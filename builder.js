// builder.js — generates the whole project so you only upload 2 files.
const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const full = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.replace(/\r\n/g, '\n'));
  console.log('✔ wrote', filePath);
}

const files = {
  // ---------------- root files ----------------
  "next.config.js": `/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, images: { unoptimized: true } };
module.exports = nextConfig;`,

  "styles.css": `:root{--bg:#0b0e14;--card:#121826;--muted:#a7b0c0;--text:#e6eefc;--accent:#39d98a;--accent2:#6aa2ff;--warn:#ffcc66;--danger:#ff6b6b}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
a{color:var(--accent2);text-decoration:none}
.container{max-width:1200px;margin:0 auto;padding:24px}
.grid{display:grid;gap:24px}
.card{background:var(--card);border-radius:14px;padding:20px;border:1px solid #1d2436}
.btn{background:var(--accent2);color:#fff;padding:12px 16px;border-radius:10px;border:0;cursor:pointer}
.btn.alt{background:var(--accent);color:#06120a}
.btn.ghost{background:transparent;border:1px solid #283047}
.badge{font-size:12px;padding:4px 8px;border-radius:8px;background:#1d2436;color:var(--muted)}
.hint{color:var(--muted);font-size:14px}
.title{font-size:32px;font-weight:700;margin:0 0 8px}
.sub{color:var(--muted);margin:0 0 16px}
.price{font-size:28px;font-weight:700}.row{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.kbd{background:#0f1421;border:1px solid #20283c;border-bottom-color:#111729;color:#a7b0c0;padding:2px 6px;border-radius:6px;font-size:12px}
hr{border:0;height:1px;background:#1d2436;margin:20px 0}
table{width:100%;border-collapse:collapse;font-size:14px}
td,th{padding:10px;border-bottom:1px solid #1d2436}
input,select,textarea{background:#0f1421;color:#e6eefc;border:1px solid #283047;border-radius:10px;padding:10px 12px;width:100%}`,

  // ---------------- pages ----------------
  "pages/_app.js": `import '../styles.css';
export default function App({ Component, pageProps }) { return <Component {...pageProps} /> }`,

  "pages/index.js": `import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Screener from '../components/Screener';
import StrategySelect from '../components/StrategySelect';
import LiveTradeFeed from '../components/LiveTradeFeed';
import Journal from '../components/Journal';
import Dashboard from '../components/Dashboard';

const LINKS = {
  starter: "https://buy.stripe.com/fZueVd0nPgU4dzvfkW38401",
  pro:     "https://buy.stripe.com/3cI7sLfiJ33efHDdcO38400",
  elite:   "https://buy.stripe.com/bJe00jfiJ7ju3YVdcO38406",
  family:  "https://buy.stripe.com/eVq7sLgmN33edzv2ya38404"
};

export default function Home(){
  const [familyVisible,setFamilyVisible]=useState(false);
  const [strategy,setStrategy]=useState('ORB');
  const [symbol,setSymbol]=useState('AAPL');
  const [timeframe,setTimeframe]=useState('5m');
  const [notes,setNotes]=useState('');
  const [lastTrade,setLastTrade]=useState(null);

  const findBuffer=useRef('');
  useEffect(()=>{
    const onKey=(e)=>{
      if(e.ctrlKey && e.key.toLowerCase()==='f'){ findBuffer.current=''; return; }
      if(findBuffer.current!==null){
        findBuffer.current += e.key;
        if(findBuffer.current.toLowerCase().includes('family free version')){
          setFamilyVisible(true); findBuffer.current=null;
        }
        setTimeout(()=>{ if(findBuffer.current) findBuffer.current=''; },1500);
      }
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[]);

  const onTrade=(dir)=>{
    const outcome=Math.random()>0.5?'WIN':'LOSS';
    const why= outcome==='WIN'
      ? 'Entry aligned with momentum + candle structure; risk managed; solid R:R.'
      : 'Signal conflicted with higher timeframe trend; late entry; stop too tight.';
    setLastTrade({symbol,timeframe,strategy,dir,outcome,why,ts:new Date().toLocaleString()});
  };

  return (<>
    <Header/>
    <main className="container grid" style={{gap:32}}>
      <section className="card">
        <div className="row">
          <div style={{flex:1}}>
            <h1 className="title">Echo AI — Chart Intelligence, Signals & Coaching</h1>
            <p className="sub">Live chart reading across TradingView, brokers & crypto. Strategy alerts, journaling, and coaching tips.<br/>All plans include a <b>3-Day Free Trial</b> before billing begins.</p>
            <div className="row">
              <a className="btn alt" href="#pricing">See Pricing</a>
              <a className="btn ghost" href="#screener">Try Screener Demo</a>
              <span className="badge">Phase 1 live • Phases 2–4 stubs wired</span>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
        <Plan name="Starter" price="$59.99/month"
          bullets={['Beginner strategies + Practice mode','Strategy Wizard + Overtrading Warnings','Built-in Trade Log + Voice alerts']}
          link={LINKS.starter}/>
        <Plan name="Pro" price="$99.99/month" highlight
          bullets={['Everything in Starter','Advanced Signals: ORB, Breakouts, Support/Resistance','Portfolio Mode (401k, ETFs) + Options tools']}
          link={LINKS.pro}/>
        <Plan name="Elite Lifetime" price="$999 one-time"
          bullets={['Lifetime of all Pro features & upgrades','Early beta access + VIP onboarding','Alexa “TrueTrend” voice signals (Phase 2)']}
          link={LINKS.elite}/>
        {familyVisible && <Plan name="Family Free" price="$0" subtle
          bullets={['Private family-only access','Limited feature set','For testing/approval use']}
          link={LINKS.family}/>}
      </section>

      <section id="screener" className="grid" style={{gridTemplateColumns:'2fr 1fr'}}>
        <div className="card">
          <div className="row">
            <input value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} placeholder="Symbol (AAPL)" style={{maxWidth:160}}/>
            <select value={timeframe} onChange={e=>setTimeframe(e.target.value)} style={{maxWidth:140}}>
              <option>1m</option><option>5m</option><option>15m</option><option>1h</option><option>4h</option><option>1d</option>
            </select>
            <StrategySelect value={strategy} onChange={setStrategy}/>
            <button className="btn" onClick={()=>onTrade('LONG')}>Sim LONG</button>
            <button className="btn ghost" onClick={()=>onTrade('SHORT')}>Sim SHORT</button>
          </div>
          <hr/>
          <Screener symbol={symbol} timeframe={timeframe} strategy={strategy}/>
          <hr/>
          <LiveTradeFeed/>
        </div>
        <div className="grid" style={{gap:24}}>
          <Dashboard symbol={symbol}/>
          <div className="card">
            <h3 style={{marginTop:0}}>Journal</h3>
            <textarea rows={6} placeholder="Notes…" value={notes} onChange={e=>setNotes(e.target.value)}/>
            <Journal notes={notes}/>
            {lastTrade && (
              <div className="card" style={{marginTop:12}}>
                <b>Last Trade ({lastTrade.ts})</b>
                <div className="hint">{lastTrade.symbol} {lastTrade.timeframe} • {lastTrade.strategy} • {lastTrade.dir}</div>
                <div style={{marginTop:8}}>
                  Outcome: <span className="badge" style={{background:lastTrade.outcome==='WIN'?'#193a2a':'#3a1e1e',color:lastTrade.outcome==='WIN'?'#39d98a':'#ff6b6b'}}>{lastTrade.outcome}</span>
                </div>
                <div className="hint" style={{marginTop:6}}>{lastTrade.why}</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>);}

function Plan({name,price,bullets,link,highlight,subtle}){
  return (
    <div className="card" style={{borderColor:highlight?'#2f4b87':'#1d2436',opacity:subtle?0.85:1}}>
      {highlight && <div className="badge" style={{background:'#2a3862',color:'#a7c0ff'}}>Recommended</div>}
      <h3 className="title" style={{margin:'8px 0'}}>{name}</h3>
      <div className="price">{price}</div>
      <div className="hint">Includes 3-Day Free Trial</div>
      <ul className="hint" style={{marginTop:12,paddingLeft:18}}>
        {bullets.map(b=><li key={b}>{b}</li>)}
      </ul>
      <a className="btn" href={link} style={{marginTop:14,display:'inline-block'}}>Start Free Trial</a>
    </div>
  );
}`,

  // ---------------- components ----------------
  "components/Header.js": `export default function Header(){return(
  <header className="container row" style={{justifyContent:'space-between',alignItems:'center',paddingTop:20}}>
    <div className="row" style={{gap:10}}>
      <div className="badge" style={{background:'#132036',color:'#cfe0ff'}}>Echo AI</div>
      <span className="hint">TrueTrend • Multi-asset Intelligent Signals</span>
    </div>
    <nav className="row" style={{gap:16}}>
      <a href="#pricing">Pricing</a>
      <a href="#screener">Screener</a>
      <a href="mailto:support@truetrendtrading.com" className="btn ghost">Support</a>
    </nav>
  </header>);}`,

  "components/Footer.js": `export default function Footer(){return(
  <footer className="container hint" style={{paddingBottom:30}}>
    <hr/>
    <div className="row" style={{justifyContent:'space-between'}}>
      <div>© ${new Date().getFullYear()} TrueTrend Trading LLC</div>
      <div className="row" style={{gap:12}}>
        <a href="#pricing">Plans</a>
        <a href="/terms" onClick={e=>e.preventDefault()}>Terms</a>
        <a href="/privacy" onClick={e=>e.preventDefault()}>Privacy</a>
      </div>
    </div>
  </footer>);}`,

  "components/Screener.js": `import { useEffect, useState } from 'react';
import { getSignal } from '../lib/engine';
export default function Screener({symbol,timeframe,strategy}){
  const [data,setData]=useState([]);
  useEffect(()=>{const id=setInterval(()=>{
    const sig=getSignal(symbol,timeframe,strategy);
    setData(prev=>[sig,...prev].slice(0,20));
  },2000);return()=>clearInterval(id)},[symbol,timeframe,strategy]);
  return (<div>
    <div className="row" style={{justifyContent:'space-between'}}>
      <div className="hint">Live Screener (demo)</div>
      <div className="badge">{symbol} • {timeframe} • {strategy}</div>
    </div>
    <table style={{marginTop:10}}>
      <thead><tr><th>Time</th><th>Symbol</th><th>TF</th><th>Signal</th><th>Confidence</th></tr></thead>
      <tbody>{data.map((r,i)=>(<tr key={i}>
        <td>{r.time}</td><td>{r.symbol}</td><td>{r.timeframe}</td>
        <td style={{color:r.side==='LONG'?'#39d98a':'#ff6b6b'}}>{r.side}</td>
        <td>{r.confidence}%</td>
      </tr>))}</tbody>
    </table>
  </div>);}`,

  "components/StrategySelect.js": `export default function StrategySelect({value,onChange}){
  return (<select value={value} onChange={e=>onChange(e.target.value)} style={{maxWidth:200}}>
    <option value="ORB">ORB (Opening Range Breakout)</option>
    <option value="BO">Breakout (Structure)</option>
    <option value="SR">Support/Resistance</option>
    <option value="MA">MA Crossover</option>
    <option value="RSI">RSI Divergence</option>
  </select>);
}`,

  "components/LiveTradeFeed.js": `import { useEffect, useState } from 'react';
export default function LiveTradeFeed(){
  const [events,setEvents]=useState([]);
  useEffect(()=>{const id=setInterval(()=>{
    const sample=["News: CPI moderates","FOMC speaker: neutral","Sector rotation into Tech","VIX steady"].sort(()=>0.5-Math.random())[0];
    setEvents(prev=>[{ts:new Date().toLocaleTimeString(),msg:sample},...prev].slice(0,10));
  },4000);return()=>clearInterval(id)},[]);
  return (<div>
    <div className="hint">Live Context Feed (demo)</div>
    <ul>{events.map((e,i)=>(<li key={i}><span className="badge">{e.ts}</span> {e.msg}</li>))}</ul>
  </div>);
}`,

  "components/Journal.js": `export default function Journal({notes}){
  return (<div className="hint" style={{marginTop:8}}>
    <div className="badge">Tip</div> Journal entries sync to your local device in this demo.
    <div style={{marginTop:8}}>Your notes: {notes?.length?<span>{notes.slice(0,120)}{notes.length>120?'…':''}</span>:'—'}</div>
  </div>);
}`,

  "components/Dashboard.js": `export default function Dashboard({symbol}){
  return (<div className="card">
    <h3 style={{marginTop:0}}>Dashboard</h3>
    <div className="hint">This panel will link accounts (Schwab, Fidelity, Robinhood, PocketOption, crypto) in Phase 2–3.</div>
    <div className="row" style={{marginTop:10}}>
      <div className="badge">PnL (demo)</div>
      <div className="badge">Win rate</div>
      <div className="badge">Streak</div>
    </div>
    <div className="hint" style={{marginTop:10}}>Watching: <b>{symbol}</b>. Subscribe to accounts to get live positions & journal sync.</div>
  </div>);
}`,

  // ---------------- lib ----------------
  "lib/engine.js": `export function getSignal(symbol,timeframe,strategy){
  const side=Math.random()>0.5?'LONG':'SHORT';
  const confidence=50+Math.floor(Math.random()*49);
  return { time:new Date().toLocaleTimeString(), symbol, timeframe, strategy, side, confidence };
}`,

  "lib/brokers.js": `export async function connectBroker(name,oauth){ return { ok:true, name }; }
export async function fetchPortfolio(name){
  return [{symbol:'SPY',qty:10,avg:530.12},{symbol:'QQQ',qty:8,avg:480.44}];
}`,

  "lib/alexa.js": `export async function getAlexaDirection(symbol='XAUUSD'){
  const dir=Math.random()>0.5?'bullish':'bearish';
  return \`Current bias for \${symbol} appears \${dir}. Watch nearby structure levels and momentum.\`;
}`,

  // ---------------- public ----------------
  "public/favicon.ico": "" // optional, can be empty
};

// write all files
for (const [f, c] of Object.entries(files)) write(f, c || "");

// overwrite package.json after build files exist (keeps scripts/deps same)
write("package.json", `{
  "name": "echo-ai-all-in-one",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "echo \\"(no linter configured)\\""
  },
  "dependencies": {
    "next": "13.5.6",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}`);
console.log("✅ Project generated");
