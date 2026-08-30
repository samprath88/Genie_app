# Genie

Genie is an AI companion app for physical board games. Point it at a game you already own and it teaches you how to play — rules, setup, a guided first round, scoring — and answers rules questions by voice or text while you play, grounded in the actual rulebook instead of guessing.

The FastAPI backend that powers retrieval, voice, and AI Q&A lives at [github.com/samprath88/Genie_backend](https://github.com/samprath88/Genie_backend).

## What it does

- **Learn a game end-to-end.** Per-game modes walk you through what the game's about, how to play, physical setup, and a guided first round, so a new player can get from box to table without reading a rulebook.
- **Ask Genie.** A conversational Q&A assistant answers rules questions mid-game, grounded in the real rulebook via retrieval rather than improvised. It remembers the conversation so far, so follow-up questions ("what about *that* card?") work naturally.
- **Voice in, voice out.** Rules and setup steps can be narrated aloud, and questions can be asked by voice — recording starts and stops automatically via voice activity detection, no press-and-hold required.
- **Choice of AI provider.** Switch between a local on-device-network model (fast, private, works offline on your LAN) and Claude (smarter, for trickier rules questions) from the Profile screen.
- **Scoring assistant.** Enter each player's tallies at game end and get the winner computed for you, with a small celebration for the win.
- **Growing game catalog.** Game metadata expands via BoardGameGeek integration on the backend, so new titles can be added without hand-authoring everything from scratch.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo (SDK 57) / React Native 0.86 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State | React Context + `AsyncStorage` persistence |
| Animation | React Native Reanimated |
| Audio recording | `@siteed/audio-studio` (native LINEAR16 WAV capture, live level analysis for voice activity detection) |
| Backend | [Genie backend](https://github.com/samprath88/Genie_backend) — FastAPI, rulebook retrieval, Google Cloud Speech/TTS, LM Studio + Claude |

## Getting started

**Prerequisites:**
- Node.js and npm
- The [Genie backend](https://github.com/samprath88/Genie_backend) running and reachable from your device
- A [development build](https://docs.expo.dev/develop/development-builds/introduction/) rather than Expo Go — this app uses native modules (audio recording) that Expo Go doesn't support

```bash
npm install
npx expo start
```

Then open the app in your development build (via EAS Build, or `npx expo run:android` / `npx expo run:ios` locally).

## Project structure

```
src/app/          Screens and navigation (Expo Router file-based routing)
src/components/   Shared UI: overlays, mode switcher, screen chrome, formatted text
src/hooks/        Narration/TTS coordination, layout helpers
src/state/        App-wide store (game selection, AI provider, purchases, players)
src/data/         Static game and content metadata
```

## Status

Active development, currently in closed playtesting.

## License

All rights reserved — see [LICENSE](LICENSE).
