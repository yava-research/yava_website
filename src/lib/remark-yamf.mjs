// Local remark plugin for article MDX.
//
// 1. ==highlighted text==  ->  <mark>highlighted text</mark>  (yellow highlighter)
// 2. ```mermaid fences      ->  <Mermaid chart="…" />           (rendered client-side)
// 3. Footnotes[^1]          ->  <Sidenote n={1}>…</Sidenote>    (shown in the right margin)
//    [^1]: The note text, written anywhere in the file (usually at the end).
//
// Registered by path in next.config.ts. It has no options, so it is safe to
// use with Turbopack. Dependency-free on purpose.

const HIGHLIGHT = /==(?=\S)([^=\n]*?\S)==/g;
const SKIP = new Set(["code", "inlineCode", "math", "inlineMath", "mdxFlowExpression", "mdxTextExpression", "mdxjsEsm"]);

function splitHighlights(value) {
  const parts = [];
  let last = 0;
  for (const match of value.matchAll(HIGHLIGHT)) {
    if (match.index > last) parts.push({ type: "text", value: value.slice(last, match.index) });
    parts.push({
      type: "highlight",
      data: { hName: "mark" },
      children: [{ type: "text", value: match[1] }],
    });
    last = match.index + match[0].length;
  }
  if (!parts.length) return null;
  if (last < value.length) parts.push({ type: "text", value: value.slice(last) });
  return parts;
}

function walk(node) {
  if (!node.children || SKIP.has(node.type)) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === "code" && child.lang === "mermaid") {
      next.push({
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [{ type: "mdxJsxAttribute", name: "chart", value: child.value }],
        children: [],
      });
      continue;
    }
    if (child.type === "text") {
      const parts = splitHighlights(child.value);
      if (parts) {
        next.push(...parts);
        continue;
      }
    }
    walk(child);
    next.push(child);
  }
  node.children = next;
}

// Phrasing content (inline nodes) of a footnote definition. Paragraphs are
// joined with a line break; anything block-level is flattened to its inline parts.
function phrasing(nodes) {
  const out = [];
  nodes.forEach((node, index) => {
    if (node.type === "paragraph" || node.type === "heading") {
      if (index > 0) out.push({ type: "break" });
      out.push(...node.children);
    } else if (node.children) {
      out.push(...phrasing(node.children));
    } else {
      out.push(node);
    }
  });
  return out;
}

function sidenotes(tree) {
  const definitions = new Map();
  const collect = (node) => {
    if (!node.children) return;
    node.children = node.children.filter((child) => {
      if (child.type === "footnoteDefinition") {
        definitions.set(child.identifier, child);
        return false;
      }
      collect(child);
      return true;
    });
  };
  collect(tree);

  const numbers = new Map();
  const replace = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type !== "footnoteReference") {
        replace(child);
        return child;
      }
      const definition = definitions.get(child.identifier);
      const seen = numbers.has(child.identifier);
      if (!seen) numbers.set(child.identifier, numbers.size + 1);
      const n = numbers.get(child.identifier);
      return {
        type: "mdxJsxTextElement",
        name: "Sidenote",
        attributes: [
          { type: "mdxJsxAttribute", name: "n", value: String(n) },
          // A repeated reference shows the number only; the note sits at the first one.
          ...(seen ? [{ type: "mdxJsxAttribute", name: "repeat", value: null }] : []),
        ],
        children: !seen && definition ? phrasing(definition.children) : [],
      };
    });
  };
  replace(tree);
}

export default function remarkYamf() {
  return (tree) => {
    sidenotes(tree);
    walk(tree);
  };
}
