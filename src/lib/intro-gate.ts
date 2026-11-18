/** Session flag: once the intro has played (or been skipped) it does not play again this session. */
export const INTRO_KEY = "chawni-intro";
/** Attribute on <html> while the intro owns the screen. CSS and the hero read it. */
export const INTRO_ATTR = "data-intro";
/** Fired on window whenever the attribute changes, so the hero can start its timer. */
export const INTRO_EVENT = "chawni-intro-change";
/** If the intro's code has not arrived after this long, skip the intro instead of delaying the page. */
export const INTRO_LOAD_TIMEOUT_MS = 1200;

/** The deadline above, unless a test raised it (`window.__CHAWNI_INTRO_TIMEOUT_MS`) so parallel runs stay reliable. */
export function introLoadTimeout(): number {
  const o = (window as Window & { __CHAWNI_INTRO_TIMEOUT_MS?: number }).__CHAWNI_INTRO_TIMEOUT_MS;
  return typeof o === "number" && o > 0 ? o : INTRO_LOAD_TIMEOUT_MS;
}

export interface IntroEnv {
  reducedMotion: boolean;
  /** `sessionStorage` flag already set. */
  seen: boolean;
  /** `navigator.webdriver` (automation, Lighthouse, most test runners). */
  webdriver: boolean;
  saveData: boolean;
  userAgent: string;
}

const BOT = /bot|crawl|spider|lighthouse|headless|prerender/i;

/** The one rule for whether the intro plays. WebGL support is checked separately, when the scene starts. */
export function shouldPlayIntro(env: IntroEnv): boolean {
  if (env.reducedMotion || env.seen || env.webdriver || env.saveData) return false;
  if (BOT.test(env.userAgent)) return false;
  return true;
}

/** Reads the real environment. Every access is guarded: storage and connection info can be unavailable. */
export function readIntroEnv(): IntroEnv {
  let seen = false;
  try {
    seen = sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    /* storage unavailable: treat as not seen */
  }
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    seen,
    webdriver: navigator.webdriver === true,
    saveData: conn?.saveData === true,
    userAgent: navigator.userAgent,
  };
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Is the intro currently playing? (client only) */
export function isIntroPlaying(): boolean {
  return document.documentElement.getAttribute(INTRO_ATTR) === "playing";
}

export function setIntroPlaying(on: boolean): void {
  if (on) document.documentElement.setAttribute(INTRO_ATTR, "playing");
  else document.documentElement.removeAttribute(INTRO_ATTR);
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/**
 * Tiny inline script rendered with the Home page. It runs before first paint and marks <html> so the
 * dark cover shows immediately (no flash of the hero before the intro). It applies the same rule as
 * `shouldPlayIntro`; the client component then confirms or cancels it.
 */
export const INTRO_PRE_PAINT_SCRIPT = `(function(){try{var d=document.documentElement,n=navigator,c=n.connection;if(matchMedia("(prefers-reduced-motion: reduce)").matches||n.webdriver===true||(c&&c.saveData)||/bot|crawl|spider|lighthouse|headless|prerender/i.test(n.userAgent))return;try{if(sessionStorage.getItem("${INTRO_KEY}")==="1")return}catch(e){}d.setAttribute("${INTRO_ATTR}","playing")}catch(e){}})()`;
