// Remote article embeds. Local files are resolved in publication-files.ts.
// Only known players are turned into frames — other links stay links.

export type RemoteVideo = {
  src: string;
  provider: "YouTube" | "Vimeo";
  ratio: "wide" | "short";
};

export function httpsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

export function tweetId(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "");
  if (!["twitter.com", "mobile.twitter.com", "x.com", "mobile.x.com"].includes(host)) return null;
  const match = url.pathname.match(/\/status(?:es)?\/(\d+)/);
  return match?.[1] ?? null;
}

export function remoteVideo(value: string): RemoteVideo | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");

  const youtubeId = youtubeVideoId(url, host);
  if (youtubeId) {
    const params = new URLSearchParams({ rel: "0" });
    const start = youtubeStart(url);
    if (start) params.set("start", start);
    return {
      src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?${params}`,
      provider: "YouTube",
      ratio: url.pathname.startsWith("/shorts/") ? "short" : "wide",
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const match = url.pathname.match(/\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/);
    if (!match) return null;
    const params = new URLSearchParams({ dnt: "1" });
    if (match[2]) params.set("h", match[2]);
    return {
      src: `https://player.vimeo.com/video/${match[1]}?${params}`,
      provider: "Vimeo",
      ratio: "wide",
    };
  }

  return null;
}

function youtubeVideoId(url: URL, host: string): string | null {
  const youtube = host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com";
  if (!youtube) return null;
  const raw = host === "youtu.be"
    ? url.pathname.split("/").filter(Boolean)[0]
    : url.pathname === "/watch"
      ? url.searchParams.get("v")
      : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
  if (!raw || !/^[\w-]{6,}$/.test(raw)) return null;
  return raw;
}

function youtubeStart(url: URL): string | null {
  const raw = url.searchParams.get("start") || url.searchParams.get("t");
  if (!raw) return null;
  if (/^\d+$/.test(raw)) return raw;
  const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match || match[0] === "") return null;
  const seconds = Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
  return seconds > 0 ? String(seconds) : null;
}
