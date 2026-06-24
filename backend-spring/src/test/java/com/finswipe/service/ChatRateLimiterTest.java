package com.finswipe.service;

import org.junit.jupiter.api.Test;

import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 동시 버스트 요청 시 레이트리밋이 정확히 한도만 통과시키는지 검증.
 * QA 리포트: POST 21회 동시 호출 시 전부 200 통과 (Bucket 중복 생성 레이스).
 */
class ChatRateLimiterTest {

    /** 새 유저로 N개 스레드를 동시에 출발시켜 통과한 요청 수를 센다. */
    private int countAllowedConcurrent(int threads, java.util.function.Function<UUID, ChatRateLimiter.ProbeResult> probe) throws InterruptedException {
        return countAllowedConcurrent(threads, UUID.randomUUID(), probe);
    }

    /** 지정한 유저로 N개 스레드를 동시에 출발시켜 통과한 요청 수를 센다. */
    private int countAllowedConcurrent(int threads, UUID userId, java.util.function.Function<UUID, ChatRateLimiter.ProbeResult> probe) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch ready = new CountDownLatch(threads);
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        AtomicInteger allowed = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            pool.submit(() -> {
                ready.countDown();
                try {
                    start.await();
                    if (probe.apply(userId).allowed()) allowed.incrementAndGet();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();
                }
            });
        }
        ready.await();          // 모든 스레드 대기 진입
        start.countDown();      // 동시 출발
        done.await(10, TimeUnit.SECONDS);
        pool.shutdownNow();
        return allowed.get();
    }

    @Test
    void post_probe_allowsExactlyRpm_underConcurrentBurst() throws InterruptedException {
        ChatRateLimiter limiter = new ChatRateLimiter();
        // 한도(20)를 초과하는 50개 동시 요청
        int allowed = countAllowedConcurrent(50, limiter::probe);
        assertThat(allowed).isEqualTo(ChatRateLimiter.RPM);
    }

    @Test
    void getHistory_probe_allowsExactlyHistoryRpm_underConcurrentBurst() throws InterruptedException {
        ChatRateLimiter limiter = new ChatRateLimiter();
        // 한도(60)를 초과하는 100개 동시 요청
        int allowed = countAllowedConcurrent(100, limiter::probeHistory);
        assertThat(allowed).isEqualTo(ChatRateLimiter.HISTORY_RPM);
    }

    @Test
    void peek_doesNotConsumeTokens_underConcurrentBurst() throws InterruptedException {
        ChatRateLimiter limiter = new ChatRateLimiter();
        UUID userId = UUID.randomUUID();
        // 빈 본문 POST 경로: 동일 유저로 peek 50회 동시 호출 — 토큰을 전혀 소비하면 안 됨
        countAllowedConcurrent(50, userId, limiter::peek);
        // peek이 무소비라면 같은 버킷에서 probe로 정확히 RPM개 통과 가능해야 함
        int probeAllowed = 0;
        for (int i = 0; i < ChatRateLimiter.RPM + 5; i++) {
            if (limiter.probe(userId).allowed()) probeAllowed++;
        }
        assertThat(probeAllowed).isEqualTo(ChatRateLimiter.RPM);
    }
}
