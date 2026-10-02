'use client';
// Bucky's two little sounds, synthesised with Web Audio (no audio files to load).
//   hover  a soft rising "boop-bip"
//   click  a cheerful chirp with a sparkle on top
// Browsers only allow sound after the visitor has interacted with the page (a click, tap or
// key press), so the hover sound starts working after the first interaction.

const MUTE_KEY = 'bucky-muted';
let ctx = null;

function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** Resume audio on the visitor's first interaction anywhere on the page. */
export function unlockOnFirstGesture() {
  const unlock = () => {
    const a = audio();
    if (a && a.state === 'suspended') a.resume().catch(() => {});
  };
  for (const ev of ['pointerdown', 'keydown', 'touchstart']) addEventListener(ev, unlock, { capture: true, passive: true });
}

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {}
}

function tone(a, { type = 'sine', from, to = from, start = 0, dur, vol = 0.12 }) {
  const t0 = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function play(fn) {
  if (isMuted()) return;
  const a = audio();
  if (!a || a.state !== 'running') return;
  fn(a);
}

export function playHover() {
  play((a) => {
    tone(a, { from: 620, to: 700, dur: 0.09, vol: 0.09 });
    tone(a, { from: 930, to: 1180, start: 0.08, dur: 0.12, vol: 0.08 });
  });
}

export function playClick() {
  play((a) => {
    tone(a, { type: 'triangle', from: 480, to: 1320, dur: 0.16, vol: 0.14 });
    tone(a, { type: 'sine', from: 1760, to: 2100, start: 0.13, dur: 0.1, vol: 0.07 });
    tone(a, { type: 'sine', from: 2350, to: 2640, start: 0.2, dur: 0.09, vol: 0.05 });
  });
}
