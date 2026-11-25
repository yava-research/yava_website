import type { ReactNode } from "react";
import { httpsUrl, remoteVideo } from "@/lib/embeds";
import {
  formatBytes,
  isVideoFile,
  publicationFile,
  publicationFileInfo,
  type PublicationFile,
} from "@/lib/publication-files";

// Article exhibits. Available in every MDX file without an import.
//   <Pdf src="/publications/files/note.pdf" title="Full note" />
//   <Video src="https://www.youtube.com/watch?v=…" title="Desk briefing" />
//   <Download href="/publications/files/model.xlsx" title="Valuation model" />

function Missing({ children }: { children: ReactNode }) {
  return <p className="attachment-missing">{children}</p>;
}

function devHint(file: PublicationFile | null) {
  if (process.env.NODE_ENV !== "development") return null;
  if (file) return ` Add it at public${file.publicPath}.`;
  return " Use a path like /publications/files/october-model.xlsx.";
}

function FileActions({ file, title, watch }: { file?: PublicationFile; title: string; watch?: { href: string; provider: string } }) {
  return (
    <div className="exhibit__actions">
      {watch && (
        <a className="btn btn--outline btn--sm" href={watch.href} target="_blank" rel="noreferrer">
          Watch on {watch.provider}
          <span className="sr-only">: {title} (opens in a new tab)</span>
        </a>
      )}
      {file && (
        <>
          {file.extension === "pdf" && (
            <a className="btn btn--outline btn--sm" href={file.publicPath} target="_blank" rel="noreferrer">
              Open PDF
              <span className="sr-only">: {title} (opens in a new tab)</span>
            </a>
          )}
          <a className="btn btn--solid btn--sm" href={file.downloadPath} download={file.filename}>
            Download
            <span className="sr-only"> {title}</span>
          </a>
        </>
      )}
    </div>
  );
}

export function Pdf({ src, title = "PDF", caption, children }: { src: string; title?: string; caption?: string; children?: ReactNode }) {
  const file = publicationFile(src);
  const info = file?.extension === "pdf" ? publicationFileInfo(file) : null;
  if (!file || file.extension !== "pdf" || !info) {
    return (
      <Missing>
        This PDF is not available.
        {devHint(file?.extension === "pdf" ? file : null)}
      </Missing>
    );
  }

  const note = children ?? caption;
  return (
    <figure className="exhibit pdf-exhibit">
      <div className="exhibit__bar">
        <div className="exhibit__copy">
          <p className="meta-label">PDF</p>
          <p className="exhibit__title">{title}</p>
          <p className="exhibit__size">{formatBytes(info.bytes)}</p>
        </div>
        <FileActions file={file} title={title} />
      </div>
      <iframe className="pdf-exhibit__frame" src={file.publicPath} title={title} loading="lazy" />
      {note ? <figcaption>{note}</figcaption> : null}
    </figure>
  );
}

export function Video({ src, title = "Video", caption, children }: { src: string; title?: string; caption?: string; children?: ReactNode }) {
  const remote = remoteVideo(src);
  const file = publicationFile(src);
  const local = file && isVideoFile(file) ? file : null;
  const info = local ? publicationFileInfo(local) : null;
  const note = children ?? caption;

  if (remote) {
    return (
      <figure className="exhibit video-exhibit">
        <div className="exhibit__bar">
          <div className="exhibit__copy">
            <p className="meta-label">{remote.provider}</p>
            <p className="exhibit__title">{title}</p>
          </div>
          <FileActions title={title} watch={{ href: src, provider: remote.provider }} />
        </div>
        <div className="video-exhibit__frame" data-ratio={remote.ratio}>
          <iframe
            src={remote.src}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        {note ? <figcaption>{note}</figcaption> : null}
      </figure>
    );
  }

  if (local && info) {
    return (
      <figure className="exhibit video-exhibit">
        <div className="exhibit__bar">
          <div className="exhibit__copy">
            <p className="meta-label">Video</p>
            <p className="exhibit__title">{title}</p>
            <p className="exhibit__size">{formatBytes(info.bytes)}</p>
          </div>
          <FileActions file={local} title={title} />
        </div>
        <div className="video-exhibit__frame" data-ratio="wide">
          <video controls playsInline preload="metadata" src={local.publicPath}>
            <a href={local.downloadPath} download={local.filename}>
              Download {title}
            </a>
          </video>
        </div>
        {note ? <figcaption>{note}</figcaption> : null}
      </figure>
    );
  }

  const fallback = httpsUrl(src);
  return (
    <Missing>
      This video is not available.
      {fallback ? (
        <>
          {" "}
          <a href={fallback} target="_blank" rel="noreferrer">
            Open the video
          </a>
          .
        </>
      ) : null}
      {process.env.NODE_ENV === "development"
        ? " Use a YouTube or Vimeo link, or an mp4, webm, or mov file in public/publications/files/."
        : null}
    </Missing>
  );
}

type DownloadItem = { href?: string; src?: string; title: string; description?: string };

export function Download({
  href,
  src,
  title = "Download",
  description,
  children,
  files,
}: DownloadItem & { children?: ReactNode; files?: DownloadItem[] }) {
  const items = files?.length
    ? files
    : href || src
      ? [{ href, src, title, description }]
      : [];
  if (items.length === 0) return null;

  return (
    <div className="attachments">
      {items.map((item, index) => (
        <FileRow
          key={`${item.href || item.src || "file"}-${index}`}
          href={item.href || item.src || ""}
          title={item.title}
          detail={index === 0 && !files?.length ? (children ?? item.description) : item.description}
        />
      ))}
    </div>
  );
}

function FileRow({ href, title, detail }: { href: string; title: string; detail?: ReactNode }) {
  const file = href ? publicationFile(href) : null;
  const info = file ? publicationFileInfo(file) : null;
  if (!file || !info) {
    return (
      <p className="attachment-missing">
        {title} is not available.
        {devHint(file)}
      </p>
    );
  }

  return (
    <div className="attachment">
      <div className="exhibit__copy">
        <p className="meta-label">{file.label}</p>
        <p className="exhibit__title">{title}</p>
        {detail ? <div className="attachment__detail">{detail}</div> : null}
        <p className="exhibit__size">{formatBytes(info.bytes)}</p>
      </div>
      <a className="btn btn--solid btn--sm" href={file.downloadPath} download={file.filename}>
        Download
        <span className="sr-only"> {title}</span>
      </a>
    </div>
  );
}
