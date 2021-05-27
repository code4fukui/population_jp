import { CSV } from "https://js.sabae.cc/CSV.js";
import { JAPAN_PREF, JAPAN_PREF_EN, JAPAN_PREF_ISO } from "https://js.sabae.cc/JAPAN_PREF.js";
import { NDJSON } from "https://js.sabae.cc/NDJSON.js";

const data = CSV.parse(await Deno.readTextFile("../org/05k01-2.csv"));
const lastUpdate = "2019-10-01";
const res = [];
for (const d of data) {
  const id = parseInt(d.ID, 10);
  const d2 = {
    "ISO3166-2": JAPAN_PREF_ISO[id - 1],
    name: JAPAN_PREF_EN[id - 1],
    name_jp: JAPAN_PREF[id - 1],
  };
  delete d.ID;
  delete d.name;
  delete d.name_jp;
  for (const n in d) {
    d2[n] = parseInt(d[n].replace(/,/g, "")) * 1000;
  }
  d2.lastUpdate = lastUpdate;
  res.push(d2);
}
const csv = CSV.stringify(res);
await Deno.writeTextFile("../population_jp_2019.csv", csv);
await Deno.writeTextFile("../population_jp.csv", csv);
await Deno.writeTextFile("../population_jp.json", JSON.stringify(res, null, 2));
await Deno.writeTextFile("../population_jp.ndjson", NDJSON.stringify(res));
