/**
 * AudioBuffer cache to prevent repeated fetching of sound files.
 */
let beepBuffer: AudioBuffer | null = null;
const audioBufferCache = new Map<string, AudioBuffer>();
const AudioContextClass =
  typeof window !== "undefined"
    ? window.AudioContext || (window as any).webkitAudioContext
    : null;

const audioCtx = AudioContextClass ? new AudioContextClass() : null;

const resumeAudioContext = async () => {
  if (!audioCtx) return false;

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  return audioCtx.state === "running";
};

const preloadAudioBuffer = async (src: string) => {
  if (!audioCtx) return null;

  const cachedBuffer = audioBufferCache.get(src);
  if (cachedBuffer) return cachedBuffer;

  try {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioBufferCache.set(src, decodedBuffer);
    return decodedBuffer;
  } catch (error) {
    console.warn("Failed to preload sound:", src, error);
    return null;
  }
};

/**
 * Preloads the scanner beep sound to ensure zero latency during operations.
 */
const preloadScannerSound = async () => {
  if (beepBuffer || !audioCtx) return;
  beepBuffer = await preloadAudioBuffer("/sound-effects/store-scanner-beep.mp3");
};

// Start preloading immediately
if (typeof window !== "undefined") {
  preloadScannerSound();
}

/**
 * Plays the store scanner beep sound using the Web Audio API.
 * Uses a cached AudioBuffer for instant, jitter-free playback.
 */
export const playScannerBeep = async () => {
  try {
    if (!audioCtx) return;

    const isReady = await resumeAudioContext();
    if (!isReady) return;

    // If not loaded yet, try to load it now
    if (!beepBuffer) {
      await preloadScannerSound();
    }

    if (beepBuffer) {
      const source = audioCtx.createBufferSource();
      source.buffer = beepBuffer;
      source.connect(audioCtx.destination);
      source.start(0);
    }
  } catch (error) {
    console.warn("Audio feedback failed:", error);
  }
};

export const primeAudioPlayback = async (src?: string) => {
  try {
    if (!audioCtx) return false;

    const isReady = await resumeAudioContext();
    if (!isReady) return false;

    if (src) {
      await preloadAudioBuffer(src);
    }

    return true;
  } catch (error) {
    console.warn("Audio priming failed:", error);
    return false;
  }
};

export const playSoundEffect = async (src: string, volume = 0.5) => {
  try {
    if (!audioCtx) return false;

    const isReady = await resumeAudioContext();
    if (!isReady) return false;

    const audioBuffer = await preloadAudioBuffer(src);
    if (!audioBuffer) return false;

    const source = audioCtx.createBufferSource();
    const gainNode = audioCtx.createGain();

    source.buffer = audioBuffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(0);

    return true;
  } catch (error) {
    console.warn("Sound effect failed:", error);
    return false;
  }
};
