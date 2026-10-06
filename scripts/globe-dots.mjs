// Bakes land dots for the hero globe into public/globe-dots.json.
// Run: node scripts/globe-dots.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const land = feature(topo, topo.objects.land);

// Fibonacci sphere gives evenly spaced samples; keep the ones on land.
const N = 26000;
const out = [];
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const theta = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (geoContains(land, [lon, lat])) out.push(+lat.toFixed(2), +lon.toFixed(2));
}
writeFileSync("public/globe-dots.json", JSON.stringify(out));
console.log(`${out.length / 2} land dots`);
