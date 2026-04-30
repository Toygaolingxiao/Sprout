import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const ROOT = process.cwd();
const TEMPLATES_PATH = path.join(ROOT, 'src', 'data', 'seed', 'templates.ts');
const OUTPUT_PATH = path.join(ROOT, 'src', 'lib', 'i18n', 'task-translations-en.json');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const URL_REGEX = /https?:\/\/[^\s]+/g;

async function translateJaToEn(text) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const url =
    'https://translate.googleapis.com/translate_a/single' +
    '?client=gtx&sl=ja&tl=en&dt=t&q=' +
    encodeURIComponent(text);

  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timeout);
  if (!res.ok) {
    throw new Error(`translate http ${res.status}`);
  }
  const json = await res.json();
  return (json?.[0] ?? []).map((x) => x?.[0] ?? '').join('');
}

async function translatePreservingUrls(text) {
  const urls = text.match(URL_REGEX) ?? [];
  if (urls.length === 0) return translateJaToEn(text);

  let cursor = 0;
  const masked = text.replace(URL_REGEX, () => `__URL_${cursor++}__`);
  const translated = await translateJaToEn(masked);

  return translated.replace(/__URL_(\d+)__/g, (_, idx) => {
    const i = Number(idx);
    return Number.isNaN(i) ? _ : (urls[i] ?? _);
  });
}

async function translateMaybeLongText(text) {
  if (text.length <= 1500) {
    return translatePreservingUrls(text);
  }

  const lines = text.split('\n');
  const translatedLines = [];
  for (const line of lines) {
    if (!line.trim()) {
      translatedLines.push('');
      continue;
    }
    translatedLines.push(await translatePreservingUrls(line));
    await sleep(80);
  }

  return translatedLines.join('\n');
}

function loadTemplatesFromTs(transpiledSource) {
  const sandbox = {
    exports: {},
    module: { exports: {} },
    require: () => ({}),
  };
  vm.runInNewContext(transpiledSource, sandbox, { filename: 'templates.js' });
  return sandbox.module.exports.CHECKLIST_TEMPLATES ?? sandbox.exports.CHECKLIST_TEMPLATES ?? [];
}

async function main() {
  const src = await fs.readFile(TEMPLATES_PATH, 'utf8');
  const transpiled = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const templates = loadTemplatesFromTs(transpiled);
  if (!Array.isArray(templates) || templates.length === 0) {
    throw new Error('CHECKLIST_TEMPLATES not found or empty');
  }

  const result = {};
  const cache = new Map();

  async function cachedTranslate(text) {
    const key = text.trim();
    if (!key) return '';
    if (cache.has(key)) return cache.get(key);

    let lastError;
    for (let i = 0; i < 3; i += 1) {
      try {
        const translated = await translateMaybeLongText(key);
        cache.set(key, translated);
        await sleep(80);
        return translated;
      } catch (error) {
        lastError = error;
        await sleep(250 * (i + 1));
      }
    }
    throw lastError;
  }

  let index = 0;
  for (const t of templates) {
    index += 1;
    const stageId = t.stage_id;
    const order = String(t.sort_order);

    if (!result[stageId]) result[stageId] = {};

    console.log(`[${index}/${templates.length}] ${stageId} #${order} ${t.title}`);

    const item = {
      title: await cachedTranslate(t.title),
      description: t.description ? await cachedTranslate(t.description) : '',
      tips: t.tips ? await cachedTranslate(t.tips) : '',
    };

    result[stageId][order] = item;
  }

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(`Generated: ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(`Templates: ${templates.length}`);
  console.log(`Unique source strings translated: ${cache.size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
