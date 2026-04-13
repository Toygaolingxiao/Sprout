#!/bin/sh
# .git/hooks/post-push doesn't exist natively in git.
# Use this script manually or via npm script: npm run deploy
#
# Usage: node scripts/deploy.mjs
# Requires VERCEL_DEPLOY_HOOK_URL env variable or .env.local entry

const url = process.env.VERCEL_DEPLOY_HOOK_URL;
if (!url) {
  console.log('⏭️  VERCEL_DEPLOY_HOOK_URL not set — skipping deploy trigger');
  console.log('   Set it in .env.local or as environment variable');
  process.exit(0);
}

console.log('🚀 Triggering Vercel deploy...');
fetch(url, { method: 'POST' })
  .then(r => {
    if (r.ok) {
      console.log('✅ Deploy triggered successfully');
    } else {
      console.error('❌ Deploy trigger failed:', r.status, r.statusText);
      process.exit(1);
    }
  })
  .catch(e => {
    console.error('❌ Network error:', e.message);
    process.exit(1);
  });
