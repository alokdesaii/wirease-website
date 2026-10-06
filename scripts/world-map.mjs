// Bakes an SVG world map + great-circle routes from Hong Kong into src/lib/worldmap.json.
// Run: node scripts/world-map.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoMercator, geoPath, geoGraticule, geoInterpolate } from "d3-geo";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));
// Flat map: Mercator centred on 150E so the seam falls in the Atlantic and trans-Pacific
// routes (HK to the US) draw unbroken. Antarctica dropped, framed 58S to 80N.
const countries = feature(topo, topo.objects.countries);
countries.features = countries.features.filter((f) => f.properties.name !== "Antarctica");
const W = 1000, H = 560;
const C = 150;
const frame = { type: "Feature", geometry: { type: "LineString", coordinates: [[C - 179.9, -58], [C + 179.9, -58], [C + 179.9, 80], [C - 179.9, 80]] } };
const proj = geoMercator().rotate([-C, 0]).fitExtent([[0, 0], [W, H]], frame);
const path = geoPath(proj);
const r = (s) => s.replace(/(\d+\.\d)\d+/g, "$1");

const HK = [114.17, 22.3];
const CITIES = {
  London: [-0.12, 51.5], Melbourne: [144.96, -37.81], Mumbai: [72.88, 19.07], Manila: [120.98, 14.6],
  Dubai: [55.27, 25.2], Kathmandu: [85.32, 27.7], Toronto: [-79.38, 43.65], Lagos: [3.38, 6.52], Singapore: [103.82, 1.35],
  "New York": [-74.0, 40.71], "Los Angeles": [-118.24, 34.05], Tokyo: [139.69, 35.68], Johannesburg: [28.05, -26.2],
};
const routes = Object.entries(CITIES).map(([name, c]) => {
  const ip = geoInterpolate(HK, c);
  const pts = Array.from({ length: 64 }, (_, i) => proj(ip(i / 63)));
  // Skip routes that wrap around the antimeridian edge of the projection.
  const jump = pts.some((p, i) => i && Math.abs(p[0] - pts[i - 1][0]) > W / 3);
  return { name, d: jump ? null : "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L"), at: proj(c).map((v) => +v.toFixed(1)) };
}).filter((x) => x.d);

writeFileSync("src/lib/worldmap.json", JSON.stringify({
  w: W, h: H,
  land: countries.features.map((f) => r(path(f) ?? "")).filter(Boolean),
  grid: r(path(geoGraticule().step([15, 15]).extent([[-180, -58], [180.1, 80.1]])())),
  hk: proj(HK).map((v) => +v.toFixed(1)),
  routes,
}));
console.log(routes.map((x) => x.name).join(", "));
