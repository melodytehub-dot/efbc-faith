import { readFileSync } from "node:fs";
import path from "node:path";

export type Song = {
  number: number | null;
  title: string;
  slug: string;
  lines: string[];
};

function readPublicJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(process.cwd(), "public", "data", file), "utf8")) as T;
}

export function getHymns(): Song[] {
  return readPublicJson<Song[]>("hymns.json");
}

export function getReadings(): Song[] {
  return readPublicJson<Song[]>("readings.json");
}
