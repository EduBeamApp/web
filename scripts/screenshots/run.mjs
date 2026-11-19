// Regenerates the screenshots of the EduBeam app that the guide shows, in public/screenshots.
//
// It drives the app through its URL only, nothing of the app's code: a local dev server of the app
// (the default, http://localhost:5173/) or any deployed one, APP=https://run.edubeam.app/. The app's
// labels and version are read from the running app.
//
//   npm run screenshots                   # with the app running at APP
//   npm run screenshots -- ui-            # only shots whose name starts with "ui-"
//   npm run screenshots -- --lang cs      # the Czech guide, in screenshots/cs/
//   npm run screenshots -- --lang all     # every language of the guide
//   npm run screenshots -- --missing      # only shots that do not exist yet, e.g. after a crash
//
// English shots go to screenshots/, every other language to screenshots/<docs language>/, with the
// app in that language. Buttons are found by their labels in the app's language, so no shot names one.
// Every shot starts from a fresh browser context, so the output depends only on the app and the
// model files in ./models. Shots are written as WebP, encoded by Chromium itself, so no image
// tooling is needed besides Playwright.
import { chromium } from 'playwright';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setMessages, shots } from './shots.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const APP = process.env.APP ?? 'http://localhost:5173/';
const SCREENSHOTS = resolve(here, '../../public/screenshots');

/** Docs language → app language. The docs say zh where the app says cn. */
const APP_LANGUAGE = {
  en: 'en',
  cs: 'cs',
  de: 'de',
  es: 'es',
  fr: 'fr',
  hi: 'hi',
  pl: 'pl',
  pt: 'pt',
  ru: 'ru',
  uk: 'uk',
  zh: 'cn',
  tr: 'tr',
  th: 'th',
  vi: 'vi',
  it: 'it',
  id: 'id',
  ja: 'ja',
  ko: 'ko',
};

const args = process.argv.slice(2);
const langAt = args.indexOf('--lang');
const langArg = langAt >= 0 ? args.splice(langAt, 2)[1] : 'en';
if (langArg !== 'all' && !(langArg in APP_LANGUAGE)) {
  throw new Error(`--lang takes ${Object.keys(APP_LANGUAGE).join(', ')} or all`);
}
const missingAt = args.indexOf('--missing');
const onlyMissing = missingAt >= 0;
if (onlyMissing) args.splice(missingAt, 1);
const languages = langArg === 'all' ? Object.keys(APP_LANGUAGE) : [langArg];
const filter = args[0] ?? '';
const browser = await chromium.launch();

/** The app's message keys the shots look up: every quoted `section.key` in shots.mjs. */
const LABEL_KEYS = [
  ...new Set((await readFile(resolve(here, 'shots.mjs'), 'utf8')).match(/(?<=')[a-zA-Z]+(?:\.[A-Za-z0-9_]+)+(?=')/g)),
];

/**
 * What the shots need to know of the app, asked of the app itself: its labels in `lang`, and its
 * version, so the What's New dialog can be seeded as seen (a first visit marks the running version
 * seen). A key the app does not know comes back unchanged and is left out.
 */
async function appFacts(lang) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript((lang) => {
    if (sessionStorage.getItem('probed')) return;
    sessionStorage.setItem('probed', '1');
    localStorage.clear();
    localStorage.setItem('app', JSON.stringify({ locale: lang }));
  }, lang);
  await page.goto(APP);
  await page.waitForSelector('#viewerControls', { timeout: 60000 });
  await page.waitForTimeout(800);
  const facts = await page.evaluate((keys) => {
    const { $t } = document.querySelector('#app').__vue_app__.config.globalProperties;
    const messages = Object.fromEntries(keys.map((key) => [key, $t(key)]).filter(([key, text]) => text !== key));
    const version = JSON.parse(localStorage.getItem('app') ?? '{}').lastSeenChangelogVersion;
    return { messages, version };
  }, LABEL_KEYS);
  await context.close();
  if (!facts.version) throw new Error(`No app version read from ${APP}`);
  return facts;
}

// Seeded as already seen, or the What's New dialog covers every shot.
let version = '';

/** Opens the app with onboarding done and, optionally, a model from ./models loaded and fitted. */
async function openApp({
  width = 1280,
  height = 800,
  lang = 'en',
  model,
  app = {},
  viewer = {},
  firstVisit = false,
  url = '',
}) {
  // A browser in the language being shot, as a first visit takes its language from there; the
  // seeded settings set it for every other shot. Without it, every first-visit shot came out in English.
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    locale: lang === 'cn' ? 'zh-CN' : lang,
  });
  context.setDefaultTimeout(5000);
  context.setDefaultNavigationTimeout(60000);
  const page = await context.newPage();
  await page.addInitScript(
    ([lang, app, viewer, version, firstVisit]) => {
      // Seed storage only on the first load, so reloads inside a shot behave like a returning user.
      if (sessionStorage.getItem('docs-seeded')) return;
      sessionStorage.setItem('docs-seeded', '1');
      localStorage.clear();
      if (firstVisit) return;
      const settings = { onboardingFinished: true, lastSeenChangelogVersion: version, locale: lang, ...app };
      localStorage.setItem('app', JSON.stringify(settings));
      if (Object.keys(viewer).length > 0) localStorage.setItem('viewer', JSON.stringify(viewer));
    },
    [lang, app, viewer, version, firstVisit]
  );
  await page.goto(new URL(url, APP).href);
  await page.waitForSelector('#viewerControls', { timeout: 60000 });
  await page.waitForTimeout(800);
  if (model) {
    await page.setInputFiles('input[type=file]', resolve(here, 'models', `${model}.json`));
    await page.waitForTimeout(600);
  }
  await page.mouse.move(width - 2, height / 2);
  return { context, page };
}

/** The union of the boxes of the given selectors (or a box), grown by `pad` CSS pixels. */
async function clipOf(page, target, pad = 0) {
  const boxes = [];
  for (const t of Array.isArray(target) ? target : [target]) {
    if (typeof t === 'object') boxes.push(t);
    else {
      const box = await page.locator(t).first().boundingBox();
      if (!box) throw new Error(`Nothing to clip: ${t}`);
      boxes.push(box);
    }
  }
  const vp = page.viewportSize();
  const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
  const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
  const right = Math.min(vp.width, Math.max(...boxes.map((b) => b.x + b.width)) + pad);
  const bottom = Math.min(vp.height, Math.max(...boxes.map((b) => b.y + b.height)) + pad);
  return { x, y, width: right - x, height: bottom - y };
}

async function toWebp(png) {
  const page = await browser.newPage();
  const dataUrl = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    return canvas.toDataURL('image/webp', 0.9);
  }, png.toString('base64'));
  await page.close();
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

const exists = (file) =>
  access(file).then(
    () => true,
    () => false
  );

const helpers = { clipOf };
let failed = 0;

for (const docsLanguage of languages) {
  const lang = APP_LANGUAGE[docsLanguage];
  const out = docsLanguage === 'en' ? SCREENSHOTS : resolve(SCREENSHOTS, docsLanguage);
  await mkdir(out, { recursive: true });
  const facts = await appFacts(lang);
  version = facts.version;
  setMessages(facts.messages);

  for (const shot of shots.filter((s) => s.name.startsWith(filter))) {
    const file = resolve(out, `${shot.name}.webp`);
    if (onlyMissing && (await exists(file))) continue;
    const { context, page } = await openApp({ ...shot, lang });
    try {
      await shot.setup?.(page, helpers);
      await page.waitForTimeout(shot.settle ?? 500);
      const clip = shot.clip ? await clipOf(page, await shot.clip(page, helpers), shot.pad ?? 8) : undefined;
      const png = await page.screenshot({ clip });
      await writeFile(file, await toWebp(png));
      console.log(`✓ ${docsLanguage}/${shot.name}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${docsLanguage}/${shot.name}: ${e.message.split('\n')[0]}`);
    } finally {
      await context.close();
    }
  }
}

await browser.close();
process.exitCode = failed > 0 ? 1 : 0;
