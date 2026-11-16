export function headingId(title: string) {
  return title.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
}
