import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

// Article attachments live in public/publications/files/ and are served at
// /publications/files/<name>. The download route forces a save dialog.
// Names stay ASCII so paths cannot escape the folder.

const FILES_PREFIX = "/publications/files/";
const ROOT = path.resolve(process.cwd(), "public", "publications", "files");
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

const KINDS: Record<string, { label: string; mime: string }> = {
  pdf: { label: "PDF", mime: "application/pdf" },
  xlsx: { label: "Excel workbook", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  xls: { label: "Excel workbook", mime: "application/vnd.ms-excel" },
  csv: { label: "Spreadsheet", mime: "text/csv; charset=utf-8" },
  tsv: { label: "Spreadsheet", mime: "text/tab-separated-values; charset=utf-8" },
  ods: { label: "Spreadsheet", mime: "application/vnd.oasis.opendocument.spreadsheet" },
  docx: { label: "Word document", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  doc: { label: "Word document", mime: "application/msword" },
  pptx: { label: "Presentation", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  ppt: { label: "Presentation", mime: "application/vnd.ms-powerpoint" },
  txt: { label: "Text", mime: "text/plain; charset=utf-8" },
  json: { label: "JSON", mime: "application/json" },
  zip: { label: "Zip archive", mime: "application/zip" },
  mp4: { label: "Video", mime: "video/mp4" },
  webm: { label: "Video", mime: "video/webm" },
  mov: { label: "Video", mime: "video/quicktime" },
};

export type PublicationFile = {
  filename: string;
  extension: string;
  label: string;
  mime: string;
  publicPath: string;
  downloadPath: string;
  absolute: string;
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${Math.max(1, Math.round(kilobytes))} KB`;
  const megabytes = kilobytes / 1024;
  return `${megabytes >= 10 ? Math.round(megabytes) : megabytes.toFixed(1)} MB`;
}

export function isVideoFile(file: PublicationFile): boolean {
  return file.extension === "mp4" || file.extension === "webm" || file.extension === "mov";
}

export function contentDisposition(filename: string): string {
  const ascii = filename.replace(/[^A-Za-z0-9._-]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

/** Describe a /publications/files or /publications/download path. Does not check that the file exists. */
export function publicationFile(input: string | string[]): PublicationFile | null {
  const segments = fileSegments(input);
  if (!segments) return null;

  const filename = segments[segments.length - 1];
  const dot = filename.lastIndexOf(".");
  const extension = dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
  const kind = KINDS[extension];
  if (!kind) return null;

  const absolute = path.resolve(ROOT, ...segments);
  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) return null;

  const encoded = segments.map((segment) => encodeURIComponent(segment)).join("/");
  return {
    filename,
    extension,
    label: kind.label,
    mime: kind.mime,
    publicPath: `${FILES_PREFIX}${encoded}`,
    downloadPath: `/publications/download/${encoded}`,
    absolute,
  };
}

/** Stat a described file, refusing symlinks that point outside the files folder. */
export function publicationFileInfo(file: PublicationFile): { bytes: number; absolute: string } | null {
  if (!existsSync(ROOT) || !existsSync(file.absolute)) return null;
  let realRoot: string;
  let realFile: string;
  try {
    realRoot = realpathSync(ROOT);
    realFile = realpathSync(file.absolute);
  } catch {
    return null;
  }
  if (realFile !== realRoot && !realFile.startsWith(realRoot + path.sep)) return null;
  const info = statSync(realFile);
  if (!info.isFile()) return null;
  return { bytes: info.size, absolute: realFile };
}

function fileSegments(input: string | string[]): string[] | null {
  if (Array.isArray(input)) {
    if (input.length === 0 || input.length > 6) return null;
    if (input.some((segment) => !SEGMENT.test(segment))) return null;
    return input;
  }

  const trimmed = input.trim();
  if (!trimmed || trimmed.includes("\\") || trimmed.includes("\0")) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return null;
  }

  const pathOnly = decoded.split("#")[0]?.split("?")[0] ?? "";
  let rest = pathOnly;
  if (rest.startsWith(FILES_PREFIX)) rest = rest.slice(FILES_PREFIX.length);
  else if (rest.startsWith("/publications/download/")) rest = rest.slice("/publications/download/".length);
  else return null;

  const segments = rest.split("/");
  if (segments.length === 0 || segments.length > 6 || segments.some((segment) => segment.length === 0)) return null;
  if (segments.some((segment) => !SEGMENT.test(segment))) return null;
  return segments;
}
