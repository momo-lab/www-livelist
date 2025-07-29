import { spawnSync } from 'child_process';
import { config } from 'dotenv';
import fs from 'fs';
import minimist from 'minimist';
import { resolve } from 'path';

// 引数解析
const args = minimist(process.argv.slice(2));

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

const distDir = 'dist/';

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

// 環境変数SSH_KEY_PATHの指定があればそれを使う
const sshKey = process.env.SSH_KEY_PATH;
const sshCmd = sshKey ? `ssh -i "${sshKey}" -o StrictHostKeyChecking=yes` : 'ssh';

// コマンド引数配列にdistDirとdestを追加
const dest = `${remoteUser}@${remoteHost}:${remoteDir}`;
const cmdArgs = ['-avz', '--delete', '-e', sshCmd, ...rsyncArgs, distDir, dest];
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
