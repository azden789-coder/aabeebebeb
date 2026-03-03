import { useState, useEffect } from "react";

const ADMIN_LOGIN = "admin332211";
const ADMIN_PASS  = "admin112233";

const C = {
  green:"#00e676", greenDark:"#00c853", gold:"#ffd600", red:"#ff1744",
  bg:"#0a0d13", bg2:"#111520", bg3:"#181e2e", card:"#1a2035",
  border:"#252d45", text:"#e8eaf6", muted:"#7986a3", purple:"#9c27b0",
};

const phoneStyle = { width:"100%", maxWidth:390, minHeight:"100vh", background:C.bg2, fontFamily:"'Barlow','Segoe UI',sans-serif", color:C.text, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden", margin:"0 auto" };
const scrollStyle = { flex:1, overflowY:"auto", paddingBottom:72, scrollbarWidth:"none" };

function Stars({ n }) {
  return <span style={{ color:C.gold, fontSize:13 }}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}

function Btn({ children, onClick, style={}, disabled=false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ border:"none", borderRadius:14, padding:"13px 18px", fontSize:15, fontWeight:800,
               cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", opacity:disabled?0.5:1, ...style }}>
      {children}
    </button>
  );
}

/* INPUT – module-level so AdminField / CouponEntryField never remount */
const inpBase = (bc) => ({
  width:"100%", background:C.bg3, border:`1px solid ${bc||C.border}`,
  borderRadius:10, padding:"12px 14px", fontSize:14,
  color:C.text, fontFamily:"'Barlow','Segoe UI',sans-serif", outline:"none",
});

function AdminField({ label, name, placeholder, type="text", form, setForm, errors={}, setErrors=()=>{} }) {
  return (
    <div>
      <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:4, letterSpacing:.5 }}>
        {label}{errors[name] && <span style={{ color:C.red }}> • {errors[name]}</span>}
      </div>
      <input
        value={form[name]||""}
        onChange={e=>{ setForm(f=>({...f,[name]:e.target.value})); setErrors(f=>({...f,[name]:undefined})); }}
        placeholder={placeholder} type={type}
        style={inpBase(errors[name]?C.red:undefined)}
      />
    </div>
  );
}

/* CouponEntryField – also module-level */
function CouponEntryField({ idx, entry, onChange }) {
  return (
    <div style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:12, padding:12, display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>TYP #{idx+1}</div>
      <input value={entry.match} onChange={e=>onChange(idx,"match",e.target.value)}
        placeholder="Mecz np. Legia – Lech" style={inpBase()} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <input value={entry.type} onChange={e=>onChange(idx,"type",e.target.value)}
          placeholder="Typ np. Over 2.5" style={inpBase()} />
        <input value={entry.odds} onChange={e=>onChange(idx,"odds",e.target.value)}
          placeholder="Kurs np. 1.85" type="number" step="0.01" style={inpBase()} />
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    {id:"home",  icon:"⚽", label:"Typy"},
    {id:"coupon",icon:"🏆", label:"Kupon"},
    {id:"premium",icon:"👑",label:"Premium"},
    {id:"admin", icon:"🔧", label:"Admin"},
  ];
  return (
    <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.bg2, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", padding:"10px 0 16px", zIndex:50 }}>
      {items.map(item=>(
        <button key={item.id} onClick={()=>setScreen(item.id)}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontSize:9, fontWeight:700, letterSpacing:".5px", textTransform:"uppercase", color:screen===item.id?C.green:C.muted, fontFamily:"inherit", opacity:screen===item.id?1:0.6, transition:"all .15s" }}>
          <span style={{ fontSize:22 }}>{item.icon}</span>{item.label}
        </button>
      ))}
    </div>
  );
}

function TopNav({ onBack, title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 18px 12px", background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
      {onBack
        ? <button onClick={onBack} style={{ background:C.card, border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.text, fontSize:18 }}>←</button>
        : <span style={{ fontFamily:"'Bebas Neue','Impact',cursive", fontSize:28, background:`linear-gradient(90deg,${C.green},${C.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:1 }}>HitKupon</span>
      }
      {title && <span style={{ fontSize:17, fontWeight:800 }}>{title}</span>}
      <div style={{ width:36 }} />
    </div>
  );
}

/* ══ HOME ══ */
function HomeScreen({ tips, coupon, isPremium, setScreen, setActiveTip, setWatchingTip, unlocked, pushVisible }) {
  const today = new Date().toLocaleDateString("pl-PL",{day:"numeric",month:"long"});
  const couponOdds = coupon.entries.length ? coupon.entries.reduce((a,e)=>a*(parseFloat(e.odds)||1),1).toFixed(2) : "–";
  return (
    <div style={phoneStyle}>
      <TopNav />
      {pushVisible && (
        <div style={{ position:"absolute", top:64, left:12, right:12, zIndex:200, background:"rgba(26,32,53,0.97)", border:`1px solid ${C.border}`, borderRadius:16, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, backdropFilter:"blur(8px)", boxShadow:"0 8px 32px rgba(0,0,0,.5)", animation:"slideDown .3s ease" }}>
          <div style={{ width:36, height:36, background:C.green, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>⚽</div>
          <div><div style={{ fontSize:13, fontWeight:800 }}>🔥 Nowy Pewniak dodany!</div><div style={{ fontSize:11, color:C.muted }}>Odblokuj za darmo – obejrzyj 30s</div></div>
        </div>
      )}
      <div style={scrollStyle}>
        <div onClick={()=>setScreen("coupon")} style={{ margin:"12px 12px 8px", background:"linear-gradient(135deg,#0d2b1a,#0a1f2e)", border:`1.5px solid ${C.green}`, borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, background:"radial-gradient(circle,rgba(0,230,118,.12),transparent 70%)" }} />
          <div style={{ background:C.green, color:"#000", fontSize:10, fontWeight:900, padding:"4px 8px", borderRadius:6, letterSpacing:1, whiteSpace:"nowrap" }}>KUPON DNIA 🔥</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800 }}>{coupon.title||"Kupon dnia"}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{coupon.entries.length} {coupon.entries.length===1?"typ":"typy"} • {isPremium ? `kurs ~${couponOdds} ✅` : "tylko Premium 👑"}</div>
          </div>
          <span style={{ color:C.green, fontSize:22 }}>›</span>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 16px 6px" }}>
          <span style={{ fontSize:16, fontWeight:800 }}>Dzisiaj • {today} 🗓️</span>
        </div>

        {tips.length===0 && (
          <div style={{ textAlign:"center", padding:"60px 24px", color:C.muted }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:16, fontWeight:700 }}>Brak typów na dziś</div>
            <div style={{ fontSize:13, marginTop:6 }}>Admin doda typy wkrótce 🔧</div>
          </div>
        )}

        {tips.map(tip=>{
          const isUnlocked = unlocked.includes(tip.id);
          return (
            <div key={tip.id} onClick={()=>{ if(isUnlocked){setActiveTip(tip);setScreen("detail");} else if(!tip.isPremiumOnly){setWatchingTip(tip);setScreen("ad");} else setScreen("premium"); }}
              style={{ margin:"6px 12px", background:C.card, borderRadius:16, border:`1px solid ${isUnlocked?C.green:C.border}`, overflow:"hidden", cursor:"pointer" }}>
              <div style={{ padding:"12px 14px 10px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ background:C.bg3, borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:600, color:C.muted }}>{tip.league}</span>
                  <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>⏱ {tip.time}</span>
                </div>
                <div style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>{tip.match}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:"rgba(0,230,118,.12)", border:"1px solid rgba(0,230,118,.3)", borderRadius:8, padding:"4px 10px", fontSize:13, fontWeight:700, color:C.green }}>{tip.type}</div>
                  <div style={{ fontSize:13, color:C.gold, fontWeight:800 }}>kurs ~{tip.odds}</div>
                  <div style={{ marginLeft:"auto" }}><Stars n={tip.stars}/></div>
                </div>
              </div>
              <div style={{ background:C.bg3, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:12, fontWeight:700, color:isUnlocked?C.green:C.text, display:"flex", alignItems:"center", gap:6 }}>
                  {isUnlocked?"✅ Odblokowany":<><span>🔒</span>{tip.isPremiumOnly?"Tylko Premium":"Typ zablokowany"}</>}
                </div>
                {isUnlocked
                  ? <button style={{ background:`linear-gradient(90deg,${C.greenDark},${C.green})`, border:"none", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:800, color:"#000", cursor:"pointer", fontFamily:"inherit" }}>Zobacz typ →</button>
                  : tip.isPremiumOnly
                    ? <button style={{ background:`linear-gradient(90deg,#6200ea,${C.purple})`, border:"none", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>👑 Premium</button>
                    : <button style={{ background:"linear-gradient(90deg,#ff6d00,#ff8f00)", border:"none", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>▶ Obejrzyj 30s</button>
                }
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav screen="home" setScreen={setScreen}/>
    </div>
  );
}

/* ══ DETAIL ══ */
function DetailScreen({ tip, setScreen }) {
  if(!tip) return null;
  const fc = f=>f==="W"?C.green:f==="D"?C.gold:C.red;
  return (
    <div style={phoneStyle}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={()=>setScreen("home")} style={{ background:C.card, border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, fontSize:18, cursor:"pointer" }}>←</button>
        <span style={{ fontSize:17, fontWeight:800 }}>Szczegóły Typu</span>
      </div>
      <div style={scrollStyle}>
        <div style={{ margin:12, background:"linear-gradient(135deg,#003d1a,#001f0d)", border:`2px solid ${C.green}`, borderRadius:16, padding:16, textAlign:"center" }}>
          <div style={{ fontSize:20, color:C.gold }}>{"★".repeat(tip.stars)}</div>
          <div style={{ fontFamily:"'Bebas Neue','Impact',cursive", fontSize:34, color:C.green, letterSpacing:3 }}>✅ PEWNIAK</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{new Date().toLocaleDateString("pl-PL",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <div style={{ margin:"8px 12px", background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:16 }}>
          {[["⚽ MECZ",tip.match],["🏆 LIGA",tip.league],["⏱ GODZINA",tip.time],["🎯 TYP",tip.type,C.green],["📊 KURS",tip.odds,C.gold],["📍 BUKMACHER",tip.bookmaker]].map(([l,v,vc])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{l}</span>
              <span style={{ fontSize:14, fontWeight:800, color:vc||C.text, textAlign:"right", maxWidth:"60%" }}>{v}</span>
            </div>
          ))}
        </div>
        {(tip.homeForm||tip.awayForm) && (
          <div style={{ margin:"8px 12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[{label:"Forma – Dom",form:tip.homeForm},{label:"Forma – Gość",form:tip.awayForm}].map(({label,form})=>(
              <div key={label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:12, textAlign:"center" }}>
                <div style={{ fontSize:10, color:C.muted, fontWeight:700, marginBottom:8 }}>{label}</div>
                <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                  {(form||[]).map((f,i)=><span key={i} style={{ width:26, height:26, borderRadius:6, background:`${fc(f)}22`, border:`1px solid ${fc(f)}66`, color:fc(f), fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{f}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
        {tip.reasoning && (
          <div style={{ margin:"8px 12px", background:C.bg3, borderRadius:16, border:`1px solid ${C.border}`, padding:16 }}>
            <div style={{ fontSize:12, color:C.muted, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>📝 Uzasadnienie</div>
            <p style={{ fontSize:14, lineHeight:1.65, margin:0 }}>{tip.reasoning}</p>
          </div>
        )}
        <div style={{ margin:"8px 12px 20px", background:"rgba(0,230,118,.07)", border:`1.5px solid ${C.green}`, borderRadius:14, padding:14, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:28 }}>🔓</span>
          <div><div style={{ fontSize:13, fontWeight:800, color:C.green }}>Typ odblokowany na 24h</div><div style={{ fontSize:11, color:C.muted }}>Pozostało: 23h 59min</div></div>
        </div>
      </div>
      <BottomNav screen="home" setScreen={setScreen}/>
    </div>
  );
}

/* ══ AD ══ */
function AdScreen({ tip, onUnlock, setScreen }) {
  const [sec,setSec]=useState(30); const [done,setDone]=useState(false);
  useEffect(()=>{ if(sec<=0){setDone(true);return;} const t=setTimeout(()=>setSec(s=>s-1),1000); return()=>clearTimeout(t); },[sec]);
  const pct=((30-sec)/30)*100;
  return (
    <div style={phoneStyle}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={()=>setScreen("home")} style={{ background:C.card, border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, fontSize:18, cursor:"pointer" }}>←</button>
        <span style={{ fontSize:17, fontWeight:800 }}>Odblokuj Typ</span>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20, gap:20 }}>
        <div style={{ width:"100%", background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:16, textAlign:"center" }}>
          <div style={{ fontSize:12, color:C.muted, fontWeight:700, marginBottom:4 }}>ODBLOKOWUJESZ</div>
          <div style={{ fontSize:20, fontWeight:900 }}>{tip.match}</div>
          <div style={{ fontSize:14, color:C.green, fontWeight:700, marginTop:4 }}>{tip.type} • @{tip.odds}</div>
        </div>
        <div style={{ width:"100%", background:"#000", borderRadius:16, aspectRatio:"16/9", display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${C.border}`, flexDirection:"column", gap:8, fontSize:13, color:C.muted }}>
          {done?<><span style={{ fontSize:40 }}>✅</span><span style={{ color:C.green, fontWeight:800, fontSize:16 }}>Reklama zakończona!</span></>:<><span style={{ fontSize:40 }}>▶</span><span>Reklama wideo</span></>}
        </div>
        <div style={{ width:"100%" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, color:C.muted }}>Postęp reklamy</span>
            <span style={{ fontSize:12, color:done?C.green:C.muted, fontWeight:700 }}>{done?"✅ Gotowe!":`⏱ ${sec}s zostało`}</span>
          </div>
          <div style={{ background:C.border, borderRadius:100, height:8 }}>
            <div style={{ width:`${pct}%`, background:done?C.green:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:100, height:8, transition:"width 1s linear" }}/>
          </div>
        </div>
        {done
          ?<Btn onClick={onUnlock} style={{ width:"100%", background:`linear-gradient(90deg,${C.greenDark},${C.green})`, color:"#000", fontSize:18 }}>🔓 ODBLOKUJ TYP</Btn>
          :<Btn disabled style={{ width:"100%", background:C.card, color:C.muted }}>Pomiń ({sec}s)</Btn>
        }
        <Btn onClick={()=>setScreen("premium")} style={{ width:"100%", background:`linear-gradient(90deg,#6200ea,${C.purple})`, color:"#fff" }}>👑 Chcę Premium – zero reklam</Btn>
      </div>
    </div>
  );
}

/* ══ COUPON SCREEN ══ */
function CouponScreen({ coupon, setScreen, isPremium }) {
  const entries = coupon.entries||[];
  const totalOdds = entries.length ? entries.reduce((a,e)=>a*(parseFloat(e.odds)||1),1).toFixed(2) : "–";

  return (
    <div style={phoneStyle}>
      <TopNav onBack={()=>setScreen("home")} title="Kupon Dnia 🏆"/>
      <div style={scrollStyle}>

        {/* Header */}
        <div style={{ margin:12, background:"linear-gradient(135deg,#0d2b1a,#001f0d)", border:`2px solid ${C.green}`, borderRadius:20, padding:20, textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue','Impact',cursive", fontSize:38, color:C.green, letterSpacing:3 }}>KUPON DNIA</div>
          <div style={{ fontSize:16, fontWeight:800, marginTop:4 }}>{coupon.title||"Najlepsze typy dnia"}</div>
          {coupon.description && <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{coupon.description}</div>}
          <div style={{ marginTop:16, display:"flex", justifyContent:"center", gap:16 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:900, color:C.gold }}>{isPremium ? totalOdds : "???"}</div>
              <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>ŁĄCZNY KURS</div>
            </div>
            <div style={{ width:1, background:C.border }}/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:900, color:C.green }}>{entries.length}</div>
              <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>TYPY</div>
            </div>
          </div>
        </div>

        {/* Premium badge or lock info */}
        {isPremium
          ? <div style={{ margin:"4px 12px 8px", background:"rgba(0,230,118,.08)", border:`1px solid ${C.green}`, borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>✅</span>
              <div style={{ fontSize:13, fontWeight:800, color:C.green }}>Masz Premium – pełny dostęp do kuponu</div>
            </div>
          : <div style={{ margin:"4px 12px 8px", background:"rgba(156,39,176,.1)", border:`1px solid ${C.purple}`, borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>👑</span>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:C.purple }}>Tylko dla Premium</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Kup Premium aby zobaczyć pełny kupon</div>
              </div>
            </div>
        }

        {entries.length===0
          ? <div style={{ textAlign:"center", padding:"32px 24px", color:C.muted }}>
              <div style={{ fontSize:40, marginBottom:10 }}>📋</div>
              <div style={{ fontSize:15, fontWeight:700 }}>Brak kuponu na dziś</div>
              <div style={{ fontSize:12, marginTop:6 }}>Admin ustawi kupon wkrótce 🔧</div>
            </div>
          : entries.map((e,i)=>(
              <div key={i} style={{ margin:"5px 12px", background:C.card, borderRadius:14, border:`1px solid ${isPremium?C.border:C.border}`, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", overflow:"hidden" }}>
                {/* blurred overlay for non-premium */}
                {!isPremium && (
                  <div style={{ position:"absolute", inset:0, backdropFilter:"blur(6px)", background:"rgba(10,13,19,.55)", display:"flex", alignItems:"center", justifyContent:"center", gap:8, zIndex:2 }}>
                    <span style={{ fontSize:20 }}>🔒</span>
                    <span style={{ fontSize:13, fontWeight:800, color:C.purple }}>Tylko Premium</span>
                  </div>
                )}
                <div>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>TYP #{i+1}</div>
                  <div style={{ fontSize:15, fontWeight:800 }}>{e.match}</div>
                  <div style={{ fontSize:13, color:C.green, fontWeight:700, marginTop:4 }}>{e.type}</div>
                </div>
                <div style={{ fontSize:24, fontWeight:900, color:C.gold }}>@{e.odds}</div>
              </div>
            ))
        }

        {coupon.bookmaker && isPremium && (
          <div style={{ margin:"4px 12px", fontSize:12, color:C.muted, textAlign:"center" }}>
            📍 Polecany bukmacher: <strong style={{ color:C.text }}>{coupon.bookmaker}</strong>
          </div>
        )}

        {!isPremium && entries.length>0 && (
          <div style={{ margin:"16px 12px 8px" }}>
            <Btn onClick={()=>setScreen("premium")} style={{ width:"100%", background:`linear-gradient(90deg,#6200ea,${C.purple})`, color:"#fff", display:"block", fontSize:16 }}>
              👑 Kup Premium – odblokuj kupon
            </Btn>
          </div>
        )}
        <div style={{ height:8 }}/>
      </div>
      <BottomNav screen="coupon" setScreen={setScreen}/>
    </div>
  );
}

/* ══ PREMIUM ══ */
function PremiumScreen({ setScreen, isPremium, premiumEmail, premiumExp, onCheckPremium, backendUrl }) {
  const [sel,setSel]           = useState(1);
  const [emailInput,setEmailInput] = useState("");
  const [checking,  setChecking]   = useState(false);
  const [checkMsg,  setCheckMsg]   = useState("");

  const plans=[
    {id:0, name:"🗓️ 7 dni",  price:"15,00 zł", period:"/ tydzień",   desc:"Idealny na przetestowanie",     stripeUrl:"https://buy.stripe.com/test_14A6oJezIf8k4JPcx58g003"},
    {id:1, name:"📅 30 dni", price:"39,99 zł", period:"/ miesiąc",   desc:"Oszczędzasz 33% vs tygodniowy", popular:true, stripeUrl:"https://buy.stripe.com/test_6oU5kF77gaS4b8d54D8g004"},
    {id:2, name:"⚽ Weekend",price:"9,99 zł",  period:"jednorazowo", desc:"Piątek → Niedziela",             stripeUrl:"https://buy.stripe.com/test_3cI9AVdvE8JW5NTeFd8g005"},
  ];
  const features=["Wszystkie typy odblokowane","Zero reklam wideo","Kupon dnia w pierwszej kolejności","Powiadomienia push premium","Historia typów 90 dni"];

  const handleCheck = async () => {
    if(!emailInput.trim()) return;
    setChecking(true); setCheckMsg("");
    await onCheckPremium(emailInput.trim());
    setChecking(false);
    setCheckMsg("ok");
    setTimeout(()=>setCheckMsg(""),4000);
  };

  const expDate = premiumExp
    ? new Date(premiumExp).toLocaleDateString("pl-PL",{day:"numeric",month:"long",year:"numeric"})
    : "";

  return (
    <div style={phoneStyle}>
      <TopNav/>
      <div style={scrollStyle}>
        <div style={{ textAlign:"center", padding:"20px 16px 10px" }}>
          <div style={{ fontSize:44 }}>👑</div>
          <div style={{ fontFamily:"'Bebas Neue','Impact',cursive", fontSize:32, background:`linear-gradient(90deg,${C.gold},#ff6d00)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:2 }}>HITKUPON PREMIUM</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Pełny dostęp • Zero reklam • Wszystkie typy</div>
        </div>

        {/* Status aktywnego premium */}
        {isPremium
          ? <div style={{ margin:"8px 12px", background:"rgba(0,230,118,.1)", border:`1.5px solid ${C.green}`, borderRadius:14, padding:14 }}>
              <div style={{ fontSize:16, fontWeight:800, color:C.green }}>✅ Masz aktywne Premium!</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>📧 {premiumEmail}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>⏳ Ważne do: <strong style={{ color:C.text }}>{expDate}</strong></div>
            </div>
          : /* Sprawdź email po zakupie */
            <div style={{ margin:"8px 12px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:14, padding:14 }}>
              <div style={{ fontSize:13, fontWeight:800, marginBottom:6 }}>🔍 Kupiłeś już Premium? Sprawdź status:</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Wpisz email użyty przy zakupie</div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={emailInput} onChange={e=>setEmailInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleCheck()}
                  placeholder="twoj@email.com"
                  style={{ ...inpBase(), flex:1, fontSize:13, padding:"10px 12px" }}/>
                <button onClick={handleCheck} disabled={checking}
                  style={{ background:C.green, border:"none", borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:800, color:"#000", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", opacity:checking?.6:1 }}>
                  {checking?"⏳...":"Sprawdź"}
                </button>
              </div>
              {checkMsg==="ok" && !isPremium && (
                <div style={{ fontSize:12, color:C.muted, marginTop:8, padding:"8px", background:"rgba(255,23,68,.08)", borderRadius:8, border:`1px solid rgba(255,23,68,.2)` }}>
                  ❌ Brak aktywnego premium dla tego emaila. Jeśli właśnie kupiłeś, poczekaj chwilę i spróbuj ponownie.
                </div>
              )}
            </div>
        }

        {/* Plany */}
        {plans.map(plan=>(
          <div key={plan.id} onClick={()=>setSel(plan.id)} style={{ margin:plan.popular?"16px 12px 8px":"8px 12px", background:sel===plan.id?"linear-gradient(135deg,#1a1a00,#1a1500)":C.card, border:`1.5px solid ${sel===plan.id?C.gold:C.border}`, borderRadius:18, padding:"14px 16px", cursor:"pointer", position:"relative" }}>
            {plan.popular && <div style={{ position:"absolute", top:-10, right:16, background:C.gold, color:"#000", fontSize:10, fontWeight:900, padding:"3px 10px", borderRadius:10 }}>NAJPOPULARNIEJSZY</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div><div style={{ fontSize:16, fontWeight:800 }}>{plan.name}</div><div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{plan.desc}</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontSize:26, fontWeight:900, color:C.gold, lineHeight:1 }}>{plan.price}</div><div style={{ fontSize:13, color:C.muted }}>{plan.period}</div></div>
            </div>
          </div>
        ))}

        <div style={{ margin:"12px 12px 4px" }}>{features.map(f=><div key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0", fontSize:13, color:C.muted }}><span style={{ color:C.green, fontSize:15 }}>✅</span>{f}</div>)}</div>

        {/* Przyciski Stripe */}
        <div style={{ margin:"12px 12px 0" }}>
          {plans.map(plan=>(
            <button key={plan.id} onClick={()=>window.open(plan.stripeUrl,"_blank")}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", background:sel===plan.id?`linear-gradient(90deg,${C.gold},#ff6d00)`:"rgba(255,214,0,.08)", border:`1.5px solid ${sel===plan.id?C.gold:C.border}`, borderRadius:14, padding:"13px 18px", marginBottom:8, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
              <span style={{ fontSize:15, fontWeight:800, color:sel===plan.id?"#000":C.text }}>{plan.name}</span>
              <span style={{ fontSize:15, fontWeight:900, color:sel===plan.id?"#000":C.gold }}>
                {plan.price} → <span style={{ fontSize:13 }}>Kup 💳</span>
              </span>
            </button>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:10, padding:"8px 0 4px" }}>
          {["BLIK","Google Pay","Apple Pay","Karta"].map(m=><div key={m} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:700, color:C.muted }}>{m}</div>)}
        </div>
        <div style={{ textAlign:"center", fontSize:10, color:C.red, padding:"4px 16px 16px", fontWeight:600 }}>⚠️ 18+ • Hazard może uzależniać • Graj odpowiedzialnie</div>
      </div>
      <BottomNav screen="premium" setScreen={setScreen}/>
    </div>
  );
}

/* ══ ADMIN LOGIN ══ */
function AdminLogin({ onLogin }) {
  const [login,setLogin]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [show,setShow]=useState(false);
  const handle=()=>{ if(login===ADMIN_LOGIN&&pass===ADMIN_PASS) onLogin(); else{ setErr("❌ Błędny login lub hasło"); setTimeout(()=>setErr(""),2500); } };
  return (
    <div style={phoneStyle}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 18px 12px", background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontFamily:"'Bebas Neue','Impact',cursive", fontSize:28, background:`linear-gradient(90deg,${C.green},${C.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>HitKupon</span>
        <div style={{ width:36 }}/>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, gap:20 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:8 }}>🔧</div>
          <div style={{ fontFamily:"'Bebas Neue','Impact',cursive", fontSize:28, color:C.text, letterSpacing:2 }}>PANEL ADMINA</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Zaloguj się, aby zarządzać</div>
        </div>
        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <div style={{ fontSize:12, color:C.muted, fontWeight:700, marginBottom:6, letterSpacing:1 }}>LOGIN</div>
            <input value={login} onChange={e=>setLogin(e.target.value)} placeholder="Wpisz login..." style={inpBase()}/>
          </div>
          <div>
            <div style={{ fontSize:12, color:C.muted, fontWeight:700, marginBottom:6, letterSpacing:1 }}>HASŁO</div>
            <div style={{ position:"relative" }}>
              <input value={pass} onChange={e=>setPass(e.target.value)} type={show?"text":"password"} placeholder="Wpisz hasło..." style={{ ...inpBase(), paddingRight:48 }} onKeyDown={e=>e.key==="Enter"&&handle()}/>
              <button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.muted }}>{show?"🙈":"👁️"}</button>
            </div>
          </div>
          {err && <div style={{ background:"rgba(255,23,68,.12)", border:`1px solid ${C.red}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.red, fontWeight:700, textAlign:"center" }}>{err}</div>}
          <Btn onClick={handle} style={{ width:"100%", background:`linear-gradient(90deg,${C.green},${C.greenDark})`, color:"#000", fontSize:16, marginTop:4 }}>🔓 ZALOGUJ SIĘ</Btn>
        </div>
      </div>
      <BottomNav screen="admin" setScreen={()=>{}}/>
    </div>
  );
}

/* ══ ADMIN PANEL ══ */
const EMPTY_TIP    = { league:"", time:"", match:"", type:"", odds:"", stars:4, bookmaker:"", reasoning:"", homeForm:"", awayForm:"", isPremiumOnly:false };
const EMPTY_COUPON = { title:"", description:"", bookmaker:"", entries:[{ match:"", type:"", odds:"" }], isPremiumOnly:false };

function AdminPanel({ tips, setTips, coupon, setCoupon, setScreen }) {
  const [tab,    setTab]    = useState("tips");
  const [view,   setView]   = useState("list");
  const [form,   setForm]   = useState(EMPTY_TIP);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [saved,  setSaved]  = useState(false);
  const [cForm,  setCForm]  = useState(EMPTY_COUPON);
  const [cSaved, setCsaved] = useState(false);

  /* tip helpers */
  const validate = () => {
    const e={};
    if(!form.league.trim()) e.league="Wymagane";
    if(!form.time.trim())   e.time="Wymagane";
    if(!form.match.trim())  e.match="Wymagane";
    if(!form.type.trim())   e.type="Wymagane";
    if(!form.odds.trim()||isNaN(parseFloat(form.odds))) e.odds="Podaj prawidłowy kurs";
    setErrors(e);
    return Object.keys(e).length===0;
  };
  const saveTip = () => {
    if(!validate()) return;
    const parsed = { ...form, id:editId||Date.now(),
      homeForm: typeof form.homeForm==="string" ? form.homeForm.toUpperCase().split("").filter(c=>["W","D","L"].includes(c)).slice(0,5) : form.homeForm,
      awayForm: typeof form.awayForm==="string" ? form.awayForm.toUpperCase().split("").filter(c=>["W","D","L"].includes(c)).slice(0,5) : form.awayForm,
    };
    if(editId!==null) setTips(p=>p.map(t=>t.id===editId?parsed:t));
    else setTips(p=>[...p,parsed]);
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setView("list"); setForm(EMPTY_TIP); setEditId(null); },1200);
  };
  const delTip = id => setTips(p=>p.filter(t=>t.id!==id));
  const editTip = tip => { setForm({...tip, homeForm:(tip.homeForm||[]).join(""), awayForm:(tip.awayForm||[]).join("")}); setEditId(tip.id); setView("addTip"); };

  /* coupon helpers */
  const openCouponForm = () => { setCForm({ ...coupon, entries: coupon.entries.length ? coupon.entries.map(e=>({...e})) : [{match:"",type:"",odds:""}] }); setView("couponForm"); };
  const addEntry  = () => setCForm(f=>({...f, entries:[...f.entries,{match:"",type:"",odds:""}]}));
  const delEntry  = i => setCForm(f=>({...f, entries:f.entries.filter((_,j)=>j!==i)}));
  const chgEntry  = (i,k,v) => setCForm(f=>({...f, entries:f.entries.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const saveCoupon = () => { setCoupon({...cForm}); setCsaved(true); setTimeout(()=>{ setCsaved(false); setView("list"); },1200); };
  const couponPreviewOdds = cForm.entries.reduce((a,e)=>a*(parseFloat(e.odds)||1),1).toFixed(2);

  const TabBar = () => (
    <div style={{ display:"flex", borderBottom:`1px solid ${C.border}` }}>
      {[["tips","⚽ Typy"],["coupon","🏆 Kupon Dnia"]].map(([id,lbl])=>(
        <button key={id} onClick={()=>{setTab(id);setView("list");}}
          style={{ flex:1, border:"none", background:"none", padding:"12px 0", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
            color:tab===id?C.green:C.muted, borderBottom:`2px solid ${tab===id?C.green:"transparent"}` }}>{lbl}</button>
      ))}
    </div>
  );

  /* ── ADD TIP FORM ── */
  if(view==="addTip") return (
    <div style={phoneStyle}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={()=>{setView("list");setForm(EMPTY_TIP);setEditId(null);setErrors({});}} style={{ background:C.card, border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, fontSize:18, cursor:"pointer" }}>←</button>
        <span style={{ fontSize:17, fontWeight:800 }}>{editId?"✏️ Edytuj typ":"➕ Dodaj typ"}</span>
      </div>
      <div style={scrollStyle}>
        <div style={{ padding:"16px 12px", display:"flex", flexDirection:"column", gap:12 }}>
          {saved && <div style={{ background:"rgba(0,230,118,.12)", border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 16px", textAlign:"center", fontSize:14, fontWeight:800, color:C.green }}>✅ Zapisano!</div>}
          <AdminField label="LIGA / TURNIEJ" name="league"    placeholder="np. 🇵🇱 PKO Ekstraklasa" form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
          <AdminField label="GODZINA"        name="time"      placeholder="np. 20:45"               form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
          <AdminField label="MECZ"           name="match"     placeholder="np. Legia – Lech"        form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
          <AdminField label="TYP"            name="type"      placeholder="np. Over 2.5"            form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
          <AdminField label="KURS"           name="odds"      placeholder="np. 1.85" type="number"  form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
          <AdminField label="BUKMACHER"      name="bookmaker" placeholder="np. STS / Fortuna"       form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:8, letterSpacing:.5 }}>OCENA (GWIAZDKI)</div>
            <div style={{ display:"flex", gap:8 }}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setForm(f=>({...f,stars:n}))} style={{ flex:1, background:form.stars>=n?"rgba(255,214,0,.2)":C.bg3, border:`1px solid ${form.stars>=n?C.gold:C.border}`, borderRadius:10, padding:"10px 0", fontSize:18, cursor:"pointer", color:form.stars>=n?C.gold:C.muted }}>★</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:8, letterSpacing:.5 }}>FORMA DRUŻYN (W/D/L – opcjonalnie)</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>GOSPOD.</div>
                <input value={form.homeForm} onChange={e=>setForm(f=>({...f,homeForm:e.target.value}))} placeholder="np. WWDWW" style={inpBase()} maxLength={5}/>
              </div>
              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>GOŚĆ</div>
                <input value={form.awayForm} onChange={e=>setForm(f=>({...f,awayForm:e.target.value}))} placeholder="np. WDWLW" style={inpBase()} maxLength={5}/>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:4, letterSpacing:.5 }}>UZASADNIENIE (opcjonalnie)</div>
            <textarea value={form.reasoning} onChange={e=>setForm(f=>({...f,reasoning:e.target.value}))} placeholder="Opis dlaczego ten typ jest dobry..." rows={4} style={{ ...inpBase(), resize:"vertical" }}/>
          </div>
          <div onClick={()=>setForm(f=>({...f,isPremiumOnly:!f.isPremiumOnly}))} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer" }}>
            <div><div style={{ fontSize:14, fontWeight:700 }}>👑 Tylko Premium</div><div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Ukryty dla darmowych użytkowników</div></div>
            <div style={{ width:44, height:24, borderRadius:100, background:form.isPremiumOnly?C.purple:C.border, position:"relative", transition:"background .2s" }}>
              <div style={{ position:"absolute", top:2, left:form.isPremiumOnly?22:2, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
            </div>
          </div>
          <Btn onClick={saveTip} style={{ width:"100%", background:`linear-gradient(90deg,${C.green},${C.greenDark})`, color:"#000", fontSize:16, marginTop:4 }}>{editId?"💾 Zapisz zmiany":"➕ Dodaj typ"}</Btn>
        </div>
      </div>
    </div>
  );

  /* ── COUPON FORM ── */
  if(view==="couponForm") return (
    <div style={phoneStyle}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={()=>setView("list")} style={{ background:C.card, border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, fontSize:18, cursor:"pointer" }}>←</button>
        <span style={{ fontSize:17, fontWeight:800 }}>🏆 Edytuj Kupon Dnia</span>
      </div>
      <div style={scrollStyle}>
        <div style={{ padding:"16px 12px", display:"flex", flexDirection:"column", gap:14 }}>

          {cSaved && <div style={{ background:"rgba(0,230,118,.12)", border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 16px", textAlign:"center", fontSize:14, fontWeight:800, color:C.green }}>✅ Kupon zapisany!</div>}

          {/* live odds preview */}
          <div style={{ background:"linear-gradient(135deg,#0d2b1a,#001f0d)", border:`1.5px solid ${C.green}`, borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:12, color:C.muted, fontWeight:700 }}>PODGLĄD ŁĄCZNEGO KURSU</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{cForm.entries.length} {cForm.entries.length===1?"typ":"typy"} w kuponie</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:32, fontWeight:900, color:C.gold }}>{couponPreviewOdds}</div>
            </div>
          </div>

          {/* metadata */}
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:4 }}>TYTUŁ KUPONU</div>
            <input value={cForm.title} onChange={e=>setCForm(f=>({...f,title:e.target.value}))} placeholder="np. Pewniaki środy 🔥" style={inpBase()}/>
          </div>
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:4 }}>OPIS (opcjonalnie)</div>
            <input value={cForm.description} onChange={e=>setCForm(f=>({...f,description:e.target.value}))} placeholder="np. 3 typy z Ekstraklasy i CL" style={inpBase()}/>
          </div>
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:4 }}>BUKMACHER (opcjonalnie)</div>
            <input value={cForm.bookmaker} onChange={e=>setCForm(f=>({...f,bookmaker:e.target.value}))} placeholder="np. STS / Fortuna" style={inpBase()}/>
          </div>

          {/* tip entries */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:.5 }}>TYPY W KUPONIE ({cForm.entries.length})</div>
              <button onClick={addEntry} style={{ background:C.green, border:"none", borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:800, color:"#000", cursor:"pointer", fontFamily:"inherit" }}>+ Dodaj typ</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {cForm.entries.map((e,i)=>(
                <div key={i} style={{ position:"relative" }}>
                  <CouponEntryField idx={i} entry={e} onChange={chgEntry}/>
                  {cForm.entries.length>1 && (
                    <button onClick={()=>delEntry(i)} style={{ position:"absolute", top:8, right:8, background:"rgba(255,23,68,.15)", border:`1px solid ${C.red}`, borderRadius:8, padding:"4px 8px", fontSize:12, cursor:"pointer", color:C.red }}>🗑️</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* premium toggle */}
          <div onClick={()=>setCForm(f=>({...f,isPremiumOnly:!f.isPremiumOnly}))} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer" }}>
            <div><div style={{ fontSize:14, fontWeight:700 }}>👑 Tylko Premium</div><div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Kupon widoczny tylko dla premium</div></div>
            <div style={{ width:44, height:24, borderRadius:100, background:cForm.isPremiumOnly?C.purple:C.border, position:"relative", transition:"background .2s" }}>
              <div style={{ position:"absolute", top:2, left:cForm.isPremiumOnly?22:2, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
            </div>
          </div>

          <Btn onClick={saveCoupon} style={{ width:"100%", background:`linear-gradient(90deg,${C.gold},#ff6d00)`, color:"#000", fontSize:18, fontFamily:"'Bebas Neue','Impact',cursive", letterSpacing:2 }}>
            💾 ZAPISZ KUPON DNIA
          </Btn>
          <div style={{ height:8 }}/>
        </div>
      </div>
    </div>
  );

  /* ── LIST VIEW ── */
  return (
    <div style={phoneStyle}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:17, fontWeight:800 }}>🔧 Panel Admina</span>
        {tab==="tips"
          ? <button onClick={()=>{setForm(EMPTY_TIP);setEditId(null);setErrors({});setView("addTip");}} style={{ background:C.green, border:"none", borderRadius:20, padding:"8px 16px", fontSize:13, fontWeight:800, color:"#000", cursor:"pointer", fontFamily:"inherit" }}>+ Dodaj typ</button>
          : <button onClick={openCouponForm} style={{ background:C.gold, border:"none", borderRadius:20, padding:"8px 14px", fontSize:13, fontWeight:800, color:"#000", cursor:"pointer", fontFamily:"inherit" }}>✏️ Edytuj kupon</button>
        }
      </div>
      <TabBar/>
      <div style={scrollStyle}>

        {/* TIPS TAB */}
        {tab==="tips" && <>
          <div style={{ margin:"12px 12px 8px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:12, textAlign:"center" }}><div style={{ fontSize:30, fontWeight:900, color:C.green }}>{tips.length}</div><div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>AKTYWNE TYPY</div></div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:12, textAlign:"center" }}><div style={{ fontSize:30, fontWeight:900, color:C.purple }}>{tips.filter(t=>t.isPremiumOnly).length}</div><div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>TYLKO PREMIUM</div></div>
          </div>
          {tips.length===0
            ? <div style={{ textAlign:"center", padding:"40px 24px", color:C.muted }}><div style={{ fontSize:40, marginBottom:10 }}>📋</div><div style={{ fontSize:15, fontWeight:700 }}>Brak typów</div><div style={{ fontSize:12, marginTop:6 }}>Kliknij „+ Dodaj typ" żeby zacząć</div></div>
            : tips.map(tip=>(
                <div key={tip.id} style={{ margin:"4px 12px", background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:"12px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, color:C.muted, marginBottom:3 }}>{tip.league} • ⏱ {tip.time}</div>
                      <div style={{ fontSize:15, fontWeight:800, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{tip.match}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                        <span style={{ background:"rgba(0,230,118,.12)", border:"1px solid rgba(0,230,118,.3)", borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:700, color:C.green }}>{tip.type}</span>
                        <span style={{ fontSize:12, color:C.gold, fontWeight:800 }}>@{tip.odds}</span>
                        {tip.isPremiumOnly && <span style={{ fontSize:10, color:C.purple, fontWeight:700 }}>👑</span>}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, marginLeft:10 }}>
                      <button onClick={()=>editTip(tip)} style={{ background:"rgba(255,214,0,.12)", border:`1px solid ${C.gold}`, borderRadius:8, padding:"6px 10px", fontSize:13, cursor:"pointer", color:C.gold }}>✏️</button>
                      <button onClick={()=>delTip(tip.id)} style={{ background:"rgba(255,23,68,.12)", border:`1px solid ${C.red}`, borderRadius:8, padding:"6px 10px", fontSize:13, cursor:"pointer", color:C.red }}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))
          }
        </>}

        {/* COUPON TAB */}
        {tab==="coupon" && (
          <div style={{ padding:"12px 12px 0" }}>
            {/* current coupon preview */}
            <div style={{ background:"linear-gradient(135deg,#0d2b1a,#001f0d)", border:`2px solid ${C.green}`, borderRadius:18, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue','Impact',cursive", fontSize:22, color:C.green, letterSpacing:2 }}>KUPON DNIA</div>
                  <div style={{ fontSize:14, fontWeight:800, marginTop:2 }}>{coupon.title||<span style={{ color:C.muted }}>Brak tytułu</span>}</div>
                  {coupon.description && <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{coupon.description}</div>}
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:28, fontWeight:900, color:C.gold }}>{coupon.entries.length?coupon.entries.reduce((a,e)=>a*(parseFloat(e.odds)||1),1).toFixed(2):"–"}</div>
                  <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>ŁĄCZNY KURS</div>
                </div>
              </div>
              {coupon.entries.length===0
                ? <div style={{ textAlign:"center", padding:"12px 0", color:C.muted, fontSize:13 }}>Brak typów – kliknij „Edytuj kupon"</div>
                : coupon.entries.map((e,i)=>(
                    <div key={i} style={{ background:"rgba(0,0,0,.35)", borderRadius:10, padding:"8px 12px", marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div><div style={{ fontSize:13, fontWeight:800 }}>{e.match||"–"}</div><div style={{ fontSize:12, color:C.green }}>{e.type}</div></div>
                      <div style={{ fontSize:18, fontWeight:900, color:C.gold }}>@{e.odds}</div>
                    </div>
                  ))
              }
              {coupon.bookmaker && <div style={{ fontSize:11, color:C.muted, marginTop:8 }}>📍 {coupon.bookmaker}</div>}
              {coupon.isPremiumOnly && <div style={{ fontSize:11, color:C.purple, fontWeight:700, marginTop:6 }}>👑 Tylko Premium</div>}
            </div>

            <Btn onClick={openCouponForm} style={{ width:"100%", background:`linear-gradient(90deg,${C.gold},#ff6d00)`, color:"#000", fontFamily:"'Bebas Neue','Impact',cursive", fontSize:20, letterSpacing:2 }}>
              ✏️ EDYTUJ KUPON DNIA
            </Btn>
            <div style={{ height:20 }}/>
          </div>
        )}
        <div style={{ height:16 }}/>
      </div>
      <BottomNav screen="admin" setScreen={setScreen}/>
    </div>
  );
}

/* ══ MAIN APP ══ */

// ⬇️ WKLEJ TU SWÓJ URL VERCEL PO WDROŻENIU (np. https://hitkupon.vercel.app)
const BACKEND_URL = "https://abebe-jel2.vercel.app";

export default function App() {
  const [screen,      setScreen]      = useState("home");
  const [tips,        setTips]        = useState([]);
  const [coupon,      setCoupon]      = useState({ title:"", description:"", bookmaker:"", entries:[], isPremiumOnly:false });
  const [activeTip,   setActiveTip]   = useState(null);
  const [watchingTip, setWatchingTip] = useState(null);
  const [unlocked,    setUnlocked]    = useState([]);
  const [isPremium,   setIsPremium]   = useState(false);
  const [premiumEmail,setPremiumEmail]= useState("");
  const [premiumExp,  setPremiumExp]  = useState(null);
  const [pushVisible, setPushVisible] = useState(false);
  const [adminLogged, setAdminLogged] = useState(false);

  useEffect(()=>{ if(isPremium) setUnlocked(tips.map(t=>t.id)); },[isPremium,tips]);

  // Sprawdź premium po powrocie ze Stripe (URL ?email=xxx)
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if(emailParam) checkPremium(emailParam);
  },[]);

  const checkPremium = async (email) => {
    if(!email) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/check-premium?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if(data.premium){
        setIsPremium(true);
        setPremiumEmail(email);
        setPremiumExp(data.expires_at);
      }
    } catch(e) {
      console.error("Błąd sprawdzania premium:", e);
    }
  };

  const handleUnlock = () => {
    if(!watchingTip) return;
    setUnlocked(p=>[...new Set([...p,watchingTip.id])]);
    setActiveTip(watchingTip);
    setWatchingTip(null);
    setScreen("detail");
  };

  const handleSetTips = (newTips) => {
    setTips(newTips);
    if(newTips.length>tips.length){ setPushVisible(true); setTimeout(()=>setPushVisible(false),4000); }
  };

  return (
    <div style={{ width:"100%", minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        @keyframes slideDown { from{transform:translateY(-20px);opacity:0} to{transform:translateY(0);opacity:1} }
        input::placeholder,textarea::placeholder { color:#4a5568; }
        input:focus,textarea:focus { border-color:#00e676 !important; box-shadow:0 0 0 2px rgba(0,230,118,.15); }
      `}</style>

      {screen==="home"    && <HomeScreen    tips={tips} coupon={coupon} isPremium={isPremium} setScreen={setScreen} setActiveTip={setActiveTip} setWatchingTip={setWatchingTip} unlocked={unlocked} pushVisible={pushVisible}/>}
      {screen==="detail"  && <DetailScreen  tip={activeTip} setScreen={setScreen}/>}
      {screen==="ad"      && watchingTip && <AdScreen tip={watchingTip} onUnlock={handleUnlock} setScreen={setScreen}/>}
      {screen==="coupon"  && <CouponScreen  coupon={coupon} setScreen={setScreen} isPremium={isPremium}/>}
      {screen==="premium" && <PremiumScreen setScreen={setScreen} isPremium={isPremium} premiumEmail={premiumEmail} premiumExp={premiumExp} onCheckPremium={checkPremium} backendUrl={BACKEND_URL}/>}
      {screen==="admin"   && (!adminLogged
        ? <AdminLogin onLogin={()=>setAdminLogged(true)}/>
        : <AdminPanel tips={tips} setTips={handleSetTips} coupon={coupon} setCoupon={setCoupon} setScreen={setScreen}/>
      )}
    </div>
  );
}
