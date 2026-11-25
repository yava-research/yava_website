export function headingId(title: string) {
  return title.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
}

/** Plain text of a markdown heading, matching what the rendered heading shows. */
export function headingText(markdown: string) {
  return markdown
    .replace(/\{\/\*.*?\*\/\}/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|`|==)(.+?)\1/g, "$2")
    .replace(/\\([\\`*_{}[\]()#+\-.!$])/g, "$1")
    .replace(/\s+#+\s*$/, "")
    .trim();
}
