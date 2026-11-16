"use client";

import { useEffect, useRef, useState } from "react";
import { httpsUrl, tweetId } from "@/lib/embeds";

// Public posts render through X's embed frame. The caption link remains if the
// frame is blocked. Height follows the frame's own resize message.

export function Tweet({ url }: { url: string }) {
  const id = tweetId(url);
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(560);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;

    function onMessage(event: MessageEvent) {
      if (event.source !== iframe?.contentWindow) return;
      if (!trustedEmbedOrigin(event.origin)) return;
      const next = readEmbedHeight(event.data);
      if (next) setHeight(next);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [id]);

  if (!id) {
    const fallback = httpsUrl(url);
    return (
      <p className="attachment-missing">
        This post is not available.
        {fallback ? (
          <>
            {" "}
            <a href={fallback} target="_blank" rel="noreferrer">
              Open the post
            </a>
            .
          </>
        ) : null}
        {process.env.NODE_ENV === "development" ? " Use a public post link, such as https://x.com/name/status/123." : null}
      </p>
    );
  }

  return (
    <figure className="tweet-exhibit">
      <iframe
        ref={frame}
        src={`https://platform.twitter.com/embed/Tweet.html?id=${id}&dnt=true&theme=light`}
        title="Post on X"
        loading="lazy"
        style={{ height }}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <figcaption>
        <a href={url} target="_blank" rel="noreferrer">
          View this post on X
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}

function trustedEmbedOrigin(origin: string) {
  try {
    const host = new URL(origin).hostname;
    return host === "platform.twitter.com" || host === "platform.x.com" || host === "twitter.com" || host === "x.com";
  } catch {
    return false;
  }
}

function readEmbedHeight(data: unknown): number | null {
  const payload = typeof data === "string" ? parseJson(data) : data;
  if (!payload || typeof payload !== "object") return null;
  const embed = (payload as { "twttr.embed"?: { method?: string; params?: unknown[] } })["twttr.embed"];
  if (!embed || embed.method !== "twttr.private.resize") return null;
  const first = embed.params?.[0];
  if (!first || typeof first !== "object" || !("height" in first)) return null;
  const height = Number((first as { height: unknown }).height);
  if (!Number.isFinite(height) || height < 180 || height > 1400) return null;
  return Math.round(height);
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
