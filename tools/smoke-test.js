/* 動作確認スクリプト（ブラウザーで主な画面をひと通り操作し、エラーがないか確かめる）
   使い方：node tools/smoke-test.js [スクリーンショットの保存先フォルダ]
   必要なもの：Playwright（npm i -D playwright などで入れる）
   外部のフォント・CDNは読み込まない（結果を毎回同じにするため）。PDF・PNGの出力は確かめない */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const URL = "file://" + path.join(ROOT, "index.html");
const SHOT = process.argv[2] || "";

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const results = [];
  let vpName = "";
  const check = (name, ok, info) => { results.push({ name: `[${vpName}] ${name}`, ok, info }); };
  let n = 0;

  // PCは「しっかり8問」、スマホ幅は「ざっくり4問」で答える
  for (const vp of [{ name: "pc", width: 1200, height: 900, mode: "full", qs: 8 }, { name: "sp", width: 390, height: 844, mode: "quick", qs: 4 }]) {
    vpName = vp.name;
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.route(u => !u.href.startsWith("file:"), r => r.abort());
    page.on("pageerror", e => errors.push(`[${vp.name}] ${e.message}`));
    page.on("dialog", d => d.dismiss());
    const shot = async name => {
      if (!SHOT) return;
      fs.mkdirSync(SHOT, { recursive: true });
      await page.addStyleTag({ content: "*{transition:none!important;animation:none!important;caret-color:transparent!important}" });
      await page.screenshot({ path: path.join(SHOT, `${vp.name}-${String(++n).padStart(2, "0")}-${name}.png`), fullPage: true });
    };
    const tab = async t => { await page.click(`.tab[data-tab="${t}"]`); await page.waitForTimeout(150); };

    await page.goto(URL);
    await page.waitForSelector("#v-start:not([hidden])");
    await shot("start");

    // 質問に答える（複数選択の質問は1つ目だけ選ぶ）
    await page.click(`[data-mode="${vp.mode}"]`);
    for (let i = 0; i < vp.qs; i++) {
      await page.waitForSelector("#v-q:not([hidden])");
      const multi = await page.isVisible("#qNext");
      await page.click("#qAns .ans >> nth=0");
      if (multi) await page.click("#qNext");
      await page.waitForTimeout(250);
    }
    await page.waitForSelector("#v-home:not([hidden])");
    check(`${vp.qs}問に答えるとホームが出る`, true);
    await shot("home");

    await tab("learn"); await shot("learn");
    check("学ぶの一覧に16項目", (await page.$$eval("#learnMount .lis > li", x => x.length)) === 16);
    await page.click('#learnMount [data-act="open"] >> nth=0');
    await page.waitForSelector("#learnMount .kguide");
    await shot("learn-item");
    // 前後ボタンが「おすすめの順番」に沿うこと（0-1 の次は 0-2、0-2 の次は 2-1）
    await page.click('#learnMount .inav [data-act="open"] >> nth=-1');
    await page.click('#learnMount .inav [data-act="open"] >> nth=-1');
    const title = await page.textContent("#learnMount .screen-title");
    check("前後ボタンがおすすめの順番に沿う（0-1→0-2→2-1）", /試験はいつ受ける/.test(title), title);
    await page.click('#learnMount [data-act="flip"]');
    await page.click('#learnMount [data-act="know"]');
    await page.click('#learnMount [data-act="markread"]');

    await page.click('#learnMount [data-act="itemquiz"]');
    await page.waitForSelector("#v-quiz:not([hidden])");
    await shot("quiz-menu");
    await page.click('#quizMount [data-act="go"][data-mode="all"]');
    for (let i = 0; i < 20; i++) {
      const q = await page.$("#quizMount .qbox"); if (!q) break;
      if (await page.$('#quizMount [data-act="pick"]')) await page.click('#quizMount [data-act="pick"] >> nth=0');
      else if (await page.$('#quizMount [data-act="ox"]')) await page.click('#quizMount [data-act="ox"] >> nth=0');
      else if (await page.$('#quizMount [data-act="orderpick"]')) { for (let k = 0; k < 4; k++) await page.click('#quizMount [data-act="orderpick"]:not([disabled]) >> nth=0'); }
      else if (await page.$('#quizMount [data-act="sortpick"]')) { const c = await page.$$eval("#quizMount .sort-card", x => x.length); for (let k = 0; k < c; k++) await page.click(`#quizMount [data-sc="${k}"] [data-act="sortpick"] >> nth=0`); }
      if (i === 0) await shot("quiz-answered");
      await page.click('#quizMount [data-act="qnext"]');
    }
    check("クイズを最後まで解ける", !!(await page.$("#quizMount .clear-stage")));
    await shot("quiz-result");
    await page.click('#quizSeg [data-qseg="kako"]');
    await page.fill("#kScore", "30"); await page.fill("#kTotal", "40");
    await page.click("#kMiss .mchip >> nth=0");
    await page.click("#kSave");
    check("過去問の記録ができる", (await page.$$eval("#kakoList .krow", x => x.length)) === 1);
    await shot("kako");

    await tab("prep");
    check("やることが自動で入る", (await page.$$eval("#taskList .trow", x => x.length)) > 0);
    await shot("prep-tasks");
    await page.click('#addTask'); await page.fill("#e_t", "テストのやること"); await page.click("[data-tsave]");
    check("やることを追加できる", (await page.textContent("#taskList")).includes("テストのやること"));
    await page.click('#prepSeg [data-pseg="checks"]'); await shot("prep-checks");
    await page.click('#prepSeg [data-pseg="sched"]'); await page.waitForTimeout(150); await shot("prep-sched");

    await tab("settings"); await shot("settings");
    // 1問だけ答え直しても、回答モードは変わらない
    const modeBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("kotaku-navi-v3")).answers.mode);
    await page.click('[data-ask="age"]');
    await page.click("#qAns .ans >> nth=1");
    await page.waitForSelector("#v-settings:not([hidden])");
    const modeAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("kotaku-navi-v3")).answers.mode);
    check("1問だけ答え直しても回答モードが変わらない", modeBefore === modeAfter, `${modeBefore} → ${modeAfter}`);

    // 回答を変えて条件に合わなくなった自動のやることは、消さずに「対象外」の目印が付く
    if (vp.mode === "full") {
      await page.click('[data-ask="route"]');
      await page.click("#qAns .ans >> nth=1"); // 新規許可 → 譲渡譲受
      await page.waitForSelector("#v-settings:not([hidden])");
      await tab("prep"); await page.click('#prepSeg [data-pseg="tasks"]');
      const offRow = await page.$('#taskList .trow.off:has-text("法令試験の申込時期")');
      check("回答を変えると対象外の目印が付く（消えない）", !!offRow);
      const home = (await (async () => { await tab("home"); return page.textContent("#next1"); })());
      check("対象外のやることはホームの「次にやること」に出ない", !home.includes("法令試験の申込時期"));
      await tab("prep"); await shot("prep-tasks-off");
      await tab("settings");
    }
    await page.click('#v-settings [data-go="consult"]');
    await page.click("#addQ"); await page.fill("#q_q", "テストの質問"); await page.click("[data-saveq]");
    await shot("consult");
    await page.click('#v-consult [data-go="share"]');
    check("相談シートに質問が載る", (await page.textContent("#paper")).includes("テストの質問"));
    await shot("share");

    // URLの#で画面を切り替えられる
    await page.evaluate(() => { location.hash = "prep"; });
    await page.waitForTimeout(200);
    check("URLの#で画面が切り替わる", !(await page.isHidden("#v-prep")));

    // 再読み込みしても記録が残る
    await page.reload(); await page.waitForTimeout(300);
    check("再読み込みしても記録が残る", !(await page.isHidden("#tabs")));
    await page.close();
  }
  // 共有用と本人用の見分け（本人用は claude.ai の保存領域を試験用の偽物に置き換えて確かめる）
  {
    vpName = "mode";
    const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
    await page.route(u => !u.href.startsWith("file:"), r => r.abort());
    page.on("pageerror", e => errors.push(`[mode] ${e.message}`));
    await page.goto(URL); await page.waitForTimeout(300);
    const co = await page.evaluate(() => ({ badge: document.querySelector("#meBadge").textContent, title: document.title, mode: document.documentElement.dataset.mode }));
    check("共有用は「共有用」の札・紺のヘッダー", co.badge === "共有用" && co.mode === "co" && co.title === "個タク準備ナビ", JSON.stringify(co));
    await page.close();

    const me = await browser.newPage({ viewport: { width: 900, height: 700 } });
    await me.route(u => !u.href.startsWith("file:"), r => r.abort());
    me.on("pageerror", e => errors.push(`[mode] ${e.message}`));
    await me.addInitScript(() => {
      const fakeDb = { collection: () => ({ onSnapshot: cb => { setTimeout(() => cb({ docChanges: () => [] }), 0); return () => {}; } }), doc: () => ({ set: async () => {} }) };
      window.claude = { use: async name => { if (name === "db") return fakeDb; throw new Error("none"); } };
    });
    await me.goto(URL); await me.waitForTimeout(300);
    const r = await me.evaluate(() => ({ badge: document.querySelector("#meBadge").textContent, title: document.title, mode: document.documentElement.dataset.mode, logo: document.querySelector(".logo .q").textContent, icon: document.querySelector("#favicon").href.includes("3B1F8F"), bg: getComputedStyle(document.querySelector(".top")).backgroundColor }));
    check("本人用は「本人用」の札・紫のヘッダー・「本」のマーク・タブ名とアイコン", r.badge === "本人用" && r.mode === "me" && r.title === "個タク準備ナビ（本人用）" && r.logo === "本" && r.icon && r.bg === "rgb(59, 31, 143)", JSON.stringify(r));
    if (SHOT) await me.screenshot({ path: path.join(SHOT, "mode-me.png") });
    await me.close();
  }
  await browser.close();

  let bad = 0;
  for (const r of results) { if (!r.ok) bad++; console.log(`${r.ok ? "OK " : "NG "} ${r.name}${r.info ? "：" + r.info : ""}`); }
  for (const e of errors) console.log("ERR " + e);
  console.log(bad || errors.length ? `\n失敗 ${bad}件・エラー ${errors.length}件` : "\nすべて成功");
  process.exit(bad || errors.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
