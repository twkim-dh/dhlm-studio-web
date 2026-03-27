'use client';

import { useState } from 'react';
import Link from 'next/link';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

type TabId = 'all' | 'lotto' | 'finance' | 'life' | 'dev' | 'etc';

const tabs: { id: TabId; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'lotto', label: '로또' },
  { id: 'finance', label: '금융' },
  { id: 'life', label: '생활' },
  { id: 'dev', label: '개발' },
  { id: 'etc', label: '기타' },
];

const posts: { slug: string; title: string; excerpt: string; date: string; cat: TabId }[] = [
  // 로또
  { slug: '', title: '🎱 로또 당첨번호 조회', excerpt: '매주 토요일 업데이트 · 역대 당첨번호 · 번호 분석 · 당첨금 기록', date: '', cat: 'lotto' },
  { slug: 'lotto-winning-tips', title: '로또 당첨 확률 높이는 5가지 방법', excerpt: '수학적으로 당첨 확률을 높이는 번호 선택 전략과 통계 분석 방법을 알려드립니다.', date: '2026-03-25', cat: 'lotto' },
  { slug: 'lotto-statistics', title: '로또 당첨 번호 통계 분석 방법', excerpt: '역대 당첨번호 데이터로 출현 빈도, 홀짝 비율, 연속번호 패턴을 분석합니다.', date: '2026-03-24', cat: 'lotto' },
  { slug: 'lotto-dream-number', title: '꿈 해몽 로또 번호 의미 총정리', excerpt: '돼지꿈, 용꿈, 돈꿈 등 꿈해몽별 행운의 로또 번호를 정리합니다.', date: '2026-03-23', cat: 'lotto' },
  { slug: 'lotto-number-generator', title: '무료 로또 번호 생성기 추천 2026년', excerpt: '보안 랜덤 생성, 꿈해몽 번호, 고정수/제외수 기능을 갖춘 번호 생성기를 소개합니다.', date: '2026-03-22', cat: 'lotto' },
  // 금융
  { slug: 'salary-calculator', title: '2026년 연봉 실수령액 계산법', excerpt: '4대보험과 세금 공제 후 실수령액을 정확하게 계산하는 방법을 안내합니다.', date: '2026-03-24', cat: 'finance' },
  { slug: 'severance-pay-guide', title: '퇴직금 계산기 사용법과 주의사항', excerpt: '근속년수별 퇴직금 계산 방법과 세금 처리 주의사항을 정리합니다.', date: '2026-03-23', cat: 'finance' },
  { slug: 'loan-interest', title: '대출 이자 계산하는 법 완벽 정리', excerpt: '원리금균등, 원금균등, 만기일시 상환 방식별 이자 계산법을 비교합니다.', date: '2026-03-22', cat: 'finance' },
  { slug: 'vat-calculator-guide', title: '부가세 계산 방법 간단 정리', excerpt: '부가세 포함/제외 계산, 매입세액공제, 간이과세자 기준을 정리합니다.', date: '2026-03-21', cat: 'finance' },
  { slug: 'gold-price-today', title: '오늘 금 시세 확인하는 법', excerpt: '국내 금 시세 조회 방법과 금 투자 시 알아야 할 기본 정보를 안내합니다.', date: '2026-03-21', cat: 'finance' },
  { slug: 'coupang-seller-fee', title: '쿠팡 판매 수수료 계산 가이드', excerpt: '쿠팡 마켓플레이스 판매 수수료 구조와 순수익 계산 방법을 정리합니다.', date: '2026-03-23', cat: 'finance' },
  // 생활
  { slug: 'bmi-guide', title: 'BMI 계산기로 내 체형 확인하기', excerpt: 'BMI 지수 계산법과 정상/과체중/비만 기준을 알려드립니다.', date: '2026-03-22', cat: 'life' },
  { slug: 'electricity-calculator', title: '전기요금 계산기 누진제 완벽 정리', excerpt: '가정용 전기요금 누진제 구간별 단가와 절약 방법을 안내합니다.', date: '2026-03-23', cat: 'life' },
  { slug: 'typing-speed-test', title: '타자 속도 테스트 온라인 무료', excerpt: '무료 한글/영문 타자 속도 측정과 연습 방법을 소개합니다.', date: '2026-03-22', cat: 'life' },
  { slug: 'unit-converter-guide', title: '단위 변환기 — 길이 무게 면적 한번에', excerpt: 'cm↔inch, kg↔lb, 평↔㎡ 등 자주 쓰는 단위 변환을 한곳에서.', date: '2026-03-21', cat: 'life' },
  // 개발
  { slug: 'json-formatter-online', title: 'JSON 포맷터 온라인 무료 사용법', excerpt: 'JSON 데이터 정렬, 검증, 압축을 브라우저에서 바로 하는 방법.', date: '2026-03-22', cat: 'dev' },
  { slug: 'password-generator', title: '안전한 비밀번호 만드는 법', excerpt: '해킹에 강한 비밀번호 생성 규칙과 무료 생성기 사용법.', date: '2026-03-21', cat: 'dev' },
  // 기타
  { slug: 'image-compress-free', title: '이미지 용량 줄이기 무료 방법', excerpt: '온라인에서 무료로 이미지 용량을 줄이는 방법과 최적 설정값.', date: '2026-03-21', cat: 'etc' },
  { slug: 'qr-code-free', title: '무료 QR코드 생성기 사용법', excerpt: 'URL, 텍스트, 연락처를 QR코드로 만드는 방법을 안내합니다.', date: '2026-03-21', cat: 'etc' },
  { slug: 'youtube-thumbnail-download', title: '유튜브 썸네일 다운로드 방법', excerpt: '유튜브 영상의 썸네일 이미지를 고화질로 다운로드하는 방법.', date: '2026-03-21', cat: 'etc' },
  { slug: 'online-tools-free', title: '무료 온라인 계산기 모음 80개', excerpt: '로그인 없이 바로 사용하는 80개 이상의 무료 온라인 도구를 소개합니다.', date: '2026-03-21', cat: 'etc' },
];

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const filtered = activeTab === 'all' ? posts : posts.filter(p => p.cat === activeTab);

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* Hero */}
      <div className="px-6" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <p className="text-[11px] tracking-[0.4em] mb-8" style={{ color: '#BCBCBC' }}>DHLM STUDIO</p>
          <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.4]"
            style={{ fontFamily: serif, color: '#1A1A1A' }}>
            블로그
          </h1>
          <p className="text-sm mt-3" style={{ color: '#6B7280' }}>
            로또 당첨번호, 도구 활용법, 생활 정보
          </p>
        </div>
      </div>

      <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingBottom: '80px' }}>
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-10" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="text-[13px] px-3 py-1.5 rounded transition-colors duration-200"
              style={{
                color: activeTab === tab.id ? '#1A1A1A' : '#9CA3AF',
                background: activeTab === tab.id ? '#F3F4F6' : 'transparent',
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-0">
          {filtered.map((post) => {
            // Special lotto card
            if (post.slug === '' && post.cat === 'lotto') {
              return (
                <Link key="lotto-hub" href="/blog/lotto"
                  className="block border p-6 mb-6 transition-colors hover:border-[#C73E3A] group"
                  style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
                  <p className="text-lg font-bold group-hover:text-[#C73E3A] transition-colors"
                    style={{ fontFamily: serif, color: '#1A1A1A' }}>
                    {post.title}
                  </p>
                  <p className="text-sm mt-2" style={{ color: '#6B7280' }}>{post.excerpt}</p>
                </Link>
              );
            }

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="block group" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ padding: '20px 0' }}>
                  <div className="flex items-center gap-3 mb-1">
                    <time className="text-[11px]" style={{ color: '#9CA3AF' }}>{post.date}</time>
                  </div>
                  <p className="text-[15px] font-medium transition-colors group-hover:text-[#C73E3A]"
                    style={{ fontFamily: serif, color: '#1A1A1A' }}>
                    {post.title}
                  </p>
                  <p className="text-[13px] mt-1" style={{ color: '#6B7280' }}>{post.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
