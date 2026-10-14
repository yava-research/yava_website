import Image from "next/image";

/** Member headshot, or a sand silhouette until a photo is added. */
export function Portrait({ name, photo, priority }: { name: string; photo?: string; priority?: boolean }) {
  return (
    <div className="portrait">
      {photo ? (
        <Image src={photo} alt={name} fill sizes="(max-width: 960px) 100vw, 520px" priority={priority} />
      ) : (
        <svg viewBox="0 0 310 370" preserveAspectRatio="xMidYMax meet" role="img" aria-label={`${name} (photo coming soon)`}>
          <circle cx="155" cy="150" r="58" fill="#DCCDB5" />
          <path d="M45 370 C45 280 95 236 155 236 C215 236 265 280 265 370 Z" fill="#DCCDB5" />
        </svg>
      )}
    </div>
  );
}
