#!/usr/bin/env bash
# Publish hifinis.com (Cloudflare, Workers static assets "hifinis-site"). Run from anywhere:
#   bash deploy/deploy.sh
# Copies the site into deploy/public (never committed) and deploys. NOT the payment server:
# never run wrangler from D:\ME\Apps\hifinis-pay for the website.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
site="$(dirname "$here")"
rm -rf "$here/public" && mkdir -p "$here/public"
(cd "$site" && tar --exclude=.git --exclude=deploy --exclude=README.md --exclude=CNAME --exclude='screenshots/*.png' -cf - .) | (cd "$here/public" && tar -xf -)
cd "$here" && npx --yes wrangler@4 deploy
