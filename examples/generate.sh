#!/usr/bin/env bash
# Synthesize speech with Koe — the smallest complete call.
#
#   HANZO_API_KEY=... ./examples/generate.sh "Describe the change. Hanzo Dev ships it to production."
set -euo pipefail

text=${1:-"Describe the change. Hanzo Dev ships it to production."}
voice=${2:-alloy}
: "${HANZO_API_KEY:?set HANZO_API_KEY (https://platform.hanzo.ai → API keys)}"

body=$(printf '{"model":"koe","input":%s,"voice":"%s"}' \
  "$(printf '%s' "$text" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')" \
  "$voice")

curl -sS https://api.hanzo.ai/v1/audio/voice \
  -H "Authorization: Bearer $HANZO_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$body" \
  --output /tmp/koe.mp3

file /tmp/koe.mp3
