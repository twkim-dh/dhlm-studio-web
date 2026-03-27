import Link from "next/link";

const financeTools = [
  { name: "연봉 실수령액 계산기", desc: "세후 월급과 공제 항목 확인", href: "/salary" },
  { name: "퇴직금 계산기", desc: "근무기간 기반 예상 퇴직금", href: "/severance" },
  { name: "대출 이자 계산기", desc: "월 상환액과 상환 스케줄", href: "/loan" },
  { name: "부가세 계산기", desc: "VAT 포함/제외 계산", href: "/vat" },
  { name: "적금 이자 계산기", desc: "만기 수령액 계산", href: "/deposit" },
  { name: "마진 계산기", desc: "마진율/원가/판매가 역산", href: "/margin" },
  { name: "유튜브 수익 계산기", desc: "예상 광고 수익 계산", href: "/youtube" },
  { name: "퍼센트 계산기", desc: "% 계산 3가지 모드", href: "/percent" },
  { name: "환율 계산기", desc: "USD/JPY/EUR/CNY 변환", href: "/exchange" },
  { name: "시급 변환 계산기", desc: "시급↔월급↔연봉 변환", href: "/time" },
  { name: "금 시세 계산기", desc: "24K/18K/14K 가격 계산", href: "/gold" },
  { name: "시급 계산기 (2026)", desc: "최저시급 기준 계산", href: "/hourly" },
  { name: "대출 비교 계산기", desc: "은행별 대출 이자 비교", href: "/loan-compare" },
  { name: "전세 vs 월세 비교", desc: "전월세 비용 비교", href: "/rent-vs-buy" },
  { name: "투자 수익률 (ROI)", desc: "ROI/CAGR 계산", href: "/investment-return" },
  { name: "쿠팡 수수료 계산기", desc: "판매 수익 계산", href: "/coupang-fee" },
];

const lifeTools = [
  { name: "BMI 계산기", desc: "체질량지수 측정 및 판정", href: "/bmi" },
  { name: "나이 계산기", desc: "만나이/한국나이/띠/별자리", href: "/age" },
  { name: "날짜 계산기", desc: "D-Day, 날짜 차이 계산", href: "/date" },
  { name: "단위 변환기", desc: "길이/무게/온도/면적 변환", href: "/unit-converter" },
  { name: "스톱워치 & 타이머", desc: "랩 기록 지원 스톱워치", href: "/stopwatch" },
  { name: "칼로리 계산기", desc: "일일 권장 칼로리 계산", href: "/calorie" },
  { name: "더치페이 계산기", desc: "N빵/팁 계산", href: "/tip-calculator" },
  { name: "카운트다운 타이머", desc: "D-Day 실시간 카운트다운", href: "/countdown" },
  { name: "전기요금 계산기", desc: "누진제 전기세 계산", href: "/electricity" },
  { name: "타자 속도 테스트", desc: "타이핑 속도 측정", href: "/typing-speed" },
  { name: "쿠팡 수수료 계산기", desc: "판매 수익 계산", href: "/coupang-fee" },
];

const mfgTools = [
  { name: "단중 계산기", desc: "코일/판재 단위중량", href: "/unit-weight" },
  { name: "Cpk 계산기", desc: "공정능력지수 계산", href: "/cpk" },
  { name: "UPH 계산기", desc: "시간당 생산량 계산", href: "/uph" },
  { name: "불량률 계산기", desc: "PPM/수율/시그마 계산", href: "/defect" },
  { name: "가동률/OEE 계산기", desc: "종합설비효율 계산", href: "/oee" },
];

const devTools = [
  { name: "JSON 포맷터", desc: "JSON 정리/압축/검증", href: "/json" },
  { name: "Base64 인코더/디코더", desc: "Base64 변환", href: "/base64" },
  { name: "JWT 디코더", desc: "JWT 토큰 분석", href: "/jwt" },
  { name: "Cron 표현식 변환기", desc: "크론 스케줄 해석", href: "/cron" },
  { name: "SQL 포맷터", desc: "SQL 쿼리 정리", href: "/sql" },
  { name: "색상 변환기", desc: "HEX/RGB/HSL 변환", href: "/color-picker" },
  { name: "더미 텍스트 생성기", desc: "한글/영문 Lorem Ipsum", href: "/lorem-ipsum" },
  { name: "URL 인코더/디코더", desc: "URL 인코딩/디코딩", href: "/url-encoder" },
  { name: "정규식 테스터", desc: "정규표현식 실시간 테스트", href: "/regex-tester" },
  { name: "내 IP 주소 확인", desc: "공인 IP 조회", href: "/ip-check" },
  { name: "화면 크기 확인", desc: "해상도/뷰포트/PPI", href: "/screen-size" },
  { name: "마크다운 미리보기", desc: "Markdown 실시간 편집", href: "/markdown-preview" },
  { name: "폰트 미리보기", desc: "웹폰트 비교 미리보기", href: "/font-preview" },
  { name: "소득세 계산기", desc: "종합소득세 계산", href: "/tax-calculator" },
  { name: "Unix 타임스탬프", desc: "타임스탬프↔날짜 변환", href: "/timestamp" },
  { name: "서브넷 계산기", desc: "CIDR/서브넷마스크", href: "/subnet" },
  { name: "chmod 권한 계산기", desc: "리눅스 파일 권한", href: "/chmod" },
  { name: "진법 변환기", desc: "2/8/10/16진수 변환", href: "/binary-converter" },
  { name: "HTML 엔티티 변환", desc: "특수문자↔엔티티", href: "/html-entity" },
];

const imageTools = [
  { name: "이미지 압축", desc: "이미지 용량 줄이기", href: "/image-compress" },
  { name: "이미지 변환", desc: "PNG/JPG/WebP 변환", href: "/image-convert" },
  { name: "이미지 리사이즈", desc: "이미지 크기 변경", href: "/image-resize" },
  { name: "유튜브 썸네일", desc: "YouTube 썸네일 추출", href: "/youtube-thumbnail" },
  { name: "QR코드 생성기", desc: "QR코드 만들기", href: "/qr" },
];

const docTools = [
  { name: "퇴사 문자 생성기", desc: "정중한 퇴사 인사말", href: "/resign-letter" },
  { name: "거절 메시지 생성기", desc: "정중한 거절 문구", href: "/reject-message" },
  { name: "축의금/조의금 문구", desc: "경조사 메시지 생성", href: "/congratulation" },
  { name: "연차 사유 생성기", desc: "연차 신청 사유 예시", href: "/annual-leave" },
  { name: "지각 변명 생성기", desc: "지각 사유 문자", href: "/late-excuse" },
  { name: "한줄 요약기", desc: "텍스트 요약 도구", href: "/text-summary" },
  { name: "글자수 세기", desc: "공백 포함/제외 글자수", href: "/character-count" },
  { name: "텍스트 변환기", desc: "대소문자/공백/줄바꿈 변환", href: "/text-transform" },
];

const genTools = [
  { name: "닉네임 생성기", desc: "랜덤 닉네임 만들기", href: "/nickname-gen" },
  { name: "회사명/브랜드명 생성기", desc: "창의적 이름 추천", href: "/company-name-gen" },
  { name: "팀명 생성기", desc: "랜덤 팀 이름 생성", href: "/team-name-gen" },
  { name: "랜덤 뽑기", desc: "무작위 선택/추첨", href: "/random-picker" },
  { name: "비밀번호 생성기", desc: "안전한 비밀번호", href: "/password-gen" },
  { name: "해시태그 생성기", desc: "인스타 해시태그 추천", href: "/hashtag-gen" },
  { name: "이모지 검색", desc: "이모지 찾기 & 복사", href: "/emoji-search" },
  { name: "랜덤 숫자/로또", desc: "랜덤 숫자 & 로또 번호", href: "/random-number" },
  { name: "모스 부호 변환기", desc: "텍스트 ↔ 모스부호", href: "/morse-code" },
];

const compareTools = [
  { name: "적금 이율 비교", desc: "은행별 적금 금리 비교", href: "/deposit-compare" },
  { name: "신용카드 혜택 비교", desc: "카드별 혜택 비교", href: "/card-compare" },
  { name: "통신사 요금 비교", desc: "알뜰폰 요금제 비교", href: "/phone-compare" },
];

interface CategoryProps {
  id: string;
  icon: string;
  title: string;
  tools: { name: string; desc: string; href: string }[];
}

function CategorySection({ id, icon, title, tools }: CategoryProps) {
  return (
    <section id={id} className="mb-14">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"
        style={{ fontFamily: "var(--font-noto-serif-kr), serif", color: '#1A1A1A' }}>
        <span>{icon}</span>
        {title}
        <span className="text-xs font-normal" style={{ color: '#6B7280' }}>({tools.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href}
            className="block p-4 bg-white border transition-all hover:border-[#C73E3A] hover:shadow-md"
            style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>{tool.name}</h3>
            <p className="text-xs" style={{ color: '#6B7280' }}>{tool.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const totalTools = financeTools.length + lifeTools.length + mfgTools.length + devTools.length + imageTools.length + docTools.length + genTools.length + compareTools.length;

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* Hero */}
      <div className="px-6" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <p className="text-[11px] tracking-[0.4em] mb-8" style={{ color: '#BCBCBC' }}>DHLM STUDIO</p>
          <h1 className="text-[clamp(28px,4vw,40px)] font-normal leading-[1.6]"
            style={{ fontFamily: "var(--font-noto-serif-kr), serif", color: '#1A1A1A', letterSpacing: '0.08em' }}>
            무료 도구
          </h1>
          <p className="text-[14px] mt-4 italic" style={{ fontFamily: 'var(--font-playfair), serif', color: '#B0B0B0' }}>
            {totalTools} free tools — no login required
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
        <CategorySection id="finance" icon="💰" title="금융 · 재테크" tools={financeTools} />
        <CategorySection id="life" icon="🏠" title="생활 · 건강" tools={lifeTools} />
        <CategorySection id="mfg" icon="🏭" title="제조 · 생산" tools={mfgTools} />
        <CategorySection id="dev" icon="💻" title="개발자 도구" tools={devTools} />
        <CategorySection id="image" icon="🖼️" title="이미지 도구" tools={imageTools} />
        <CategorySection id="doc" icon="📝" title="문서 · 업무" tools={docTools} />
        <CategorySection id="gen" icon="🎲" title="생성기" tools={genTools} />
        <CategorySection id="compare" icon="📊" title="비교" tools={compareTools} />
      </div>
    </div>
  );
}
