import { spawnSync } from 'child_process';
import fs from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import minimist from 'minimist';

// 引数解析
const args = minimist(process.argv.slice(2));

const srcRaw = args._[0] as string | undefined;
const destRaw = args._[1] as string | undefined;
if (!srcRaw || !destRaw) {
  console.error('Usage:');
  console.error('  node scripts/rsync.ts <src> <dest> [--mode=xxx] [--delete] [--exclude=...]');
  console.error('');
  console.error('Examples:');
  console.error('  node scripts/rsync.ts dist/ "{REMOTE}/" --mode=development --delete');
  console.error('  node scripts/rsync.ts "{REMOTE}/subdir/" public/subdir/ --mode=development');
  process.exit(1);
}

// mode を取得（env読み込み用）
const mode = ([] as string[]).concat(args.mode).pop();

// mode以外をrsync用に配列に変換
const rsyncArgs = Object.entries(args)
  .filter(([key]) => key !== '_' && key !== 'mode')
  .flatMap(([key, value]) => {
    if (typeof value === 'boolean') {
      return value ? [`--${key}`] : [];
    }
    if (Array.isArray(value)) {
      return value.map((v) => `--${key}=${v}`);
    }
    return [`--${key}=${value}`];
  });

// Viteと同じ.env読み込み順
const envFiles = ['.env', '.env.local'];
if (mode) {
  envFiles.push(`.env.${mode}`, `.env.${mode}.local`);
}
for (const file of envFiles) {
  const path = resolve(process.cwd(), file);
  if (fs.existsSync(path)) {
    config({ path });
    console.log(`Loaded environment from ${file}`);
  }
}

const remoteUser = process.env.REMOTE_USER;
if (!remoteUser) {
  console.error('ERROR: REMOTE_USER is not defined.');
  process.exit(1);
}

const remoteHost = process.env.REMOTE_HOST;
if (!remoteHost) {
  console.error('ERROR: REMOTE_HOST is not defined.');
  process.exit(1);
}

const remoteDir = process.env.REMOTE_DIR;
if (!remoteDir) {
  console.error('ERROR: REMOTE_DIR is not defined.');
  process.exit(1);
}

const vars: Record<string, string> = {
  REMOTE: `${remoteUser}@${remoteHost}:${remoteDir}`,
};

function expand(s: string) {
  return s.replace(/\{([A-Z0-9_]+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

const src = expand(srcRaw);
const dest = expand(destRaw);

// 環境変数SSH_KEY_PATHの指定があればそれを使う
const sshKey = process.env.SSH_KEY_PATH;
const sshCmd = sshKey ? `ssh -i "${sshKey}" -o StrictHostKeyChecking=yes` : 'ssh';

// コマンド引数配列の組み立て
const cmdArgs = ['-avz', '-e', sshCmd, ...rsyncArgs, src, dest];
console.log('Executing: rsync', cmdArgs.join(' '));

// spawnSyncで実行
const result = spawnSync('rsync', cmdArgs, { stdio: 'inherit' });

if (result.error) {
  console.error('Failed to start rsync:', result.error);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(`rsync failed with exit code ${result.status}`);
  process.exit(result.status ?? 1);
}
