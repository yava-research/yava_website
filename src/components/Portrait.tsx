import Image from "next/image";

/** Real headshots only; absent photos use a compact, decorative monogram. */
export function Portrait({ name, photo, priority }: { name: string; photo?: string; priority?: boolean }) {
  return (
    <div className="portrait" data-photo={Boolean(photo)}>
      {photo ? (
        <Image src={photo} alt={name} fill sizes="(max-width: 960px) 100vw, 520px" priority={priority} />
      ) : (
        <span className="portrait__initials" aria-hidden="true">{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
      )}
    </div>
  );
}
