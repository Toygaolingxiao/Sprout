import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const options = {
    type: 'patch',
    notes: ['🔧 機能更新を反映'],
    message: '',
    skipBuild: false,
    skipDeploy: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--type' && argv[i + 1]) {
      options.type = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--notes' && argv[i + 1]) {
      options.notes = argv[i + 1]
        .split('|')
        .map((v) => v.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    if (arg === '--message' && argv[i + 1]) {
      options.message = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--skip-build') {
      options.skipBuild = true;
      continue;
    }
    if (arg === '--skip-deploy') {
      options.skipDeploy = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map((v) => Number(v));

  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function updateReleaseNotes(nextVersion, notes) {
  const filePath = resolve(process.cwd(), 'src/data/release-notes.ts');
  let source = readFileSync(filePath, 'utf8');

  const versionMatch = source.match(/export const APP_VERSION = '(\d+\.\d+\.\d+)';/);
  if (!versionMatch) {
    throw new Error('APP_VERSION が src/data/release-notes.ts で見つかりません');
  }

  source = source.replace(
    /export const APP_VERSION = '(\d+\.\d+\.\d+)';/,
    `export const APP_VERSION = '${nextVersion}';`,
  );

  const entry = [
    '  {',
    `    version: '${nextVersion}',`,
    `    date: '${todayIsoDate()}',`,
    '    items: [',
    ...notes.map((n) => `      '${n.replace(/'/g, "\\'")}',`),
    '    ],',
    '  },',
  ].join('\n');

  const releaseNotesHeader = /(export const RELEASE_NOTES: \{ version: string; date: string; items: string\[\] \}\[] = \[\r?\n)/;
  const nextSource = source.replace(
    releaseNotesHeader,
    `$1${entry}\n`,
  );

  if (nextSource === source) {
    throw new Error('RELEASE_NOTES の挿入位置が見つかりませんでした');
  }

  source = nextSource;

  writeFileSync(filePath, source, 'utf8');
}

function updateReadmeVersion(nextVersion) {
  const filePath = resolve(process.cwd(), 'README.md');
  let source = readFileSync(filePath, 'utf8');
  source = source.replace(/for commit \d+\.\d+\.\d+/, `for commit ${nextVersion}`);
  writeFileSync(filePath, source, 'utf8');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!['patch', 'minor', 'major'].includes(options.type)) {
    throw new Error('--type は patch | minor | major を指定してください');
  }

  const releaseNotesSource = readFileSync(resolve(process.cwd(), 'src/data/release-notes.ts'), 'utf8');
  const currentVersionMatch = releaseNotesSource.match(/export const APP_VERSION = '(\d+\.\d+\.\d+)';/);
  if (!currentVersionMatch) {
    throw new Error('現行バージョンの取得に失敗しました');
  }

  const currentVersion = currentVersionMatch[1];
  const nextVersion = bumpVersion(currentVersion, options.type);

  updateReleaseNotes(nextVersion, options.notes.length > 0 ? options.notes : ['🔧 機能更新を反映']);
  updateReadmeVersion(nextVersion);

  console.log(`🧾 Version updated: ${currentVersion} -> ${nextVersion}`);

  if (options.dryRun) {
    console.log('🧪 Dry run mode: commit/push/deploy は実行しません');
    return;
  }

  if (!options.skipBuild) {
    console.log('🏗️ Running build...');
    run('npm run build');
  }

  console.log('📦 Creating git commit...');
  run('git add -A');
  const commitMessage = options.message || `release: v${nextVersion}`;
  run(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);

  console.log('⬆️ Pushing branch...');
  run('git push');

  if (!options.skipDeploy) {
    console.log('🚀 Triggering deploy...');
    run('node scripts/deploy.mjs');
  }

  console.log(`✅ Release flow completed: v${nextVersion}`);
}

main();
