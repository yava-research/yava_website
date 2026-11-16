import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { contentDisposition, publicationFile, publicationFileInfo } from "@/lib/publication-files";

type DownloadContext = { params: Promise<{ file: string[] }> };

// Forces a save for files in public/publications/files/. Inline reading uses
// the static /publications/files/ URL (the PDF viewer and video player).

async function respond(context: DownloadContext, method: "GET" | "HEAD") {
  const { file } = await context.params;
  const described = publicationFile(file);
  const info = described ? publicationFileInfo(described) : null;
  if (!described || !info) {
    return new Response("File not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const headers = {
    "Content-Type": described.mime,
    "Content-Length": String(info.bytes),
    "Content-Disposition": contentDisposition(described.filename),
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=0, must-revalidate",
  };

  if (method === "HEAD") return new Response(null, { status: 200, headers });

  const body = Readable.toWeb(createReadStream(info.absolute));
  return new Response(body as ReadableStream, { status: 200, headers });
}

export function GET(_request: Request, context: DownloadContext) {
  return respond(context, "GET");
}

export function HEAD(_request: Request, context: DownloadContext) {
  return respond(context, "HEAD");
}
