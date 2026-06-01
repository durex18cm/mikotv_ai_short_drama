<div align="center">

# Miko TV

### An AI agent workflow that turns a single idea into a finished short drama

**Ideas in, short dramas out.** Upload an image or a one-line concept, and a team of AI agents writes the script, designs the characters, builds the storyboard, generates keyframes, renders video, adds voice, subtitles, music and SFX — then edits it all into a ready-to-publish vertical short.

**English** · [简体中文](./README.zh-CN.md)

</div>

---

## ✨ Why Miko TV

Creating an AI short drama today means juggling a dozen disconnected tools — one for the script, another for character art, another for image-to-video, another for voice, another for editing. Every handoff loses context, and consistency falls apart along the way.

**Miko TV collapses the whole pipeline into one guided agent workflow.** You make the creative decisions that matter — *the concept, the cast, the look* — and a coordinated set of agents handles everything in between, keeping characters, style, and tone consistent from the first frame to the final cut.

> **The core idea:** *Users do less, AI does more.*
> One end-to-end loop for AI short-drama creation — not another heavyweight video editor.

| Today (DIY) | With Miko TV |
| --- | --- |
| 6–10 disconnected tools | One continuous workflow |
| You write prompts, tune model params | You pick the concept, cast & style |
| Characters drift between shots | Character profiles enforced everywhere |
| Reshoot the whole episode on one bad shot | Re-do a single shot, line, or voice |
| Hours of manual editing | Auto-assembled final cut |

---

## 🎬 What it does

Give the platform a reference image (optional) and a drama type, and it runs a complete creation loop:

```
Idea / image  →  Script  →  Characters  →  Style  →  Storyboard
     →  Keyframes  →  Video  →  Voice + Subtitles  →  Auto-edit  →  Preview  →  Export
```

The 6 steps you actually touch:

**① Describe** → **② Confirm characters** → **③ Pick a style** → **④ Generate** → **⑤ Refine the shots you don't like** → **⑥ Export**

Everything else — scene splitting, shot breakdown, prompt writing, keyframes, rendering, voice matching, music & SFX, final assembly — runs automatically under the hood.

---

## 🧩 The agent workflow (12 stages)

Each stage is driven by a specialized agent. They share a single project context, so every downstream stage is grounded in the script, character profiles, and chosen style.

| # | Stage | What the agent does |
| --- | --- | --- |
| 1 | **Create Project** | Set title, episode count, duration, aspect ratio (9:16), language |
| 2 | **Choose Drama Type** | Pick a genre + tropes + "hook points" — no script writing required |
| 3 | **Script Analysis** | Auto-split into episodes, scenes, shots, dialogue, narration, action |
| 4 | **Confirm Characters** | Auto-detect cast & generate profiles (look, costume, personality, voice) |
| 5 | **Visual Style** | One unified style for the whole drama (cinematic, epic-Chinese, anime, game-CG, ink-wash, vertical-short) |
| 6 | **Storyboard** | Per-shot board from script + characters + style |
| 7 | **Keyframes** | Visual draft of every shot — lock the ones you like before rendering |
| 8 | **Video Generation** | Render each shot from its locked keyframe via pluggable video models |
| 9 | **Voice & Subtitles** | Auto-matched narration & dialogue voices, auto subtitles |
| 10 | **Auto-Edit** | Stitch clips, align voice, add subtitles, music, SFX, transitions |
| 11 | **Preview** | Watch the cut; re-do any single shot, line, or voice in place |
| 12 | **Export** | Vertical 9:16 MP4, with or without subtitles |

### Design principles

- **The idea is the only required input.** No prompts, no model parameters, no timeline juggling.
- **You confirm only what matters:** *Is the script right? The characters? The style?*
- **Keyframes before video** — confirm the look cheaply before paying for renders.
- **Local re-do, not full re-do** — fix one shot without regenerating the episode.
- **Clear state at every stage** — pending, queued, generating, done, failed, confirmed, locked.

---

## 🎥 Pluggable video models

Video generation is model-agnostic. Each shot is rendered through a unified adapter layer, so you can route shots to the best engine for the style, budget, or availability — and swap providers without touching the rest of the pipeline.

| Model | Strength |
| --- | --- |
| **Google Veo** | Cinematic motion, strong prompt adherence, longer coherent shots |
| **Seedance** | Fast, expressive image-to-video, great for stylized & character-driven shots |
| **HappyHorse** | Cost-efficient batch rendering for high-volume episode production |

> The same adapter pattern applies across the AI layer — LLMs, image, voice and music providers are all swappable behind a stable interface.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Web App  ·  React + TypeScript + Tailwind + shadcn/ui       │
└───────────────────────────────┬─────────────────────────────┘
                                 │  REST / WebSocket
┌───────────────────────────────▼─────────────────────────────┐
│  API Gateway  ·  Python · FastAPI · async · Pydantic         │
└───────────────────────────────┬─────────────────────────────┘
                                 │
┌───────────────────────────────▼─────────────────────────────┐
│  Agent Orchestrator  ·  multi-agent graph, shared context    │
│                                                              │
│  Script · Character · Storyboard · Keyframe · Video ·        │
│  Voice · Music/SFX · Editor agents                           │
└───────────────────────────────┬─────────────────────────────┘
                                 │  unified adapter layer
┌───────────────────────────────▼─────────────────────────────┐
│  AI Model Providers                                          │
│  LLM (script/characters) · Image (keyframes) ·               │
│  Video (Veo · Seedance · HappyHorse) · TTS · Music           │
└───────────────────────────────┬─────────────────────────────┘
                                 │
┌───────────────────────────────▼─────────────────────────────┐
│  Infra  ·  Task queue · Object storage · DB · FFmpeg render  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech stack

**Frontend**
- React 18 · TypeScript 5 · Vite 5
- Tailwind CSS 3 · shadcn/ui (Radix UI)
- framer-motion · lucide-react

**Backend & API**
- Python 3.11+ · FastAPI · async I/O · Pydantic
- WebSocket streaming for live generation status

**Agent layer**
- Multi-agent orchestration with a shared project context graph
- Specialized agents per stage (script, character, storyboard, keyframe, video, voice, music, editor)
- Tool/function calling, structured outputs, and per-stage retries with local re-do

**AI models**
- **LLM** — script analysis, character design, prompt synthesis
- **Image** — keyframe generation with character & style conditioning
- **Video** — pluggable engines: **Google Veo**, **Seedance**, **HappyHorse**
- **Voice** — TTS & voice matching for narration and dialogue
- **Music & SFX** — generative score and sound-effect matching

**Pipeline & infra**
- Distributed task queue for long-running generation jobs
- Object storage for assets (keyframes, clips, audio, exports)
- PostgreSQL for project & asset metadata
- FFmpeg-based auto-editing and final composition
- Docker for reproducible deploys

---

## 🚀 Getting started

The web app:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Then open the local URL Vite prints (default `http://localhost:5173`).

---

## 🗺️ Roadmap

- [x] End-to-end creation flow from concept to export
- [x] 12-stage agent workflow with shared project context
- [x] Pluggable video model layer (Veo · Seedance · HappyHorse)
- [ ] Persistent projects & cloud rendering queue
- [ ] Keyframe → video consistency with character/style locking across engines
- [ ] Multi-language voice & subtitle generation
- [ ] Team collaboration & shared asset library
- [ ] Direct publishing to short-video platforms

---

## 🤝 Contributing

Issues, ideas, and PRs are welcome — open an issue first to discuss anything substantial.

## License

Released under the [MIT License](LICENSE).

<div align="center">
<br/>
<sub>Built with care for creators. <b>Ideas in, short dramas out.</b></sub>
</div>
