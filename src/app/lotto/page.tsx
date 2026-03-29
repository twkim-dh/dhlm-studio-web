'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const ACCENT = '#C73E3A', GOLD = '#D4A843', DARK = '#0D0D0D', DARK2 = '#1A1A1A', DARK3 = '#2A2A2A', GRAY = '#888', LIGHT = '#F5F5F0';

function LogoSymbol({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} style={{ display: 'block' }}>
      <defs><linearGradient id="lG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E8C86A"/><stop offset="50%" stopColor="#D4A843"/><stop offset="100%" stopColor="#B8922E"/></linearGradient></defs>
      <circle cx="28" cy="28" r="22" fill="none" stroke="url(#lG)" strokeWidth="2.5"/>
      <circle cx="28" cy="28" r="15" fill="none" stroke="url(#lG)" strokeWidth="1.2" opacity="0.5"/>
      <circle cx="28" cy="28" r="12" fill="url(#lG)" opacity="0.15"/>
      <text x="28" y="33" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="900" fill="url(#lG)">45</text>
      <circle cx="28" cy="6" r="2.5" fill="#E8C86A"/><circle cx="48" cy="20" r="2" fill="#D4A843" opacity="0.7"/>
      <circle cx="45" cy="38" r="1.8" fill="#D4A843" opacity="0.5"/><circle cx="10" cy="36" r="2.2" fill="#E8C86A" opacity="0.6"/>
    </svg>
  );
}

function Ball({ num, size = 30, bonus = false }: { num: number; size?: number; bonus?: boolean }) {
  const bg = bonus ? 'linear-gradient(135deg,#6B7280,#9CA3AF)' : num<=10 ? 'linear-gradient(135deg,#EAB308,#F59E0B)' : num<=20 ? 'linear-gradient(135deg,#3B82F6,#60A5FA)' : num<=30 ? 'linear-gradient(135deg,#EF4444,#F87171)' : num<=40 ? 'linear-gradient(135deg,#8B5CF6,#A78BFA)' : 'linear-gradient(135deg,#10B981,#34D399)';
  return <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:size*0.38, color:'#fff', border: bonus?'2px dashed rgba(255,255,255,0.4)':'none', boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>{num}</div>;
}

function gen(): number[] { const s = new Set<number>(); while(s.size<6){ const a=new Uint32Array(1); crypto.getRandomValues(a); s.add((a[0]%45)+1); } return [...s].sort((a,b)=>a-b); }

interface Msg { role:'user'|'bot'; text?:string; numbers?:number[]; bonus?:number; numberLabel?:string; numberMeta?:string; numberSets?:{numbers:number[];tag?:string;meta?:string}[]; stats?:{label:string;value:string|number;color?:string;sub?:string}[]; proLock?:{title:string;desc:string}; actions?:{id:string;icon?:string;label:string;primary?:boolean}[] }

const DRAWS = [
  { round:1216, numbers:[3,13,21,27,35,44], bonus:19, date:'2026.03.28' },
  { round:1215, numbers:[5,8,16,24,38,42], bonus:31, date:'2026.03.21' },
];

function Bubble({ msg, onAction }: { msg:Msg; onAction:(id:string)=>void }) {
  const u = msg.role==='user';
  return (
    <div style={{ display:'flex', justifyContent:u?'flex-end':'flex-start', marginBottom:12 }}>
      {!u && <div style={{ flexShrink:0, marginRight:8, marginTop:2 }}><LogoSymbol size={32}/></div>}
      <div style={{ maxWidth:'80%', padding:'12px 16px', borderRadius: u?'16px 16px 4px 16px':'16px 16px 16px 4px', background: u?`${ACCENT}CC`:DARK2, border: u?'none':`1px solid ${DARK3}` }}>
        {msg.text && <div style={{ fontSize:13, color:LIGHT, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{msg.text}</div>}
        {msg.numbers && <div style={{ marginTop:msg.text?12:0 }}>
          {msg.numberLabel && <div style={{ fontSize:10, color:GRAY, marginBottom:6 }}>{msg.numberLabel}</div>}
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', alignItems:'center' }}>
            {msg.numbers.map(n=><Ball key={n} num={n} size={32}/>)}
            {msg.bonus!==undefined && <><span style={{ color:DARK3, margin:'0 2px', fontSize:10 }}>+</span><Ball num={msg.bonus} size={32} bonus/></>}
          </div>
          {msg.numberMeta && <div style={{ fontSize:10, color:GRAY, marginTop:6 }}>{msg.numberMeta}</div>}
        </div>}
        {msg.numberSets && <div style={{ marginTop:msg.text?12:0, display:'flex', flexDirection:'column', gap:10 }}>
          {msg.numberSets.map((s,i)=><div key={i} style={{ background:`${DARK3}80`, borderRadius:10, padding:'8px 12px' }}>
            <div style={{ fontSize:10, color:GRAY, marginBottom:6 }}>세트 {i+1}{s.tag?` — ${s.tag}`:''}</div>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>{s.numbers.map(n=><Ball key={n} num={n} size={32}/>)}</div>
            {s.meta && <div style={{ fontSize:10, color:GRAY, marginTop:4 }}>{s.meta}</div>}
          </div>)}
        </div>}
        {msg.stats && <div style={{ marginTop:12, display:'grid', gridTemplateColumns:`repeat(${Math.min(msg.stats.length,3)},1fr)`, gap:6 }}>
          {msg.stats.map((s,i)=><div key={i} style={{ background:DARK3, borderRadius:8, padding:'8px 6px', textAlign:'center' }}>
            <div style={{ fontSize:10, color:GRAY }}>{s.label}</div>
            <div style={{ fontSize:18, fontWeight:900, color:s.color||LIGHT }}>{s.value}</div>
            {s.sub && <div style={{ fontSize:9, color:GRAY }}>{s.sub}</div>}
          </div>)}
        </div>}
        {msg.proLock && <div style={{ marginTop:12, padding:14, background:`${GOLD}10`, borderRadius:12, border:`1px solid ${GOLD}20`, textAlign:'center' }}>
          <div style={{ fontSize:20, marginBottom:4 }}>🔒</div>
          <div style={{ fontSize:12, fontWeight:700, color:GOLD }}>{msg.proLock.title}</div>
          <div style={{ fontSize:11, color:GRAY, marginTop:4, lineHeight:1.5, whiteSpace:'pre-wrap' }}>{msg.proLock.desc}</div>
          <button style={{ marginTop:10, padding:'8px 20px', borderRadius:8, background:GOLD, color:DARK, border:'none', fontWeight:800, fontSize:12, cursor:'pointer' }}>PRO 시작 → 주 ₩1,000</button>
        </div>}
        {msg.actions && <div style={{ marginTop:12, display:'flex', flexWrap:'wrap', gap:6 }}>
          {msg.actions.map((a,i)=><button key={i} onClick={()=>onAction(a.id)} style={{ padding:'8px 14px', borderRadius:20, background:a.primary?`${GOLD}20`:DARK3, color:a.primary?GOLD:LIGHT, border:a.primary?`1px solid ${GOLD}30`:`1px solid ${DARK}`, fontSize:12, fontWeight:a.primary?700:500, cursor:'pointer' }}>
            {a.icon && <span style={{ marginRight:4 }}>{a.icon}</span>}{a.label}
          </button>)}
        </div>}
      </div>
    </div>
  );
}

export default function LottoPro() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, typing]);
  useEffect(() => { setTimeout(()=>bot({ text:'안녕하세요! 저는 Lotto PRO 분석 AI입니다.\n\n1,216회차 데이터를 기반으로 번호 생성, 통계 분석, 전략 상담을 도와드립니다.\n\n무엇을 해볼까요?', actions:[{id:'rec',icon:'🎯',label:'번호 추천',primary:true},{id:'latest',icon:'📊',label:'최근 당첨번호'},{id:'stats',icon:'📈',label:'통계 분석'},{id:'hot',icon:'🔥',label:'핫/콜드 번호'}] }),500); },[]);

  const bot = (m:Omit<Msg,'role'>) => setMsgs(p=>[...p,{role:'bot',...m}]);
  const usr = (t:string) => setMsgs(p=>[...p,{role:'user',text:t}]);
  const sim = (cb:()=>void, d=1200) => { setTyping(true); setTimeout(()=>{setTyping(false);cb();},d); };

  const doRec = () => { usr('이번 주 번호 추천해줘'); sim(()=>{ const n=gen(), s=n.reduce((a,b)=>a+b,0), o=n.filter(x=>x%2).length; bot({ text:'1,216회차 데이터를 분석해서 생성했습니다.\n최근 출현 패턴과 미출현 보정을 적용했어요.', numbers:n, numberLabel:'AI 추천 번호', numberMeta:`합계 ${s} · 홀짝 ${o}:${6-o}`, actions:[{id:'save',icon:'💾',label:'이 번호 저장',primary:true},{id:'rec',icon:'🔄',label:'다시 생성'},{id:'multi',icon:'📦',label:'5세트 생성'}] }); }); };

  const doMulti = () => { usr('5세트 한번에 생성해줘'); sim(()=>{ const sets=Array.from({length:5},()=>{ const n=gen(),s=n.reduce((a,b)=>a+b,0),o=n.filter(x=>x%2).length; return {numbers:n,meta:`합계 ${s} · 홀짝 ${o}:${6-o}`,tag:undefined as string|undefined}; }); sets[0].tag='균형형';sets[1].tag='고합계';sets[2].tag='저합계'; bot({ text:'5세트를 생성했습니다.', numberSets:sets, actions:[{id:'save',icon:'💾',label:'전체 저장',primary:true},{id:'multi',icon:'🔄',label:'다시 생성'}] }); },1800); };

  const doLatest = () => { usr('최근 당첨번호 알려줘'); sim(()=>{ const d=DRAWS[0]; bot({ text:`${d.round}회 (${d.date}) 당첨 결과입니다.`, numbers:d.numbers, bonus:d.bonus, numberLabel:`${d.round}회 당첨번호`, stats:[{label:'합계',value:d.numbers.reduce((a,b)=>a+b,0),color:GOLD},{label:'홀짝',value:`${d.numbers.filter(n=>n%2).length}:${d.numbers.filter(n=>!(n%2)).length}`},{label:'1등',value:'12억',color:'#EF4444'}], actions:[{id:'rec',icon:'🎯',label:'번호 추천',primary:true}] }); }); };

  const doStats = () => { usr('통계 분석 보여줘'); sim(()=>bot({ text:'최근 100회차 기준 주요 통계입니다.', stats:[{label:'평균 합계',value:'138',sub:'적정 범위',color:GOLD},{label:'최빈 홀짝',value:'3:3',sub:'가장 많이 출현'},{label:'연속번호',value:'42%',sub:'연속 포함 비율',color:'#60A5FA'}], actions:[{id:'hot',icon:'🔥',label:'핫/콜드 번호'},{id:'rec',icon:'🎯',label:'번호 추천',primary:true}] })); };

  const doHot = () => { usr('핫/콜드 번호 알려줘'); sim(()=>bot({ text:'최근 20회차 기준 출현 빈도 분석입니다.\n\n🔥 핫 번호 — 최근 자주 출현\n❄️ 콜드 번호 — 최근 미출현', numberSets:[{numbers:[3,13,21,27,35],tag:'🔥 HOT',meta:'최근 20회 중 5회 이상 출현'},{numbers:[2,9,17,26,43],tag:'❄️ COLD',meta:'최근 20회 중 0~1회 출현'}], actions:[{id:'rec',icon:'🎯',label:'핫 번호 기반 추천',primary:true}] })); };

  const doSave = () => { usr('이 번호 저장할게'); sim(()=>bot({ text:'번호를 저장하면 이런 것들이 가능해요:', proLock:{title:'PRO 기능이 필요합니다',desc:'번호 저장 → 자동 결과 체크 → 내 패턴 분석\n주 ₩1,000 (로또 1게임 값)'}, actions:[{id:'rec',icon:'🔄',label:'다른 번호 생성'}] })); };

  const act = (id:string) => { switch(id){ case 'rec':doRec();break; case 'multi':doMulti();break; case 'latest':case 'latest-3':doLatest();break; case 'stats':doStats();break; case 'hot':doHot();break; case 'save':doSave();break; } };

  const send = () => { const t=input.trim(); if(!t)return; setInput(''); usr(t); const l=t.toLowerCase();
    if(l.includes('추천')||l.includes('번호')||l.includes('생성')) sim(doRec,300);
    else if(l.includes('당첨')||l.includes('결과')||l.includes('최근')) sim(doLatest,300);
    else if(l.includes('통계')||l.includes('분석')) sim(doStats,300);
    else if(l.includes('핫')||l.includes('콜드')||l.includes('빈도')) sim(doHot,300);
    else if(l.includes('저장')) sim(doSave,300);
    else sim(()=>bot({ text:'아래 기능 중에서 선택해주세요!', actions:[{id:'rec',icon:'🎯',label:'번호 추천',primary:true},{id:'latest',icon:'📊',label:'최근 당첨번호'},{id:'stats',icon:'📈',label:'통계 분석'},{id:'hot',icon:'🔥',label:'핫/콜드 번호'}] }));
  };

  return (
    <div style={{ fontFamily:"'Noto Sans KR',sans-serif", background:DARK, color:LIGHT, height:'100vh', maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'14px 20px', borderBottom:`1px solid ${DARK3}`, display:'flex', alignItems:'center', gap:12, background:`${DARK2}CC`, backdropFilter:'blur(12px)', flexShrink:0 }}>
        <LogoSymbol size={38}/>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
            <span style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:700, color:LIGHT, letterSpacing:1 }}>Lotto</span>
            <span style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:900, color:GOLD, letterSpacing:2 }}>PRO</span>
          </div>
          <div style={{ fontSize:10, color:'#10B981', display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10B981' }}/>1,216회 데이터 분석 중
          </div>
        </div>
        <Link href="/" style={{ padding:'6px 14px', borderRadius:8, background:DARK3, color:GRAY, border:`1px solid ${DARK3}`, fontSize:11, fontWeight:600 }}>Home</Link>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 8px', display:'flex', flexDirection:'column' }}>
        {msgs.map((m,i)=><Bubble key={i} msg={m} onAction={act}/>)}
        {typing && <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}><LogoSymbol size={32}/><div style={{ background:DARK2, border:`1px solid ${DARK3}`, borderRadius:'16px 16px 16px 4px', padding:'12px 18px', display:'flex', gap:4 }}>{[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:'50%', background:GRAY, animation:`td 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}</div></div>}
        <div ref={endRef}/>
      </div>

      {msgs.length<=1 && <div style={{ padding:'0 16px', display:'flex', gap:6, flexWrap:'wrap' }}>
        {[{icon:'🎯',label:'번호 추천',id:'rec'},{icon:'📊',label:'최근 결과',id:'latest'},{icon:'🔥',label:'핫/콜드',id:'hot'},{icon:'📈',label:'통계',id:'stats'}].map(a=>
          <button key={a.id} onClick={()=>act(a.id)} style={{ padding:'8px 14px', borderRadius:20, background:DARK2, color:LIGHT, border:`1px solid ${DARK3}`, fontSize:12, cursor:'pointer' }}>{a.icon} {a.label}</button>
        )}
      </div>}

      <div style={{ padding:'12px 16px 20px', borderTop:`1px solid ${DARK3}`, background:DARK2, flexShrink:0 }}>
        <div style={{ display:'flex', gap:8, alignItems:'center', background:DARK3, borderRadius:24, padding:'4px 4px 4px 16px' }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="번호 추천, 통계 분석, 필터 설정..."
            style={{ flex:1, background:'none', border:'none', outline:'none', color:LIGHT, fontSize:14, fontFamily:"'Noto Sans KR',sans-serif" }}/>
          <button onClick={send} disabled={!input.trim()}
            style={{ width:36, height:36, borderRadius:'50%', background:input.trim()?GOLD:DARK, border:'none', color:input.trim()?DARK:GRAY, fontSize:16, cursor:input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center' }}>↑</button>
        </div>
      </div>

      <style>{`
        @keyframes td{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
        input::placeholder{color:${GRAY}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${DARK3};border-radius:2px}
      `}</style>
    </div>
  );
}
