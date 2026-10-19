// Local storage that tells the truth. A private window, blocked site data or a full quota makes the
// browser refuse a write, and a tool that then says "Saved" is wrong (Wave F r1, Astra). Every tool
// that keeps something on this device writes through here and shows a notice when this returns false.
// The Caffeine diary keeps its own versioned store (diary.ts), with the same notice.

/** The stored value, or null when there is none or the browser won't let the page read it. */
export function readLocal(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

/** Writes the value; false when the browser refused it, so the tool can say it isn't kept. */
export function writeLocal(key: string, value: string): boolean {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}

/** Whether this browser lets the page keep anything at all: for a tool that promises it before any write. */
export function canStore(): boolean {
  const k = 'jayarr-storage-probe';
  try { localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch { return false; }
}
