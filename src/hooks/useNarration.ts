import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

const API_BASE = 'http://192.168.1.101:8000';

/**
 * Only one useNarration instance may play at a time across the whole app —
 * screens keep their previous audio alive when React Navigation keeps the
 * prior screen mounted, and Ask Genie's playback is a separate instance
 * entirely. Whoever calls `play` next force-stops whoever held this before.
 */
let activeId: string | null = null;
let activeStop: (() => void) | null = null;

function claim(id: string, stopSelf: () => void) {
  if (activeId && activeId !== id) {
    activeStop?.();
  }
  activeId = id;
  activeStop = stopSelf;
}

function release(id: string) {
  if (activeId === id) {
    activeId = null;
    activeStop = null;
  }
}

/** Stops whatever narration is currently active, from outside any useNarration instance. */
export function stopAllNarration() {
  activeStop?.();
  activeId = null;
  activeStop = null;
}

/**
 * TTS playback for a block of text, via the same `/speak` endpoint used
 * throughout the app.
 */
export function useNarration() {
  const id = useId();
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  // Bumped on every play()/stop() so a stale in-flight fetch — the TTS
  // request is real network latency, easily outlived by a quick tab switch
  // or navigation — recognizes it's been superseded and discards its result
  // instead of spawning a player nobody asked for anymore.
  const tokenRef = useRef(0);

  const stopSelf = useCallback(() => {
    tokenRef.current += 1;
    playerRef.current?.pause();
    playerRef.current?.remove();
    playerRef.current = null;
    setPlaying(false);
  }, []);

  const stop = useCallback(() => {
    stopSelf();
    release(id);
  }, [id, stopSelf]);

  const play = useCallback(async (text: string) => {
    if (!text) return;
    const token = ++tokenRef.current;
    claim(id, stopSelf);
    playerRef.current?.pause();
    playerRef.current?.remove();
    playerRef.current = null;
    setPlaying(true);
    setError(null);

    try {
      const response = await expoFetch(`${API_BASE}/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const bytes = await response.bytes();
      if (tokenRef.current !== token) return; // superseded while fetching

      const file = new File(Paths.cache, `genie-narration-${Date.now()}.mp3`);
      file.write(bytes);

      const player = createAudioPlayer({ uri: file.uri });
      if (tokenRef.current !== token) {
        player.pause();
        player.remove(); // superseded while decoding — never let it start
        return;
      }

      playerRef.current = player;
      player.addListener('playbackStatusUpdate', (status: any) => {
        if (status?.didJustFinish) {
          setPlaying(false);
          release(id);
        }
      });
      player.play();
    } catch (err) {
      if (tokenRef.current !== token) return; // superseded — ignore stale error
      console.error('Error playing narration:', err);
      setError(err instanceof Error ? err.message : 'Failed to play narration');
      setPlaying(false);
      release(id);
    }
  }, [id, stopSelf]);

  // True pause — keeps the player alive so `resume` continues from the same
  // position, instead of `stop`'s full teardown.
  const pause = useCallback(() => {
    playerRef.current?.pause();
    setPlaying(false);
  }, []);

  const resume = useCallback(
    (text: string) => {
      if (playerRef.current) {
        claim(id, stopSelf);
        playerRef.current.play();
        setPlaying(true);
      } else {
        play(text);
      }
    },
    [id, stopSelf, play],
  );

  useEffect(() => stop, [stop]);

  return { playing, error, play, pause, resume, stop };
}
