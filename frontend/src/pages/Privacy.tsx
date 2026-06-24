import { Header } from "../components/layout/Header";
import { DialMenu } from "../components/layout/DialMenu";

export const Privacy = () => {
  return (
    <>
      <Header type="sub" title="개인정보처리방침" />
       <div className="px-4 py-6 pb-16 flex flex-col gap-8 text-gray-700">
 
        <p className="text-sm leading-relaxed">
          FinSwipe는 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위해 본 개인정보처리방침을 수립·공개합니다.
        </p>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제1조 (개인정보의 처리 목적)</h2>
          <p className="text-sm leading-relaxed">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul className="text-sm leading-relaxed flex flex-col gap-1 pl-2">
            <li>- 회원 가입 및 관리: 회원 식별, 본인 확인, 부정이용 방지, 가입의사 확인, 분쟁 처리 등</li>
            <li>- 서비스 제공: 뉴스 피드 제공, AI 요약·감성 분석, 챗봇 응답, 투자 학습 퀴즈, 푸시 알림</li>
            <li>- 서비스 개선: 이용 통계 분석, 신규 기능 개발, UX 개선, 오류 진단</li>
            <li>- 의무 이행 및 분쟁 대응: 법령 준수, 민원 처리, 분쟁 해결, 수사기관 요청 대응</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-900">제2조 (처리하는 개인정보의 항목)</h2>
          <p className="text-sm leading-relaxed">회사는 회원가입, 서비스 제공 등을 위해 다음의 개인정보 항목을 처리하고 있습니다.</p>
 
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-800">1. 회원가입 및 인증 정보</h3>
            <ul className="text-sm leading-relaxed flex flex-col gap-1 pl-2">
              <li>- 이메일 (email)</li>
              <li>- 닉네임 / 표시 이름 (display_name)</li>
              <li>- 프로필 사진 URL (avatar_url) — 구글 로그인 시</li>
              <li>- 로그인 ID (login_id) — 이메일/아이디 찾기용</li>
              <li>- 비밀번호 해시 (password_hash) — 자체 가입 시</li>
              <li>- 구글 계정 고유 ID (google_sub) — OAuth 시</li>
              <li>- 가입 경로 (auth_provider: email / google)</li>
              <li>- 이메일 인증 여부 및 토큰 (email_verified, email_verify_token)</li>
              <li>- 비밀번호 재설정 토큰 (password_reset_token)</li>
            </ul>
          </div>
 
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-800">2. 서비스 이용 정보</h3>
            <ul className="text-sm leading-relaxed flex flex-col gap-1 pl-2">
              <li>- 관심 종목 (tickers — 예: NVDA, AAPL)</li>
              <li>- 투자 레벨 (level: 1~5)</li>
              <li>- 투자 성향 (tendency — 예: 가치투자형)</li>
              <li>- 피드 정렬 방식 (news_sort: time/power)</li>
              <li>- 알림 설정 (notify_all_news, notify_sentiment_news)</li>
            </ul>
          </div>
 
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-800">3. 행동 데이터 (서비스 개선 목적)</h3>
            <ul className="text-sm leading-relaxed flex flex-col gap-1 pl-2">
              <li>- 읽은 기사 이력 (user_read_articles)</li>
              <li>- AI 챗봇 대화 내용 (chat_messages)</li>
              <li>- 퀴즈 시도 이력, 정답률, 최종 레벨 (quiz_sessions)</li>
              <li>- 퀴즈 문항별 응답 (quiz_questions)</li>
            </ul>
          </div>
 
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-800">4. 기기 및 자동 수집 정보</h3>
            <ul className="text-sm leading-relaxed flex flex-col gap-1 pl-2">
              <li>- FCM 푸시 토큰 (device_tokens)</li>
              <li>- 접속 IP, 접속 일시, OS/앱 버전, 브라우저 종류, 쿠키, 세션 ID</li>
            </ul>
          </div>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제3조 (개인정보의 처리 및 보유 기간)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 법령에 따른 개인정보 보유·이용 기간 또는 이용자로부터 동의받은 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</li>
            <li>2. 각 개인정보의 처리 및 보유 기간은 다음과 같습니다.</li>
          </ul>
          <div className="rounded-xl border border-gray-200 overflow-hidden text-sm mt-1">
            <div className="grid grid-cols-3 bg-gray-50 font-semibold text-gray-700">
              <div className="px-3 py-2 border-r border-gray-200">구분</div>
              <div className="px-3 py-2 border-r border-gray-200">보유 기간</div>
              <div className="px-3 py-2">근거</div>
            </div>
            {[
              ["회원 정보 (이메일, 인증정보 등)", "회원 탈퇴 시까지", "이용자 동의"],
              ["AI 챗봇 대화 내용", "회원 탈퇴 후 30일 이내 파기", "이용자 동의"],
              ["읽은 기사·퀴즈 이력", "회원 탈퇴 시까지", "이용자 동의"],
              ["부정이용 기록", "1년", "회사 내부 방침"],
              ["통신사실확인자료 (접속 로그)", "3개월", "통신비밀보호법"],
              ["소비자 불만·분쟁처리 기록", "3년", "전자상거래법 (해당 시)"],
              ["표시·광고 기록", "6개월", "전자상거래법 (해당 시)"],
            ].map(([label, period, basis], idx) => (
              <div key={idx} className="grid grid-cols-3 border-t border-gray-200">
                <div className="px-3 py-2 border-r border-gray-200 text-gray-700">{label}</div>
                <div className="px-3 py-2 border-r border-gray-200 text-gray-500">{period}</div>
                <div className="px-3 py-2 text-gray-500">{basis}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">※ AI 모델 개선을 위해 비식별 처리된 통계자료는 익명화 후 별도 보존될 수 있으며, 이 경우 더 이상 개인정보에 해당하지 않습니다.</p>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제4조 (개인정보의 제3자 제공)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 이용자의 개인정보를 본 방침 제1조에서 명시한 범위 내에서만 처리하며, 이용자의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.</li>
            <li>2. 다만, 다음의 경우에는 예외로 합니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 이용자가 사전에 동의한 경우</li>
                <li>- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제5조 (개인정보 처리의 위탁)</h2>
          <p className="text-sm leading-relaxed">회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있으며, 위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 필요한 사항을 규정하고 있습니다.</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden text-sm mt-1">
            <div className="grid grid-cols-3 bg-gray-50 font-semibold text-gray-700">
              <div className="px-3 py-2 border-r border-gray-200">수탁업체</div>
              <div className="px-3 py-2 border-r border-gray-200">위탁업무</div>
              <div className="px-3 py-2">보유·이용 기간</div>
            </div>
            {[
              ["Google LLC (Firebase / FCM)", "푸시 알림 발송, 인증 처리", "회원 탈퇴 또는 위탁계약 종료 시"],
              ["Google LLC (Google Sign-In)", "OAuth 인증", "회원 탈퇴 또는 위탁계약 종료 시"],
              ["AWS", "서비스 인프라 운영", "회원 탈퇴 또는 위탁계약 종료 시"],
              ["Google (Gemini 2.5 Flash-Lite)", "AI 챗봇 응답 생성, 뉴스 요약", "응답 생성 후 즉시 또는 위탁계약 종료 시"],
              ["Finlight (News API)", "금융 뉴스 데이터 제공", "해당 없음 (개인정보 미제공)"],
            ].map(([company, task, period], idx) => (
              <div key={idx} className="grid grid-cols-3 border-t border-gray-200">
                <div className="px-3 py-2 border-r border-gray-200 text-gray-700">{company}</div>
                <div className="px-3 py-2 border-r border-gray-200 text-gray-500">{task}</div>
                <div className="px-3 py-2 text-gray-500">{period}</div>
              </div>
            ))}
          </div>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제6조 (개인정보의 국외 이전)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 본 서비스의 일부 위탁업체(Google, AWS, OpenAI 등)는 데이터 처리를 위해 개인정보를 국외로 이전할 수 있습니다.</li>
            <li>2. 국외 이전 내역은 다음과 같습니다.</li>
          </ul>
          <div className="rounded-xl border border-gray-200 overflow-hidden text-sm mt-1">
            <div className="grid grid-cols-3 bg-gray-50 font-semibold text-gray-700">
              <div className="px-3 py-2 border-r border-gray-200">이전 국가</div>
              <div className="px-3 py-2 border-r border-gray-200">이전 시기 및 방법</div>
              <div className="px-3 py-2">이전 항목</div>
            </div>
            <div className="grid grid-cols-3 border-t border-gray-200">
              <div className="px-3 py-2 border-r border-gray-200 text-gray-700">미국 (Google, OpenAI, AWS)</div>
              <div className="px-3 py-2 border-r border-gray-200 text-gray-500">서비스 이용 시 네트워크 전송</div>
              <div className="px-3 py-2 text-gray-500">이메일, OAuth 식별자, 챗봇 입력 텍스트, 푸시 토큰</div>
            </div>
          </div>
          <p className="text-sm text-gray-500">이용자는 국외 이전을 거부할 권리가 있으나, 거부 시 해당 기능(예: 구글 로그인, AI 챗봇, 푸시 알림)을 이용할 수 없습니다.</p>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제7조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 이용자(또는 법정대리인)는 회사에 대해 언제든지 다음의 권리를 행사할 수 있습니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 개인정보 열람 요청</li>
                <li>- 개인정보 정정·삭제 요청</li>
                <li>- 개인정보 처리정지 요청</li>
                <li>- 동의 철회</li>
                <li>- 회원 탈퇴</li>
              </ul>
            </li>
            <li>2. 권리 행사는 앱 내 "마이페이지 &gt; 설정 &gt; 개인정보 관리" 메뉴 또는 개인정보 보호책임자에게 서면·이메일 등으로 요청할 수 있으며, 회사는 지체 없이 조치하겠습니다.</li>
            <li>3. 권리 행사는 이용자의 법정대리인이나 위임을 받은 자 등 대리인을 통하여서도 하실 수 있습니다. 이 경우 「개인정보 처리 방법에 관한 고시」 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제8조 (만 14세 미만 아동의 개인정보 처리)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 만 14세 미만 아동의 회원가입을 받지 않습니다.</li>
            <li>2. 회원가입 시 생년월일 또는 만 14세 이상 여부를 확인하며, 사후 만 14세 미만임이 확인된 경우 즉시 가입을 취소하고 수집된 개인정보를 파기합니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제9조 (개인정보의 파기 절차 및 방법)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</li>
            <li>2. 파기 방법은 다음과 같습니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 전자적 파일 형태의 정보: 복구·재생할 수 없도록 안전하게 삭제 (예: 로우레벨 포맷, 안전 삭제 알고리즘)</li>
                <li>- 종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제10조 (개인정보의 안전성 확보조치)</h2>
          <p className="text-sm leading-relaxed">회사는 「개인정보 보호법」 제29조에 따라 다음과 같은 안전성 확보조치를 취하고 있습니다.</p>
          <ul className="text-sm leading-relaxed flex flex-col gap-1 pl-2">
            <li>- 관리적 조치: 내부관리계획 수립·시행, 직원 정기 교육, 접근권한 관리 정책 운영</li>
            <li>- 기술적 조치: 개인정보 처리시스템 접근권한 관리, 접근통제시스템 설치, 비밀번호 일방향 암호화 저장, 보안프로그램 설치 및 갱신, 통신구간 암호화 (TLS)</li>
            <li>- 물리적 조치: 데이터 처리 장비의 물리적 접근 통제, 비인가자 접근 제한</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제11조 (개인정보 자동 수집 장치의 설치·운영 및 거부)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 이용자에게 개별 맞춤 서비스 제공을 위해 쿠키, 디바이스 식별자(FCM 토큰) 등을 사용할 수 있습니다.</li>
            <li>2. 이용자는 기기 설정 또는 앱 내 "설정 &gt; 알림" 메뉴에서 이를 거부할 수 있습니다. 다만 거부 시 일부 기능(푸시 알림, 맞춤 추천 등)이 제한될 수 있습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제12조 (AI 기능 사용에 관한 특별 고지)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 본 서비스의 AI 챗봇 및 뉴스 요약 기능 사용 시 입력된 텍스트는 응답 생성을 위해 제3자 AI 모델 제공사(예: OpenAI, Anthropic 등)에게 일시적으로 전달됩니다.</li>
            <li>2. 이용자는 AI 챗봇에 다음과 같은 정보를 입력하지 않을 것을 권장합니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 주민등록번호, 계좌번호, 비밀번호 등 식별 가능한 민감정보</li>
                <li>- 타인의 개인정보</li>
                <li>- 법령상 비밀유지 의무가 있는 정보</li>
              </ul>
            </li>
            <li>3. 챗봇 대화 내용은 서비스 품질 개선 목적으로 활용될 수 있으며, 이용자는 "설정 &gt; 개인정보" 메뉴에서 활용 거부를 선택할 수 있습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제13조 (개인정보 보호책임자)</h2>
          <p className="text-sm leading-relaxed">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden text-sm mt-1">
            <div className="grid grid-cols-4 bg-gray-50 font-semibold text-gray-700">
              <div className="px-3 py-2 border-r border-gray-200">구분</div>
              <div className="px-3 py-2 border-r border-gray-200">성명</div>
              <div className="px-3 py-2 border-r border-gray-200">직책</div>
              <div className="px-3 py-2">연락처</div>
            </div>
            <div className="grid grid-cols-4 border-t border-gray-200">
              <div className="px-3 py-2 border-r border-gray-200 text-gray-700">개인정보 보호책임자</div>
              <div className="px-3 py-2 border-r border-gray-200 text-gray-500">정종호</div>
              <div className="px-3 py-2 border-r border-gray-200 text-gray-500">대표</div>
              <div className="px-3 py-2 text-gray-500 text-xs">sw22tm1dn1ght@gmail.com / 010-3307-4482</div>
            </div>
          </div>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제14조 (권익침해 구제방법)</h2>
          <p className="text-sm leading-relaxed">이용자는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden text-sm mt-1">
            <div className="grid grid-cols-3 bg-gray-50 font-semibold text-gray-700">
              <div className="px-3 py-2 border-r border-gray-200">기관</div>
              <div className="px-3 py-2 border-r border-gray-200">연락처</div>
              <div className="px-3 py-2">홈페이지</div>
            </div>
            {[
              ["개인정보분쟁조정위원회", "1833-6972", "www.kopico.go.kr"],
              ["개인정보침해신고센터 (KISA)", "(국번없이) 118", "privacy.kisa.or.kr"],
              ["대검찰청 사이버수사과", "1301", "spo.go.kr"],
              ["경찰청 사이버수사국", "(국번없이) 182", "ecrm.cyber.go.kr"],
            ].map(([org, tel, site], idx) => (
              <div key={idx} className="grid grid-cols-3 border-t border-gray-200">
                <div className="px-3 py-2 border-r border-gray-200 text-gray-700">{org}</div>
                <div className="px-3 py-2 border-r border-gray-200 text-gray-500">{tel}</div>
                <div className="px-3 py-2 text-gray-500">{site}</div>
              </div>
            ))}
          </div>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제15조 (개인정보처리방침의 변경)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지합니다.</li>
            <li>2. 다만, 이용자에게 불리한 변경의 경우에는 시행 30일 전부터 공지하고, 별도의 동의를 받습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-1 pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-2">부칙</h2>
          <p className="text-sm text-gray-500">• 공고일자: 2026년 06월 19일</p>
          <p className="text-sm text-gray-500">• 시행일자: 2026년 06월 19일</p>
        </section>
 
      </div>
      <DialMenu />
    </>
  );
};