import { Header } from "../components/layout/Header";
import { DialMenu } from "../components/layout/DialMenu";

export const Terms = () => {
  return (
    <>
      <Header type="sub" title="이용약관" />
      <div className="px-4 py-6 pb-16 flex flex-col gap-8 text-gray-700">
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제1조 (목적)</h2>
          <p className="text-sm leading-relaxed">
            이 약관은 FinSwipe가 제공하는 "FinSwipe" 모바일 애플리케이션 및 부속 서비스의 이용과 관련하여, 회사와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
          <p className="text-sm leading-relaxed">
            본 서비스는 정식 상용 출시 전 단계의 소규모 비공개 베타테스트로 제공되며, 회사가 사전 선정한 제한된 인원의 테스터를 대상으로 무상으로 제공됩니다. 회사는 베타테스트 기간 중 언제든지 서비스의 전부 또는 일부를 변경·중단하거나 시험 데이터를 초기화할 수 있습니다.
          </p>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제2조 (정의)</h2>
          <p className="text-sm leading-relaxed">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. "서비스"란 회사가 제공하는 금융·증권 관련 뉴스 정보 제공, AI 기반 요약·분석, 챗봇AI, 학습 퀴즈 등 일체의 기능을 의미합니다.</li>
            <li>2. "베타테스트"란 정식 출시 전 서비스의 검증·개선을 목적으로 회사가 사전 선정한 제한된 이용자(이하 "테스터")에게 무상으로 제공되는 시험 운영을 말합니다.</li>
            <li>3. "이용자"란 본 약관에 동의하고 서비스를 이용하는 회원을 말합니다.</li>
            <li>4. "회원"이란 서비스에 가입하여 ID와 비밀번호 또는 OAuth 인증을 통해 서비스를 이용하는 자를 말합니다.</li>
            <li>5. "콘텐츠"란 회사가 제공하는 뉴스 요약, AI 응답, 감성 점수, 기술적 지표 시각화, 학습 퀴즈 등 일체의 정보·자료를 말합니다.</li>
            <li>6. "AI 생성 콘텐츠"란 회사가 인공지능 모델을 활용하여 자동으로 생성한 콘텐츠를 말합니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제3조 (약관의 효력 및 변경)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</li>
            <li>2. 회사는 「약관의 규제에 관한 법률」, 「전자상거래 등에서의 소비자보호에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
            <li>3. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 시행일자 7일 전부터 공지합니다. 다만 이용자에게 불리한 변경의 경우에는 시행일자 30일 전부터 공지하고, 별도의 동의를 받습니다.</li>
            <li>4. 이용자가 개정약관의 적용에 동의하지 않는 경우 회사는 개정약관의 내용을 적용할 수 없으며, 이 경우 이용자는 이용계약을 해지할 수 있습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제4조 (회원가입)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입하고 본 약관 및 개인정보처리방침에 동의함으로써 회원가입을 신청합니다.</li>
            <li>2. 회사는 다음 각 호에 해당하는 신청에 대하여는 가입을 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 만 14세 미만 아동인 경우</li>
                <li>- 타인의 명의를 도용한 경우</li>
                <li>- 회원정보에 허위·누락·오기가 있는 경우</li>
                <li>- 부정한 용도 또는 영리 목적으로 서비스를 이용하고자 하는 경우</li>
                <li>- 관련 법령 또는 본 약관에 위배되는 신청인 경우</li>
              </ul>
            </li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제5조 (회원정보의 관리)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회원은 자신의 회원정보가 변경된 경우 즉시 수정해야 하며, 미수정으로 인한 불이익은 회원이 부담합니다.</li>
            <li>2. 회원의 ID 및 비밀번호 관리 책임은 회원 본인에게 있으며, 이를 제3자가 사용하도록 하여서는 안 됩니다.</li>
            <li>3. 회원은 자신의 ID 및 비밀번호가 도용되거나 제3자에 의해 사용되고 있음을 인지한 경우 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제6조 (서비스의 제공)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 회원에게 다음 각 호의 서비스를 제공합니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 금융·증권 관련 뉴스 큐레이션 및 AI 요약</li>
                <li>- 종목별 뉴스 감성 분석 정보 및 기술적 지표 시각화</li>
                <li>- AI 챗봇을 통한 정보 안내</li>
                <li>- 투자 학습용 퀴즈 콘텐츠</li>
                <li>- 푸시 알림 및 이메일 알림</li>
                <li>- 기타 회사가 추가 개발하거나 다른 회사와의 제휴 등을 통해 제공하는 일체의 서비스</li>
              </ul>
            </li>
            <li>2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 본 서비스는 베타테스트 단계이므로 서비스의 안정성·연속성·가용성이 보장되지 않으며, 점검·개선을 위하여 사전 공지 없이 수시로 중단·변경될 수 있습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제7조 (서비스의 변경 및 중단)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 서비스의 기획·운영상 또는 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경할 수 있습니다.</li>
            <li>2. 회사는 다음 각 호에 해당하는 경우 서비스 제공을 중단할 수 있습니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 시스템 점검, 보수, 교체 등 부득이한 경우</li>
                <li>- 천재지변, 전쟁, 정전, 통신두절 등 불가항력적 사유가 발생한 경우</li>
                <li>- 서비스 제공사업자(AI 모델 제공사, 뉴스 데이터 제공사 등)와의 계약 종료 또는 이들의 서비스 중단</li>
                <li>- 기타 회사의 경영상 사정으로 서비스 제공이 곤란한 경우</li>
              </ul>
            </li>
            <li>3. 회사는 사전 공지함을 원칙으로 하나, 긴급한 경우 사후에 공지할 수 있습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제8조 (서비스의 성격 및 책임의 한계)</h2>
          <p className="text-sm leading-relaxed font-semibold">본 서비스는 정식 상용 출시 전 단계의 비공개 베타테스트(Closed Beta)로서, 회사가 사전 선정한 제한된 인원의 테스터에게 무상으로만 제공됩니다. 회사는 본 서비스와 관련하여 이용자로부터 어떠한 대가도 수취하지 아니하며, 불특정 다수를 대상으로 투자조언·투자권유를 영업으로 제공하지 않습니다.</p>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 본 서비스는 투자 참고용 정보를 제공하는 단순 정보 제공 서비스입니다. 회사는 「자본시장과 금융투자업에 관한 법률」상 투자자문업자·투자일임업자 또는 유사투자자문업자로 등록·신고된 바 없으며, 본 서비스는 투자자문업, 투자일임업, 금융투자상품 매매·중개, 유사투자자문업 그 밖의 금융투자업에 해당하는 영업을 영위하지 않습니다.</li>
            <li>2. 본 서비스는 개별 이용자의 투자 목적·재산 상황·투자 경험 등에 적합한 맞춤형 투자 자문을 제공하지 않으며, 어떠한 금융상품의 매수·매도·보유를 권유하지 않습니다.</li>
            <li>3. 본 서비스가 제공하는 모든 콘텐츠(AI 요약, 감성 점수, 기술적 지표 해석, 챗봇 응답 등)는 참고용 정보로서, 정확성·완전성·시의성·적시성을 보장하지 않습니다.</li>
            <li>4. 이용자는 본 서비스의 정보를 근거로 한 모든 투자 결정의 책임이 이용자 본인에게 있음을 동의하며, 그 결과로 발생한 손익은 이용자 본인에게 귀속됩니다.</li>
            <li>5. 회사는 이용자의 투자 결정·매매 행위·그 결과에 대하여 어떠한 책임도 부담하지 않습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제9조 (AI 생성 콘텐츠에 관한 특약)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 본 서비스는 인공지능(AI) 모델을 활용하여 뉴스 요약, 챗봇 응답, 감성 점수 등 콘텐츠를 자동으로 생성합니다.</li>
            <li>2. AI가 생성한 콘텐츠는 다음과 같은 본질적 한계를 가집니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 사실과 다른 정보를 생성(환각, hallucination)할 수 있습니다.</li>
                <li>- 원문 뉴스의 의도나 맥락을 정확히 반영하지 못할 수 있습니다.</li>
                <li>- 최신 정보가 반영되지 않을 수 있습니다.</li>
                <li>- 동일한 입력에 대해서도 시점·모델 업데이트에 따라 다른 결과를 반환할 수 있습니다.</li>
              </ul>
            </li>
            <li>3. 이용자는 AI 생성 콘텐츠를 투자 판단의 유일한 근거로 사용해서는 안 되며, 반드시 원문 뉴스, 공식 공시(DART, EDGAR 등), 전문가 의견 등을 직접 확인해야 합니다.</li>
            <li>4. AI 챗봇이 생성한 응답의 부정확성, 오류, 누락으로 인한 이용자의 손해에 대해 회사는 고의 또는 중과실이 없는 한 책임을 부담하지 않습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제10조 (면책 조항)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 다음 각 호의 사유로 인하여 발생한 손해에 대해서는 책임을 지지 않습니다.
              <ul className="flex flex-col gap-1 pl-4 mt-1">
                <li>- 천재지변, 전쟁, 기간통신사업자의 서비스 중단, 제3자 서비스 제공사의 장애 등 불가항력으로 인한 서비스 중단</li>
                <li>- 이용자의 귀책사유로 인한 서비스 이용 장애</li>
                <li>- 이용자가 서비스를 통해 얻은 정보로 인한 투자 손익, 거래 결과</li>
                <li>- 이용자 상호 간 또는 이용자와 제3자 상호 간 서비스를 매개로 한 분쟁</li>
                <li>- 무료로 제공되는 서비스 이용과 관련하여 관련 법령에 특별한 규정이 없는 한 발생한 손해</li>
              </ul>
            </li>
            <li>2. 회사는 서비스 화면에 게재되거나 본 서비스를 통한 제3자(언론사, 분석기관 등)의 콘텐츠의 정확성, 완전성, 적법성에 대해 책임을 지지 않습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제11조 (이용자의 의무 및 금지행위)</h2>
          <p className="text-sm leading-relaxed">이용자는 다음 각 호의 행위를 하여서는 안 됩니다.</p>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 본 서비스를 이용하여 「자본시장법」상 무인가 금융투자업 또는 미신고 유사투자자문업을 영위하는 행위</li>
            <li>2. 회사의 사전 서면 동의 없이 본 서비스의 콘텐츠(AI 생성 콘텐츠 포함)를 복제·재배포·판매·전송·출판하는 행위</li>
            <li>3. 자동화된 방법(크롤링, 봇, 스크래핑 스크립트 등)으로 본 서비스의 정보를 수집하는 행위</li>
            <li>4. 타인의 개인정보를 도용하거나 회원 계정을 양도·대여·매매하는 행위</li>
            <li>5. AI 챗봇을 이용하여 회사 또는 제3자의 명예를 훼손하거나, 위법·유해한 정보를 생성·유포하는 행위</li>
            <li>6. AI 챗봇에 주민등록번호·계좌번호·비밀번호 등 민감정보를 입력하는 행위</li>
            <li>7. 서비스 운영을 방해하거나 시스템에 부정 접근, 비인가 변경을 시도하는 행위</li>
            <li>8. 기타 관계 법령에 위배되거나 공공질서 또는 미풍양속에 반하는 일체의 행위</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제12조 (콘텐츠의 권리)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사가 작성한 콘텐츠(AI 생성 콘텐츠 포함)에 대한 저작권 및 기타 지식재산권은 회사에 귀속됩니다.</li>
            <li>2. 원본 뉴스 기사의 저작권은 해당 언론사 등 권리자에게 귀속되며, 회사는 적법한 라이선스 범위 내에서 이를 수신·요약·표시합니다.</li>
            <li>3. 이용자는 회사의 사전 서면 동의 없이 본 서비스의 콘텐츠를 영리 목적으로 이용하거나 제3자에게 제공할 수 없습니다.</li>
            <li>4. 이용자가 본 서비스를 이용함으로써 작성·등록한 게시물(예: 챗봇 입력, 퀴즈 응답)의 저작권은 이용자에게 귀속되나, 회사는 이를 서비스 운영·개선·홍보 목적으로 무상으로 사용할 수 있습니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제13조 (광고성 정보 수신)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 이용자가 「정보통신망법」 제50조에 따라 사전 동의한 경우에 한하여 광고성 정보 또는 마케팅 정보를 푸시 알림·이메일로 전송할 수 있습니다.</li>
            <li>2. 야간(21:00~익일 08:00) 시간대에 광고성 정보를 전송하려는 경우에는 별도의 사전 동의를 받습니다.</li>
            <li>3. 이용자는 언제든지 앱 내 "설정 &gt; 알림" 메뉴 또는 이메일 하단의 수신거부 링크를 통해 광고성 정보 수신을 거부할 수 있으며, 회사는 지체 없이 이를 처리합니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제14조 (계약 해지 및 이용 제한)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회원은 언제든지 앱 내 "마이페이지 &gt; 계정 삭제" 메뉴를 통해 회원 탈퇴를 신청할 수 있으며, 회사는 지체 없이 이를 처리합니다.</li>
            <li>2. 회사는 회원이 본 약관 또는 관련 법령을 위반한 경우 사전 통지 후 이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다. 단, 명백한 위반 또는 긴급한 경우 사전 통지 없이 조치 후 사후 통지할 수 있습니다.</li>
            <li>3. 이용계약 해지 시 회사는 「개인정보 처리 및 보유 기간」에 따라 개인정보를 파기합니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제15조 (손해배상)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사 또는 이용자가 본 약관의 규정을 위반하여 상대방에게 손해를 입힌 경우, 손해를 입힌 자는 상대방에게 발생한 손해를 배상할 책임이 있습니다.</li>
            <li>2. 회사의 손해배상 책임은 회사의 고의 또는 중대한 과실이 있는 경우에 한하며, 통상의 손해에 한정됩니다. 단, 「약관의 규제에 관한 법률」 등 관련 법령에 위배되지 않는 범위에서 적용됩니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제16조 (준거법 및 관할법원)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 본 약관 및 회사와 이용자 간의 분쟁은 대한민국 법령에 따라 규율됩니다.</li>
            <li>2. 회사와 이용자 간 발생한 분쟁에 관한 소송은 「민사소송법」상의 관할법원에 제기합니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">제17조 (기타)</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 pl-2">
            <li>1. 회사는 필요한 경우 특정 서비스에 관하여 적용될 사항(이하 "개별약관")을 정하여 미리 공지할 수 있으며, 회원이 해당 서비스를 이용하는 경우 본 약관과 함께 개별약관이 적용됩니다.</li>
            <li>2. 본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는 관련 법령 또는 상관례에 따릅니다.</li>
          </ul>
        </section>
 
        <section className="flex flex-col gap-1 pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-2">부칙</h2>
          <p className="text-sm text-gray-500">• 공고일자: 2026년 06월 19일</p>
          <p className="text-sm text-gray-500">• 시행일자: 2026년 06월 19일</p>
          <p className="text-sm text-gray-500 mt-1">• 본 약관은 FinSwipe의 비공개 베타테스트 기간 동안 적용되는 약관이며, 정식 출시 시 별도의 약관으로 대체될 수 있습니다.</p>
        </section>
 
      </div>
      <DialMenu />
    </>
  );
};