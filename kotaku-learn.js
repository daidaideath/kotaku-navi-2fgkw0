/* 個タク学習モジュール kotaku-learn.js（2026-10-16作成・2026-10-22 v03・Claude）
   個タク準備ナビに組み込む共通の学習機能（学ぶ・クイズ）。説明と問題はClaude版「個タク開業クイズ」v01（2026/10/11）を引き継ぐ。
   このファイルが学習教材の正本。教材を直すときはこのファイルを直す（index.html から読み込む）。 */
(function(){
"use strict";
const CSS = `.klq{ --studio:#1B2272; --studio-2:#3B1F8F; --ray:#232C8E; --gold-deep:#C98F00; --a:#2459E0; --b:#B35F00; --c:#7041E0; --big:#3B1F8F;
  --font:var(--f-body,"BIZ UDPGothic","Hiragino Sans","Meiryo",sans-serif); --round:var(--f-body,"Hiragino Sans","Meiryo",sans-serif); --disp:var(--f-disp,"Hiragino Maru Gothic ProN","Meiryo",sans-serif);
  font-family:var(--font); font-size:16px; line-height:1.8; color:var(--ink); }
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]) .klq{ --big:var(--gold); } }
:root[data-theme="dark"] .klq{ --big:var(--gold); }
.klq .kapp{ background:var(--sheet); border:1px solid var(--rule); border-top:0; border-radius:0 0 16px 16px; padding:16px; outline:none; }
.klq .timetable td.big{ color:var(--big) !important; }
.klq .note{ background:none; padding:0; border-radius:0; margin:0; }
.klq .btn-ghost{ text-decoration:none; color:var(--ink); padding-inline:22px; }
.klq h2,.klq h3,.klq h4{ line-height:1.4; margin:0; }
.klq .kfoot{ border-top:1px solid var(--rule); margin-top:24px; padding-top:12px; font-size:.85rem; color:var(--ink-soft); }
.klq .kfoot p{ margin:0; }
.klq table{ min-width:0; }
.klq .cmp{ display:block; overflow-x:auto; }
.klq [hidden]{ display:none !important; }
.klq .deck{ margin-top:8px; }
.klq .deck-prog{ font-weight:700; font-size:.9rem; margin-bottom:8px; }
.klq .fcard{ border-radius:18px; overflow:hidden; box-shadow:0 0 0 4px var(--studio); background:var(--sheet); }
.klq .fcard .fq{ background:radial-gradient(120% 140% at 50% 0%, #2F3BB0 0%, #1B2272 70%); color:#fff; font-weight:700; font-size:1.15rem; line-height:1.7; padding:18px 16px 20px; border-bottom:5px solid var(--gold); display:flex; gap:12px; align-items:flex-start; }
.klq .fcard.done-all .fq{ justify-content:center; font-family:var(--round); font-size:1.5rem; border-bottom:0; }
.klq .fcard .fa{ padding:16px; font-weight:700; font-size:1.1rem; line-height:1.7; display:flex; gap:12px; align-items:flex-start; background:var(--ok-bg); }
.klq .fcard .src{ margin:0; padding:8px 16px 12px; border-top:0; background:var(--ok-bg); }
.klq .ftag{ flex:none; font-family:var(--round); font-weight:800; width:2em; height:2em; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; background:var(--gold); color:var(--gold-ink); font-size:1rem; }
.klq .ftag.a{ background:var(--ok); color:#fff; }
.klq .btn-ok{ background:var(--ok); color:#fff; border-color:var(--ok); font-weight:800; }
.klq .btn-again{ border-color:var(--ng); color:var(--ng); background:var(--sheet); }
.klq .ox{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.klq .oxb{ min-height:84px; border-radius:16px; border:3px solid var(--rule); background:var(--sheet); font-family:var(--round); font-weight:800; font-size:2.6rem; cursor:pointer; line-height:1; }
.klq .oxb.o{ color:var(--ok); } .klq .oxb.x{ color:var(--ng); }
.klq .oxb:hover:not([disabled]){ border-color:var(--studio); }
.klq .oxb.is-right{ border-color:var(--ok); background:var(--ok-bg); }
.klq .oxb.is-wrong{ border-color:var(--ng); background:var(--ng-bg); }
.klq .oxb[disabled]{ cursor:default; }
.klq .sr{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
/* テロップ文字（番組の字幕の縁取り） */
.klq .telop{
  font-family:var(--round); font-weight:800; color:#fff; letter-spacing:.02em; line-height:1.25;
  text-shadow:
    3px 0 0 var(--studio), -3px 0 0 var(--studio), 0 3px 0 var(--studio), 0 -3px 0 var(--studio),
    2px 2px 0 var(--studio), -2px 2px 0 var(--studio), 2px -2px 0 var(--studio), -2px -2px 0 var(--studio),
    0 6px 0 var(--gold-deep);
}

/* ===== 上部の進行表示 ===== */
.klq .meter{ border-radius:16px 16px 0 0; display:flex; align-items:center; gap:12px; min-height:60px; padding:0 14px; background:linear-gradient(90deg,var(--studio),var(--studio-2)); color:#C9CEF5; border-bottom:4px solid var(--gold); }

.klq .lamp{
  flex:none; font-family:var(--round); font-weight:800; font-size:17px; line-height:1; letter-spacing:.06em;
  padding:9px 12px; border-radius:999px; min-width:5.4em; text-align:center; border:2px solid rgba(255,255,255,.35);
}
.klq .lamp[data-mode="vacant"]{ background:#2B3380; color:#C9CEF5; }
.klq .lamp[data-mode="hired"]{ background:var(--gold); color:var(--gold-ink); box-shadow:0 0 14px rgba(255,200,61,.65); border-color:#fff; }
.klq .lamp[data-mode="arrive"]{ background:#0B7A3B; color:#fff; box-shadow:0 0 14px rgba(76,211,138,.6); border-color:#fff; }
.klq .lamp.flip{ animation:flip .45s ease; }
@keyframes flip{ 0%{transform:scale(1)} 40%{transform:scale(1.15)} 100%{transform:scale(1)} }
.klq .meter-info{ flex:1; min-width:0; }
.klq .meter-title{ font-weight:700; color:#fff; font-size:15px; line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.klq .segs{ display:flex; gap:4px; margin-top:6px; }
.klq .kseg{ flex:1; height:8px; border-radius:4px; background:rgba(255,255,255,.18); }
.klq .kseg.on{ background:#4CD38A; }
.klq .kseg.now{ background:var(--gold); }
.klq .icon-btn{ flex:none; background:none; border:1.5px solid rgba(255,255,255,.4); color:#fff; border-radius:999px; padding:6px 12px; cursor:pointer; font-size:14px; white-space:nowrap; }
@media (max-width:440px){ .klq .lamp{ font-size:15px; min-width:4.8em; padding:8px 8px; } .klq .meter{ gap:8px; } }

/* ===== 共通 ===== */
.klq h1, .klq h2, .klq h3{ line-height:1.4; margin:0; }
.klq .screen-title{ font-family:var(--round); font-weight:800; font-size:1.55rem; margin:4px 0 6px; }
.klq .corner{ display:inline-block; font-family:var(--round); font-weight:800; font-size:.85rem; color:#fff; background:linear-gradient(90deg,var(--studio),var(--studio-2)); border-radius:999px; padding:2px 14px; margin:0 0 4px; }
.klq .lead{ color:var(--ink-soft); margin:0 0 16px; }
.klq .btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:52px; padding:10px 22px;
  border-radius:14px; cursor:pointer; font-weight:700; border:2px solid var(--ink); background:var(--sheet);
}
.klq .btn-primary{ font-family:var(--round); font-weight:800; font-size:1.1rem; background:var(--gold); color:var(--gold-ink); border-color:var(--gold); box-shadow:0 5px 0 var(--gold-deep); margin-bottom:5px; }
.klq .btn-primary:active:not([disabled]){ transform:translateY(4px); box-shadow:0 1px 0 var(--gold-deep); }
.klq .btn-ghost{ border-color:var(--rule); background:transparent; font-weight:400; }
.klq .btn-row{ display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; align-items:flex-start; }
.klq .btn[disabled]{ opacity:.45; cursor:not-allowed; }
.klq .note{ font-size:.875rem; color:var(--ink-soft); }
.klq .src{ font-size:.8rem; color:var(--ink-soft); border-top:1px dashed var(--rule); margin-top:14px; padding-top:8px; line-height:1.6; }
.klq .src a{ color:inherit; }

/* ===== 出演者と会話 ===== */
.klq .talk{ display:flex; flex-direction:column; gap:14px; margin:8px 0; }
.klq .line{ display:flex; gap:12px; align-items:flex-start; }
.klq .line.right{ flex-direction:row-reverse; }
.klq .face{ flex:none; width:72px; text-align:center; }
.klq .face img{ width:68px; height:68px; border-radius:50%; object-fit:cover; display:block; margin:0 auto; background:#DCE3FF; border:3px solid #fff; }
.klq .face b{ display:inline-block; margin-top:4px; font-size:11px; font-weight:700; line-height:1.5; padding:0 7px; border-radius:4px; color:#fff; background:var(--studio); }
.klq .face[data-sp="t"] img{ box-shadow:0 0 0 3px #2E4FC7; }
.klq .face[data-sp="r"] img{ box-shadow:0 0 0 3px #F2B400; }
.klq .face[data-sp="c"] img{ box-shadow:0 0 0 3px #D63384; }
.klq .face[data-sp="k"] img{ box-shadow:0 0 0 3px #7A52D6; }
.klq .face[data-sp="t"] b{ background:#2E4FC7; }
.klq .face[data-sp="r"] b{ background:#8A6500; }
.klq .face[data-sp="c"] b{ background:#C2255C; }
.klq .face[data-sp="k"] b{ background:#6A3FC2; }
.klq .bubble{ position:relative; background:var(--sheet); border:2px solid var(--rule); border-radius:16px; padding:10px 14px; max-width:34em; }
.klq .line .bubble::before{ content:""; position:absolute; top:22px; left:-8px; width:12px; height:12px; background:var(--sheet); border-left:2px solid var(--rule); border-bottom:2px solid var(--rule); transform:rotate(45deg); }
.klq .line.right .bubble::before{ left:auto; right:-8px; transform:rotate(-135deg); }

/* ===== 問題パネル ===== */
.klq .qbox{ background:var(--sheet); border-radius:18px; overflow:hidden; margin-top:8px; box-shadow:0 0 0 4px var(--studio), 0 10px 0 -2px rgba(27,34,114,.25); }
.klq .qhead{ display:flex; align-items:center; gap:12px; padding:8px 14px; background:linear-gradient(90deg,var(--studio),var(--studio-2)); color:#fff; font-weight:700; }
.klq .qnum{ font-size:1.7rem; }
.klq .qtext{ margin:0; padding:18px 16px 20px; font-size:1.18rem; font-weight:700; line-height:1.7; color:#fff; background:radial-gradient(120% 140% at 50% 0%, #2F3BB0 0%, #1B2272 70%); border-bottom:5px solid var(--gold); }
.klq .qbody{ padding:16px 14px; }
.klq .opts{ display:flex; flex-direction:column; gap:12px; }
.klq .opt{
  text-align:left; min-height:60px; padding:10px 12px; border-radius:14px; border:3px solid var(--rule); background:var(--sheet); cursor:pointer; line-height:1.6;
  display:flex; gap:12px; align-items:center; font-weight:700;
}
.klq .opt .k{ flex:none; width:2.3em; height:2.3em; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; font-family:var(--round); font-weight:800; font-size:1rem; color:#fff; background:var(--a); }
.klq .opt:nth-child(2) .k{ background:var(--b); }
.klq .opt:nth-child(3) .k{ background:var(--c); }
.klq .opt:hover:not([disabled]){ border-color:var(--studio); transform:translateY(-1px); }
.klq .opt[disabled]{ cursor:default; }
.klq .opt.is-right{ border-color:var(--ok); background:var(--ok-bg); }
.klq .opt.is-right .k{ background:var(--ok); }
.klq .opt.is-wrong{ border-color:var(--ng); background:var(--ng-bg); }
.klq .opt.is-wrong .k{ background:var(--ng); }
.klq .opt.is-dim{ opacity:.5; }
.klq .ord .opt{ font-weight:400; }
.klq .ord .opt[disabled]{ opacity:.45; }

.klq .fb{ margin-top:16px; border-radius:16px; padding:14px 16px; border:4px solid; }
.klq .fb.ok{ border-color:var(--ok); background:var(--ok-bg); }
.klq .fb.ng{ border-color:var(--ng); background:var(--ng-bg); }
.klq .fb-head{ display:flex; align-items:center; gap:14px; }
.klq .fb-title{ font-family:var(--round); font-weight:800; font-size:1.6rem; line-height:1.3; }
.klq .fb-sub{ display:block; font-family:var(--font); font-weight:700; font-size:.95rem; }
.klq .fb.ok .fb-title{ color:var(--ok); }
.klq .fb.ng .fb-title{ color:var(--ng); }
.klq .burst{ position:relative; flex:none; width:76px; height:76px; display:flex; align-items:center; justify-content:center; }
.klq .fb.ok .burst::before{
  content:""; position:absolute; inset:-14px; border-radius:50%;
  background:repeating-conic-gradient(rgba(11,122,59,.32) 0 12deg, transparent 12deg 24deg);
  animation:spin 1.2s ease-out;
}
.klq .mark{ position:relative; width:64px; height:64px; display:inline-flex; align-items:center; justify-content:center; font-size:2.3rem; font-weight:800; border-radius:50%; color:#fff; font-family:var(--round); }
.klq .fb.ok .mark{ background:var(--ok); box-shadow:0 0 0 4px #fff, 0 0 0 7px var(--ok); }
.klq .fb.ng .mark{ background:var(--ng); box-shadow:0 0 0 4px #fff, 0 0 0 7px var(--ng); }
.klq .ring{ display:block; width:36px; height:36px; border:7px solid #fff; border-radius:50%; }
.klq .fb h4{ margin:12px 0 2px; font-size:.95rem; }
.klq .fb p{ margin:4px 0; }
.klq .fb .answer{ font-weight:700; }
.klq .fb .talk{ margin-top:12px; }
.klq .pop{ animation:pop .4s ease-out both; }
@keyframes pop{ 0%{transform:scale(.4)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
@keyframes spin{ from{transform:rotate(-60deg) scale(.6); opacity:0} to{transform:rotate(0) scale(1); opacity:1} }

/* 並べ替え */
.klq .order-picked{ display:flex; flex-direction:column; gap:6px; margin:0 0 12px; padding:10px; border:2px dashed var(--rule); border-radius:12px; min-height:56px; }
.klq .order-picked .ochip{ display:flex; gap:10px; align-items:center; }
.klq .num{ flex:none; width:1.9em; height:1.9em; border-radius:50%; background:var(--studio); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-family:var(--round); font-size:.9rem; }

/* 仕分け */
.klq .sort-card{ border:3px solid var(--rule); border-radius:12px; padding:12px; background:var(--sheet); font-weight:700; }
.klq .sort-card + .sort-card{ margin-top:10px; }
.klq .sort-card.ok{ border-color:var(--ok); background:var(--ok-bg); }
.klq .sort-card.ng{ border-color:var(--ng); background:var(--ng-bg); }
.klq .bins{ display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.klq .bin{ min-height:44px; padding:6px 12px; border-radius:999px; border:2px solid var(--studio); background:var(--sheet); cursor:pointer; font-size:.9rem; font-weight:700; }
.klq .bin.sel-ok{ background:var(--ok); color:#fff; border-color:var(--ok); }
.klq .bin.sel-ng{ background:var(--ng); color:#fff; border-color:var(--ng); }
.klq .sort-why{ font-size:.9rem; margin-top:6px; font-weight:400; }
.klq .sort-why b{ margin-right:4px; }

/* ===== 解説コーナー ===== */
.klq .kguide{ background:var(--sheet); border:2px solid var(--rule); border-radius:16px; padding:16px; }
.klq .kguide h3{ font-family:var(--round); font-weight:800; font-size:1.2rem; margin-bottom:10px; }
.klq .kguide p{ margin:8px 0; }
.klq .kguide ul{ margin:6px 0; padding-left:1.3em; }
.klq .kguide li{ margin:4px 0; }
.klq .course{ list-style:none; padding:0; margin:8px 0 0; position:relative; }
.klq .course::before{ content:""; position:absolute; left:17px; top:10px; bottom:10px; width:4px; background:var(--gold); border-radius:2px; }
.klq .course li{ position:relative; padding-left:50px; margin:0 0 14px; }
.klq .course li::before{ content:attr(data-n); position:absolute; left:0; top:0; width:38px; height:38px; border-radius:50%; background:var(--studio); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--round); font-weight:800; }
.klq .course b{ display:block; font-size:1.05rem; }
.klq .cmp{ width:100%; border-collapse:collapse; font-size:.92rem; line-height:1.6; }
.klq .cmp th, .klq .cmp td{ border:1px solid var(--rule); padding:8px; vertical-align:top; text-align:left; }
.klq .cmp thead th{ background:var(--studio); color:#fff; }
.klq .cmp tbody th{ background:var(--rule-soft); font-weight:700; width:5.5em; }
.klq .timetable{ width:100%; border-collapse:collapse; font-size:.95rem; }
.klq .timetable th, .klq .timetable td{ border-bottom:1px solid var(--rule); padding:8px 6px; text-align:left; }
.klq .timetable td.big{ font-family:var(--round); font-weight:800; font-size:1.3rem; color:var(--studio-2); }
.klq .four{ display:grid; grid-template-columns:1fr; gap:10px; }
@media (min-width:600px){ .klq .four{ grid-template-columns:1fr 1fr; } }
.klq .four section{ border:2px solid var(--rule); border-radius:12px; padding:10px 12px; background:var(--bg); }
.klq .four h4{ margin:0 0 4px; font-size:1rem; }
.klq .four p{ margin:0; font-size:.93rem; }
.klq .callout{ border-left:6px solid var(--gold); padding:6px 12px; margin:12px 0 0; background:var(--bg); border-radius:0 8px 8px 0; }
.klq .goal{ margin:4px 0 14px; padding:8px 12px; border:2px dashed var(--ink-soft); border-radius:12px; }
.klq .goal b{ display:inline-block; font-size:.8rem; background:var(--gold); color:var(--gold-ink); border-radius:6px; padding:0 8px; margin-right:8px; }
.klq .when{ list-style:none; padding:0; margin:0; }
.klq .when > li{ border:2px solid var(--rule); border-radius:12px; padding:10px 12px; margin:0 0 10px; background:var(--bg); }
.klq .when > li > b{ display:block; }
.klq .when .tag{ font-size:.75rem; font-weight:700; padding:1px 8px; border-radius:99px; background:var(--studio); color:#fff; margin-left:6px; vertical-align:2px; }

/* ===== ホーム ===== */
.klq .khero{
  position:relative; overflow:hidden; text-align:center; border-radius:20px; padding:26px 16px 22px; margin-bottom:16px; color:#fff;
  background:repeating-conic-gradient(from 0deg at 50% 115%, var(--studio) 0 7deg, var(--ray) 7deg 14deg);
  box-shadow:inset 0 -40px 60px -30px rgba(59,31,143,.9);
}
.klq .khero .hero-t{ font-size:2rem; }
.klq .khero .sub{ display:inline-block; margin-top:14px; background:var(--gold); color:var(--gold-ink); font-weight:700; border-radius:999px; padding:2px 14px; font-size:.9rem; }
.klq .cast{ display:grid; grid-template-columns:repeat(4,1fr); gap:6px; max-width:440px; margin:16px auto 0; }
.klq .cast figure{ margin:0; }
.klq .cast img{ width:100%; max-width:84px; aspect-ratio:1; border-radius:50% 50% 12px 12px; object-fit:cover; background:#DCE3FF; border:3px solid #fff; display:block; margin:0 auto; }
.klq .cast figcaption{ display:inline-block; margin-top:-4px; position:relative; font-size:12px; font-weight:700; background:var(--gold); color:var(--gold-ink); border-radius:4px; padding:0 8px; }
.klq .khero p{ margin:10px 0 0; font-size:.92rem; color:#DDE2FF; }
.klq .hello{ display:flex; gap:12px; align-items:flex-start; margin:4px 0 6px; }
.klq .start-box{ background:var(--sheet); border-radius:18px; padding:16px; margin:14px 0 26px; box-shadow:0 0 0 3px var(--studio); }
.klq .start-box .next-label{ font-size:.85rem; color:var(--ink-soft); font-weight:700; }

/* 記録 */

/* エンディング */
.klq .finale{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:6px 0 14px; }
.klq .finale figure{ margin:0; text-align:center; }
.klq .finale img{ width:100%; max-width:120px; aspect-ratio:1; border-radius:50%; object-fit:cover; background:#DCE3FF; border:3px solid var(--gold); }
.klq .finale figcaption{ font-size:.75rem; color:var(--ink-soft); font-weight:700; }
.klq .clear-stage{ text-align:center; border-radius:20px; padding:30px 16px 24px; color:#fff; background:repeating-conic-gradient(from 0deg at 50% 50%, var(--studio) 0 8deg, var(--ray) 8deg 16deg); }
.klq .clear-stage .big{ font-size:3rem; display:inline-block; }
.klq .clear-stage p{ color:#DDE2FF; margin:10px 0 0; }

/* 根拠・設定 */
.klq .kpanel{ background:var(--sheet); border:2px solid var(--rule); border-radius:16px; padding:16px; }
.klq .kpanel + .kpanel{ margin-top:14px; }
.klq .kpanel h3{ font-size:1.1rem; margin-bottom:6px; }
.klq .srclist{ padding-left:1.2em; }
.klq .srclist li{ margin:8px 0; line-height:1.6; }
@media (prefers-reduced-motion: reduce){ .klq *{ animation:none !important; transition:none !important; } }

/* v03：太すぎて読みにくい文字を直す（見出しは本文の書体の太字、番組風の大きな字だけ表示用の書体） */
.klq .telop{ font-family:var(--disp); font-weight:400; font-synthesis:none; letter-spacing:.03em;
  text-shadow:2px 0 0 var(--studio),-2px 0 0 var(--studio),0 2px 0 var(--studio),0 -2px 0 var(--studio),0 4px 0 var(--gold-deep); }
.klq .khero .hero-t{ font-size:2rem; text-shadow:3px 0 0 var(--studio),-3px 0 0 var(--studio),0 3px 0 var(--studio),0 -3px 0 var(--studio),0 6px 0 var(--gold-deep); }
.klq .qnum{ text-shadow:none; color:var(--gold); }
.klq .lamp{ font-weight:700; letter-spacing:.04em; }
.klq .screen-title,.klq .fb-title,.klq .kguide h3{ font-weight:700; }
.klq .lch .no,.klq .isec span,.klq .lch .pr b,.klq .ftag,.klq .oxb{ font-family:var(--disp); font-weight:400; font-synthesis:none; }
.klq.klearn{ font-size:15px; }
.klq .kapp2{ display:flex; flex-direction:column; gap:14px; }
.klq .kapp2.item{ display:block; background:var(--sheet); border:1px solid var(--rule); border-radius:16px; padding:16px 18px; }
.klq .lnext{ background:var(--studio); color:#fff; border-radius:16px; padding:16px 18px; }
.klq .lnext .l{ font-size:12px; color:var(--gold); font-weight:800; letter-spacing:.08em; }
.klq .lnext .t{ font-size:20px; font-weight:800; line-height:1.4; }
.klq .lnext .s{ font-size:13px; color:#C9CEF2; }
.klq .lnext .acts{ display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }
.klq .lnext .btn-ghost{ color:#fff; border-color:rgba(255,255,255,.45); background:transparent; }
.klq .lcat{ background:var(--sheet); border:1px solid var(--rule); border-radius:14px; padding:14px 16px; }
.klq .lch{ display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; }
.klq .lch .no{ font-family:var(--round); width:38px; height:38px; border-radius:10px; background:var(--studio); color:var(--gold); display:grid; place-items:center; font-size:18px; }
.klq .lch h3{ font-size:16px; }
.klq .lch p{ margin:0; font-size:12.5px; color:var(--ink-soft); line-height:1.5; }
.klq .lch .pr{ text-align:right; font-size:13px; color:var(--ink-soft); white-space:nowrap; line-height:1.3; }
.klq .lch .pr b{ font-size:22px; color:var(--ink); font-family:var(--round); }
.klq .lch .pr small{ display:block; font-size:11px; }
.klq .lbar{ height:8px; border-radius:4px; background:var(--rule-soft); margin:10px 0 4px; overflow:hidden; }
.klq .lbar i{ display:block; height:100%; background:var(--a); }
.klq .lis{ list-style:none; margin:0; padding:0; }
.klq .lis .li{ display:grid; grid-template-columns:28px 1fr auto; gap:10px; align-items:center; width:100%; text-align:left; background:none; border:0; border-top:1px solid var(--rule-soft); padding:10px 2px; font:inherit; color:inherit; cursor:pointer; line-height:1.45; }
.klq .lis li:first-child .li{ border-top:0; }
.klq .lis .st{ width:24px; height:24px; border-radius:50%; border:2px solid var(--rule); display:grid; place-items:center; font-size:13px; font-weight:900; }
.klq .lis .rd .st{ background:var(--ok); border-color:var(--ok); color:#fff; }
.klq .lis .cur .st{ border-color:var(--gold); box-shadow:0 0 0 3px var(--gold-soft); }
.klq .lis .tt{ font-weight:700; font-size:15px; }
.klq .lis .meta{ font-size:12px; color:var(--ink-soft); white-space:nowrap; }
.klq .lis .ns{ cursor:default; color:var(--ink-soft); }
.klq .lis .ns .tt{ font-weight:500; }
.klq .lis .tag{ font-size:11px; border:1px dashed var(--rule); border-radius:99px; padding:1px 8px; white-space:nowrap; }
.klq button.li:hover .tt{ color:var(--a); }
@media (max-width:520px){ .klq .lis .li{ grid-template-columns:28px 1fr; } .klq .lis .li .meta{ grid-column:2; } .klq .lis .ns .tag{ grid-column:2; justify-self:start; } }
.klq .ibar{ display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.klq .crumb{ font-size:12px; font-weight:800; color:var(--ink-soft); letter-spacing:.06em; }
.klq .btn-s{ min-height:36px; padding:4px 14px; font-size:.9rem; }
.klq .isec{ display:flex; align-items:center; gap:8px; font-size:17px; margin:22px 0 8px; }
.klq .isec span{ width:26px; height:26px; border-radius:8px; background:var(--studio); color:var(--gold); display:grid; place-items:center; font-size:14px; font-family:var(--round); }
.klq .isec small{ font-size:12px; color:var(--ink-soft); font-weight:700; }
.klq .idone{ display:flex; gap:8px; flex-wrap:wrap; }
.klq .inav{ display:flex; justify-content:space-between; gap:8px; margin-top:18px; border-top:1px solid var(--rule); padding-top:12px; }
.klq .qchips{ display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
.klq .qchip{ border:2px solid var(--rule); background:var(--sheet); border-radius:99px; padding:6px 12px; font:inherit; font-size:14px; font-weight:700; cursor:pointer; color:var(--ink); }
.klq .qchip small{ margin-left:6px; color:var(--ink-soft); font-weight:500; }
.klq .qchip[aria-pressed="true"]{ background:var(--studio); border-color:var(--studio); color:#fff; }
.klq .qchip[aria-pressed="true"] small{ color:#C9CEF2; }
.klq .qmodes{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-top:12px; }
.klq .qmode{ border:2px solid var(--studio); background:var(--sheet); border-radius:14px; padding:12px; font:inherit; cursor:pointer; color:var(--ink); text-align:center; line-height:1.4; }
.klq .qmode b{ display:block; font-size:15px; }
.klq .qmode small{ color:var(--ink-soft); }
.klq .qmode.miss{ border-color:var(--ng); }
.klq .qmode[disabled]{ opacity:.45; cursor:default; }
@media (max-width:520px){ .klq .qmodes{ grid-template-columns:1fr; } }
.klq .wrongs{ margin:6px 0 0; padding-left:18px; font-size:14px; }
.klq .segs{ display:grid; gap:3px; }
`;
const IMG = { t:"data:image/webp;base64,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", r:"data:image/webp;base64,UklGRgRlAABXRUJQVlA4WAoAAAAQAAAAZwEAZwEAQUxQSCQaAAABDIdt2waSFe0/ddK0979ARExA/lx/Kkml6leqBLCScPmiWFr5uvbUR8VePuKqLtinqnbgxS3gBfWFyu9UFdd+s3X+QJaeP2D9Awp4+67szApovUvYOr+rqiSA4Ah8QXf9CWCSMNvf2QRcQF4XR+n2D+IRwBmf1Wlfz5IVxzwvVuJYzxQ2HXjmhoOax4Ud3POoPAOiAOojBQGPONaTYrbTjpNVtShVwCNMoDZFrSRVPujeV6LKcjWeYMjCZavxQE/iYhxm8DyxFBu72/RpVpODiurBJFy6pYHqUEmcDwgHUUFYMajDOAk4AmpAOaiHPgHOkO7tZB+AppWyhv2TIqvVv6p6ORAIQaMQdyPuXOKeXI9cIe7u7tc97u7u7u7ubkhcCTvdXT31YRfOnj1ne863GxET4MhtG0n6/5/bvHR1VWqbuUbEBPihtu2QRW3bemJ5rcjKVmTbyGzfvqM79X1H97gz35Ft28ps27Y16zrPcz+uM6irelbX7Oo4IibAtyRJliRJtvX/n1yVSH0ztZuqmlc/RsQE4P/+n5y4KfV7CWYo1K9FhAELrvfrX44fIwD3YxGwy+OfhVJ/+uCWwxeE9BcREc8kNXLXP820KIqgZh//GtzfQyzChG4T7S5uz67zfun26v+3hPTjEAuh6YBZTz39zPMvuuCii5dbfPHFFxxW453dd2QXABERe/n8bEL9NSQEyOzjNjngnFufePHnf/jz3/7+z//85/svPv9i6ptPPfTpLxaPgGj79HGoCVE/DAlAyx3z4Pvflta8CkmlzZgIkOiHp8sWQSOLUH8KCTB6xzt+MLMyeO99CI+mxhhjaAQ1exBs6smbLjSqBgAs3E9CAow86E2zVPgQdabV10Yt21BvVk55/dGrj990LAAW6v8gB8y244tmvog60xpuSMs3NPpojemDSyeOJYCln0OAWXZ+3swHnek0RVWNIfgimtn7V08cA7Bw/wXvLI5+8uczS2GfU+Qo8K4o7YOzfgaAHWUAgfLDYXHT5zOLRTTUaF7DiLBSlDbtlh0XAiCcAdkpjMVeU7IzmjqAxHAootnkizcbAgh3OsoLIoeuvaakG4MHTTX6YFY+f+BCAHMno8wgqmHcPVYWEGgNamqMRTSbcsbKgBNqeiHKDGKHX3xhRQDQWtVQN/v+/OUBxx0KIOQkE/aql/WogCZpnaQaCrVvTh4Lcp0qKxkD/pNioY0amy6spBqLZO/vNgiOq55gxHuzeAAp5MMmif6UzM/cuFjsVDvByLtzz4NRvFsZsE45epd7zz124aocY9T9ViIAjdiQ4dUqgJHfuBJC1YwIwkPvsjqAxvQ5YoMkoOQ/dgBTFSMiFr7Q6gpoBRneREgmOx5E1YuI2OFf5lXR2EXZpO/e/s3MVczhr+ZVVevZGERv53SBq1cNB5mPqmk+NXq7ZBBR1XK4OzzQnCJKvuWQLapWguX+LtfsYvm6Q4kqFLEMfTZNc2z5MpHKREQO51jHLGF5PBxVIyJyONR8zIovEboVpCJBsEUMEc0KqQ2ZTloMXIGIiGnM+2VIYk7i3YPCHh9ckRzOMJ+aVtUZ0YAWdhKkCu0u7g+nlXtUGnk0hvom4MoD2Tr5lzU078FeGUpUdchtvSEL+4KbqLedIFXH4cEsMUquEtIrw4mqDfPoH1ZjX84kUJS8HQ7uGEQAqOM4/DULaBYyIWlIk+Yj7hQgIvQ49TmC8dM8IpiP9PtK6u2vkI4BtEGfSzzkSSuAmr5CzpQ+6dWYvlqMuGMQOizB4QgrntyVs1HLM+E6xnVJsOQ3Mf4KEd8vB64mRI6vNK+3qaez8yEVxeHXyWs+ePxuHLiSMA95yoqMiLqdA6kkDjtbPfaEe9RWSF8sRFxBmEe/WRaqmjrXaIIWdhyqiMPxVqhqmtHcgk18em8UqHIQnf4neaDV2UBzh+jtt5DKIXh2FpiEbayndTuvehAN+3Y10BSyzepS9fbGcFDFEGwtB63Qd3aULKOjVGMs1iGpFsSDHs6ymnzk8PQk1cL+jooh2Ka0QBtG0mCvjSKqFDTkOTOmkK3FAsMabGe4KuGwswXQyrI3Nkje7nZE1YG46xHz07oT9R9noEIIxtejPpnnACQaFpHno+Gqg8P/rEiFDvSdhS1fBaGqwJj9vTJowfBRLOT5g+GoDA7bll7bIbt3xToRthakIhDV7rGiHU75ysqUPLQyCFaZFmPnSNa7GlwRHI61oqMsjuULs4IqAdGAh6zQXoZzub5ZBlwJGEt+lUIvc7Qo9ge4SiDYygptJyU5ktqg2P8glYBxihWxrRQkORC1NsweEKoENPhZ86qa5sldCS8nzQeqAIzlf0yxneQ2RAzrgiuAYEfz2k6znQhvEyGV4EIrVDX1oKVODIUdVwUIQ76ZfiC4ybng/GOMLwCaPLmHt7uFKPsc9s+y2STYK8OQf4Lze1qhqpuKNnkMOPcIQ55P1wr5AdI0bVz+MZb8usamkzRtlH8O25pr4w22EyT3ajjBbPPxdkLmERHTLeab0FlwmccY/XYeXQPOPIfxXtmEbifKvBr2Nq9Nl3p70OWe4JIsCvbcYFDWMXU9ZXHD4fDu6NzDgpMsMC8WmTRf5gnWKqLCrMw/KKcskHkOfzDfRu4VbWru1XBiW+1rrdBgU+bNPIeLregWziIPmKvDp7lHXQ+aV20tBzem12AfzJV3jPk+sdAJtLgGe2tU3gmW/V5jt86LbjJdCvbckNzbQqNqH4vM5u0+IeTd/uYz6Rbk3t/Na5rPWUrTe7sWnHVMN1pIbYkDuLCgt2syj/juNrLf0t4uzzvC8FcstkeCmwW7CJJ3Yz9tnxNaydvpcHm30GedZGlvf4fkHGPRLy1qHh2fd4RFvsimQ3JvvqkWVb/EIuptt9wb+qL52G7WWjXGcsu8A8udVkRVMc0nR52+GjjnGIt/mHyz5rE9D4jp6yWyjnjUHebjDJ70Lvhgok0em3UOx5gPIWqVB7zzEwr29khQvjls8pWGGLXJkw2/wmNdGSfY+EeL2vShID8hhV0GRq4zFnw7XULQr4u34yC5Rjz0DAttyMT0y3xjOvg7r2GfYQruhX2+BDjTCMMeCJ6h7erTHMiIGT3g9mgXIddo4qQQ1tfgQPWv3tWDmJ0OyTSiwZeqj/NgbEHc9ofLNMZmX2jQeeiGC9aBSJvlGtNKH1tQ1UG1TbQiUb9aDJJnguOsrh0I5gM8n58VnGWMRd/R0Ivs4tASlg8RU5YJ9lEfe5X1lENLhJd94PKM6Iqy0xSlBQGvvxuba6g9bl47TWlJICy2Qi3LGGM+tpgyudflpZAcI4fNNWVzz/K54ci04y20yM/y8ULgDGOm94+WowCuL5fJMwz52nqxNwERcRNIhhHm+nmyXlQwAybByu2zjDHfH9ZLqziYQIDqG4GzbIX/1/X3tpQmEeA3gmSYw69qaAOU4RRuO2eZ4Ki0NWOPTjDDYXAZxjjvoKBqVePkPWkfSH4R3F3p+xNLtFUNyvkLZofC5dioV8bIrepC75wEybH5PhrpPem8J430yrmUYYyFp2aMkeQ6jaDecXtwMPJbMO7bulGIxsrMbuoCZZfDhOmMVe9YpxeeJoqdCkZuk8O2pTMt+QGOgOTY3lYmdnwTeDwkv4hqONq6HmuCF+vJwRwxbVtwjp3STOIgO0JHE3j9eCVIdjHX7rKiQQWs1mY56IKXLB8aCc4uwdwfJEMSIpXYYn3DQdFrtw7MsBo2KGL0RnaLSmcvAyX/DaEMO9bqLPFcbFrAcn8Isov55gZWkW/yYT+47GKMet18oPaTcelJc0Ci5BEZJlj2Ww3Oav0eodwhy35VhvjSt2bF4WJ6fxVIhh1thU5SmWP7sXx7my6iDDvHfBt9Nz3BHhwOzi/GdTlk5J5ZQMhuyRB3VNxOnGGM0xqanoNdNCgMdh1yzGG/3rGnOZ54PNjpECLKrZ3Frenk/ppqdzhCdu8srirEMcxgjnjAU7HcBg45dtF/6/q4SeBjtibWctpq4Cy7umhNuBXvrGpkhmhTFs20m2twhgeXUmnSYO/MBcqy29LX1ZIycsAE6u0qZmTZrRnzpbGS40PwoertGEie3cSMxSBz7ZBra9S1razlXow0MkGM6+SZw/h6aglPVcgauHfRuIf9q7GmaB+MAWUYCdaP2j3HPCSxpd7o1WAP1bIMNdqkjC3yXAcreKcG3ivsAggynGs4xkL3UnpY2zbsZRqjbgnOMhxaV21BLzzLbgyaII02dR5QhjGOsxhb9MUmoMHuHZhjgm3LEFTVyHc5VBN4OxmM7Gac9msZ7aKft3cYJL8Ez8nCcDDyq0CI09fOMELXV6ovcWxa+SThy3fGgjJsmX/W2IeJvpko7NIa55fg17XQjtK0Pgq8+GkPOGTY77Ol6b+rhIfmIaYM28gM0NjeKAu5J2aJ+GYdchnGWOKvxHh4JWWRlcP9dGEiZDfRwMctaGqxF0SVvlZj+f0ycDkGwfFWtMorUvAtqhrjQRDKtBV/TL0gmtlGgr06CEzIcq7db15bYvyQyfapWtgVzMh0hyN6yDPhq/4Kybf1NfaMJ8zgGft52xsu1xhjJltQ7Z4r7hV9sWq0X0JyjTDwEfM9ox1jjxTHg7Nta/fj49TWvFcI2SUb3M72J3oUtLOgFbB805ZQptUWJ/2oBqj0xBPWICfZBc8nQLKMBGd9Jl2jE23T8WxPIPTHRYgzjAi7/TFdk/dVEpS8ABlGjv9pMmBqy6K1EQQ/jANnl8Nh5p2BZyNljibyjCQodgRcbjlsXITI0OZzTP2GlTcRZ5Zg1S+S12OvmoXKBavVg9kTA4myinnMO+a1sYsyNicNToWNPdKVWYJzra6xO1mDdCnbAkp5KSSrBBPqMWrT9Spd35rZvqjlFPGIJyykGVnvwT0BUafMB84pwdlW1xkc52KGuc0CYPk3CDJasFHdR9XUS/bLPK4/zks5RTzwKSuapFGmMomKOZpFUPJZEGS0w372FzqOTvUUyZVJdZxl3mD3DhLKKMZ8k/Rveqaal4y4Mr0pYnp/QTAyWnCeFc5CF9X1qs6sM6e3M+GQ0YJNglcaGs7glbHj7v5GklHEgx6zQnGJk8dpxoOTqbf9kVOCPayIDVShCcoEjh0t2PY5xTzHe+qbNKgM33rTyPY0xnLznHL4k9W12cUpPKaj0/amxZoZJYur/hkBpF+Vl8px1uZVo323LDiXGEd9LQugSh4wQfqKlIJ9OgaUSYyBb0ljFAtRvuL5gVlEgMOw69IANE2V946KcLAdGpq83QxG/hJRDQs8ZgZoZI+YZKhTBduAV0qFnQrJHyKuYYnXrQA0YTHP2Gn7fGl42zeDCCzY7GMr0rR1NFd0wz7U2+YZBIH7mzefdFJyyFw5vWAHkhTTt8uCs4fpqHenOWjy0ey32oYGe2MEKHeYB70vSzC9LJQ+S3Xi7U5hZC6JXJ4d/QkZTKggqp6+BV04V2//gOSOYG/bY2rTlrxqnic12FbZw7T019EbGpGVkOVtglj+MA6cOzjVCgCNe8dsmatAyxLshcHIXMJsb5RhNPpMA5vA2+WQzGGsG7RRm6CFCjsMtcxxvKeFRE+6z7aAhvUhOUPgATjZQvodreL2/pygNqDORETENWCzT0ttG1vw0qqYXUOMdmQWJ0ydhYjEAXP+pyi1bBW68A6U9+AWVzzGOzI7BK4NBg1Dc2IRZiLqDM4B8+73joWYWg4jZmQ4hzeefwvqq0B6jPGrV28896htV19gqENzccJEfZwIsNR/PjHzqi0z0hwdveDYqQyue6ycILc8H+9ipp4SHGulmU2b9Pojl5+0w/j5RwxCcxYRor6JGZhw9ldmRVBNrdbuoFdcfc/JqVyZUdyz/DNq1AbnpmlFvYjWdPqUNx69+m/brzX/UEZTFhFhoj5FgAnX102LELWNktbwUrjRVBS6z8ZwPUd8jxWxMXhf1INaY33ys3dfeMxWq8w7EDMUESbqE4ix8nu7tM6D95ws6zz1RkkXjaaW4Ab567nARNQzhBFvmf/jPMKtdMXJ/v9+/aUPveRpj1y3yHBGcxYRol7FREd8l14ignXTkHcqFxaVkiueH3QDRJiJeoKxzDcpuBsRblaKRTb5/NW7zz7y9+suOAuhKTsnTNQrGANOtliCZY8QndIH6pzGk9DIzgkTtUqwefL6ZARAhFspFqU1FlNfuuuCEyauOXYgmhKLMFN7Ec9ymdUDy6bfSCa7VBm9jh2cip744bm7rzhHF5qy49Y47GFFQ3VtvzH4oihCaWZW/vjhQ9eduv8Wiw8TNGdx3DaCc2x6jC2tFllWGMl7ze+59CXS7Id377vm5L02WLgLAHNr/mz1GdR4zWPwRX163Sdr/Obley446o/rLjqM0caCHW16iLp+6qRHjJjvzTP3PlpjmPr0FbvNDzB3T3CZFREOWpHGpiH4ol74aI3hs9ceuPiknRchagumxaZEH2fE6qwy92ZqCdUYfFEvfDKzj05eERDuBjHfY4Ve0FIChCQNqWqcyRCKol73yRrPhbQDCd9g9dhEaNUkcR6bMaCUtGmMvihKm3bd+oAwzQxjyPPmla4Camn5ZjMbmwdf1H9M/2sPwRNrcW/N6iyGOaruDP/+K9MLFwDIMc3EPB9a6M4pd7rlj0ME0dnxbUDEPP9vqkVE0DfbAyN3heKjfXTIAgzASQMJVv9Jo+ohA926WmwPuDao4dQsERFMx2E6pNJcia5yo1EpebPJtxy8ymCARJhqmGheW9QDDTrecfsVpOcGYJ1p7hGAZhVRYqEUm2z6SQq+NPvh2X+u6gC4LjrJ6qrNUnShCxHWBPcMiathiXdLiwYmichvaImk0ftk9sM9h68+GMAlVrSsnniwF/XLhUGtIxECgAnvWMFg8/yMZuosqSYNQc1+fOS4CWMfNt8DcwKerw9rGYkAwIhxE8/7wYoY0dCvaTM3VWNRRLP6p9OSanrcOvcyoZUkDGDYhsff8u53Zuo10hQLGW7nfco7hIEz1YakqhqDVys1td4cAssrwC1gByxOuOcl34vMrGbBkv1apZeND+c0hkrr9/4O6Z4Dhmz04p9kpnXFg+UvYR1fknecv7JD8Ny1e8wYuufTPrN0FhGgJZfrm+QFF7oKo432ftstASa+aFZ0FkRPS6JzWlAYLGoPT7hy9Y69AOGxfrcw5jqzehEjgIClKmerLnbkD6n/XAbcjU1et3oRG2kv55I1esV77OAV+gQgLH8+N6gbP1k9xhh1WNM3A8s4ZIvnNR51mbRTeiU/UyN0M3idodax3vWCNi7tvdHlOyDdctqyQt1M9NHa/cCLuoeUFrbH0XO2tk0JJSDCu3w6XAu0ODk0rmMipO0BIrp8PKTvyR8x99ftUam3t6L1+cfQcsPQ+d9F4L4ox8pPK8Wj+ptT+yAH8NTBZQf1vZJfPQbUnSY1o59fae+Nj2wz+jIdpiJ3PMFJcsWuLkDrvPTGLD0/tR3V7SS4fggbKmxHSMtmXMTvRfuJQTfsASdwz5cpEJlRpeJHaG0VSWP6eklwO/Q0Mpn82lpQ6KrVYG8MA/WUd3JKP4M13tO8PeAIveinZeO4Dty6Gf0w+k5Bphd2NmSn8/Ih9pFEVjg8L9rIjHYSJDFBg/0R7ga4GCU0q0c88IYo0hh1fcgYc2Ati/z2kLLyu3GtaFI4Dx/nGXYQ7MMx4G2y8jof7MbjJooqb88PAe2y9oWcmcsz5qpWb3cQd4pmN4F3NruKSafCdYiOLDSjzGSvZacUdigcci39gJbx9ntIR/hGAzdswQRRWJQ0/izbPEFUruxeaZHa5wuDW+AnepbBrm0V7c2RoBZkV0bcSbGn4mWCPTGo1/nS7NummYr0pQWJEm/XgdG7cL6MVBKRgUKlYP+B9C4dPq/hNV/RJB8pJDTYgXB9SpJ4X2CvpikWab5EwdD+AOldIT3p8FutbqSbDDtNaV1wu6jq7MhN+KRxXrxETbTvl26f+Zsxk5H4pKdgtOzTuUC9yTmSecpgWL5muoyOgr08qHd1QzZG83Lja588A4bGz+5ntHQHu9UcznxYrsGQmsKuBPc+gcioIXOYQqN2YQ3Hd8YH/gnpA5oZxshsTaibgz744MNKe8P1EdluStiNLTo8XYaUhPKXkD7CWA7UGx4zR297TzNtX8MgQou1+oIg55fjY4vyVnjkKplPM8rvxoH7gFseuqmJXYLDhBtxm7oAKKv8Xhp4aWjWGKh7U4+Zgmat2TC7HYxsYSzdNFP/AO+9aCq1Tof0Br9eo1aywdG9Y34LuaLGNbhkoghLPRWmFNulVayjZKahyzXlisiVqYVWamkgzH7VBsqJKdZXl6LLjn3zJVrM8bQecWs6Sum7b4QlREc6zMDKP0BapCE53rCCPokVzHIs22GB8DRI7yR7ZjamlpCk85I19BB8CUUhcwd6XA72lNqip9+lSsF2g7SkyOVLsYQhHTNNMXiRKuzpFGW5UaF8YQhRS4QesY6W+G4xYfI7jiN7SznupGhbQVrUU8cV+keSbXqlzpr70FSZ4k6wm4VbMn5sgx8aZ9bgu5/Q9OM4cOdJXu9jRU9zi24HOxHSifLhWD2Xe3Aj2jujwGV12E/Scip5Bud4pjwbbTdIXWcpNPxlHvdey0N6/Rnzdpcw9dxT0iYcKq/kCoUxfb8MuEVynnGhxRrk2A4eeFuJ1nwKVL3tBNctKrlaoLT65ra5SqVqYRdAqDuNOkvBHg/5m1WDvT4cremkejIu7ligf1gx+vGQbr3rcN8qmQ5/gxZ2OGrthcoFyXC6Fgj8ETcRtxOqdI6TdvxXWP5oJKitgm5QXbGRJGv5XSRC/14e0mZdP3T4DU3kQp6/aCfHX+aXBcsT2ynk4Nr/Q3u3ErcPMmyoq7aF/8Bz0vzEbZPzE5dsjN/FLACu20IA0Eo46VYX4R+Ww6y0Ph0PIaKtAVZQOCC6SgAAEAQBnQEqaAFoAT5hLJFGJCKhoSi2azCADAlN3zxnHMWy0EJvitYgP7M0XuO+E/+R1Yck+0P0v+R/df2s+Oe+X2b49/wHMtWf5ynQP/R/uf7p/5P5tf9X1y/rH/ue4J+sn6/+vD67f8B/3PUd/S/8//3f8j7w//H/53+F94X95/3PsCfzn/E/+T2w/+t7H399/5nsB/yb+8f+D12v/b/z/hD/r//A/cX4EP5//g//X7AH/l9QD0AOxR/vX4sfsN8uvIXuO84fQt9j91uRD2l5rfeLOl2s8BT3R/wfT3iNam+gX7wffv+x6A84bxv7AH8//un/c9c/+h4pH4z/x+wD/Of7D/2P8P+VvzFf+X3se5j68/93+2+Af+b/23/s/5H27fZ5+5Psh/r9/yPz/OZm5xXCRv+Zd/oyoE2ZwclsCz84rhJHqp3P84Qf6l3KruTPmW9/+3yKiyHMdbl5i3PfjAoS0EwFCpkcIe2XiSPlDIOeCSPVTuf5wg/z0SyinZsIH6wQebavxBbjkemFx5gM68yztDFSK7yhn4t5BbCTfzmsfUihdKMARzxPU5zsNV8EkeqnZ6MgGoiVUFdPlm0N5oXHx0KBf84Gc5XDgPHGH/VMXZS5G7TSAjyhXqIIT2c5Jrx3G4I6Ulg2zF8FtbQj1Y8I665txUPVRqjvSua5Ef3iDDEbFx1+7HpAfQrtrAcUXdCz7/xqHLwMUODJCCPIA72P1sF2GmmcOMCw2tC9CBaCRh39ajh3CKDSr+1BQRn+cVwkj0Z6KDvF9kr51JE2mtNuxf8D7GIZD1VdxR6Co7+sAlS3Vdcei8+ohbyi68J8/TEDoFkF1yFdiqUY/IQajyUdwgkj1U7nAwqgYhZgxygQXPtNxMfCdqzn2VGXZmlYPDp2scu6bve3SEXIF/4nSluv249CXJCncO5Xl8KxkY1Fc7B4EeiR6qdz99Y8uY/QDz8+EztbI4mmVcxR73MJcFxtox2pYxDWRos26IDzj2tCJfYQSeQax98pWpQy5YiovAbx28Hcj4ei8OSXDVfBIzfEfZfDb9DjVxgwrc/1uu8B6dwY95VcZEorLTbrmrnPh0868ZelPhnoy0O/whE8wxWq9ZswNpOSorcPpxkGeYFc24rhI2cex9/aF1JmCKDxVgTc2m/6YfTCBCArj9pDr4Lze+AQiY3zxcKRUmBv+XjxAzAF33qeIPfn4wJMNKZzYpHlOX9X4+2/TDNzioakcgnfCxizB/qDDY65/MPM1fGTr60xBxlkwoWA7M7X/QBfBu5oESDQnKqyfMCLO9NNjEObuwl9KZ/Ub69y9oGIomwStPafziuEkejGoHtS2LIwBEhKpCY6bStv/2ffZgTX7KUzFIafEoN8o8n5hKc4JYrkM5lqJGgH5jfurUvlEKsY6zXSV+i8AGbauVIRkbnFcJI3FieQ0XuoU1jd6iVKj/6OgSRmVL2kKeTgppXq91h6iqJ8ePmBWnbR53qE+Bs7r1Gbc8dvHBTkPWZgykVS3MaEbPF7QDIzcuU1JJnT2AY6oMrSVH0N/evT742n8EIbOnswphfdnaub2NF/7lCLeazhZVRFFNqzX0E2G5wrhDBgaqdz+Ob5kf3ENL12kzga2rncu2uP1HAQMnMOqZF9ValT1Fb9GKXx6JNA2zCAuqxVsOTNCDAmEADV4QbWqnc/jm9t9IOZw0aA+HkY7no1vqT17XhSrp5vqhStWrPNITGsIzBXa7g09bsL2xZgCUGb/X5srEga8grSNE/u9kQ0izu9Fn6r8aie/KC0v1SgvlYKOlNaEJIjAQayOyj6qEijtNlbpYam6ieTZzOfMmB9lhkankcLVKLuqdfdyJJfm9FlfeGdb5dwJE4DHdC5j+w5ws1n/yk53jIPLEmtn5PinzZzKDoxuv5RNILJyCohJCi4DsVr4t9EVHoVnZ6qnp68R1q2fh05jahFjQJlsT0QHcIdaVRMjzk1jarPfn+T4hfrp5NmKTzh9Lf41GwP1y5Z2nz8sr/JfdsDFkoxB40VQ8//ExFyBEMV5APshtY8TYfYEoLAC57FuBC6uIfOyBBFgViG4no0X0yDLI88iEJHdmlaYd4Vn/HjhyOjmoBCV0ihFiBADAJofHMmZ/m4+F+eZvt0CYNdx8MVqq5mSCfW68w9Y5ZsYIJkKruOqSyODSCZVsBlIxBsCqAp0P+5cmCWmRk7qbiae81hrHZuudK0c0LrAuR4pj7E4vQuFfo456i4qpTLdmEi63VJjHjAGvfqXg98BZnD7JOIbaH8VYlxgm7KQtS2pM7D33L9QaQPYuKIRQx66YQDvugw85JL+JZpWtyblwasYOWPaZ9rtf+TR+BaMaOqUM0I9obMEzBivawONhZrsLe8ssZLf61IDGAFuJIAFEwHE9DSgTXuIU2oB39hVUCgIhrUsv5KbtmOIh/oNPPnD2HASBlw8Ny7PpLJeqiXW5TwxKiBJN1sSZ2x87BRfDX4FZXfVFVVGE+9pe+mer32nttMpwcWrBZ5vYIWKm2ELTlXKs9cH48FqjV7dprF3GqZE1j15uuVQApdaTgtLTV9syN3uvZg+vsxPtuqTuBCIhYFcB9+h/68CEnnuCTpeHgBym5YovITHP6Jv3OJVDuIgOsJD2LwmnuogtsbndZbzvHVEzMAp0513TgC3AH6y1yHxEtAkNUcog+DGlIXoIeIci0Ac6Ld+kE87bPK/eLA7VM0k8/9WT36FPwYvpZyBcu6NsNhfQukLnu+tXD4AG6Tvu/uHaKv+zx38+1vrJUxpqZZFdxngAD++2SwBOyETqDMTNlrtnAWuvr7nUwZKYIVNGoAp9aJFWE6c+rRxD03L7CM4eUPqkBRnqIbvtIAP/AGypE293cwKEW6LkW/IbJc9dpvWKAYrsFBcz7QgsD15ZBXBLBi8STmnV5ZfLt2e6g4qGsUdIhprqqJolm+QW7xhVBFCKrgt4QNxdLJA4AAxXgAACv8Q3bWmpArLe4THnpaoknBxqv6ArJe4HcKEc62aZu70yO3YS35xCY+z/kc03h5nZIzVT+JrVn2op/LD4rdE8Q89VQHD7Zd++kvZfKtK4JEhm77Ds+0OHCs9COmMJTIWh0bJcxjtXLgccNf/NOcn8ZWPTQf/hYc3ojiLY+GzJ9mMDuH5yljZ5K8XSPVAmD5S9e+1CcTdQNiIrM/a6i+/bSFh/CeYcbEKzVtWENmNO4tnqBJE6FNHidY8PGMkjesKDoeHqWktH0nXToBNeAvmP5lJ/q2TCjk2BzUT3JDfr8SIvOK9r8IG2VpJjJl9ZvC3qWMUnudUxqvtFTjyblMHn4sBq8iYKijgZjS/viXl2seGjY7qWyjkE2+A9t9t+SCZug3orEiH4iuvFTNBxcoPNYd82UwgBU4MYJGQNgDaj2IkidzDsrMhhxY4qR2XTuBFZL+/HFJZtsrUiE8sVWl6FLj/3Q+jYT1lfUFQsxevxN/8ZBtlD6ay2LsppW8gUd0QrVNoe18yHp6jwQOcHBxceA7ygyU+fIaRg0RUfhsEPk5BB+eofzJIkDxRZ21Lyo1AwRIBRJ7QzUQpFXXiZrimGDueLn9kZjKluOJFcDYB3suTQLC42+ye/NfwTcHi288XlE4Mw3mXfSv+ADc+GLGeQDrEFQatx5qkH4RKpIDtvythuX57LmrOdcdDL1kPKummbzhTe+kw4GxUyLNfUoOxKcS+0fEzwl/KMa3KVkT47Y4j/u9gR53xn8SrQIYbsSUdaQTYuaCBf9Y4wSP9ByYJtAAEvLlJ6Fv/JbVq0pgnGuo0S1h7alPWaaZr4XYhdVeZcnhyQKaNzqXCVegr5n+vdMm7Jg1eW+qLmFXiRs/eBVk0DhdlQ53SRINw6f7HJbhEtPRA/kOMqykAmQhwpv8H2Fl9bPk+XSfvFnBuSE75YHjq7OlDORJodlDuBz6k0biSWByctx/JOviKslOmpRlNP1UPl140huWc/ImgItutsrhp+jh1K+m5WepDU9mYG6FqC7aCcGqnlBLRuoKKPjX/08CBc/aVACwYb3InzqSo3+kz7/wnrsn9SA3A8IaVYRvlOpKJt8NcnvHp4ePYcawER198eTT9/uTTopEI//C4KNdhDEpCI7SEO9GC8XKQ1Ge4jtLfftDb8KywKE2N13LIpCHukAcFvATNoI5vNmcU37FDVqmRJG/WcjLX6VVskAvrekdD7eXaBVyafiXcytqyToWcsC9VlV7LnDEf93y+l5bSawRfMPa7KPnA4WxncMT3u7Q67HGhZVSu+DGo7h0bk23TxOlShq0WBtYuDndnFTlvtz+ym+tf+/Z8yZ7fAdxRmRYVcZ4E0UnRP8jDvrTwys0MBR34WZ31/cvhxFobVmqLAmp0KSGyUjnTuaghFHr1xmux10/8ZX/TzUkJMULGp8jsZhMdSlOfzX8r1F0zcIWylJR6oRNyJzQnnEIBnsBOF527zJQU9bJ4e3AHT5oWzfDm97GEWrX3cdLb2y1q9jnqBN+1cV/v1gY/2+XH7ePvDSKsLo1og2bKd7TjbRXbgYsagOmV5CWttzfG17TWXYVsbrqmgg8ztvtEdkH6LcvwR9zrlbo5GuGXgadUL4jo61qDYH1qbBGOpg5IK3pz/lUn2SOA4ff9AA/u4shU2MyzmYnugLHGZRz/xe0ofYc1xxm+ukSFzMXsA7qCVQvT0MGFfvQp6vswAvUk5rcorDH7fRnSsdhTF6c5VtRSbDMf+7+8meg5rZjHwT46P4FJtRpldOGooCqbcFLC33hGIJaP1C08OK4kmKZQhVOuQ7wvwV7nGEd6Bv5Hj/rEEzEgs/XAPxtkPPirUvF1KNB6AMquRt5K6QaLW/wFkgXtZB/gbhDyp/5nMUPUgOYv8rcvpf5M0gCUTS5dChrjY+zieCmNEZKOh4lIh097JXzJVAhP31QJyUcuyc1VSF3/LDPt+RLb7rdmpzfI0Gf5xxYrsU5dixytMyniuaf0pFb9qgOj/W2GNa+frwymMku8rERNcMXC5jFNj+3MZADvHnuvM1DZyDiEddZX3xXOcl52+iqJuxdAUSoyQ/0ZCjGAso59RqGCYmaDVupZZRardlvretSjDw9ADdGbHH29R5afvBs5gnE5iwK85ATB3fudGOBagjRAHOHXPEPT4SqDlM2F3afyiPt9h6Pzt/NbKD70K+2a2E+9n3d4xW9wTxm2MIOQ9i81BXO7YVI5uEB3/qombXZh+13Upxc6/2lHQoLIEwhKAVkWcUhGij6KDERkSwAp7WIC39Q7kOwq8lrxAgScORRvlpyO37EYCdp3HHMp3k4XCgM2d5XgAhc/HHYeWE2f9kQbnLyQOu4Px9ra3+sd7zSYj6xuH2O2VDx8GT9wAulvuJCrPBRS/TYEtMd8V1/Jpz4QY9QKBRbwROOE2z4I73oDaA8XUQPpV+4qHs9GQiMutCEdL9xKPyoBFseNxV8vuj9DEjBUsAFUA0Rl91olQvoBjZ+QP+xP7jB2YhYpgIth5/SZublgLlp31vB2ipnwbyyA3ndB1M+Pt9YI9BFYofQAAPryWQ+G/idfED/lW6bftXATIVYOq9rBIykcJHjjvXR1f8Hko1dfELZty2fkWFHWztYGPaFNmPrALbgFzo1WNppt3SE9gjrmT+iIMc/4RTLxRqL1dZzDiwrJJpy1NtO7T9mN2bX3u3ij3bRNuTM7GTgqCSb/PJJblrB076wmIdYb4ZWOrMbbjzmDgM9dLG41+v9oIdDzRg/iMmFlT/+f7mTmqSL2RcqoGgGW1R52ylAL0YE8BWz949YzGGiNLalsC38nwAa1MoflLcVUslDmWWGXteZowoO8O0ooHKIXAG66tMaeWGDml//d1dFoxxxt6P/VKnJvcO/GflTNsq/nYM6we38BoXwz3vNaDrYGGellAt6EZ768bLRvUfnjniWk4IK2VukPLmgoHta3+JDv7OWmZ5+7WRGQueYO2lLMe1ba1Mz9+O6uTnEObAKT9qyY01VIgx1gFU6590DI4cwRAQec2Iet1a0YLC3oMw8HAV3G5RMQhoE5PXpyCkMGO0UGt8rtqNYDuzHaPe7UpubA/91RJ+Jmx5AKviCwKy29te1MnYGCxS5wJ+zNF7vZQYIApLpsQxOrnjDSs2GzZW1s5dtCqxv9O9or5gtDrEoe+7Fn3IZYGr3xxffMmhjr6griQZbhyc81C46lGr58t+HhUyMqj1vAbbH4Ifbq7WnzVFkrreJpH47qwA70nBSmWj3xC7xqMl4JTcixkL93UFmhYp3n3UVJBNsNCen9qFHgFsDdLbXK7ndyO1qPTBDnCLR5vHO6nRqWQ7l/FAsXCZygpAa03GOmkjbW8efgQZy9MXvyqWZkbWR2nO4A91+KLCMXuMZUf3g7FhPcU2HDEI1w5DlS7eNJwlJOlWfLxRuIU9OX/w0fldZfswik0cAO+bXZJyChLqkrDda4gEuW6AHBhYPDY0tg1Mr95jOoR49i2V+Ri/tPrgTyYl+HfDDKHlgxh0fuHsDUdwpkDh2AdgFgppvPrSkm6/91bFVQ4Q+XjkHfW5WZthMgieT4NY8ItZrbWFDxZEM5/stnoMBLogDgHgJz13mvJOtm5Zs+1bqGPooJbynVc0BL2OeEvtPJ88aR+/3k8ma7d9mZp5hkfkpZfDYWyhfe631tfgGJmyF0JUStMTRxoIpjQdgsShoXgZh+KIkiqWEu4+Dv4eble828hiF8Ak0KcaCc1dbi5/TFb//fmikSDaXofsA6vPAnJOQfsx1uuRYX+2EZkKYKwwqkZpS54MGuKzX8riEA0FzWLg1o4cqV27CdyeG92zvy3HrJebVwOHI5IG/yeHG7PILD2vPs4ly9yjhlDBxEFjFuDdE2cVsS9hE9jp/vINmet0ASsihCjv4asat24jfZN03pw7N0W3A/Le96hUPPMzJUNuW/CEb3OpcrVlmegwz4CwitX3t+rz9oVbeh5NyaKT0gIEkDOCM434XKQFg9l/svZlK0ulTKoboYQDPxSUuhgJUse2NYzZQ6YShZYwEbvHXcgqwqASQo/Nu8c+g+p8i31ZxasFqUx0xGH2+9ZH/+yyvBHxSP4SVX04SwpvJjAyerUcPIbXC22Hcbil8PkFK3vKEjpcXIdDtcwiOgSWWpI0cuXCqMCAnulvczPHeVVOntwZ5vH8snTw3s3uQonxdjaS0zCrtlwWTnEC7qtlPLZK3EhwipN9DSvPshrmKA9JWuBvNYzCHhKixakV1tY+cKJCwajIF6s/Ztc/7mgKJQEdVPRRLjDuPaXAHIrZjfkGGQOhVwg4VCKfQiRpNnav3b9K8ks7e3j+/jLRTjh6MX2XEDKVaEUdDoiDLvT+JuchdaLw8HN+AatjpJKi7LZbh5a2rqobmVdXE1i1FjtsOcPZN+zvsh/7LbYdVAtZQZnio5mUoqjPGtdXGC59SSRserBp3BkR4otrURQYV1QLwQpNRwlV/ovhCj+u+3CfjMFqlhkOHyvU1gogs+t7BciaLTKSRFQHtcsYGJxuR08kzkF1Tcuk2SiGzRMKzOc4tNASxFHKCsHkqb6kFczdy3S1GuH8kqziFcVOiOqvg6B3Yav40yHOA9z/zZaA85NnOUoKB9Dsku5CHJtFhNQ1zZ57i6r05QAAjQQcaSKCKWeOBML2tjqAlLbV+GEPPZ8vwoszZaFeZqXTnC7x5fITfreATltLDbTsGOXD8/T+98eJjSh1mqOpsjAgPDXi0DBZIBVhMiOLk82npyrDi3llafeDEmCgte1FSUNKUEaSX6x2q50r7RgPVJeZwTyoz0pnnj0XBWUMgEuztBj+0+glGtY+21XnAlZu9xQdTa+mtZZKlFocU1y8H3IpAy3KuPVGCK+mc8rCeOb/5++LuyXQXC7z2yvVtdkHv9wnH9x4MMyQdJoRJN7oQ6B8RKzRH8eYfwRZt8NXCy/88iSRwhE0oMPtJfwcfL78uxEQjb7uUUU0oexWki7KAzqQcIY1NVOhTD4U3PrxQbFPyYN66u9CnJnOmKT9hADTacT3XMrptX2n/zAwr0h79FTfn2kwDUXKhhezU2JIaq8PDG86DK/5XlI+c8k0Snd6Eqmq5kywwWRJSsDv4HHJM1Bw1WArG/h3FZCis5fuB3HDgHg075P1w3/fxalN/dnh5tZJqZj0huGX2cAwiOWVLx1g3sAfP7bfHOkbaOIPSqmEXz9HZr+WSBX03CbvCa9mSgnookYCF3cggTF/RbfINju8v1oCBCAm1m4cxmwdkj4FZ3rrlY4Gjuvkt9EnVqhD1shjpoGLNNPWh9u38Yg3gHSXYz85pnN1MCyExtSjCXubTmy988Bl4poYcDoZYZL7DYoiKvEkYKJGZFBYcrhlpBmUR73pghGvUVpZ4TdKZaj2Bhh1FPDnO6SeUhGYo4XbhBC1zL36q5iuNS4HmcvczXc1MF7EnP/cU4TWRdCFmcFl1Q+S6g0EiCzCLjL2nPPu4n2UjHWL3t3xmYKX3b5jA5M6TN4pY9ICrfhGG+Xvy7FPgscSVcOebvJlFf+QNtzdE5K6gsInnVUV64OlOf4rNDlw4hopbske04cKPMYAO3NJjwJ8n8GtAvxhfULb4++dgqz7/wqE0QhR+yYN3rFm8Psd/gHiiL5XPtn7RT//f9+L9tk8X5tu1/03I5+BxUSxzHyaHdBOSb1hligcz8zHLC7PCyHoAAhnUbsk6lSXIan0zU4Z336z7b1VtcLp3eUxVQ5R7j7OY1QrwuP4fr9HyqaWvDN2HMC0sbp6P5u/D1OTKh9AxLJwG9XoIpbyvEBYDHAFGTZrnjXve1CcAL67X61JdkeatNK1Vt648ydpcNapwkLXNBMPR9PAUpx10bhdC8r3m9f3ZVQYvmxQywauUsZTa/aWUXkPTFYrDTipScKQEej+YU9lDZ52ozjan0pgXnfwqeNk/hcQEXfVc3Zqg42rWSNiZipYMBGGUFNixKRlBUeonv6oDyMl9JcLtOXAesiiDj6/I92UVRsEqWTaq3RQweUhLzCTX8In/4YkFMoORpJ6Blkwtu9roRHTa9HVt+4S0k+ebm87evj6lRKGFOOZ+go/s/0Kr02BepUIlMsDOzlJTF1Igj+PA+jrFjyUrOCFhbOgf+xGsAVE8AYc6oy/vfByLql//nfeSci066nnLaf5fJD0PontqtxcubLTosIzAWmbLfhOOx3DNmXm6lrJHoG68VN1YKZlRasS/ARsz0qhtFA5YlukBOr96Ch1tsqUYsfYuWBWUz3SdFatArHdWUyoXz4Gk4nk0pIt+miLCq+lGPmpf/g0GhEAjXNBr43v8KTqEcXBS0mw6o9hjPCpVo0C7r9gfLnR+WNAjLp8it5bPi/R4ncHmQjx9uVmxNZVdtMMX13d0s0bysB2DxqIYZQvrjhH/6PSJezbFCS2h2uBnr0E+PRHvrZBZjG7lG9/jVium+xgp5A2EW5pWXSlMwBLhWstF4lbxszPQJ/Uoj9WPpvcdLwcNkr+lybLfUsuJNlU6DXwESOtQxGCF+eBM5giDTW/F/+i1+cJ4SVMt1YWePGesMglyQyO2j3+Xu2t+JOCDpfbYOhJC9cod0W0LfACGn9/TdN1O2wDCdSTN4l8HrucwQorChQy9oeAbDQAJfjHkdO22t0kVYTuZGdETd1jJkQ0w08jULukZtqI7X0cmOkVfbA4st940dz9Qt130aRXCH9mO1ubF7uAT4AADOEP6Uz46bpwPpbNqsPkLeG0V551pv6F+7XXSJyMFI54b1WHER5Q46XJlqjSI+cbHNHdbRy/vlYHFFhY4u6U24GhLKbp2dVde55mkvW+ohNTxFoYmD8P4+Voo3QWotal10PUpZ/sV5uqVBEw8xC0OmL801r2Tn2lkkc4+PX0VnFUudevUGZNbuIHzY+Q2dvjAaGrOFwfSLCNC7YBHhHd8m7xIrOld8AZ403suPJP4cXUs7VISPGBJPzTac3/NOdAxGhSdIoEse/8HX1vVssPHy/h1jnySMg51Cfh/rxyKeCFfoMoapBtDKWsyCLYeUTjUotuMlaA6dNxQNrlWaLiAUGZPYKvHQw8IUKssaU9seXsIpQPK3EXmB3PqLyuR3u4USvF+qQJA5bVZ1lwjvW7TUYzLl6Xns1xgZMaZ8oz5U7EO0CmYlZoe1EEvNT3IH5ZDYFIrCsUb8xVVoWfFMebw5AJmu+o3TMgVCSdT9VGrANq+VTDyXY/+NX0NyoYbkowwGZLzWc9aCOJvy6ePU0YNVdZ8imcH5vlxZ+SKXh32HIGl3nWk9DU0G/kjJI5lx0MZ3uWNgH0VAVJo3VqZFrl0ROAgLx2G/osRIiA0NfYWuFc/44qII0nrxa8xJ3yLtW6f20Wywf/rRBtOHastdeJZs1JucMow2xDK50jQcSvTVmnnHexeJFjZiv5MN+/LjAOZr3PH5oSpGtv3nNWBmJucrJZ4KmuE3la4xUhXIU5xXMvQvdFKn71qGvGgdtu0KYGTFoTGXh74wXWKlewlr2dAKn3J70+OVwUWRil/GUUIljYaa6gKHSsJuZcy4acsH4LMnUmPMeKmGuVuHDXCa/JHTKVgFNin5zPnYQbD2CCbpwb3YnGDLEnYn7Pz81VZBnH9IfcUhimggRR9GXERkXHr3g5pkRO+aq5I+YfMNzw8Z/v+t1OgLl+LZ3y6H5poRdP/mKek5BalxiOmp13RR2hbmpkZ22iQVcshetZ4YMmS63z3rs3heAOBTO0WQhT6VBkRt47iXdnY7vTTWfxcsEy0JvT/frESFYp7VMGJwMmJzlPagSIXMC0KzD9A7oiP+zII+wOhwAIoxRSfsA/LmBKq+crPa0rasMUSgLpeyehr2rCeA/exZRspj3B0a9VcIuPN7JUXTaY7FoY+5iah4inL0pHjgUq6NdUBKhq9qfdzd0pq01mjknHgeZYP9CrEx2N8lVptxufTsMTdOHVIEhI4u2wHCZumcKUZ1TPTTLfGzurJr6yYwThPvQ3ZKaLUEPGGU+YF0SkBr7hZGMK1d9IO5m80zPFY27geJj5ysh6+BK14DhMljX7chyabVBw952ZXV836a/9UvQWH8QfXG+oMM/nBfdiUDvY1S63kWw62zcwpxYdw/sOBEqjdjoruGLJezXh+CT6TKyJ9k1LzptfU8kA2RCClpIz4nBHhRs4WklMkmU5FH8L1/snwTWRXW7kNo//0oPFuqLvK51KIN50+4V4oIYAGAy7Xmajf+4IqETnvugSGprvMOF5HrNwNLgv7sjYPkD6rHdAlHaTnycs5NVsd04+QOLLZnUV5HVLG7lCgBEm6QNHo4vxfe6ohMmuIOS+bboAZ/JpARRIJ+DbYsXke3dMM8ENN1vg8qlsWlvx7zu7cafwpGtrYJ8MGw8jp8zyLOEEar9jHw3SD4Rv2VUU3obmeHnyghnT+e1bV/rsEWgjgN0T5KdbfXW06TwI446KUQQZi5pGuS5EMdAKb2D6m/yqSMj3nan3ZmFJQdMjDUEq211dnWP2ugq3E+lrQbQeF1++6srMmJt5RdLB7VxuNh4yg0N4GQ8sBR9gXxPeznGAj+eugHijpw3r5YSsfMWJyVzzygCnk+CnZ7NaU09hrRa0/vSQHa2eXLTi5JduedONZJWv08tcvpcM/GHUr7TaEZbrBA5JqGRiCX6RQCTZGqX0yBiLLzHWXEhvXQlxRVIf/DTYvGDSu54eP8mjPAanQVioeTl5hkDky0huvjZs3UOmW029oAIA+9zP1rudFcFPw6FBpsjgIsojYd9bJo1JNU/mMxtbxo7031JWoilTKL7pLA3FKw0VVWd2yfsqRc9eTQagTQCe77AO+IX8LzunxIabjZTTuE3miHRBFpYxLQzituhOZJn4GVTZ8LV2TahijAHBRPeJ7OqpUg9b8gXYolwMKdEu0wWe1Z2Rajrkj+OgWoMhvKIgnJ7J9BaF6/1sbWlz+TD35LiIYppXPq7wkthq4CqJJ5y88gpsul6iXU2VN8O1F/fyKW3IgG0FM5GWM6xCVowoBw5Qpwxv+agdx9OeuTFKKPWUdnuoVYK+MA1EiKJ/yrN89+efDOQ64L4t06qWdpjm21HKFtpZcJD1Z4JVrRdFju9c+hSDZIPzdQuIQHt95TnxAceSlR3QexlJk/7TRUfcOJ4Ax9FTsz3bH0MQwZzRjHHK0wl9NqgB8b5SSV6F+ZozMk1zzgxGFYet7T1J9pBBCPG1jn4+XiEW4shzCTl4pbfe2RaTraJH6unXh40aBrgnDWEyieZQIp9y5tdyuYVIhM5MM4FR6f5QzOR6sr4n0BX2SSC/CBf9VGsXFnWdsD1P8Rscp74GYD2GcD0uOnGlYO6bLjLsSiXn/CuH0YN9QhBe4rrHJo44DYHbFe+Trkn8O+0RzISut52GtQYiWO79ctHrWuKUOEewrEXuUtLtExbL3RNTR79YkUj6c9emOdrYT84Kpw4GZvOtoOY2/9ulEN6AyxcBY37Ne4ty7r5me2iD+sPhnIQDg0cqLwb1exjAP/iOiusBsPSzIYc4WmcIKgwRnQjKpIrxyiAlURsZD3XknbfvpW510DtITaNrAjGSOzmkh0WRv/kCQ6exx3E7SzRcU/tdfYdJotDLEkoEjKikKVjj8gAH1K7EPD723sOnZUR3+ACnVp/OZGnqbi8Og42xpCLYHVp3eCxFAKbbSGFuBbvvcHJpMSzZ2eMxafMTFfBetDjfty19lo1Ma77rP17pOpv7O2Gmp/KBEhO2rbPdqVaaLeCXcAr2DNtKJhuX+il1tHUsweqITGcU+04hp7jwa968isHeD4ZzfoPUc7/N7ESPdTJ7EC85jy6G+lsBaV+OhK/DNYu0TjiW23SkeFD22Nn7qa0gFlQr7EUHwR/9WaeTq5v/mueu/SCuxialxtw3GsoU34J6/3+H+3doXg8WioP6Irhs5j42DPlPISSNvUlB9Kiz1nBsYUvUiqooNbstLlgBwRA0QFjcfdCmf7+kzO+RhQWATG8+9DuNMaV+qL6D7JFdK3U/D7hwDjSJNLU2TffgcSLFd3+NbfilNSTNyL2VoKVNcqfWnpZr4DkRhXOaileXtPe5YQSbiazIMSUdnOhp8IVuTzhzWLAFl1jNO6h7aLX3/It+c5dcPtD+h8z/KWCyXnOuTUw60SLbohl0ZNglDFpMiRRgHh/aCRz9mejLm+1J0zfeBl5oIaH+nRL6Zeeryt6GWJXzmY7nAs9D4coi5q7K1zQzpoKOiIRM+3Q6aszQ3/POtNMRmpnRfIygc1vTY9Tn4EZbGok/8IPQWq7MWftAUN+MqcOdTLCNpaWHu23ZaLjk7Pro/G2Y69+3j8bcGPea4ez+91lAghNkVw0wmsyPfO1YJVdRHKyHMr7943XrozX0Tx3TBYJfGjnOLrCKGeJjSF4wvILvQjfM5PZBvncwZ1nYT/t2wyCRYUwBFbPA3NHeOL28g8acffiQybIgQaggAK3OXNK0CE8t7O9j1/Ey5hUQDbbTi56iOq9pYGEPVaT56nAhM6Xd/gxYLuDOPqAolrB2FZmPVk4rjNkmxiieZCo7XdDtNq+kgasuKPyonOe2v6iBgfcQ2WAaMOzkN47YcU1p1CgGoBdZ2eWRV3s4kSAzeakgo+tQG/WyB6r/rcKXqWUFlT/wgHAjHZU2yUEhpCv3yIVq6WanSEgi9ejBaZl3KiF9umTfi49v0/g68dJN4R7clTtpyrFCemTWzwSQxZFcnFIWGPfhS7aFDS/A+pZ3FVf5f7kNUB5amys/ZBMRN6rIuoCZBDO9XwplHnmcjWrF2TC2xcnLWua3UWkGbXMs2EEL9QBKAJH4bExlOs6hvVTV4gKGLwMOB6ALb3kNEVJQ3/uvjZx2Q5kttgmErh78HFwRNATBLP9uuPOVYpUEsXQBExW3xu8aNTzFMH0t+mwA/kY56gf5t0hD04J/3WMivxs8eJvwVFnI+Lvc/OijokF9cf9dCWghwoM4ac2xiGZfe5qCUDC/o+DbnrjJVPMfHuT3h24axExOuIQG89idr5xhKJFw9ac/RxEG7L4r0JtLCr91m+6gffjvEy4UueFJwpD9EDUvV1fpYzY0Rs7zoBNm/o7YiEM15ecYgzHsg57kOT3Grp6RZn8SGFPvV2FNokvaUshqfwldAUpa5l5zqmjKdA5minCgPxXieUnhv6hrC7j93LBbwMzZmeaTpaI+rpug7dnSFBys7OOpvz4lJ770ZNwYzetjJFXZt7BSPzLj6/RyC86G7ab958XvE9DAF4h0nkt1OXevO8ZwkeAVzry+rX3XRfZDmd2vWECoPqopGv/fIt6YAED+afL906lhf8Rge0g9KkFcttpXJNTqooB4vUdLdpfbxQx02nPx/Xb1t8NRVaCozpmaG6rjuvqLB+1IIs7bEjhfNHZQ5DpfV1oTdySZlK80zPbp/jrkbtFrLi4F+QzczYJgmLmFD1WSgwtSwYDjjgvIohvo79H4NolDCJArMgG8AOarRcw1R1AKtmIpGn9LPyVnOu01BunLy1wNz3XY6Ch3cu5k9RgllgfeXmenK0g6F19APojbplcmX8MddkYUm33B07+QN6tDxlJEglPQcbJ5BP4FtjlnHHnbDE0o0Xk7eSa4CNNVmjfq9uS6SEN9RQJi812bYXpSLT5KZBMZh3KztE/uMNeQCdpqZJvbKBGjG17bawtjbKhEvIRhcPDMKLRGN93gKxwYKJjBQTp2edjeSiR04llrADqfvI+DAWdbLH7FzzI9jskn0ejI8oJrWrBhbYUzfkv0AitFA7+P9IihPAA2eRIA540MlNpNDdQLG+Sb0ZRyI0Q1DNcN1abZkJwjdTvmo6YdE1yeDHgXoUI/YEfteAytsDoI6soxgvsER3YVQag2IFlvkj6jdxgqNkE1qr8kYosBCm5QP8A2eUhXmAFt+vgFrhHUEJJwHXpqHGJ909buhsf92vWic/l46ftfK/ZpKICyPWreaUgz+4bPjHrRS0APhbNTAAQ5StKRPsH0qVboJO00RUQuWgP2nGA5fgVWqb4MfQGkOGRshPc9xvH3DxWix2fLSE+xtYhMVy9Cgpt5CnRGg8kABIU+wi5UD9eTlK50xLqId/0s6tmj1mteezSrGVNUIT1j3m9LELBdht7asnD5hPu6rWsYn33Ae3PksQ24M3I34k8uCtDjsodr7UlH7lHcrJMr32cWw5CmsJZzwTqhqkAOXvgH/KZSd5PMcduBA5iWv5IR3PVyWKaxYMQ1LpIkdAYMLMZbI0gwaG6UbqJVYBK3ccqw+Lo4t1+h+McgXwUan6dyyFp/YXn36FbNVYj4auPUwOoSrPM4famuw8SvUwc8Badka03MiH0cUSil+bf88PKIXfBnb/v0bfvy0MxUTyXFiEb7AWHiqZt5xiXfhk+5Y0Eug7U/qqWxjc8KlWuPO07eWW1toaPrJmbMiSGzJTQ8Zu/OQGQi7nl9lo2+JlPR+lehdGCHm2rTt7L/Yj0Ld6FQDkc6d9cW+zDizAvulHcY4VHFxGwH1sAACz/TUJGw5lDvMgpQeRyPNKmhU26g7RwdiqZDzeq37VUBlbddMh4XTPQGW4zCy9Nv+6aTok3nxMN/qTugzhvxTSuyDMjhxboGlnHLHW3fsMo/em5oK0v4IAS+sQ7t5uiM12a/t6PhQOXeUzulNeDnKd8qeYi1nme7Y7SUqKTXCTPEZfahqJ+UKA/rGCGU6JhvS6W+Ev0IwPE3J8+qFGWOTPW2vwzRm+4NU3eAKJXsEIHf0FPh87dikUPOd556zGc49RUhejzXkSQ99e0haFYdj/dIgZUPwVtBnVvgRg40n4A59Ru8qTWUnbmotOSD7PGmnBcotXbYvi6UzKb6NVBIXWUypHWwMQVFrk7IWus6sE0cj5F2E8/w16NjJCeIc6a/xWlfmb2KPoJucaKfQ4r4gTjN4uo8PCJJBgcxhf1xPdEk5zsvNmNybpkMYqrcTPYoyzVst2V3XEkmMGyidqHVl/rT/iTDCW4HZnJlWx7ILcCbG9kLPx1LU3Ri5wHJH/KgBHzMNWgFgQYeLQmp+MAWE4JhPCikJWRzFVTXDDRbFb6NoWQxftRp/Wet5L4HDIxGWAPBUYXFLaQSZTwPKLvOt/DtHVTt8kajEf0Fu2jcuT6gBzi1Z7TOQkbmvs1g6I7BjySC5/ye16xkk+xtP+n6LFY2PY/9+tis4Z55kwIK03RxqnsCjgG+2JYpJwUMoWHim3y1EJXOk46Wb/i2HC4GM8eFP24kUSvs0GLuBZ9NsE3oYfpa/2Y0KfSP75SLcsZg3/+67//DV6YtiqY4f7v7DewV5wdi7R5n87knOZWcZp6Svv/+6nWOv43zStNTUUTHYlDhLQUmrlwmtPEDSA391mn3R6Yr/yKew+ooDE9MkXn/kVO1F/Q8j2b4tN9q1oEnep8ihuZnnLk/Q0m/Df4bBJjTz7xM0t1/elZaRr8d6b48/BmYkkAbuNA3B9NU0IVegIRjY/zpWyFTwCrXFXe7V3+ke5lyHOL6MS+T9ENgmWYBSCZUnITz27P5YiyVQKSIlez96iq3NShjFcb67RPttWaVnodjNKVTpTdMz57QtpJ0+UE4ejq0ktHfaEofo16fJg/jT84hs8OrHn9x70ndyANuqVb0Q1Op94NiIYgylQ0GMqrM6D0qRyt/9xJwNu4ZCFDRzCLP2kfNM576v6qmkCyS/aOxcEe76xfKzaHIAtPZ2R/W/ISGtAXjq8ZYV35lXsPUV+Gx5tAvPuJTfU4uVhwJmBknm6hykGrbvC1nxuv+YukqFsCvU6tRsnQwVAw6DGgGCAaj5Dm4fA1S84u7FvsuhIb6eJJ6F6MMPnrKNK+ieACBuChlZA91j/ph5C6tF9K0PbgeHpOPA8tNqLYC6NDj/rk07yBKQkWPfqeQSSnG8bb+wL5/NyUX33DcfrNhDTzsijPXpJIg0+jecreqF7lcCgpLwNuLLJwSABxZ7+/rYoMmqTZGwIPxFoNz1VlLESp6X9NS/+utdd5K1MWMvyJJktNFKBiKKyLUSXsvb19wEAXriR6KFD158nomZROrMIpCmkM7rjvIksYtOTLUAQcIY2D/eUIwBrB65//pymreNEjIVpXPJAOlogO/lGro7Ww4LpIQnZfteKkqUF4Kw+0G8rXCjSebT0mhwC4KrQHsi04XMpe4kAi3ujfXfIHRKKTOcDYRy5OZyeFSTv9FIi7Bc8YDclfDxCla8U7VUWYqgJY3Y3WSLFTKJCdk4r3v4Xh87b+8SSCm6kYXRoK9G9YVQ2Y1jcuSrCL5y0SFrm5VJ857lp/uo5JkNMeT5GkcjQ1fndnaW130XPuiJL5po0u8ph1sHh+E+qfH3KUuIz2SWud4mRtK13I7bJ9XrkIe0bONid8FehVK0jVDY3LrwXKJyBweB+Pa8VFARZPRkQCpgvREy4OOfyVRPsdwavjm5Q2oqXz+xyFr/w/hjjAVGxRDPIWHOabZ5fRPnbA9zxLB7aEC/vSeqAMc2rmV9i9gAMSIXKaEKLR08dBf00wSW2DP8hu34qIro3eesRzB6dsTEd3AANLuIfkK4OGEh547LtdjYhYhbDoRPeCoQhOsI1pHBvpiKKRbKGPOTqWRhqLWqJm4y/lzxCVpC9bfZL8h3uK2qhkn/gCjoqZzOI8byTxaPH5b3CT/rlgqBcPKzsR000usMl06fqS5VihS5jVLHgAiOksvt0HB8jqZh8xOVhBzkUexpH0acttyXhWnV7Wf7QkVxMQ9BvLSjfdjCOeCaVFxNyQnUCkq+a4jvYNhNyQccJ5Wl+YNvung8sBnm2bz/jVPRHr4vcVWPvF3Fan9/MaYO4bC2nnYzrOIKE5Ixtonw7oeZ0JPwm08kKMuoPCbmTCftY/z3B7YxTEi9vJh8cSgcaPfW7eIF0EtySXvBCQS8GPwDOqzXvok/iRxoXImk+2tdzstNgEkEXT5JjFDuKlvNFVBWLlch5LqpAFcQZqFzMtygzBIpdB9Lqi08GWKLMLfjkLKxvF/pbqLOZMNwlN/wov54xHH2MR/RwSPQpo5cKMwKq19SCpKhGTtwKK1JImNhDK5smScWOtGBb8nFNgZPWGg8ZtFe+GFwpyWfa37ujjdzkVUG9u3t905SiWSvFqxLH8T+XEMuNbmjMgprMomQ5bpG2Vwt5w1sPEZydFSHO/YjWqYVWY2hcEdTxmD6KMbMKsmKZ5ZCljE4SyIk53EbRbuXHnsdu5pFWiDx8eWcDPMvF/LqYa4+PDTDm73QbA2DC6cPit5G2Go0S7sGES8BpneJkqHHseX90T5ZeGK0XennWVcby7/BvufrevCdDVJSlPcUY2OAkoSnuSD64NtUkjnYTHY7brLgq32A+HLvBzgxZ21wmWaLOjTGRW9yQpOmQWGGNsXbwg3Y9fESGFiJ6ZhSIKiEmFOjg/STZQxmMGiNV9E0FcwH2YPKF5Eyj50y2/UFE4TWaPfxz+61OZRHCUy9kiUa9i/oyuQ87Sudimwo58PPjgK6hyMXizt5puGuOhan9eFDtJxrT3QE4lrL1B4aRSUsx50ndi7c/GpYJ9qTUxmE70MiFZ5F0XVN2kXCPEZYNtpyJdt8DarRd+VhkWL9gsf3bpIQf74iIcmZe8tUOQYtmuJ0Y0Y4B4mx0QWgtRw3UduAbxM9w/HhawofHwqHTe6lU2z9ydcEjwk1RhrE0Ctenp5d8jVX4qOa/EWjPNxsdHKBqBQ02tUI59mlp9XKzfooolhy2wLry4QR2HQgvbgGOvxOgX5/UMEPK3eym04juwWTFSJxb0Itfg+kOWbRO9m3b0JLBDY4x4aRpVOKgmV/4s1UQHp8s0Mcnd4nCbffv46cfGJm+7Dm/LmEqz4HiIPpRfHaM8BH+MTGytAiulh1p2qzJckTlGpQoLpwvCC+xr8hul/gwA2hS0UdFrdzEBqSf3gnEYUCKzgzmL7XYziS+92HrkjgxrIf6e/r6XCC/+phjpJH3s8BDQKo/Wb5Ij1HfYqKDfItgBC4eyJdKBt2qWXLLkH0YS00OjxcQ+DvD/qlYvCoV0dg3aMkFDAwhhl4sh2n6wsRvWVaQUSkicgMLiUntN6902ikJbU4ENgpm0d2MvPnUUHEQewBYWa2U5vhHAEDTD7KWWzlHvRqPiQRv4bVXzUI9fOLWWG3DGqWThiJ8y1YMlXd30QSngcGn89eyuYXluHQA2Zx0ginMs22OoFK/qtt2lfY1aGGnXuA6174nGuWs8IHWeVPPCAzuPWXJ6pDqQ4kpm7fJPlmOJmsc1Kw5nDNuVDXrfcs0dlW7QrfpEhX4stvKos7NN0sh/XRiAM7zprS04v/PHzlOddlpl8icsg8C0X5SoofHjvX/gXO5V+QxXxTmOoquXSQMBdgcKcwDEcOip9RlWF5kTF6GEaaCY+57K8OL98cqcJGzeCjSBNnruQRz1LQRo1P5pX1Xu7OspMjiItF6pdrmWVti/0IMRvqzE1/gTHjYSAd17cw6MwsEhwkjraIwCECMtK5/OIYY1miP2XDg+viojBapbmdbuFJPJ0mSjPePTrRFe1a1s8vx+NtZp3+ia/yDf3+6+9Xw96xulbpEPEswabiCMfZoF51yHdZP1OqbDDbGpKAO2Qjd7Jb+6toG0hXltk0I5qzvpyjIA1vYGyw1mdG/VoN95U18DkresjGQH4DMVgvaleaPN+k1s7lpXeYyZL9ocNo+fyxOTP7+pdeIBjVdMid8HjA8QSxu6FlwxFAD3GKXorp1HlDDvLI64rbanqCxIOn8QvjnA2KXAFXBwxxSoB9wWsPnCwWNiJdfPE81r98gq8qdIHyh/j4grcqUbO1h9nNzn2BgATgMgyek4FW8l7k2IubDsOYVaZYF3e4jgL8wxpBwxoFQ6Fjjcz49C/opnOFYy6fyH3vhPcZqunXvw2UAh/FkA+Ya1rhqLK0yyEATtlXcc24r/oQ2WxzRwpm3W4GowAbLP5oquZ8SRI8qFhHsjwUQ2362ObuVR4kdSCpPFVOeBXQUca6dZgzX6N8ePpus/+klc6r9kl69dY7fuRldYfE2cx+zOYDJzrsTwMksV3jCLawJ0W5EgcDFNhnqYJz46CnaSFUNylr5O6YH0j5DzYAoUrp2xT15MdWoiF0Ep/L3R39K1b1gEeYnnI21rqxXRwwKv6vtfzrU7fI4njlNl8LCYdP944wQPnZsmMYJfIeC/lx/oMaLOYANpaX1UzHBfKx/+weTrqCS71ekqGxGYv5wwA4G3OlPfabaUKVmMaqo+b9p4vDigXamKcVS0LMhVaXE/0wLD6ETKlRb1J74sQQfMvph6rdumpF6vwZi14mzbhRBqxkasM8D+x6bfxPR3O7JkEuhEzykFLmOB3hTXECP57+ZKRbU8z42GZC935Wgt2jALXbcPLAu666p9f9mS8pGqPsdjxKskZ5rp+XfEddYc1wP3mrYwRBASDEmPGRlW46vdtt2/bLluMXp5bq2SD1m6Fm/HIb1KPrnak1EuoPg50MHe6k6dfHDBZFpJkhcWiKn76Lv11rcwL+RXx6m81X43c96pwxnJ5WVm6iWfkqvsCiaDJXANlnhVPr6HaRZCUi6GDgy6HGEZnxqFTO4d16+m48n/Ud7xXANoLWMwlUUkfZGbpw7wL/Cp+NtAtsYTbgvJB0m754u6AVN9199oY5pt4VMGCuZAR+7GtWwvTyvveSNLiQ7SjNnscVtmAUxCynn0EihmHIGX7wqSSERxO7nGttjFNM8K0kr6YzgrpZJ++5XWrk14bl9SRkKycZtc5YRlBKhYnFMtqziPMqEpyvkSvpdgbD5ZmT8+CGcuGpkM2T1dhqQvXdMNjsvzoBQy1i+XobLjqct7kV2/eVC6kT526tuESYHh96cENV69li4FaujF26t8iw0XkcGHuSDvieWjDIFZrYYQOeMJm0+s8UTupCnOK8ukDa37hx7CKhfsUeklPVgoiAke1a7HlX1TD3JlmOyWbjH8lW+aHtFFGV+bPfQjCT3AGm4rklg8TYmEbaGdMV3GziZMhlYezNVPYvg5F438ug3eixEX22P09sFip6PFkyNgeLG4wU/uLRJOnynTR8/H2AxEhMb0XNIBOyz6JKoG/rCZ9m2ajHcEudG7M7DIzgOEQG5ajjafiACdYIPyjo3/1tRc7hyD+NEYcGjX6sOiRIolQ47z7uLtjitrEHhvtL17+S/RyrBvN3jnJlV3Vjc5vZ1hz72tpR4fPidI0Ci9eeBa8D2r1ZB4BoAXbcl/oPPXZtAXQGumxJIG+SEzm3gp0jCh7XwKpyXY+Q3N2g/8mJ6hoXsNAY0mnRVSIKHH/Ur+sniV1Dam1TY5qgOAbJlg5PrHAICEBECcLeZsCtJajMzNn06DaINjCltFhrWgIKXN5QnapDjlc8q+DRlNpRMEJxPhqGv54EjydfUCn9F7Q4/3/POETXl1BsMXvajjOmIx2b8J6zpw+diY9iEPGdk9obFUXa5aVEsBeg9g8HXdNNWiEuqDrerehW89U2Rh6dueBYc7uY0fGx3p8lxiokSiwP4qdD7aC5qbxvqK0HUWAJdnBfkqMgR01VngO6+hGWCXKZxYxCCpwK494jassZlZS0i25TyW6bPS0vIAUo3iICvq+8A4ENTm9sIcex4dzZKSfGDFWMdbjkmVuf5Bqt6PyB/tgfDpXLWR5TBAUx3W+Zg/Acg/SdAopEKzqFLRPc/9RpiKkMn6AH6woRlZclnWDyHJhz08TFFYRPdR/BXYf5WOIcuA73M8FTSTZbjTd82n46vhVlrqH5LTo6inD58OZKhLpm25/3xI+KD/H1re7fqKPpN18tJmOzKDzDrAVFrOniIXXPdNmdn39vsQSWRl4eB6OyzpS5Gd+caNnETs4NaQHunv9JWBoB71RBL7AOA7+OtowaAN5fAP74eJ/Bw71/z0Wus7SrKHR76+HMQsEHzWOJkEmXD8nyrlHaiO8/VmZgIkIQHQKLt0eEQuYsT6ZjwgYK/lbz5dZF0uN3DHrO1/oW71MfLc4aztj7aKbklFK12844u5xwNRnn6FEub++vIhFzjkoi3AP5WTxExet9lj33QhxJ4x3r3eYKKXMjgx7Fm77KbnzP/g7tFABHir6YHxHNKsd6xXa1025I7nv95y147EmzaNEbV57ZFhjj/LQtnZzzja7dIxGDhTKuwpFDCNDINXG3LeylEFzhq5uLidPgI/zgdaCmR0CbnpOBY33Qz1qmXYMtVcEtYhHih+lWd7Dr8ltIgR7hqXWG7Oq7OORmjeG/CJQkWrEyAveUDmIElAP1uPGZ8np8jnojdBqcYjOQi/g7GiSJDE9ISwvjO8zRyX1uTnOXsGSSMGeSKfEFv+WLu8jetZUkg3PglS45gtF6yJ3NYUcnV1tD2S3zDGP6Mh7iRJ0u3CgAkW9Sa1+wVnvblkYylaWMqiytN7p5w6hPD5XboaK4fadHaVa7BMgtFXBY7Gj8x5NVSHI7rMfbif50LB6tCaJgZuMnCYiD/RngsZD6ASyVSJn6yt7hht0YIA20TpWdBAJHgzNf3q/BZnt5AdCNkQxQZeJJimwlOeTTQl3oQsUdPxCpQYGKonVMw2Rkg60+h0q8Y3MZyQ2npjxcEbIlovyQE0LALtBGLm2dLEDpDlXp84hxkpLYH27bzIyObrEYpnGuRy5M76MJRNxO6yB0Votk/g2irsWIoAEcgUT3Sv7QrqZQhUdRpTRVgQa5+7e6jaQFyuA/8S85FfpfFaCcrGpM90nlMZoddiVrZ6Vc+e5xOyBXZ7ligc5p1KHISmN8/sqJAAb269WuXufXmt5xyzywvoa8Pzy4VE2Yg75nM3eLeD1VbBd9BE6AXbfeozWY87YDQqfH8+mSXYVcittadij56T+JU7f7XijCYWWL4/kl6KL744IgqDi/eaYb4Of9oKVNcDC3kq8N5bcBHDby7E0NhkWURtZNcYvts3fQRk/QN/ZQlS3qp0z8I7wBT865bl1shOh6OsYBDfsXMKR6uh90n78aQMcdNTF5j1P1hRBa57QKINYiW2PUFzXYJ+OeF1mLWw4YkUW6T097mU10RL4w1FSGSnHZdDOgC+Cgf/UtAfCFg1AkvBbUssGFrJLT9wzNbzo4kKZuoMZIK2dJGy2oQk8EI2eS7A0lRCpc0rNpglj7wJ1mA1Bk7V4+TbRJ7ZVtKePeDG2iENmwAZn2LZ8MW5YcR/nJtXIAs5G0/2X/v9DxoyeFw8zhqxdiVC3wT1/9bQTmkC/EcdLgladyilXiPRPg7iGOWLdTAgnSPnvY/Eg4v+GtHcMkOJ/59doLkNIV3ln28bI4oUx0gLas4H47CtHG475nk5fLxE/WRxS/kXxM+mvU1zR05HHBRRluYcY3KxnHFoO72AI8l3KtvTvbQVg7o4nU9TMc27TFKunsyGYfHpyOvRu7W167OZfjJKZEPXo7NOiWrYjbflkJqP5mKsMXDN9qyw/vMMZPpl2Nm3zIl6MOyxDU+kuB7e7ZHrkcsfhfhJ1pN3eEcCoJ5cd++s6LyBFj0DSthuCUh7T6z2p1ZSM7BTH58gMzS+edBqWc8CPOGgtLKPUbVM4l6y/XsYKuO98FTmewDNuNIotfda5/RAGP9VPk0M7qnnXgZMZee9p1DI4WGeebq6kMDNgv3l7XvfLEr5PSxyrjq5OIehLPmufmpqjzNowmsEEOqs5VJEhjyjtX+hiTIZCdhno0+zdN8kUxgg52rrB9gb7o6nse6zp8X9ZDflmAn+XFP8YTICjXaskOVzTUHX2x8cIYLoi3onaV5b04F80LeblUzsczgU8z9CTXzzcSZRS5qV1VaKlv+yO6UAVI1vq3XopM2vRCb7IZyvJG+bRc+W9S9xkTJcRYos6Hac9VSPUBFbVc/v9KJI7TIo/0nKnQnMt8+Lg4ht/mQDbuse5urVKVRCUhfTgrPhwBvQHa0SmDf55XKj11JcFUbd7IChVOFf/nXq14UeNTkLu8hJ1ZRPbZNRI2BLC2u+knQUbTgEKsAnprjsACgYtys1kC/zDfhtqNMJX7/tEy0Ua130/T2sAHITFXWXx+bREKviamc0ifTfPbkgbRxjGSN3qWpJnq8CvSr5Z85pKizhrAp2VHYbk5gwTsttKozZCmJL2MjPZQVoPm0f2jVsrMyOBssxGofZpHWpMR6ObiuoQMNSdLjr29x4XqjPkj3VH8vXAEk0S6hcUXcIINCrcqFfUOaJEzoaV6eBt3E0mZjNCpWPxXeRrhc4p1t/yWBdJNMcsbYCRewyHu/XVuuk44ovjeVDfnhmcE15tvL8vrRQ60TFt3lcspZ/sTp65VV8e8EkFTaD6H8zBrv1+Sla+t9VhnuBlkpc7UwW86tyUctcUhWcJvsgJK10cl9rTBSwILkpDEnd29G2xIqj8xGxWJmLcKoEsBMwSaavLp/G0Z7J4V3WcthTbF+X09ZatASRGO3IPrXcy5HX2Yr9K84dDQlRJ7lKekH5thX4ZddH2LEd1NQK9vjCeNxDFq3dmwISEM/0kHrTCQS59U7AfEXKb3u/1hGKsD7r7wHaAu2SMVOIwvPyYNvNkqkW/rUwGYIM5xTTTnWgLfRhv9uaY+CV3rK8SJtkMZeguwiJdOTd/w1D9mxRo3HI0zJZNJjuBMgwyDOc0P0fJdgyN9vCpK006VXmCi5acTtVI5+O/xUGpthZj7QVTxzEav5atPSYlwKKfderaJ//ZjjYr8Shrxq1rL3T9czNGq4xsfB6r4LuARWC2vIs3aKNs9HT6YPYYV9mgUf4ymLfwpba6Lr1CN/oUvwVWx9op/8uZn+YfZEfzALvTLhtbhQ7uKPIBf9l21y42Fbg+sHX6HqKmJsRYpX7Uau00yPTiNMJF8JzefjTXe3T2Yotr85FBbb6vgDM1Z7CLdcrA3LLT9dBWL4vx1qcLnGpUtaaIn5GWwEOy335VovNlpQaReF4ljJUChE1O56g4ndos5hDgYrA6UAEUoYOmpDCHaQ+W+kiPJ8/LTdqAXiPeAPpC+m34dcf2tOmKgzH++V5JcwqiqASDWTTRiIp8Yf4bqXaWsrKsw0EvBz2w6NLf6X7LOdZjZBJ+i16gX/nljOXZP26mj3me4iVNoYDa6i/ItIDQgs14353hpvnrvUFhjAE+2DCOBmfpPxC/myrqaJORQb3qI7WUNJo2GvwPg8eCBo7+IkLbuf8NuW66l51IMeCs+LewSi60Wojx2Uv2JF6dC7DzO8IwXmc0GNPT5hNYEKtj8rDUUs9UY6Q6IFe8JbGhG3yIbHUgb4HJAdV0x11Iak/sKjlAj8hhYxep2S3MBFuWuqkGO5KQ1GKrcRyQNxtkDQCknQKRngVcaxozbLNL7g5jWrpMnjHzb6Jk8G0zQtEsnNpbZb9aJoeLWg87iFIlQdrXoDKnfdLx7McKE85kvH/bHGO0cPwLeBoheL4ysxGq1U6GZ6JdI4LeUD2/XHAnY0/W49GXEoKgsDpMF5pus6Ca/9MUSmYQyvKW6x35lzB+V4RMZkW6hoYpStA0ASoOlBcz//NrOUKkCA0NhA2EVZdudQLmjvQvaOw3AAAA=", c:"data:image/webp;base64,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", k:"data:image/webp;base64,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" };
const CAST = {
  t:{ name:"先生",   alt:"先生（青い服・眼鏡・笑顔の人物）" },
  r:{ name:"ライバル", alt:"ライバル（黄色い服・青い帽子の人物）" },
  c:{ name:"応援役", alt:"応援役（赤い服・笑顔の人物）" },
  k:{ name:"確認役", alt:"確認役（青い服・眼鏡・腕組みの人物）" }
};

/* ---------- 根拠資料（確認日：2026/10/11） ---------- */
const SRC = {
  R01:{ n:"個人タクシー事業の許可及び譲渡譲受認可申請事案の審査基準", d:"関東運輸局公示。2001/12/27制定・2026/02/17改正", u:"https://wwwtb.mlit.go.jp/kanto/content/000107995.pdf" },
  R02:{ n:"許可申請、譲渡譲受及び相続認可申請に係る細部取扱い", d:"関東運輸局公示。2002/01/31制定・2026/02/17改正", u:"https://wwwtb.mlit.go.jp/kanto/content/000284962.pdf" },
  R03:{ n:"個人タクシー事業の許可等に係る法令の試験の実施について", d:"関東運輸局公示。2002/01/31制定・2026/02/17改正（2026/04/01以降受付に適用）", u:"https://wwwtb.mlit.go.jp/kanto/content/000227879.pdf" },
  R07:{ n:"許可申請書の記入要領・添付書類", d:"関東運輸局。掲載ページの改正表示2026/02/17", u:"https://wwwtb.mlit.go.jp/kanto/content/000284963.pdf" },
  R08:{ n:"準特定地域一覧（関東運輸局管内）", d:"関東運輸局。発行日の表示なし", u:"https://wwwtb.mlit.go.jp/kanto/content/000269539.pdf" },
  R10:{ n:"準特定地域における個人タクシー事業に係る許可の特例的な取扱いについて", d:"関東運輸局公示。2022/03/31制定・2026/02/17改正", u:"https://wwwtb.mlit.go.jp/kanto/content/000263437.pdf" },
  R13:{ n:"譲渡譲受認可申請書の記入要領・添付書類", d:"関東運輸局。掲載ページの改正表示2026/02/17", u:"https://wwwtb.mlit.go.jp/kanto/content/000284968.pdf" },
  W01:{ n:"タクシー事業を始めるには（個人タクシー欄）", d:"関東運輸局Webページ。更新表示2026/09/30", u:"https://wwwtb.mlit.go.jp/kanto/jidou_koutu/tabi2/taxi_jigyoukaisi/index.htm" }
};
const CHECKED = "2026/10/11";

/* ---------- ステージ1「開業までの流れ」6回 ---------- */
const SESSIONS = [
{
  id:1, title:"開業までの道のりは4段階", short:"4つの段階", goal:"開業までを4つの段階に分けて、全体の形をつかむ",
  ride:[
    ["r","個人タクシーって、試験に受かったら開業できるんでしょ？　まずは勉強だよね！"],
    ["t","勉強は大事です。でも試験は、道のりの一部なんです。今日は開業までの地図を広げてみましょう。"],
    ["r","地図かあ。道なら得意だけど、制度の道はまだ迷子だな。"]
  ],
  predict:{ type:"order", react:"r",
    q:"新しく許可を受けて開業する場合（新規許可）。4つの段階は、どんな順番だと思う？　1番目から順にタップしてください。",
    items:["法令の試験（事前試験）に合格する","許可を申請する","審査を経て許可を受ける","営業を始める"],
    why:"関東運輸局の試験の決まりが改正され、2026年4月1日以降に受け付ける申請では、申請した後に受ける試験（申請後試験）の対象は譲渡譲受と相続だけになりました。新規許可は、申請の前に事前試験に合格しておく流れです。",
    diff:"ポイントは2つ。新規許可では試験の合格が申請より先（「申請してから試験」は以前の決まり）。そして営業を始めるのは、許可を受けた後です。",
    ok:"よっしゃ、順番どおり！　試験が先にあるのがポイントなんだね。",
    ng:"オレも申請が先だと思ってた。正しい順番を見て、もう一回並べてみよう！",
    src:["R03","R02"]
  },
  guide:{
    title:"4つの段階で、それぞれ何が見られるか",
    html:`<ol class="course">
<li data-n="1"><b>事前試験</b>申込日の時点で、第二種運転免許があること、65歳未満であること、運転経歴の要件を満たすことが受験の条件です。</li>
<li data-n="2"><b>申請</b>経歴、法令を守ってきたか、資金、営業所、車庫、車両、健康、運転の適性を、書類で示します。</li>
<li data-n="3"><b>許可</b>審査基準に照らして判断されます。特別区・武三の新規許可には、年度ごとの参入枠もあります（第2回で）。</li>
<li data-n="4"><b>営業開始</b>許可には「許可等の日から4か月以内に事業を開始すること」という条件が付きます。</li>
</ol>
<p class="callout">この先の「試験」「資金」「営業所・車庫・車両」のステージは、主に段階1と2の中身です。今日は全体の形だけ持ち帰れば十分です。</p>`,
    src:["R01","R03"], srcNote:"審査基準Ⅰ.2〜11・Ⅲ.2(13)、試験実施要領Ⅱ.1"
  },
  check:{ type:"choice", react:"c",
    q:"Aさんは法令の試験に合格し、合格証を受け取りました。翌日から個人タクシーとして営業できる？",
    opts:[
      {t:"できる。合格証が営業の許可を兼ねている", n:"合格証は「試験に合格した」ことの証明で、営業の許可ではありません。"},
      {t:"まだできない。申請して許可を受け、営業開始の準備をしてから", n:""},
      {t:"まだできない。もう一度、申請後の試験に合格する必要がある", n:"新規許可で申請後に受ける試験は、現在の決まりではありません。事前試験の合格者として申請します。"}
    ], ans:1,
    why:"試験は4段階の1つめ。合格したら申請し、審査を経て許可を受け、その後に営業を始めます。",
    ok:"できたね！　『試験の先にも段階がある』って分かったら、今日の一歩はばっちり！",
    ng:"大丈夫、ここで気づけたら一歩前進！　正しい答えと解説を見て、もう一度選んでみよう。",
    src:["R01","R03"]
  },
  alight:{
    examples:["試験は4段階のうちの1つ。合格の後に申請・許可・営業開始がある","新規許可は、試験が先で申請が後"],
    next:[["r","入口がもう1つあるって聞いたけど……近道なのかな？"],["t","次回は「新規許可」と「譲渡譲受」、2つの入口を見比べましょう。"]]
  }
},
{
  id:2, title:"入口は2つ：新規許可と譲渡譲受", short:"2つの入口", goal:"新規許可と譲渡譲受の違いを、ひと言で説明できるようにする",
  ride:[
    ["k","個人タクシーを始める方法は一つだけ、と思っていないかな？"],
    ["t","実は入口が2つあります。新しく許可を受ける「新規許可」と、いま営業している個人タクシー事業者から事業を譲り受ける「譲渡譲受」です。"],
    ["k","では、それぞれの入口がいつ開いているのか。まずは予想してみよう。"]
  ],
  predict:{ type:"choice", react:"k",
    q:"特別区・武三交通圏で「新規許可」を申請できる時期は？",
    opts:[
      {t:"一年中いつでも", n:"「通年」なのは譲渡譲受の受付です。準特定地域の新規許可は、特例の取扱いで期間が決まっています。"},
      {t:"原則として毎年度、5月・9月・1月の決まった期間", n:""},
      {t:"5年に1回だけ", n:"そのような決まりはありません。受付は毎年度、年3回の期間です。"}
    ], ans:1,
    why:"特別区・武三は準特定地域に指定されています。そこでの新規許可は特例の取扱いで、原則として毎年度5月1日〜31日、9月1日〜30日、1月1日〜31日が受付期間です。具体的な期間は年度ごとの公示に書かれ、参入枠に達すると、それ以降の期間は受け付けません。",
    ok:"正解。では「なぜ期間と枠が決まっているのか」も言えるかな？　次の図で確かめよう。",
    ng:"迷うところだね。審査基準を読むと、準特定地域は特別な扱いなんだ。違いを見て、もう一度選んでみよう。",
    src:["R01","R10","R08"]
  },
  guide:{
    title:"2つの入口を並べてみる",
    html:`<table class="cmp">
<thead><tr><th></th><th>新規許可</th><th>譲渡譲受</th></tr></thead>
<tbody>
<tr><th>どんな手続き</th><td>新しく事業の許可を受ける（道路運送法第4条）</td><td>今の事業者から事業を譲り受け、認可を受ける（同第36条）</td></tr>
<tr><th>申請の受付</th><td>準特定地域の特例で、原則毎年度5月・9月・1月の各期間</td><td>通年</td></tr>
<tr><th>数の上限</th><td>年度ごとの参入枠。申請が枠を上回ればくじ引き</td><td>譲ってくれる事業者との契約が前提</td></tr>
<tr><th>試験</th><td>申請の前に事前試験に合格</td><td>事前試験の合格者として申請するか、申請後試験を受ける</td></tr>
<tr><th>本人の条件</th><td>審査基準Ⅰの条件</td><td>審査基準Ⅰの条件（受付時期の項を除く）。申請後試験なら、車庫は合格後の指定日までの確保でよい</td></tr>
</tbody></table>
<p class="callout">新規許可の特例を定めた公示には「2029年3月31日をもって廃止する」と書かれています。その後の新規許可の扱いは、${CHECKED}に確認した資料からは分かりません。そのときの公示で確かめましょう。</p>
<p class="note">譲渡する側にも条件があります（例：65歳以上80歳未満など）。譲渡する人が75歳以上80歳未満の場合、譲り受ける人は60歳以下であることが条件です。</p>`,
    src:["R01","R10","R13"], srcNote:"審査基準Ⅰ.12・Ⅳ.1、特例公示5・附則、譲渡譲受記入要領Ⅱ"
  },
  check:{ type:"choice", react:"r",
    q:"Bさんは譲渡譲受で開業したいと考えています。本人の条件のほかに、必ず必要になるものは？",
    opts:[
      {t:"譲渡する事業者と交わす譲渡譲受契約", n:""},
      {t:"参入枠のくじ引きに当たること", n:"参入枠とくじ引きは、新規許可の特例の話です。"},
      {t:"申請の前に新車を購入しておくこと", n:"申請書類には、譲渡譲受する車両の自動車検査証の記録事項などを付けます。新車の購入は条件ではありません。"}
    ], ans:0,
    why:"譲渡譲受の申請書には、譲渡人と譲受人が交わした譲渡譲受契約書の写しや、譲渡価格の明細書を添付します。相手がいて初めて成り立つ入口です。",
    ok:"やった！　相手がいて初めて成り立つ入口なんだね。オレもすっきりした！",
    ng:"オレもくじ引きと混ざってた。くじ引きは新規許可の話なんだって。違いを見て、もう一回！",
    src:["R13"]
  },
  alight:{
    examples:["新規許可は年3回の期間と参入枠。譲渡譲受は通年で、譲渡の契約が前提","特例の公示には2029/03/31の廃止規定。その先は公示で確認"],
    next:[["k","入口によって試験の時期が違うと言ったね。では、合格証に「期限」があるのは知っているかな？"]]
  }
},
{
  id:3, title:"試験はいつ受ける？　合格証の期限", short:"試験の時期", goal:"試験の時期と、合格証の期限の関係を知る",
  ride:[
    ["r","試験なんて、早く受けて合格しちゃえば、あとは楽でしょ？"],
    ["t","その気持ち、分かります。ただ、合格証には有効期限があるんです。"],
    ["r","えっ、期限!?　免許の更新みたいなもの？"]
  ],
  predict:{ type:"choice", react:"c",
    q:"事前試験の合格証の有効期限は、どうなっていると思う？",
    opts:[
      {t:"一度合格したら、ずっと有効", n:"期限があります。いつまでも使えるわけではありません。"},
      {t:"発行日から2年。ただし65歳に達する日の前日のほうが早ければ、その日まで", n:""},
      {t:"発行日から10年", n:"10年ではなく、2年（または65歳に達する日の前日）です。"}
    ], ans:1,
    why:"試験実施要領では、合格証の有効期限は「発行日から2年を経過する日」か「65歳に達する日の前日」のうち、早いほうです（審査基準Ⅰによる許可の場合）。申請日にこの期限が切れていると、合格者として扱われません。",
    ok:"正解、すごい！　期限を知っているだけで、計画がぐっと立てやすくなるよ。",
    ng:"予想が外れた問題ほど、よく覚えられるんだ。正しい答えを見て、もう一度いってみよう！",
    src:["R03","R02"]
  },
  guide:{
    title:"事前試験の時刻表",
    html:`<table class="timetable">
<thead><tr><th>受験の申込み</th><th>試験の実施</th></tr></thead>
<tbody>
<tr><td>4月1日〜5月31日</td><td class="big">7月</td></tr>
<tr><td>8月1日〜9月30日</td><td class="big">11月</td></tr>
<tr><td>12月1日〜1月31日</td><td class="big">3月</td></tr>
</tbody></table>
<p class="note">いずれも原則。実施日と場所は、試験日の1か月前までに関東運輸局報で公示されます。</p>
<ul>
<li><b>受験の条件は申込日の時点で見る</b>：第二種運転免許（普通・中型・大型）、65歳未満、運転経歴の要件（第4回で）。</li>
<li><b>試験の形</b>：○×方式と語群選択方式。40問・36点以上で合格・50分。タクシー業務適正化特別措置法の「特定指定地域」の試験は、同法の問題が5問加わり45問・41点以上・60分です。自分の区域の試験がどちらかは、受験するときに公示などで確かめます。</li>
<li><b>合格は受けた営業区域で使う</b>：申請する営業区域と受験した営業区域が違うと、合格者として扱われません。</li>
</ul>`,
    src:["R03","R02"], srcNote:"試験実施要領Ⅱ.1〜4・Ⅳ.2・別表1、細部取扱いⅠ.1"
  },
  check:{ type:"choice", react:"k",
    q:"Cさんは早めに事前試験に合格しました。でも、資金と車庫の準備にあと2年以上かかりそうです。何が起こりうる？",
    opts:[
      {t:"申請するころには合格証の期限が切れ、合格者として扱われないことがある", n:""},
      {t:"合格は、申請するまで自動で延長される", n:"自動で延長されるという決まりは、試験実施要領にはありません。"},
      {t:"申請はできないが、営業は始められる", n:"営業を始めるには許可が必要です。試験の合格だけでは営業できません（第1回）。"}
    ], ans:0,
    why:"合格証の期限は発行日から2年（または65歳に達する日の前日）。申請日に期限が切れていると合格者として扱われないため、「いつ受けるか」は「いつ申請するか」から逆算します。",
    ok:"その通り。では、もう一歩。受験の時期は、何から逆算すればいい？　そう、申請の予定日だね。",
    ng:"ここは迷いやすいところ。何が違ったのか、解説で確かめてから、もう一度選んでみよう。",
    src:["R03","R02"]
  },
  alight:{
    examples:["合格証の期限は2年（または65歳前日）。受験は申請の予定から逆算","合格は受けた営業区域で使う"],
    next:[["r","じゃあ、受験の条件の「運転経歴の要件」って、どう数えるの？"],["t","次回は40歳以上の経歴の条件を、制度の文章から読んでみましょう。自分に当てはめる判定は、まだしません。"]]
  }
},
{
  id:4, title:"40歳以上の経歴の条件を読む", short:"経歴の条件", goal:"審査基準の経歴の条件を、言葉どおりに読めるようにする",
  ride:[
    ["k","「タクシーを10年やったら申請できる」と聞いたことはないかな？"],
    ["t","よく聞く言い方ですね。でも、審査基準の文章はもう少し細かいんです。"],
    ["k","どこが細かいのか。文章を読む前に、まず予想してみよう。"]
  ],
  predict:{ type:"choice", react:"r",
    q:"申請時に40歳以上65歳未満の人。自動車の運転を職業とした期間が「10年以上」必要ですが、その10年はどの期間の中で数える？",
    opts:[
      {t:"申請日以前の25年間のうちで、合わせて10年以上", n:""},
      {t:"運転免許を取ってから今までの合計で10年以上", n:"期間の枠があります。申請日以前の25年間のうちで数えます。"},
      {t:"申請日の直前の10年間、ずっと続けて", n:"「続けて10年」は35歳未満の区分の条件です。40歳以上の区分は「25年間のうち10年以上」です。"}
    ], ans:0,
    why:"審査基準の別表2では、40歳以上65歳未満の区分は「申請日以前25年間のうち、自動車の運転を専ら職業とした期間が10年以上」とされています。",
    ok:"おっ、正解！　オレは『免許を取ってから』だと思ってた。読み方が分かるとすっきりするね。",
    ng:"オレも同じところで迷った！　25年という枠があるんだって。違いを見て、もう一回いこう。",
    src:["R01"]
  },
  guide:{
    title:"40歳以上65歳未満の区分を分解する",
    html:`<div class="four">
<section><h4>条件1：運転を職業とした期間</h4><p>申請日以前25年間のうち10年以上。タクシーやバスなど一般旅客自動車運送事業用の車以外（たとえばトラック）を運転した期間は、50%に換算します。例：4年なら2年として数えます。</p></section>
<section><h4>条件2：この区域でのタクシー経験</h4><p>申請する営業区域で、申請日以前3年以内に2年以上、タクシー・ハイヤーの運転を職業としていたこと。</p></section>
<section><h4>数えない期間の例</h4><p>通勤やレジャーでの運転、運転と他の業務を兼ねていた期間、会社の役員などを兼ねていた期間は、運転経歴に含みません。</p></section>
<section><h4>あわせて見られること</h4><p>申請日以前3年間に道路交通法の違反や免許停止がないこと（例外あり）、5年間に一定の処分を受けていないこと。</p></section>
</div>
<p><b>証明に使う書類の例</b>：在職証明書（採用・退職日、休職期間、月当たりの勤務日数、事業所・職種ごとの期間などを記載）、乗務員台帳の写し、特別区・武三では運転者登録原簿の謄本、社会保険の加入期間の証明。</p>
<p class="callout">ここで身につけるのは「読み方」です。自分が条件を満たすかどうかは、受験や申請の時期が具体的になってから、証明資料をそろえて確かめます。</p>`,
    src:["R01","R07"], srcNote:"審査基準Ⅰ.3・Ⅰ.4・別表2、許可申請記入要領Ⅰ《4ページ》・Ⅱ.5"
  },
  check:{ type:"choice", react:"k",
    q:"○か×か。「タクシー会社に在籍していた期間なら、休職していた期間も含めて、そのまま運転経歴として数えられる」",
    opts:[
      {t:"○　在籍していれば数えられる", n:"「在籍」と「運転を職業としていた」は別の言葉です。"},
      {t:"×　在籍と、運転を職業としていた期間は同じとは限らない", n:""}
    ], ans:1,
    why:"審査基準が見ているのは「自動車の運転を専ら職業とした期間」です。在職証明書には休職期間や月当たりの勤務日数も書く決まりがあり、実際に運転を職業としていたかが確かめられます。",
    ok:"そう。『在籍』と『運転していた』は別の言葉なんだ。言葉の違いに気づけたね。",
    ng:"惜しい。言葉の違いに注目すると見えてくるよ。解説を読んで、もう一度選んでみよう。",
    src:["R01","R07"]
  },
  alight:{
    examples:["40歳以上は「25年間のうち10年以上」＋「この区域で3年以内に2年以上」","在籍期間＝運転経歴とは限らない。証明は在職証明書など"],
    next:[["c","条文を読むの、ちょっと慣れてきたんじゃない？　それだけで大きな前進！"],["c","次はお金と場所の話。「自己資金」はどれくらい必要か、予想しておいてね！"]]
  }
},
{
  id:5, title:"お金と、営業所・車庫・車両の条件", short:"お金と場所", goal:"申請で見られる「お金・営業所・車庫・車両」の項目を知る",
  ride:[
    ["c","今日はお金と場所の話！　数字がいくつか出てくるけど、全部覚えなくて大丈夫だよ。"],
    ["t","はい。今日は「どんな項目があるか」を知る回です。金額の計画は、資金のステージでじっくりやります。"],
    ["c","まずは直感で予想してみよう！"]
  ],
  predict:{ type:"choice", react:"k",
    q:"申請では、開業に必要な資金（所要資金）に対して、自己資金がどれくらい求められる？",
    opts:[
      {t:"所要資金の50%以上", n:"半分では足りません。審査基準は100%以上です。"},
      {t:"所要資金の100%以上を、申請日以降いつも確保しておく", n:""},
      {t:"自己資金はなくてよい。借入れでまかなえればよい", n:"自己名義の預貯金などで、所要資金の100%以上を確保していることが求められます。"}
    ], ans:1,
    why:"審査基準では、所要資金の100%以上の自己資金（自己名義の預貯金等）が、申請日以降常に確保されていることが条件です。",
    ok:"正解。では、家族名義の預金は自己資金に入るかな？　次の図で確かめよう。",
    ng:"意外だったかな。審査基準では100%以上、しかも申請日以降ずっとなんだ。図を見てから、もう一度選んでみよう。",
    src:["R01"]
  },
  guide:{
    title:"申請で見られる4つの持ち物",
    html:`<div class="four">
<section><h4>資金</h4><p>所要資金＝設備資金（原則80万円以上）＋運転資金（80万円以上）＋車庫の資金＋保険料1年分。その100%以上を自己名義の預貯金などで、申請日以降いつも確保。家族名義の預貯金や現金は資料になりません。任意保険は対人8,000万円以上・対物200万円以上。</p></section>
<section><h4>営業所</h4><p>住居と営業所が同じであること。申請する営業区域の中に、現に住んでいること。使う権利（持ち家・賃貸など）があること。</p></section>
<section><h4>車庫</h4><p>営業区域の中で、営業所から直線2km以内。車全体が入り、1年以上使う権利があること。前面の道路との関係で出入りに支障がないこと（私道は原則、通行の承認）。</p></section>
<section><h4>車両</h4><p>使う権利（購入・リース・自己所有）があること。電子地図の表示、車の位置の表示、目的地までの経路案内ができる機器を備えること。</p></section>
</div>
<p class="callout">先生からひとこと：条件を先に知っておくと、引っ越しや貯金の計画で迷いにくくなります。契約や購入は、申請の時期が見えてから比べれば間に合います。</p>`,
    src:["R01","R07"], srcNote:"審査基準Ⅰ.5〜8、許可申請記入要領Ⅰ《6ページ》・Ⅱ.10"
  },
  check:{ type:"choice", react:"r",
    q:"Dさんは、自宅から直線で3km離れた場所に、安くて広い駐車場を見つけました。自宅を営業所にする場合、ここを車庫にできる？",
    opts:[
      {t:"できない。営業所から直線2km以内であることが条件", n:""},
      {t:"できる。営業区域の中ならどこでもよい", n:"区域内であることに加えて、営業所からの距離の条件があります。"},
      {t:"できる。広ければ距離は問われない", n:"広さ（車全体が入ること）と距離は、別々の条件です。"}
    ], ans:0,
    why:"車庫は、申請する営業区域の中にあり、営業所から直線で2km以内であることが条件です。安さや広さだけでは決められません。",
    ok:"おっ、正解！　安さだけで決めなくてよかった〜。オレも覚えとこ。",
    ng:"オレも『区域内ならOK』だと思った！　距離の条件があるんだね。違いを見て、もう一回いこう。",
    src:["R01"]
  },
  alight:{
    examples:["自己資金は所要資金の100%以上を申請日以降ずっと。自己名義で","車庫は営業所から直線2km以内。営業所＝住居"],
    next:[["r","書類って、今のうちに全部そろえておけば安心だよね？"],["t","次回、このステージの最終回でそこを確かめます。"]]
  }
},
{
  id:6, title:"いつ、何を準備する？", short:"準備の時期", goal:"今やることと、申請の直前にやることを分ける",
  ride:[
    ["r","書類って、今のうちに全部取っておけば安心だよね！"],
    ["t","実は、早すぎると使えない書類があるんです。申請日から逆算して取る書類ですね。"],
    ["k","では、どの書類がどれくらい前なら使えるのか。予想から始めよう。"]
  ],
  predict:{ type:"choice", react:"k",
    q:"新規許可の申請に付ける「運転記録証明書」（自動車安全運転センター発行）。いつ発行されたものが必要？",
    opts:[
      {t:"申請日前3週間以内に発行されたもの", n:""},
      {t:"申請日前1年以内に発行されたもの", n:"1年では長すぎます。運転記録証明書はとくに短く、3週間以内です。"},
      {t:"発行日はいつでもよい", n:"発行日の条件があります。古いものは使えません。"}
    ], ans:0,
    why:"許可申請の記入要領では、運転記録証明書は「申請日前3週間以内に発行されたもので、過去5年間の記録を証明するもの」とされています。",
    ok:"正解。どうしてこんなに短いのか、考えてみたかな？　直前の記録を確かめるため、と考えると覚えやすいよ。",
    ng:"ここは意外なところ。正しい答えと違いを見て、もう一度選んでみよう。",
    src:["R07"]
  },
  guide:{
    title:"準備のタイムライン",
    html:`<ul class="when">
<li><b>いま（希望の時期が決まる前）</b>法令・お金・条件の基礎を少しずつ学ぶ。転職や事業所の変更などで、職歴の記録が散らばりそうなときは、記録の取り方や所在を確かめておく。</li>
<li><b>希望の時期が決まったら<span class="tag">目安：6〜12か月前</span></b>経歴・資金・住まいを証明資料で整理し、その時点の制度と照らし合わせる。受験の申込時期を、申請の予定から逆算する。</li>
<li><b>申請の直前<span class="tag">発行日の条件あり</span></b>運転記録証明書は申請日前3週間以内。戸籍抄本・住民票・運転適性診断票は申請日前3か月以降。試験合格証の写しは申請日前2年以降の発行。その他の挙証資料は原則、申請日前4か月以降（免許、通帳、契約書、退職した会社の在職証明書などは例外）。</li>
<li><b>許可の後</b>許可等の日から4か月以内に事業を開始する。具体的な準備は「開業準備」のステージで。</li>
</ul>
<p class="note">「6〜12か月前」は、この教材の作業上の目安で、制度の期限ではありません。書類の発行時期は新規許可の記入要領によるもので、譲渡譲受は対応する要領で確かめます。</p>`,
    src:["R07","R01"], srcNote:"許可申請記入要領Ⅱ.1〜16、審査基準Ⅲ.2(13)"
  },
  check:{ type:"sort", react:"c",
    q:"5枚のカードを、それぞれ「いつやるか」で仕分けてください。",
    bins:["いま","希望の時期が決まったら","申請の直前"],
    cards:[
      {t:"法令の基礎を、10分ずつ学ぶ", b:0, w:"知識は今から少しずつ積み上げられます。"},
      {t:"転職するので、前の会社の在職記録の取り方を確かめておく", b:0, w:"記録が散らばる前に、取り方や所在を確かめておくと安心です。証明書そのものは後で取ります。"},
      {t:"運転記録証明書を取る", b:2, w:"申請日前3週間以内の発行が必要です。早く取ると使えません。"},
      {t:"住民票を取る", b:2, w:"申請日前3か月以降の発行が必要です。"},
      {t:"経歴を証明資料で整理し、その時点の制度と照らし合わせる", b:1, w:"制度は変わることがあるので、時期が決まってから最新の制度で確かめます。"}
    ],
    ok:"全部正解！　『いつやるか』が見えると、焦らなくていいね！",
    ng:"仕分けは迷って当たり前。赤いカードの説明を見て、もう一度選んでみよう！",
    src:["R07"]
  },
  alight:{
    examples:["今は学ぶ・記録の所在を確かめる。証明書は申請日から逆算して取る","運転記録証明書は申請日前3週間以内"],
    finale:true,
    next:[
      ["t","6回で、開業までの地図がそろいました。"],
      ["r","次のステージは試験か。オレ、法令の言葉にもっと慣れたいな。"],
      ["k","分からないことは「後で確かめること」として書き残せたら十分だよ。"],
      ["c","2週間、おつかれさま！　ステージ1、クリアだね！"]
    ]
  }
}
];


/* ---------- 回の文章を「項目」の言い方に直す（もとのテンプレートは変えない） ---------- */
const REWORD = [
  ["（第2回で）","（「入口は2つ」の項目で）"],
  ["（第4回で）","（「40歳以上の経歴の条件を読む」の項目で）"],
  ["（第1回）","（「開業までの道のりは4段階」の項目）"],
  ["この先の「試験」「資金」「営業所・車庫・車両」のステージは、主に段階1と2の中身です。今日は全体の形だけ持ち帰れば十分です。","分類1（開業準備）と分類2（試験）の項目は、主に段階1と2の中身です。ここでは全体の形だけ持ち帰れば十分です。"],
  ["今日は「どんな項目があるか」を知る回です。金額の計画は、資金のステージでじっくりやります。","ここでは「どんな項目があるか」を知りましょう。金額の計画は、別の項目で扱います（準備中）。"],
  ["具体的な準備は「開業準備」のステージで。","具体的な準備は、分類1の「許可・認可の後から営業開始まで」で扱います（準備中）。"],
  ["法令の基礎を、10分ずつ学ぶ","法令の基礎を、少しずつ学ぶ"],
  ["今日は開業までの地図を広げてみましょう。","ここで開業までの地図を広げてみましょう。"],
  ["今日はお金と場所の話！","ここはお金と場所の話！"]
];
(function walk(o){ for(const k in o){ const v=o[k]; if(typeof v==="string"){ let t=v; REWORD.forEach(([a,b])=>{ t=t.split(a).join(b); }); o[k]=t; } else if(v && typeof v==="object") walk(v); } })(SESSIONS);

/* ---------- 4つの分類と項目（2026/10/22 v03：分類別に進める形へ組み直し） ---------- */
const CATS = [
  { n:0, name:"開業に向けて大まかに知っておくこと", short:"全体像", desc:"開業までの道のり・入口・準備の時期" },
  { n:1, name:"開業準備", short:"開業準備", desc:"経歴・資金・営業所と車庫・書類・許可後の準備" },
  { n:2, name:"試験", short:"試験", desc:"試験の時期と形式、出題される法令" },
  { n:3, name:"実際の経営", short:"経営", desc:"開業後のお金の管理と記録" }
];
/* sid：既存の回（SESSIONS）の中身を使う項目。sidなし＝準備中 */
const ITEMS = [
  { id:"0-1", cat:0, sid:1 },
  { id:"0-2", cat:0, sid:2 },
  { id:"0-3", cat:0, sid:6 },
  { id:"1-1", cat:1, sid:4 },
  { id:"1-2", cat:1, sid:5 },
  { id:"1-3", cat:1, title:"申請書類の種類と相談の順番" },
  { id:"1-4", cat:1, title:"許可・認可の後から営業開始まで" },
  { id:"2-1", cat:2, sid:3 },
  { id:"2-2", cat:2, title:"道路運送法の入口（許可・認可・届出）" },
  { id:"2-3", cat:2, title:"運輸規則と日々の運行・記録" },
  { id:"2-4", cat:2, title:"運送の引受け・拒否" },
  { id:"2-5", cat:2, title:"道路運送車両法・点検整備・事故報告" },
  { id:"2-6", cat:2, title:"タクシー業務適正化特別措置法" },
  { id:"2-7", cat:2, title:"運賃・料金・運送約款" },
  { id:"3-1", cat:3, title:"毎月の費用と家計の分け方" },
  { id:"3-2", cat:3, title:"記帳と収支の管理" }
];
ITEMS.forEach(it => { const s = it.sid && SESSIONS.find(x=>x.id===it.sid); if(s){ it.title = s.title; it.short = s.short; it.goal = s.goal; } it.ready = !!s; });
/* 読むおすすめの順番（もとの第1〜6回の順）。項目を公開したらここにも足す */
const ORDER = ["0-1","0-2","2-1","1-1","1-2","0-3"];
/* 公開中の項目をおすすめの順番に並べる（ORDERにない項目は後ろに分類順で） */
const readyInOrder = () => ORDER.map(id=>ITEMS.find(x=>x.id===id)).filter(x=>x && x.ready).concat(ITEMS.filter(x=>x.ready && !ORDER.includes(x.id)));

/* ---------- 覚えるカード（回ごと。根拠は案件フォルダの公式原本で2026/10/22に本文確認） ---------- */
const CARDS = {
  1:[
    { id:"c1-1", q:"新規許可で開業するまでの4段階の順番は？", a:"①事前試験に合格 → ②許可を申請 → ③審査を経て許可 → ④営業開始", src:["R03","R02"] },
    { id:"c1-2", q:"許可を受けてから、事業を始めるまでの期限は？", a:"許可等の日から4か月以内", src:["R01"] },
    { id:"c1-3", q:"事前試験の受験の条件は、いつの時点で見られる？", a:"受験を申し込む日の時点", src:["R03"] }
  ],
  2:[
    { id:"c2-1", q:"特別区・武三の新規許可の申請受付（原則）は？", a:"毎年度 5月・9月・1月の各1か月。参入枠に達すると、それ以降の期間は受け付けない", src:["R10"] },
    { id:"c2-2", q:"譲渡譲受の申請受付は？", a:"通年", src:["R01"] },
    { id:"c2-3", q:"譲渡する人が75歳以上80歳未満のとき、譲り受ける人の条件は？", a:"60歳以下", src:["R01"] }
  ],
  3:[
    { id:"c3-1", q:"合格証の有効期限は？", a:"発行日から2年を経過する日と、65歳に達する日の前日の、早いほう", src:["R03"] },
    { id:"c3-2", q:"事前試験の申込期間と実施月（原則）は？", a:"4/1〜5/31 → 7月、8/1〜9/30 → 11月、12/1〜1/31 → 3月", src:["R03"] },
    { id:"c3-3", q:"試験の形と合格基準（特定指定地域以外）は？", a:"○×方式と語群選択方式。40問・36点以上・50分（特定指定地域は45問・41点以上・60分）", src:["R03"] }
  ],
  4:[
    { id:"c4-1", q:"40歳以上65歳未満：運転を職業とした期間の条件は？", a:"申請日以前25年間のうち10年以上", src:["R01"] },
    { id:"c4-2", q:"40歳以上65歳未満：この区域でのタクシー経験の条件は？", a:"申請する営業区域で、申請日以前3年以内に2年以上", src:["R01"] },
    { id:"c4-3", q:"タクシー・バスなど以外の車（トラック等）を運転した期間の数え方は？", a:"50％に換算する（例：4年なら2年）", src:["R01"] }
  ],
  5:[
    { id:"c5-1", q:"自己資金の条件は？", a:"所要資金の100％以上を、自己名義の預貯金等で、申請日以降いつも確保", src:["R01"] },
    { id:"c5-2", q:"所要資金のうち、設備資金と運転資金は？", a:"設備資金80万円以上（例外あり）、運転資金80万円以上。これに車庫の資金と保険料1年分を足す", src:["R01"] },
    { id:"c5-3", q:"車庫の距離の条件は？", a:"営業区域の中で、営業所から直線2km以内", src:["R01"] }
  ],
  6:[
    { id:"c6-1", q:"運転記録証明書は、いつ発行されたものが必要？", a:"申請日前3週間以内（過去5年間の記録を証明するもの）", src:["R07"] },
    { id:"c6-2", q:"戸籍抄本・住民票・運転適性診断票は？", a:"申請日前3か月以降に発行されたもの", src:["R07"] },
    { id:"c6-3", q:"その他の挙証資料（原則）は？", a:"申請日前4か月以降に発行されたもの（運転免許・通帳・契約書などは例外）", src:["R07"] }
  ]
};

/* ---------- ○×問題（まぎらわしいところ。sid：関係する項目の回） ---------- */
const OX = [
  { id:"t1-1", sid:1, kind:"申請", q:"法令試験の合格証があれば、個人タクシーの営業を始められる。", ans:false, why:"合格証は試験に合格した証明で、営業の許可ではありません。申請して許可を受け、その後に営業を始めます。", src:["R01","R03"] },
  { id:"t1-2", sid:1, kind:"試験", q:"新規許可は、事前試験に合格してから申請する。", ans:true, why:"2026年4月1日以降に受け付ける申請では、申請後に受ける試験の対象は譲渡譲受と相続だけです。新規許可は事前試験の合格者として申請します。", src:["R03","R02"] },
  { id:"t1-3", sid:3, kind:"試験", q:"合格証は、一度もらえば何年後の申請でも使える。", ans:false, why:"発行日から2年を経過する日か、65歳に達する日の前日の早いほうまでです。受験の時期は申請の予定から逆算します。", src:["R03"] },
  { id:"t1-4", sid:4, kind:"申請", q:"タクシー会社に在籍していた期間は、休職中も含めてそのまま運転経歴になる。", ans:false, why:"見られるのは「自動車の運転を専ら職業とした期間」です。在職証明書には休職期間や月当たりの勤務日数も書きます。", src:["R01","R07"] },
  { id:"t1-5", sid:5, kind:"申請", q:"家族名義の預金も、自己資金として示せる。", ans:false, why:"自己名義の預貯金等で、所要資金の100％以上を申請日以降いつも確保していることが条件です。", src:["R01","R07"] },
  { id:"t1-6", sid:6, kind:"申請", q:"住民票は、今のうちに取っておけば申請に使える。", ans:false, why:"住民票は申請日前3か月以降の発行が必要です。証明書の多くは申請日から逆算して取ります。", src:["R07"] }
];

/* ============================================================
   v03（2026/10/22）：「学ぶ」（分類→項目を読む・覚える）と
   「クイズ」（問題だけ）を別の画面にした。保存はアプリ側に任せる
   ============================================================ */
const fresh = () => ({ v:3, read:{}, cards:{}, q:{}, lastItem:null, last:null });
let S = fresh(), OPT = {};
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){ try{ OPT.save && OPT.save(JSON.parse(JSON.stringify(S))); }catch(e){} }
function changed(){ try{ OPT.onChange && OPT.onChange(); }catch(e){} }

/* 旧版（v02：回ごとの記録）からの引き継ぎ */
function migrate(st){
  st = st || {};
  if(st.v === 3) return Object.assign(fresh(), st);
  const n = fresh();
  Object.keys(st.done||{}).forEach(sid => { const it = ITEMS.find(x=>x.sid===+sid); if(it) n.read[it.id] = Date.now(); });
  Object.keys(st.ans||{}).forEach(k => { const a = st.ans[k]; if(a) n.q[k] = { first:a.first, tries:a.tries||1, last:a.last, miss:a.first===false && a.last!==true, t:Date.now() }; });
  n.cards = Object.assign({}, st.cards||{});
  if(st.cur){ const it = ITEMS.find(x=>x.sid===st.cur.id); if(it) n.lastItem = it.id; }
  return n;
}

/* ---------- 共通の部品 ---------- */
function face(sp){ return `<div class="face" data-sp="${sp}"><img src="${IMG[sp]}" alt="${esc(CAST[sp].alt)}" width="64" height="64"><b>${CAST[sp].name}</b></div>`; }
function line(sp, text, right){ return `<div class="line${right?" right":""}">${face(sp)}<div class="bubble">${esc(text)}</div></div>`; }
function talk(lines){ return `<div class="talk">${lines.map(([sp,t])=>line(sp,t, sp!=="t")).join("")}</div>`; }
const CARD_CHECKED = "2026/10/22";
function srcLine(ids, extra, date){
  const parts = ids.map(id => `<a href="${SRC[id].u}" target="_blank" rel="noopener">${esc(SRC[id].n)}</a>`);
  return `<div class="src">根拠：${parts.join("／")}${extra?`（${esc(extra)}）`:""}。確認日 ${date||CHECKED}。</div>`;
}
const itemById = id => ITEMS.find(x=>x.id===id);
const catOf = n => CATS.find(c=>c.n===n);
const sessionOf = it => it && it.sid ? SESSIONS.find(s=>s.id===it.sid) : null;
const cardsOf = it => it && it.sid ? (CARDS[it.sid]||[]) : [];
const shuffle = a => a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);

/* 問題の一覧（項目ごと：予想・確認の2問＋○×） */
const QS = [];
ITEMS.forEach(it => {
  const s = sessionOf(it); if(!s) return;
  QS.push({ qid:`s${s.id}p`, item:it.id, cat:it.cat, q:s.predict });
  QS.push({ qid:`s${s.id}c`, item:it.id, cat:it.cat, q:s.check });
  OX.filter(o=>o.sid===s.id).forEach(o => QS.push({ qid:o.id, item:it.id, cat:it.cat, q:{ type:"ox", q:o.q, ans:o.ans, why:o.why, kind:o.kind, src:o.src, react:"k" } }));
});
const isMiss = qid => S.q[qid] && S.q[qid].miss;
const isTried = qid => !!S.q[qid];

/* ---------- 進み具合（アプリ側からも使う） ---------- */
function progressOf(state){
  const st = migrate(state);
  const cats = CATS.map(c => {
    const its = ITEMS.filter(i=>i.cat===c.n), ready = its.filter(i=>i.ready);
    const cs = ready.flatMap(cardsOf), qs = QS.filter(q=>q.cat===c.n);
    return { n:c.n, name:c.name, short:c.short, items:its.length, ready:ready.length,
      read:ready.filter(i=>st.read[i.id]).length,
      cards:cs.length, known:cs.filter(x=>st.cards[x.id]&&st.cards[x.id].k).length,
      qs:qs.length, tried:qs.filter(q=>st.q[q.qid]).length, firstOk:qs.filter(q=>st.q[q.qid]&&st.q[q.qid].first===true).length,
      miss:qs.filter(q=>st.q[q.qid]&&st.q[q.qid].miss).length };
  });
  const sum = k => cats.reduce((a,c)=>a+c[k],0);
  return { cats, total:{ items:sum("items"), ready:sum("ready"), read:sum("read"), cards:sum("cards"), known:sum("known"), qs:sum("qs"), tried:sum("tried"), firstOk:sum("firstOk"), miss:sum("miss") }, next:nextItemOf(st) };
}
function nextItemOf(st){
  if(st.lastItem && !st.read[st.lastItem] && itemById(st.lastItem) && itemById(st.lastItem).ready) return { id:st.lastItem, resume:true };
  const id = ORDER.find(i=>!st.read[i]);
  return id ? { id, resume:false } : null;
}

/* ============================================================
   学ぶ
   ============================================================ */
let L = null;               // { root, view:"list"|"item", id, deck }
function renderLearn(){
  if(!L) return;
  if(L.view === "item") return renderItem();
  if(L.view === "cards") return renderCardReview();
  const nx = nextItemOf(S); const P = progressOf(S);
  const allCards = ITEMS.filter(i=>i.ready).flatMap(cardsOf);
  const known = allCards.filter(c=>S.cards[c.id]&&S.cards[c.id].k).length;
  let top;
  if(nx){ const it = itemById(nx.id);
    top = `<div class="lnext"><div class="l">${nx.resume?"続きから":"次に読む"}</div><div class="t">${esc(it.title)}</div><div class="s">${esc(catOf(it.cat).short)}・読む → 覚えるカード${cardsOf(it).length}枚</div>
      <div class="acts"><button class="btn btn-primary" data-act="open" data-id="${it.id}">読む</button>${allCards.length?`<button class="btn btn-ghost" data-act="cardreview">カードの復習（覚えた ${known}/${allCards.length}）</button>`:""}</div></div>`;
  } else {
    top = `<div class="lnext"><div class="l">公開中の項目は読み終えました</div><div class="t">カードとクイズで仕上げましょう</div><div class="s">準備中の項目は順に追加します</div>
      <div class="acts">${allCards.length?`<button class="btn btn-primary" data-act="cardreview">カードの復習（覚えた ${known}/${allCards.length}）</button>`:""}<button class="btn btn-ghost" data-act="toquiz">クイズへ</button></div></div>`;
  }
  const catHtml = c => {
    const p = P.cats[c.n]; const its = ITEMS.filter(i=>i.cat===c.n);
    const pct = p.ready ? Math.round(p.read/p.ready*100) : 0;
    const rows = its.map(it => {
      if(!it.ready) return `<li class="li ns"><span class="st" aria-hidden="true"></span><span class="tt">${esc(it.title)}</span><span class="tag">準備中</span></li>`;
      const rd = !!S.read[it.id]; const cs = cardsOf(it); const kn = cs.filter(x=>S.cards[x.id]&&S.cards[x.id].k).length;
      const cur = !rd && nx && nx.id===it.id;
      return `<li><button class="li${rd?" rd":""}${cur?" cur":""}" data-act="open" data-id="${it.id}"><span class="st" aria-hidden="true">${rd?"✓":""}</span><span class="tt">${esc(it.title)}</span><span class="meta">${rd?"読んだ":"未読"}・カード ${kn}/${cs.length}</span></button></li>`;
    }).join("");
    return `<section class="lcat" data-cat="${c.n}"><div class="lch"><span class="no">${c.n}</span><div class="nm"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div>
      <div class="pr"><b>${p.read}</b>/${p.ready}<small>読んだ${p.items>p.ready?`・準備中 ${p.items-p.ready}`:""}</small></div></div>
      <div class="lbar"><i style="width:${pct}%"></i></div><ul class="lis">${rows}</ul></section>`;
  };
  L.root.innerHTML = `<div class="klq klearn"><div class="kapp2">${top}${CATS.map(catHtml).join("")}
    <div class="kfoot"><p>関東運輸局の公示などをもとに作った非公式の教材です。個人の受験資格や申請できる日を判定するものではありません。会話は教材用の創作です。</p><div class="btn-row"><button class="btn btn-ghost" data-act="sources">根拠資料の一覧</button></div></div></div></div>`;
}
function openItem(id){
  const it = itemById(id); if(!it || !it.ready) return;
  L.view = "item"; L.id = id; L.deck = null;
  S.lastItem = id; S.last = Date.now(); save();
  renderItem(); scrollTop(L.root);
}
function renderItem(){
  const it = itemById(L.id), s = sessionOf(it), g = s.guide, c = catOf(it.cat);
  const cs = cardsOf(it);
  if(!L.deck) L.deck = { q: cs.filter(x=>!(S.cards[x.id]&&S.cards[x.id].k)).map(x=>x.id).concat(cs.filter(x=>S.cards[x.id]&&S.cards[x.id].k).map(x=>x.id)), flipped:false, all:cs.length, done:0 };
  const qn = QS.filter(q=>q.item===it.id).length;
  const sib = readyInOrder(); const i = sib.indexOf(it);
  const prev = sib[i-1], next = sib[i+1];
  const rd = !!S.read[it.id];
  L.root.innerHTML = `<div class="klq klearn"><div class="kapp2 item">
    <div class="ibar"><button class="btn btn-ghost btn-s" data-act="list">← 学ぶ</button><span class="crumb">${c.n}. ${esc(c.short)}</span></div>
    <h2 class="screen-title">${esc(it.title)}</h2>
    <p class="goal"><b>この項目で</b>${esc(it.goal||"")}</p>
    ${talk(s.ride.slice(0,2))}
    <h3 class="isec"><span>1</span>読む</h3>
    <div class="kguide"><h3>${esc(g.title)}</h3>${g.html}${srcLine(g.src, g.srcNote)}</div>
    <h3 class="isec"><span>2</span>覚えるカード<small>${cs.length}枚</small></h3>
    <p class="lead">表を見て答えを思い浮かべてから、めくります。覚えていなければ「もう一度」。</p>
    <div class="deck"></div>
    <h3 class="isec"><span>3</span>確かめる</h3>
    <div class="idone">
      <button class="btn ${rd?"btn-ghost":"btn-primary"}" data-act="markread">${rd?"✓ 読んだ（取り消す）":"読み終えた"}</button>
      <button class="btn btn-ghost" data-act="itemquiz" data-id="${it.id}">この項目のクイズ（${qn}問）</button>
    </div>
    <div class="inav">${prev?`<button class="btn btn-ghost btn-s" data-act="open" data-id="${prev.id}">← ${esc(prev.short||prev.title)}</button>`:"<span></span>"}${next?`<button class="btn btn-ghost btn-s" data-act="open" data-id="${next.id}">${esc(next.short||next.title)} →</button>`:""}</div>
  </div></div>`;
  renderDeck(L.root.querySelector(".deck"), L.deck);
}
function renderDeck(box, d){
  if(!box) return;
  if(!d.q.length){
    box.innerHTML = `<div class="fcard done-all"><div class="fq">全部覚えた！</div></div><div class="talk">${line("c","ばっちり！　忘れたころにカードの復習をすると、ぐっと残るよ。",true)}</div>`;
    return;
  }
  const c = cardById(d.q[0]);
  box.innerHTML = `<div class="deck-prog">あと ${d.q.length}枚</div>
  <div class="fcard${d.flipped?" flipped":""}"><div class="fq"><span class="ftag">Q</span>${esc(c.q)}</div>${d.flipped?`<div class="fa"><span class="ftag a">A</span>${esc(c.a)}</div>${srcLine(c.src,"",CARD_CHECKED)}`:""}</div>
  <div class="btn-row">${d.flipped?`<button class="btn btn-ok" data-act="know">○ 覚えた</button><button class="btn btn-again" data-act="again">もう一度</button>`:`<button class="btn btn-primary" data-act="flip">めくる</button>`}</div>`;
}
function cardById(id){ for(const k in CARDS){ const c=CARDS[k].find(x=>x.id===id); if(c) return c; } return null; }
function onCard(act){
  const d = L.deck; if(!d || !d.q.length) return;
  if(act==="flip"){ d.flipped = true; return renderDeck(L.root.querySelector(".deck"), d); }
  const id = d.q.shift();
  if(act==="know") S.cards[id] = { k:true, t:Date.now() };
  else { S.cards[id] = { k:false, t:Date.now() }; d.q.push(id); }
  d.flipped = false; save(); renderDeck(L.root.querySelector(".deck"), d); changed();
}
function startCardReview(){
  const all = ITEMS.filter(i=>i.ready).flatMap(cardsOf); if(!all.length) return;
  const weak = all.filter(c=>!(S.cards[c.id]&&S.cards[c.id].k)).map(c=>c.id);
  const rest = shuffle(all.filter(c=>!weak.includes(c.id)).map(c=>c.id));
  L.view = "cards"; L.deck = { q: weak.concat(rest).slice(0, Math.max(6, weak.length)), flipped:false };
  renderCardReview(); scrollTop(L.root);
}
function renderCardReview(){
  L.root.innerHTML = `<div class="klq klearn"><div class="kapp2 item"><div class="ibar"><button class="btn btn-ghost btn-s" data-act="list">← 学ぶ</button><span class="crumb">カードの復習</span></div>
  <h2 class="screen-title">思い出してみよう</h2><p class="lead">まだ覚えていないカードから出ます。</p><div class="deck"></div></div></div>`;
  renderDeck(L.root.querySelector(".deck"), L.deck);
}
function renderSourcesIn(el, back){
  el.innerHTML = `<div class="klq klearn"><div class="kapp2 item"><div class="ibar"><button class="btn btn-ghost btn-s" data-act="${back}">← 戻る</button><span class="crumb">根拠資料</span></div>
  <h2 class="screen-title">根拠資料の一覧</h2>
  <p class="lead">説明・カード・問題の正答は、次の公式資料に基づいています（説明と予想・確認の問題は${CHECKED}、カードと○×は${CARD_CHECKED}に確認）。資料は改正されることがあるため、受験・申請の前には最新版を確認してください。</p>
  <div class="kpanel"><ol class="srclist">${Object.values(SRC).map(x=>`<li><a href="${x.u}" target="_blank" rel="noopener">${esc(x.n)}</a><br><span class="note">${esc(x.d)}</span></li>`).join("")}</ol></div>
  <div class="kpanel"><h3>この教材で扱わないこと</h3><p>個人の受験資格・申請できる日・資金額の判定、具体的な試験日程、2029年4月以降の新規許可の扱い。クイズの問題はすべてオリジナルで、試験の過去問ではありません。</p></div></div></div>`;
}
function onLearnClick(e){
  const b = e.target.closest("[data-act]"); if(!b || !L || !L.root.contains(b)) return;
  const a = b.dataset.act;
  if(a==="open") openItem(b.dataset.id);
  else if(a==="list"){ L.view="list"; renderLearn(); scrollTop(L.root); }
  else if(a==="flip"||a==="know"||a==="again") onCard(a);
  else if(a==="markread"){ if(S.read[L.id]) delete S.read[L.id]; else S.read[L.id]=Date.now(); save(); changed(); renderItem(); }
  else if(a==="itemquiz"){ try{ OPT.onGoQuiz && OPT.onGoQuiz({ item:b.dataset.id }); }catch(err){} }
  else if(a==="toquiz"){ try{ OPT.onGoQuiz && OPT.onGoQuiz({}); }catch(err){} }
  else if(a==="cardreview") startCardReview();
  else if(a==="sources"){ L.view="src"; renderSourcesIn(L.root,"list"); scrollTop(L.root); }
}

/* ============================================================
   クイズ（問題だけ）
   ============================================================ */
let Z = null;   // { root, $app, scope:{cat:null|n}, run }
function quizShell(){
  Z.root.innerHTML = `<div class="klq"><div class="meter"><div class="lamp" data-mode="vacant" aria-live="polite">待機中</div><div class="meter-info"><div class="meter-title">個タクQUIZ</div><div class="segwrap"></div></div><button class="icon-btn homebtn" type="button" data-act="pause" hidden>ここで休憩</button></div><div class="kapp" tabindex="-1"></div></div>`;
  Z.$app = Z.root.querySelector(".kapp");
}
function setLamp(mode){
  const el = Z.root.querySelector(".lamp"); const txt = {vacant:"待機中", hired:"挑戦中", arrive:"クリア"}[mode];
  if(el.dataset.mode !== mode){ el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip"); }
  el.dataset.mode = mode; el.textContent = txt;
}
function setMeter(title, i, n){
  Z.root.querySelector(".meter-title").textContent = title;
  const w = Z.root.querySelector(".segwrap");
  if(i == null){ w.innerHTML = ""; return; }
  const cells = Array.from({length:n}, (_,k)=>`<div class="kseg ${k<i?"on":k===i?"now":""}"></div>`).join("");
  w.innerHTML = `<div class="segs" aria-hidden="true" style="grid-template-columns:repeat(${n},1fr)">${cells}</div><span class="sr">${n}問中${i+1}問目</span>`;
}
function homeBtn(show){ Z.root.querySelector(".homebtn").hidden = !show; }
function poolOf(scope, mode){
  let p = QS.filter(q => scope.item ? q.item===scope.item : (scope.cat==null || q.cat===scope.cat));
  if(mode==="miss") p = p.filter(q=>isMiss(q.qid));
  if(mode==="new") p = p.filter(q=>!isTried(q.qid));
  return p;
}
function renderQuizMenu(){
  Z.run = null; setLamp("vacant"); setMeter("個タクQUIZ　問題だけを解く", null); homeBtn(false);
  const sc = Z.scope; const P = progressOf(S);
  const chip = (v, label, cnt) => `<button class="qchip" data-act="scope" data-cat="${v}" aria-pressed="${String(sc.item?false:(sc.cat==null?v==="all":String(sc.cat)===v))}">${esc(label)}<small>${cnt}問</small></button>`;
  const base = poolOf(sc,"all"), miss = poolOf(sc,"miss"), nw = poolOf(sc,"new");
  const scopeName = sc.item ? itemById(sc.item).title : sc.cat==null ? "全部の分類" : `${sc.cat}. ${catOf(sc.cat).short}`;
  const tried = base.filter(q=>isTried(q.qid)).length, first = base.filter(q=>S.q[q.qid]&&S.q[q.qid].first===true).length;
  const hello = !P.total.tried ? ["t","問題だけを解く場所です。間違えても、正しい答えと解説を見てもう一度選べます。時間制限はありません。"]
    : P.total.miss ? ["k",`前に間違えた問題が${P.total.miss}問あるよ。「間違えた問題」から解くと覚えやすい。`]
    : ["c","いい調子！　分類を選んで、思い出す練習を続けよう。"];
  Z.$app.innerHTML = `
  <section class="khero"><div class="telop hero-t">個タクQUIZ</div><span class="sub">問題だけ・時間制限なし</span>
  <div class="cast">${["t","r","c","k"].map(sp=>`<figure><img src="${IMG[sp]}" alt="${esc(CAST[sp].alt)}"><figcaption>${CAST[sp].name}</figcaption></figure>`).join("")}</div></section>
  <div class="hello">${face(hello[0])}<div class="bubble">${esc(hello[1])}</div></div>
  <div class="start-box">
    <div class="next-label">どこから出す？</div>
    <div class="qchips">${chip("all","全部",QS.length)}${CATS.map(c=>chip(String(c.n),`${c.n}. ${c.short}`,QS.filter(q=>q.cat===c.n).length)).join("")}</div>
    ${sc.item?`<p class="note" style="margin-top:8px">項目「${esc(scopeName)}」の問題　<button class="btn btn-ghost btn-s" data-act="scope" data-cat="all">全部に戻す</button></p>`:""}
    <div class="qmodes">
      <button class="qmode" data-act="go" data-mode="all" ${base.length?"":"disabled"}><b>順番に全部</b><small>${base.length}問</small></button>
      <button class="qmode miss" data-act="go" data-mode="miss" ${miss.length?"":"disabled"}><b>間違えた問題</b><small>${miss.length}問</small></button>
      <button class="qmode" data-act="go" data-mode="new" ${nw.length?"":"disabled"}><b>まだ解いていない</b><small>${nw.length}問</small></button>
    </div>
    <p class="note" style="margin-top:8px">${esc(scopeName)}：解いた ${tried}/${base.length}問・1回目で正解 ${first}問${base.length?"":"（この分類の問題は準備中です）"}</p>
  </div>
  <div class="kfoot"><p>問題はすべてオリジナルで、試験の過去問ではありません。過去問は「過去問」の画面から配布元を開けます。</p><div class="btn-row"><button class="btn btn-ghost" data-act="zsources">根拠資料の一覧</button></div></div>`;
}
function startRun(mode){
  const list = poolOf(Z.scope, mode); if(!list.length) return;
  Z.run = { list, i:0, ok:0, seen:{}, answered:false, mode };
  setLamp("hired"); homeBtn(true); renderQ(); scrollTop(Z.root);
}
const TYPE_LABEL = { choice:"3択", order:"並べ替え", sort:"仕分け", ox:"○×" };
function renderQ(){
  const r = Z.run, e = r.list[r.i], it = itemById(e.item), q = e.q;
  r.answered = false; orderSel = []; sortSel = {};
  setMeter(`${catOf(e.cat).short}　${r.i+1}／${r.list.length}`, r.i, r.list.length);
  Z.$app.innerHTML = `<span class="corner">${esc(catOf(e.cat).short)}・${esc(it.title)}</span>
  ${qHtml(q, r.i)}
  <div class="btn-row"><button class="btn btn-primary nextbtn" data-act="qnext" disabled>${r.i+1<r.list.length?"次の問題へ":"結果を見る"}</button></div>`;
}
function qHtml(q, n){
  const head = `<div class="qhead"><span class="qnum telop">Q${n+1}</span><span>${TYPE_LABEL[q.type]||""}${q.kind?`・${esc(q.kind)}の対策`:""}</span></div><p class="qtext">${esc(q.q)}</p>`;
  if(q.type==="choice") return `<div class="qbox">${head}<div class="qbody"><div class="opts" role="group" aria-label="選択肢">${q.opts.map((o,i)=>`<button class="opt" data-act="pick" data-i="${i}"><span class="k" aria-hidden="true">${"ABCD"[i]}</span><span>${esc(o.t)}</span></button>`).join("")}</div><div class="fbwrap" aria-live="polite"></div></div></div>`;
  if(q.type==="order"){ const disp = [2,0,3,1].filter(i=>i<q.items.length);
    return `<div class="qbox">${head}<div class="qbody"><div class="order-picked picked" aria-live="polite"><span class="note">ここに順番が並びます</span></div>
    <div class="opts ord">${disp.map(i=>`<button class="opt" data-act="orderpick" data-i="${i}"><span>${esc(q.items[i])}</span></button>`).join("")}</div>
    <div class="btn-row" style="margin-top:10px"><button class="btn btn-ghost" data-act="orderreset">並べ直す</button></div><div class="fbwrap" aria-live="polite"></div></div></div>`; }
  if(q.type==="sort") return `<div class="qbox">${head}<div class="qbody">${q.cards.map((c,ci)=>`<div class="sort-card" data-sc="${ci}"><div>${esc(c.t)}</div>
    <div class="bins" role="group" aria-label="時期を選ぶ">${q.bins.map((b,bi)=>`<button class="bin" data-act="sortpick" data-c="${ci}" data-b="${bi}">${esc(b)}</button>`).join("")}</div><div class="sort-why" aria-live="polite"></div></div>`).join("")}<div class="fbwrap" aria-live="polite"></div></div></div>`;
  if(q.type==="ox") return `<div class="qbox">${head}<div class="qbody"><div class="ox" role="group" aria-label="○か×"><button class="oxb o" data-act="ox" data-v="1" aria-label="○">○</button><button class="oxb x" data-act="ox" data-v="0" aria-label="×">×</button></div><div class="fbwrap" aria-live="polite"></div></div></div>`;
  return "";
}
function fbHtml(ok, q, pickedText){
  let body = "";
  if(!ok){
    if(q.type==="choice") body += `<h4>正しい答え</h4><p class="answer">${esc(q.opts[q.ans].t)}</p>`;
    if(q.type==="ox") body += `<h4>正しい答え</h4><p class="answer">${q.ans?"○（正しい）":"×（誤り）"}</p>`;
    if(q.type==="order") body += `<h4>正しい順番</h4><div class="order-picked" style="border-style:solid;border-color:var(--ok)">${q.items.map((t,i)=>`<div class="ochip"><span class="num">${i+1}</span><span class="answer">${esc(t)}</span></div>`).join("")}</div>`;
    if(pickedText) body += `<h4>選んだ答えとの違い</h4><p>${esc(pickedText)}</p>`;
    if(q.diff) body += `<p>${esc(q.diff)}</p>`;
  }
  if(q.why) body += `<h4>${ok?"なぜ正解？":"先生の解説"}</h4><p>${esc(q.why)}</p>`;
  const okT = q.ok || "そのとおり！　ここは本番でも迷いやすいところだよ。";
  const ngT = q.ng || "大丈夫、ここで気づけたら一歩前進！　解説を見て、もう一度選んでみよう。";
  const retry = ok ? "" : `<div class="btn-row" style="margin-top:12px"><button class="btn" data-act="retry">もう一度選ぶ</button></div>`;
  return `<div class="fb ${ok?"ok":"ng"}" role="status">
    <div class="fb-head"><span class="burst"><span class="mark pop" aria-hidden="true">${ok?'<i class="ring"></i>':"！"}</span></span><span class="fb-title">${ok?"正解！":"不正解"}<span class="fb-sub">${ok?"その調子！":"ここを一緒に確認しよう"}</span></span></div>
    ${body}<div class="talk">${line(ok?(q.react||"c"):"c", ok?okT:ngT)}</div>${retry}
    ${q.src?srcLine(q.src,"",q.type==="ox"?CARD_CHECKED:CHECKED):""}</div>`;
}
function record(ok){
  const r = Z.run, e = r.list[r.i];
  const a = S.q[e.qid] || { first:null, tries:0, last:null, miss:false };
  if(a.first===null) a.first = ok;
  a.tries++; a.last = ok; a.t = Date.now();
  /* 「間違えた」かどうかはその回の1回目の答えで決める（解き直して正解しても、次回もう一度出す） */
  if(!r.seen[e.qid]){ r.seen[e.qid] = true; a.miss = !ok; if(ok) r.ok++; }
  S.q[e.qid] = a; save();
  const nb = Z.root.querySelector(".nextbtn"); if(nb) nb.disabled = false;
  changed();
}
const curQ = () => Z.run.list[Z.run.i].q;
function onPick(btn){
  const box = btn.closest(".qbox"), q = curQ(), i = +btn.dataset.i, ok = i===q.ans;
  box.querySelectorAll(".opt").forEach((b,bi)=>{ b.disabled = true; if(bi===q.ans && ok) b.classList.add("is-right"); else if(bi===i) b.classList.add("is-wrong"); else b.classList.add("is-dim"); });
  if(ok) box.querySelectorAll(".opt")[q.ans].classList.add("is-right");
  box.querySelector(".fbwrap").innerHTML = fbHtml(ok, q, ok ? "" : q.opts[i].n);
  record(ok);
}
function onOx(btn){
  const box = btn.closest(".qbox"), q = curQ(), pick = btn.dataset.v==="1", ok = pick===q.ans;
  box.querySelectorAll(".oxb").forEach(b=>{ b.disabled = true; if(b===btn) b.classList.add(ok?"is-right":"is-wrong"); });
  box.querySelector(".fbwrap").innerHTML = fbHtml(ok, q, "");
  record(ok);
}
function onRetry(btn){
  const box = btn.closest(".qbox");
  box.querySelectorAll(".opt,.oxb").forEach(b=>{ b.disabled=false; b.classList.remove("is-right","is-wrong","is-dim"); });
  box.querySelector(".fbwrap").innerHTML = "";
  const picked = box.querySelector(".picked"); if(picked){ picked.innerHTML='<span class="note">ここに順番が並びます</span>'; orderSel=[]; }
  box.querySelectorAll(".sort-card").forEach(c=>{ c.classList.remove("ng","ok"); c.querySelector(".sort-why").innerHTML=""; c.querySelectorAll(".bin").forEach(b=>{b.disabled=false;b.classList.remove("sel-ok","sel-ng");}); });
  sortSel = {};
  const first = box.querySelector(".opt:not([disabled]),.bin:not([disabled]),.oxb:not([disabled])"); if(first) first.focus();
}
let orderSel = [];
function onOrderPick(btn){
  const box = btn.closest(".qbox"), q = curQ(), i = +btn.dataset.i;
  orderSel.push(i); btn.disabled = true;
  box.querySelector(".picked").innerHTML = orderSel.map((x,n)=>`<div class="ochip"><span class="num">${n+1}</span><span>${esc(q.items[x])}</span></div>`).join("");
  if(orderSel.length === q.items.length){
    const ok = orderSel.every((x,n)=>x===n);
    box.querySelectorAll(".opt").forEach(b=>b.disabled=true);
    box.querySelector(".fbwrap").innerHTML = fbHtml(ok, q, "");
    orderSel = []; record(ok);
  }
}
function onOrderReset(btn){
  const box = btn.closest(".qbox");
  if(box.querySelector(".fb")) return onRetry(btn);
  orderSel = []; box.querySelectorAll(".opt").forEach(b=>b.disabled=false);
  box.querySelector(".picked").innerHTML = '<span class="note">ここに順番が並びます</span>';
}
let sortSel = {};
function onSortPick(btn){
  const q = curQ(), ci = +btn.dataset.c, bi = +btn.dataset.b, box = btn.closest(".qbox"), card = box.querySelector(`[data-sc="${ci}"]`), c = q.cards[ci];
  const ok = bi===c.b; sortSel[ci] = ok;
  card.classList.add(ok?"ok":"ng");
  card.querySelectorAll(".bin").forEach((b,k)=>{ b.disabled=true; if(k===bi) b.classList.add(ok?"sel-ok":"sel-ng"); });
  card.querySelector(".sort-why").innerHTML = ok ? `<b style="color:var(--ok)">○</b>${esc(c.w)}` : `<b style="color:var(--ng)">！</b>正しくは「${esc(q.bins[c.b])}」。${esc(c.w)}`;
  if(Object.keys(sortSel).length === q.cards.length){
    const all = Object.values(sortSel).every(Boolean);
    box.querySelector(".fbwrap").innerHTML = fbHtml(all, Object.assign({}, q, { why: all ? "申請日から逆算して取る書類と、今からできる準備を分けられました。" : "", diff: all ? "" : "証明書の多くは、申請日から逆算して取ります。いまは学ぶことと、記録の所在を確かめることが中心です。" }), "");
    sortSel = {}; record(all);
  }
}
function nextQ(){
  const r = Z.run; r.i++;
  if(r.i < r.list.length){ renderQ(); scrollTop(Z.root); return; }
  setLamp("arrive"); setMeter("結果", null); homeBtn(false);
  const wrong = r.list.filter(e=>S.q[e.qid]&&S.q[e.qid].miss);
  const all = r.ok === r.list.length;
  Z.$app.innerHTML = `<div class="clear-stage"><span class="telop big pop">${r.ok} / ${r.list.length}</span><p>1回目で正解した数です。</p></div>
  <div class="hello" style="margin-top:16px">${face(all?"c":"t")}<div class="bubble">${all?"全問正解！　この感覚を忘れないうちに、カードの復習もどうぞ。":"間違えた問題こそ覚えやすいんです。解説をもう一度読んで、また挑戦しましょう。"}</div></div>
  ${wrong.length?`<div class="kpanel" style="margin-top:14px"><h3>もう一度出す問題（${wrong.length}問）</h3><ul class="wrongs">${wrong.map(e=>`<li>${esc(e.q.q)}</li>`).join("")}</ul></div>`:""}
  <div class="btn-row">${wrong.length?`<button class="btn btn-primary" data-act="go" data-mode="miss">間違えた問題をもう一度</button>`:""}<button class="btn ${wrong.length?"btn-ghost":"btn-primary"}" data-act="zmenu">メニューに戻る</button></div>`;
  Z.run = null; scrollTop(Z.root);
}
function onQuizClick(e){
  const b = e.target.closest("[data-act]"); if(!b || !Z || !Z.root.contains(b)) return;
  switch(b.dataset.act){
    case "scope": Z.scope = { cat: b.dataset.cat==="all" ? null : +b.dataset.cat }; renderQuizMenu(); break;
    case "go": startRun(b.dataset.mode); break;
    case "pick": onPick(b); break;
    case "ox": onOx(b); break;
    case "retry": onRetry(b); break;
    case "orderpick": onOrderPick(b); break;
    case "orderreset": onOrderReset(b); break;
    case "sortpick": onSortPick(b); break;
    case "qnext": nextQ(); break;
    case "pause": case "zmenu": renderQuizMenu(); scrollTop(Z.root); break;
    case "zsources": setLamp("vacant"); homeBtn(false); setMeter("根拠資料の一覧", null); renderSourcesIn(Z.$app, "zmenu"); break;
  }
}

/* ---------- 取り付け ---------- */
function scrollTop(el){ try{ const r = el.getBoundingClientRect(); if(r.top < 0) el.scrollIntoView({block:"start"}); }catch(e){} }
function injectCss(){ if(document.getElementById("klq-style")) return; const st = document.createElement("style"); st.id = "klq-style"; st.textContent = CSS; document.head.appendChild(st); }
function init(opts){ OPT = opts || {}; injectCss(); S = migrate(OPT.state); }
function mountLearn(el){
  injectCss(); L = { root:el, view:"list" };
  if(!el._kl){ el.addEventListener("click", onLearnClick); el._kl = true; }
  renderLearn();
}
function mountQuiz(el){
  injectCss(); Z = { root:el, scope:{ cat:null }, run:null }; quizShell();
  if(!el._kz){ el.addEventListener("click", onQuizClick); el._kz = true; }
  renderQuizMenu();
}
function busy(){ return !!(Z && Z.run) || !!(L && (L.view==="item" || L.view==="cards")); }
window.KotakuLearn = {
  version:"2026-10-22_v03", CATS, ITEMS, ORDER, init, mountLearn, mountQuiz, migrate,
  progress: progressOf, state: () => JSON.parse(JSON.stringify(S)),
  update(state){ const n = migrate(state); if(JSON.stringify(n.read)+JSON.stringify(n.cards)+JSON.stringify(n.q) === JSON.stringify(S.read)+JSON.stringify(S.cards)+JSON.stringify(S.q)) return; S = n; if(L && L.view==="list") renderLearn(); if(Z && !Z.run) renderQuizMenu(); },
  quizFor(scope){ if(!Z) return; Z.scope = scope && scope.item ? { item:scope.item } : { cat: scope && scope.cat!=null ? scope.cat : null }; renderQuizMenu(); },
  openItem(id){ if(L) openItem(id); },
  showList(){ if(L){ L.view="list"; renderLearn(); } },
  busy
};

})();
