# Koe — agent notes

Koe (`koe`, `koe-1`) is Hanzo's voice and dialogue synthesis SKU. Inference serving in production runs through [`hanzo-inc/zen`](https://github.com/hanzo-inc/zen) (`POST /v1/audio/voice` and `POST /v1/audio/speech`); this repository also carries the standalone Koe Python dialogue CLI/Gradio app (`dia/`).

> **Separation of audio models**: Voice & dialogue is **Koe** ([`hanzo-inc/koe`](https://github.com/hanzo-inc/koe), `/v1/audio/voice`), Foley & sound effects is **Oto** ([`hanzo-inc/oto`](https://github.com/hanzo-inc/oto), `/v1/audio/foley`), and Music & score generation is **Uta** ([`hanzo-inc/uta`](https://github.com/hanzo-inc/uta), `/v1/audio/music`). Never conflate the three.

## Where Koe lives across the stack

| Layer | Repo / file | What it owns |
|---|---|---|
| The SKU, its price, its rungs | `hanzo/universe` → `charts/app/files/zen/catalog.yaml` | the `koe` entry (`mode: audio`, `zen-voice: *koe`, `zen3-tts: *koe`, aliases `koe-1: koe`, `zen-voice-mini: koe`) |
| The serving plane | [`hanzo-inc/zen`](https://github.com/hanzo-inc/zen) → `media.go` | `handleAudio` → `/v1/audio/voice` & `/v1/audio/speech` → `mediaProxy` |
| Cloud gateway & Studio | `hanzo-inc/cloud` → `apps/ai/media_rpc.go`, `apps/studio/exec.go` | `/v1/audio/voice` and `/v1/audio/speech` at `api.hanzo.ai`; Studio step defaults `voice.speak` to `koe` |
| 1-click K8s Stack | [`hanzo-inc/platform`](https://github.com/hanzo-inc/platform) → `src/lib/deploy/stacks.ts` | `koe` stack template (`ghcr.io/hanzoai/koe:latest`) |
| Product page | [`hanzo-inc/app`](https://github.com/hanzo-inc/app) → `lib/creative-models.ts` | `/koe` (`koe-1`, open foundation `zen3-tts` / `zenlm/zen-dub`) |

## Verifying a deploy

```bash
# 1. Verify koe is in the live model catalog
curl -s https://api.hanzo.ai/v1/models | jq '.data[] | select(.id=="koe")'

# 2. Synthesize speech with koe
curl -s https://api.hanzo.ai/v1/audio/voice \
  -H "Authorization: Bearer $HANZO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"koe","input":"Describe the change. Dev ships it.","voice":"af_heart"}' \
  --output /tmp/koe.mp3
```
