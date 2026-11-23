import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(__dirname);
const OUT_PNG = join(REPO_ROOT, 'entry.png');

function buildFrontpageHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 1024px;
    height: 1024px;
    overflow: hidden;
    background: #f3efe6;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #f3efe6;
  }
  /* MASTHEAD: 112px exact */
  .masthead {
    height: 112px;
    background: linear-gradient(135deg, #0a1128 0%, #111d3a 58%, #172a4f 100%);
    color: #ffffff;
    padding: 12px 24px 10px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 4px solid #d97706;
    flex-shrink: 0;
  }
  .masthead-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .masthead-top-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .date-pill {
    background: #eab308;
    color: #0a1128;
    font-weight: 800;
    font-size: 12.5px;
    letter-spacing: 0.9px;
    padding: 3px 10px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .edition-tag {
    color: #cbd5e1;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.3px;
    text-transform: uppercase;
  }
  .masthead-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 38px;
    font-weight: 800;
    letter-spacing: 0.9px;
    line-height: 1.04;
    color: #ffffff;
  }
  .masthead-beats {
    font-size: 11.5px;
    font-weight: 700;
    color: #93c5fd;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .globe-wrap {
    width: 78px;
    height: 78px;
    flex-shrink: 0;
  }

  /* 6-PANEL GRID: 876px exact */
  .grid {
    height: 876px;
    padding: 12px 18px;
    display: grid;
    grid-template-columns: 488px 488px;
    grid-template-rows: repeat(3, 276px);
    gap: 12px;
    flex-shrink: 0;
  }
  .card {
    background: #ffffff;
    border: 1px solid #d4cfc4;
    border-radius: 8px;
    padding: 10px 13px 9px 13px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 5px rgba(15, 23, 42, 0.05);
    position: relative;
    overflow: hidden;
  }
  .card-top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  .card-header {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    flex-shrink: 0;
  }
  .card-kicker {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  .card-loc {
    font-size: 10.5px;
    font-weight: 700;
    color: #475569;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    background: #f1f5f9;
    padding: 2px 7px;
    border-radius: 4px;
  }
  .visual-box {
    width: 460px;
    height: 158px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    margin-bottom: 7px;
    flex-shrink: 0;
  }
  .card-headline {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 19.8px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.15;
    margin-bottom: 4px;
    letter-spacing: -0.25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
  }
  .card-summary {
    font-size: 12.6px;
    font-weight: 500;
    color: #334155;
    line-height: 1.32;
  }

  /* FOOTER TICKER: 36px exact */
  .footer {
    height: 36px;
    background: #0a1128;
    color: #f8fafc;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11.8px;
    border-top: 2px solid #eab308;
    flex-shrink: 0;
  }
  .footer-left {
    display: flex;
    align-items: center;
    gap: 9px;
    overflow: hidden;
    white-space: nowrap;
  }
  .footer-label {
    color: #facc15;
    font-weight: 800;
    letter-spacing: 0.6px;
  }
  .footer-items {
    color: #e2e8f0;
    font-weight: 600;
  }
  .footer-date {
    color: #fde047;
    font-weight: 800;
    letter-spacing: 0.7px;
    flex-shrink: 0;
  }
</style>
</head>
<body>
<div class="page">
  <!-- MASTHEAD -->
  <header class="masthead">
    <div class="masthead-left">
      <div class="masthead-top-row">
        <span class="date-pill">MONDAY · 23 NOVEMBER 2026</span>
        <span class="edition-tag">GLOBAL FRONT PAGE · SIX-REGION EDITION</span>
      </div>
      <div class="masthead-title">WORLD NEWS IN ONE DAY</div>
      <div class="masthead-beats">CLIMATE SUMMIT · TECH MARKETS · BALTIC SECURITY · AFRICA CRISES · ASIA DIPLOMACY · US &amp; ENVIRONMENT</div>
    </div>
    <div class="globe-wrap">
      <svg viewBox="0 0 100 100" width="78" height="78">
        <defs>
          <radialGradient id="gBg" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="100%" stop-color="#091024"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#gBg)" stroke="#eab308" stroke-width="2.2"/>
        <ellipse cx="50" cy="50" rx="24" ry="45" fill="none" stroke="#3b82f6" stroke-width="1" stroke-opacity="0.45"/>
        <line x1="5" y1="50" x2="95" y2="50" stroke="#3b82f6" stroke-width="1" stroke-opacity="0.45"/>
        <line x1="12" y1="30" x2="88" y2="30" stroke="#3b82f6" stroke-width="0.9" stroke-opacity="0.35"/>
        <line x1="12" y1="70" x2="88" y2="70" stroke="#3b82f6" stroke-width="0.9" stroke-opacity="0.35"/>
        <!-- Hotspot pins for the 6 stories -->
        <circle cx="57" cy="36" r="4.5" fill="#10b981" stroke="#fff" stroke-width="1.3"/>
        <circle cx="79" cy="38" r="4.5" fill="#ef4444" stroke="#fff" stroke-width="1.3"/>
        <circle cx="54" cy="24" r="4.5" fill="#38bdf8" stroke="#fff" stroke-width="1.3"/>
        <circle cx="55" cy="54" r="4.5" fill="#f97316" stroke="#fff" stroke-width="1.3"/>
        <circle cx="70" cy="46" r="4.5" fill="#6366f1" stroke="#fff" stroke-width="1.3"/>
        <circle cx="24" cy="37" r="4.5" fill="#a855f7" stroke="#fff" stroke-width="1.3"/>
      </svg>
    </div>
  </header>

  <!-- 6-PANEL NEWS GRID -->
  <main class="grid">
    <!-- PANEL 1: COP31 COLLAPSE -->
    <section class="card">
      <div class="card-top-bar" style="background:#059669;"></div>
      <div class="card-header">
        <span class="card-kicker" style="color:#047857;">CLIMATE · UN SUMMIT BREAKDOWN</span>
        <span class="card-loc">ANTALYA, TÜRKIYE</span>
      </div>
      <div class="visual-box" style="background:linear-gradient(135deg,#052e22 0%,#0b3b2d 100%);">
        <svg viewBox="0 0 460 158" width="460" height="158">
          <!-- Top status pills -->
          <rect x="12" y="10" width="224" height="22" rx="4" fill="#dc2626"/>
          <text x="20" y="25" fill="#ffffff" font-size="10.8" font-weight="800" letter-spacing="0.3">NO FINAL PACT · +44H OVERTIME</text>
          <rect x="244" y="10" width="204" height="22" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1"/>
          <text x="255" y="25" fill="#a7f3d0" font-size="10.8" font-weight="800" letter-spacing="0.3">LONGEST UN COP IN HISTORY</text>

          <!-- Center Fractured Earth + Gavel Icon -->
          <circle cx="56" cy="76" r="32" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
          <path d="M 38 56 Q 52 65 44 82 Q 62 88 55 102" fill="none" stroke="#34d399" stroke-width="2" stroke-opacity="0.5"/>
          <!-- Fracture jagged bolt through globe -->
          <path d="M 57 42 L 50 67 L 63 73 L 52 110" fill="none" stroke="#facc15" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Two opposing blocks on the right -->
          <rect x="100" y="42" width="168" height="68" rx="6" fill="#0f172a" fill-opacity="0.78" stroke="#38bdf8" stroke-width="1.3"/>
          <text x="110" y="59" fill="#38bdf8" font-size="10.5" font-weight="800">EU · UK · ISLAND BLOC</text>
          <text x="110" y="79" fill="#ffffff" font-size="15.5" font-weight="800">REJECT DRAFT</text>
          <text x="110" y="96" fill="#cbd5e1" font-size="10.5" font-weight="600">No fossil-fuel phase-out</text>

          <rect x="280" y="42" width="168" height="68" rx="6" fill="#0f172a" fill-opacity="0.78" stroke="#f87171" stroke-width="1.3"/>
          <text x="290" y="59" fill="#fca5a5" font-size="10.5" font-weight="800">ANTALYA PLENARY</text>
          <text x="290" y="79" fill="#ffffff" font-size="15.5" font-weight="800">GAVELED SHUT</text>
          <text x="290" y="96" fill="#cbd5e1" font-size="10.5" font-weight="600">Kurum closes with no pact</text>

          <!-- Bottom summary bar -->
          <rect x="12" y="120" width="436" height="27" rx="4" fill="#022c22" stroke="#10b981" stroke-width="1"/>
          <text x="22" y="138" fill="#ecfdf5" font-size="11.2" font-weight="700">FOSSIL-FUEL TRANSITION DEADLOCK  ·  UAE CONSENSUS ROLLBACK BLOCKED</text>
        </svg>
      </div>
      <h2 class="card-headline">COP31 Collapses With No Deal in Antalya</h2>
      <p class="card-summary">UN climate talks ended without a pact after 44 hours of record overtime as the EU, UK, and island states rejected a draft omitting a fossil-fuel phase-out.</p>
    </section>

    <!-- PANEL 2: ASIAN MARKETS & AI BUBBLE SELL-OFF -->
    <section class="card">
      <div class="card-top-bar" style="background:#dc2626;"></div>
      <div class="card-header">
        <span class="card-kicker" style="color:#b91c1c;">MARKETS &amp; TECH · AI BUBBLE FEARS</span>
        <span class="card-loc">SEOUL · TOKYO · NY</span>
      </div>
      <div class="visual-box" style="background:#0f172a;">
        <svg viewBox="0 0 460 158" width="460" height="158">
          <!-- Index badges -->
          <rect x="12" y="10" width="138" height="40" rx="5" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.3"/>
          <text x="20" y="25" fill="#fca5a5" font-size="10" font-weight="800">SOUTH KOREA KOSPI</text>
          <text x="20" y="43" fill="#ffffff" font-size="17" font-weight="800">-3.7% MON</text>

          <rect x="158" y="10" width="142" height="40" rx="5" fill="#1e293b" stroke="#f87171" stroke-width="1.1"/>
          <text x="166" y="25" fill="#cbd5e1" font-size="10" font-weight="800">WALL ST NASDAQ</text>
          <text x="166" y="43" fill="#f87171" font-size="17" font-weight="800">-5.3% SLIDE</text>

          <rect x="308" y="10" width="140" height="40" rx="5" fill="#1e293b" stroke="#fb923c" stroke-width="1.1"/>
          <text x="316" y="25" fill="#cbd5e1" font-size="10" font-weight="800">US S&amp;P 500 INDEX</text>
          <text x="316" y="43" fill="#fb923c" font-size="17" font-weight="800">-3.7% DROP</text>

          <!-- Chart grid -->
          <line x1="16" y1="64" x2="444" y2="64" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="16" y1="94" x2="444" y2="94" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="16" y1="124" x2="444" y2="124" stroke="#334155" stroke-width="1"/>

          <!-- Volume bars in background -->
          <rect x="55" y="106" width="14" height="18" fill="#334155" fill-opacity="0.55"/>
          <rect x="125" y="100" width="14" height="24" fill="#334155" fill-opacity="0.55"/>
          <rect x="195" y="92" width="14" height="32" fill="#7f1d1d" fill-opacity="0.65"/>
          <rect x="265" y="84" width="14" height="40" fill="#991b1b" fill-opacity="0.65"/>
          <rect x="335" y="76" width="14" height="48" fill="#b91c1c" fill-opacity="0.7"/>
          <rect x="405" y="70" width="14" height="54" fill="#dc2626" fill-opacity="0.75"/>

          <!-- Shaded area under curve -->
          <polygon points="18,64 105,69 195,83 290,103 375,117 440,122 440,124 18,124" fill="#ef4444" fill-opacity="0.22"/>
          <!-- S&P dashed line -->
          <polyline points="18,62 105,67 195,75 290,88 375,98 440,104" fill="none" stroke="#fbbf24" stroke-width="2.3" stroke-dasharray="6,4"/>
          <!-- Kospi / Nasdaq steep drop line -->
          <polyline points="18,64 105,69 195,83 290,103 375,117 440,122" fill="none" stroke="#ef4444" stroke-width="3.5"/>
          <circle cx="440" cy="122" r="4.5" fill="#ef4444" stroke="#ffffff" stroke-width="1.6"/>

          <text x="18" y="145" fill="#cbd5e1" font-size="11" font-weight="700">AI CAPEX RETURNS QUESTIONED  ·  CHIP &amp; HARDWARE STOCKS LEAD SELL-OFF</text>
        </svg>
      </div>
      <h2 class="card-headline">Kospi Drops 3.7% in Global AI Tech Rout</h2>
      <p class="card-summary">South Korean and Asian shares slid sharply Monday after Nasdaq's 5.3% tumble as investors questioned multi-trillion-dollar AI infrastructure returns.</p>
    </section>

    <!-- PANEL 3: BALTIC SEA & POLAND SECURITY -->
    <section class="card">
      <div class="card-top-bar" style="background:#0284c7;"></div>
      <div class="card-header">
        <span class="card-kicker" style="color:#0369a1;">SECURITY · BALTIC SEA &amp; COUNTER-INTEL</span>
        <span class="card-loc">FINLAND · POLAND</span>
      </div>
      <div class="visual-box" style="background:linear-gradient(135deg,#082f49 0%,#0f172a 100%);">
        <svg viewBox="0 0 460 158" width="460" height="158">
          <!-- Left panel: Gulf of Finland ship fire -->
          <rect x="10" y="10" width="220" height="138" rx="6" fill="#0c4a6e" fill-opacity="0.55" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="18" y="27" fill="#7dd3fc" font-size="10.5" font-weight="800" letter-spacing="0.4">GULF OF FINLAND · DRONE HIT</text>
          <!-- Finnish coastline top shape -->
          <path d="M 11 36 L 88 36 L 122 46 L 180 39 L 229 44 L 229 34 L 11 34 Z" fill="#334155"/>
          <text x="18" y="54" fill="#cbd5e1" font-size="10" font-weight="700">FINNISH WATERS (TOWED)</text>
          <!-- Ship icon + flame + drone vector -->
          <line x1="48" y1="64" x2="124" y2="78" stroke="#facc15" stroke-width="1.8" stroke-dasharray="4,3"/>
          <polygon points="68,98 176,98 162,114 82,114" fill="#475569" stroke="#e2e8f0" stroke-width="1.3"/>
          <rect x="96" y="84" width="38" height="14" fill="#64748b"/>
          <circle cx="142" cy="81" r="11" fill="#f97316" fill-opacity="0.9"/>
          <circle cx="142" cy="81" r="6" fill="#fde047"/>
          <text x="18" y="135" fill="#ffffff" font-size="12" font-weight="800">SHIP 'SPARTA II' ON FIRE</text>

          <!-- Right panel: Poland & Denmark foil assassination plot -->
          <rect x="240" y="10" width="210" height="138" rx="6" fill="#1e1b4b" fill-opacity="0.75" stroke="#818cf8" stroke-width="1.2"/>
          <rect x="250" y="18" width="190" height="21" rx="4" fill="#dc2626"/>
          <text x="258" y="33" fill="#ffffff" font-size="10.5" font-weight="800">WARSAW &amp; COPENHAGEN</text>
          <text x="250" y="59" fill="#ffffff" font-size="16" font-weight="800">RUSSIAN PLOT FOILED</text>
          <text x="250" y="77" fill="#c7d2fe" font-size="11.5" font-weight="700">Target: Rapper 'Kyivstoner'</text>
          <text x="250" y="97" fill="#e2e8f0" font-size="10.5" font-weight="600">• Poland confirms Aug arrest</text>
          <text x="250" y="114" fill="#e2e8f0" font-size="10.5" font-weight="600">• Denmark expels Russian envoy</text>
          <text x="250" y="131" fill="#38bdf8" font-size="10.5" font-weight="700">• Sparta II crew evacuated</text>
        </svg>
      </div>
      <h2 class="card-headline">Russian Ship Burns Off Finland; Plot Foiled</h2>
      <p class="card-summary">Drone-struck sanctioned ship Sparta II drifted into Finnish waters after catching fire, while Poland confirmed it thwarted a Russian plot against Kyivstoner.</p>
    </section>

    <!-- PANEL 4: AFRICA HUMANITARIAN & HEALTH CRISES -->
    <section class="card">
      <div class="card-top-bar" style="background:#ea580c;"></div>
      <div class="card-header">
        <span class="card-kicker" style="color:#c2410c;">CRISIS &amp; HEALTH · EAST &amp; CENTRAL AFRICA</span>
        <span class="card-loc">ITURI, DRC · KHARTOUM</span>
      </div>
      <div class="visual-box" style="background:linear-gradient(135deg,#2a1205 0%,#1c1917 100%);">
        <svg viewBox="0 0 460 158" width="460" height="158">
          <!-- Left card: DRC Ebola response trapped -->
          <rect x="10" y="10" width="215" height="138" rx="6" fill="#431407" fill-opacity="0.75" stroke="#fb923c" stroke-width="1.2"/>
          <rect x="20" y="18" width="195" height="21" rx="4" fill="#ea580c"/>
          <text x="27" y="33" fill="#ffffff" font-size="10.5" font-weight="800">WHO EMERGENCY · ITURI, DRC</text>
          <!-- Medical Cross -->
          <circle cx="44" cy="72" r="20" fill="#7c2d12" stroke="#fdba74" stroke-width="1.6"/>
          <rect x="40" y="59" width="8" height="26" fill="#ffffff" rx="1.5"/>
          <rect x="31" y="68" width="26" height="8" fill="#ffffff" rx="1.5"/>
          <text x="72" y="66" fill="#ffffff" font-size="15.5" font-weight="800">24H+ HOSPITAL</text>
          <text x="72" y="84" fill="#fdba74" font-size="14" font-weight="800">CLASHES &amp; SIEGE</text>
          <text x="20" y="111" fill="#fed7aa" font-size="11" font-weight="700">17th Ebola Outbreak Zone</text>
          <text x="20" y="129" fill="#cbd5e1" font-size="10.5" font-weight="600">Staff trapped in maternity ward</text>

          <!-- Right card: Khartoum UN Building Drone Strike -->
          <rect x="235" y="10" width="215" height="138" rx="6" fill="#1e293b" fill-opacity="0.88" stroke="#f87171" stroke-width="1.2"/>
          <rect x="245" y="18" width="195" height="21" rx="4" fill="#b91c1c"/>
          <text x="253" y="33" fill="#ffffff" font-size="10.5" font-weight="800">KHARTOUM · SUDAN DRONES</text>
          <text x="245" y="64" fill="#ffffff" font-size="16" font-weight="800">UN FACILITY STRUCK</text>
          <text x="245" y="83" fill="#fca5a5" font-size="12" font-weight="700">Staff Inside During Strike</text>
          <text x="245" y="108" fill="#e2e8f0" font-size="10.8" font-weight="600">• Residential districts hit</text>
          <text x="245" y="127" fill="#cbd5e1" font-size="10.5" font-weight="600">• UN coordinator condemns attack</text>
        </svg>
      </div>
      <h2 class="card-headline">DRC Clashes Trap Ebola Staff; Sudan UN Hit</h2>
      <p class="card-summary">WHO chief Tedros urged a halt to fighting in Ituri after clashes trapped Ebola staff at a hospital, while drone strikes damaged a UN site in Khartoum.</p>
    </section>

    <!-- PANEL 5: ASIA DIPLOMACY & COURTS -->
    <section class="card">
      <div class="card-top-bar" style="background:#2563eb;"></div>
      <div class="card-header">
        <span class="card-kicker" style="color:#1d4ed8;">DIPLOMACY &amp; COURTS · SOUTH &amp; SE ASIA</span>
        <span class="card-loc">NEW DELHI · BANGKOK</span>
      </div>
      <div class="visual-box" style="background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);">
        <svg viewBox="0 0 460 158" width="460" height="158">
          <!-- Left: India-Nepal Bilateral Summit -->
          <rect x="10" y="10" width="215" height="138" rx="6" fill="#1e3a8a" fill-opacity="0.48" stroke="#60a5fa" stroke-width="1.2"/>
          <text x="20" y="28" fill="#93c5fd" font-size="10.5" font-weight="800" letter-spacing="0.4">NEW DELHI · BILATERAL SUMMIT</text>
          <text x="20" y="53" fill="#ffffff" font-size="16.5" font-weight="800">SHAH – MODI TALKS</text>
          <text x="20" y="71" fill="#bfdbfe" font-size="11.2" font-weight="700">Nepal PM's 1st Foreign Visit</text>
          <rect x="20" y="84" width="195" height="24" rx="4" fill="#172554" stroke="#3b82f6" stroke-width="0.9"/>
          <text x="28" y="100" fill="#60a5fa" font-size="10.8" font-weight="800">HYDROPOWER · RAIL · TRADE</text>
          <text x="20" y="129" fill="#cbd5e1" font-size="10.5" font-weight="600">Cross-border projects inaugurated</text>

          <!-- Right: Thailand Court of Appeal Verdict -->
          <rect x="235" y="10" width="215" height="138" rx="6" fill="#312e81" fill-opacity="0.48" stroke="#a78bfa" stroke-width="1.2"/>
          <text x="245" y="28" fill="#c4b5fd" font-size="10.5" font-weight="800" letter-spacing="0.4">BANGKOK · COURT OF APPEAL</text>
          <text x="245" y="53" fill="#ffffff" font-size="16.5" font-weight="800">THAI MP VERDICT DAY</text>
          <text x="245" y="71" fill="#ddd6fe" font-size="11.2" font-weight="700">MP Rukchanok Srinork (People's)</text>
          <rect x="245" y="84" width="195" height="24" rx="4" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="0.9"/>
          <text x="253" y="100" fill="#facc15" font-size="10.8" font-weight="800">SEC. 112 &amp; CYBER ACT RULING</text>
          <text x="245" y="129" fill="#cbd5e1" font-size="10.5" font-weight="600">6-year sentence &amp; House seat case</text>
        </svg>
      </div>
      <h2 class="card-headline">Nepal PM Shah Meets Modi; Thai Court Rules</h2>
      <p class="card-summary">Nepal PM Balendra Shah and India's Narendra Modi launched hydropower and rail pacts in New Delhi as Thailand's Appeal Court ruled on MP Rukchanok.</p>
    </section>

    <!-- PANEL 6: US LEAD AZIDE & LAHORE AQI 500+ -->
    <section class="card">
      <div class="card-top-bar" style="background:#7c3aed;"></div>
      <div class="card-header">
        <span class="card-kicker" style="color:#6d28d9;">ENVIRONMENT &amp; HAZMAT · US &amp; SOUTH ASIA</span>
        <span class="card-loc">IOWA, USA · LAHORE</span>
      </div>
      <div class="visual-box" style="background:linear-gradient(135deg,#1e1b4b 0%,#2e1065 100%);">
        <svg viewBox="0 0 460 158" width="460" height="158">
          <!-- Left: US Army Lead Azide Controversy -->
          <rect x="10" y="10" width="215" height="138" rx="6" fill="#0f172a" fill-opacity="0.78" stroke="#c084fc" stroke-width="1.2"/>
          <text x="20" y="28" fill="#e9d5ff" font-size="10.5" font-weight="800">MIDDLETOWN, IOWA · US ARMY</text>
          <!-- Hazard Warning Triangle Icon -->
          <polygon points="196,40 214,70 178,70" fill="#eab308" stroke="#fef08a" stroke-width="1.2"/>
          <text x="193" y="66" fill="#0f172a" font-size="15" font-weight="900">!</text>
          <text x="20" y="59" fill="#facc15" font-size="26" font-weight="800">4.4 TONS</text>
          <text x="20" y="78" fill="#ffffff" font-size="13" font-weight="800">VOLATILE LEAD AZIDE</text>
          <text x="20" y="102" fill="#cbd5e1" font-size="10.5" font-weight="600">• 9,700 lbs unstable explosive</text>
          <text x="20" y="121" fill="#cbd5e1" font-size="10.5" font-weight="600">• Court stay &amp; EPA plume fight</text>

          <!-- Right: Lahore AQI > 500 Hazardous Smog -->
          <rect x="235" y="10" width="215" height="138" rx="6" fill="#0f172a" fill-opacity="0.78" stroke="#f43f5e" stroke-width="1.2"/>
          <text x="245" y="28" fill="#fda4af" font-size="10.5" font-weight="800">LAHORE, PAKISTAN · AIR CRISIS</text>
          <!-- Hazardous AQI Badge Circle -->
          <circle cx="418" cy="54" r="16" fill="#881337" stroke="#fb7185" stroke-width="1.5"/>
          <text x="406" y="58" fill="#ffffff" font-size="10" font-weight="800">MAX</text>
          <text x="245" y="59" fill="#fb7185" font-size="26" font-weight="800">AQI 500+</text>
          <text x="245" y="78" fill="#ffffff" font-size="13" font-weight="800">WORLD'S MOST POLLUTED</text>
          <!-- AQI Severity Bar -->
          <rect x="245" y="90" width="192" height="11" rx="5.5" fill="#334155"/>
          <rect x="245" y="90" width="186" height="11" rx="5.5" fill="#e11d48"/>
          <text x="245" y="121" fill="#cbd5e1" font-size="10.5" font-weight="600">• Hazardous smog engulfs Punjab</text>
        </svg>
      </div>
      <h2 class="card-headline">US Army Lead Azide Fight; Lahore AQI 500+</h2>
      <p class="card-summary">Emergency legal battles challenged a US Army plan to detonate 4.4 tons of unstable lead azide in Iowa, while Lahore's smog surged past AQI 500.</p>
    </section>
  </main>

  <!-- FOOTER TICKER -->
  <footer class="footer">
    <div class="footer-left">
      <span class="footer-label">ALSO 23 NOV 2026:</span>
      <span class="footer-items">South Korea education minister resigns over exam scandal  •  Anthropic Claude aids math breakthrough  •  Russian strikes hit Lviv &amp; Kyiv</span>
    </div>
    <span class="footer-date">23 NOV 2026</span>
  </footer>
</div>
</body>
</html>`;
}

function findBrowserExecutable() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('No Chromium-based browser executable found');
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function renderPngWithCdp(htmlContent, outputPngPath) {
  const browserBin = findBrowserExecutable();
  const tempDir = join(tmpdir(), `makefun-news-20261123-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });
  const htmlPath = join(tempDir, 'frontpage.html');
  writeFileSync(htmlPath, htmlContent, 'utf8');

  const port = 9345 + Math.floor(Math.random() * 400);
  const userDataDir = join(tempDir, 'profile');
  mkdirSync(userDataDir, { recursive: true });

  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  const proc = spawn(
    browserBin,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      '--window-size=1024,1024',
      fileUrl,
    ],
    { stdio: 'ignore' }
  );

  try {
    let targets = null;
    for (let i = 0; i < 40; i++) {
      await sleep(150);
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/list`);
        if (res.ok) {
          const list = await res.json();
          const pageTarget = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
          if (pageTarget) {
            targets = pageTarget;
            break;
          }
        }
      } catch {
        // wait for DevTools port
      }
    }
    if (!targets) {
      throw new Error('Failed to connect to headless browser DevTools target');
    }

    const ws = new WebSocket(targets.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });

    let msgId = 1;
    const sendCdp = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        const listener = (event) => {
          const data = JSON.parse(typeof event.data === 'string' ? event.data : event.data.toString());
          if (data.id === id) {
            ws.removeEventListener('message', listener);
            if (data.error) reject(new Error(data.error.message));
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', listener);
        ws.send(JSON.stringify({ id, method, params }));
      });

    await sendCdp('Page.enable');
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(400);

    const shot = await sendCdp('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1024, height: 1024, scale: 1 },
      captureBeyondViewport: true,
    });

    const pngBuf = Buffer.from(shot.data, 'base64');
    writeFileSync(outputPngPath, pngBuf);
    ws.close();
    return pngBuf;
  } finally {
    try {
      proc.kill();
    } catch {
      // ignore
    }
  }
}

const html = buildFrontpageHtml();
const buf = await renderPngWithCdp(html, OUT_PNG);
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(`Rendered ${OUT_PNG}: ${width}x${height}, ${buf.length} bytes`);
