// Eerlijk lootjes trekken voor LeukeKeuze (14-11-2026, GO Marius: 'nu kan de verzender zien wie welk lootje krijgt, dat is niet eerlijk').
// Bron: scripts/lootjes/lootjes.ts in de repo. Geen sleutels in de code: de functie gebruikt de eigen service-sleutel van Supabase.
// Werking: de organisator maakt een groep; de server trekt meteen en bewaart wie wie heeft, maar geeft dat NIET aan de organisator.
// Iedereen opent het groepslinkje, kiest zijn eigen naam (één keer, daarna is die naam vergeven) en ziet alleen zijn eigen lootje.
// Bewaard: alleen voornamen. Alles ouder dan 60 dagen wordt bij elke aanroep weggegooid.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const ORIGINS = ["https://leukekeuze.nl", "https://www.leukekeuze.nl", "http://localhost:8765", "http://127.0.0.1:8765"];
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

function cors(origin: string): Record<string, string> {
  return { "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0], "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
}
function antwoord(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...cors(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
function schoon(s: unknown, max: number): string {
  return String(s ?? "").replace(/[\u0000-\u001f<>{}"`\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}
function code(n: number): string {
  const t = "abcdefghjkmnpqrstuvwxyz23456789", b = crypto.getRandomValues(new Uint8Array(n));
  let s = ""; for (const x of b) s += t[x % t.length]; return s;
}
// Iedereen trekt een ander, niemand zichzelf of zijn partner.
function trek(namen: string[], nietSamen: Map<string, string>): string[] | null {
  const mag = (a: string, b: string) => a !== b && nietSamen.get(a) !== b;
  for (let p = 0; p < 5000; p++) {
    const r = namen.slice();
    for (let i = r.length - 1; i > 0; i--) { const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1); [r[i], r[j]] = [r[j], r[i]]; }
    if (namen.every((n, k) => mag(n, r[k]))) return r;
  }
  return null;
}
// Eenvoudige bescherming tegen misbruik: hooguit 20 nieuwe groepen per uur per adres.
const maakTeller = new Map<string, number[]>();
function teVeel(ip: string): boolean {
  const nu = Date.now(), l = (maakTeller.get(ip) || []).filter((t) => nu - t < 3600000);
  if (l.length >= 20) return true;
  l.push(nu); maakTeller.set(ip, l); if (maakTeller.size > 5000) maakTeller.clear(); return false;
}
function ip(req: Request): string {
  return (req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || (req.headers.get("x-forwarded-for") || "").split(",").pop() || "?").trim();
}
let laatsteOpruim = 0;
async function opruimen() {
  if (Date.now() - laatsteOpruim < 3600000) return;
  laatsteOpruim = Date.now();
  await db.from("lk_loot_groepen").delete().lt("gemaakt", new Date(Date.now() - 60 * 86400000).toISOString());
}
async function groep(g: string) {
  const { data } = await db.from("lk_loot_groepen").select("id,naam,budget,moment,ronde,beheer,stellen").eq("id", g).maybeSingle();
  return data;
}
async function deelnemers(g: string) {
  const { data } = await db.from("lk_loot_deelnemers").select("nr,naam,getrokken,token,gekozen").eq("groep_id", g).order("nr");
  return data || [];
}
function openbaar(gr: { naam: string; budget: number; moment: string; ronde: number }, d: { nr: number; naam: string; gekozen: string | null }[]) {
  return { naam: gr.naam, budget: gr.budget, moment: gr.moment, ronde: gr.ronde, namen: d.map((x) => ({ nr: x.nr, naam: x.naam, gekozen: !!x.gekozen })) };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return antwoord({ fout: "Niet toegestaan." }, 405, origin);
  if (origin && !ORIGINS.includes(origin)) return antwoord({ fout: "Niet toegestaan." }, 403, origin);
  let inv: Record<string, unknown> = {};
  try { inv = await req.json(); } catch { return antwoord({ fout: "Er ging iets mis." }, 400, origin); }
  opruimen().catch(() => {});
  const actie = String(inv.actie || "");
  const g = schoon(inv.g, 20);
  try {
    if (actie === "maak") {
      if (teVeel(ip(req))) return antwoord({ fout: "Je hebt al heel veel groepen gemaakt. Probeer het later nog eens." }, 429, origin);
      const gezien = new Set<string>();
      const namen = (Array.isArray(inv.namen) ? inv.namen : []).map((n) => schoon(n, 25)).filter((n) => { const k = n.toLowerCase(); if (!n || gezien.has(k)) return false; gezien.add(k); return true; });
      if (namen.length < 3) return antwoord({ fout: "Vul minstens 3 verschillende namen in." }, 400, origin);
      if (namen.length > 40) return antwoord({ fout: "Het kan met hooguit 40 mensen." }, 400, origin);
      const nietSamen = new Map<string, string>();
      for (const s of Array.isArray(inv.stellen) ? inv.stellen : []) {
        if (!Array.isArray(s)) continue;
        const a = schoon(s[0], 25), b = schoon(s[1], 25);
        if (a && b && a !== b && namen.includes(a) && namen.includes(b)) { nietSamen.set(a, b); nietSamen.set(b, a); }
      }
      const r = trek(namen, nietSamen);
      if (!r) return antwoord({ fout: "Met deze stellen lukt het niet om eerlijk te trekken. Haal een stel weg of zet er iemand bij." }, 400, origin);
      const id = code(10), beheer = code(24);
      const budget = Math.min(500, Math.max(1, Math.round(Number(inv.budget) || 15)));
      const moment = ["s", "k", "a"].includes(String(inv.moment)) ? String(inv.moment) : "s";
      const stellen: string[][] = []; for (const [a, b] of nietSamen) if (a < b) stellen.push([a, b]);
      const { error: e1 } = await db.from("lk_loot_groepen").insert({ id, beheer, naam: schoon(inv.naam, 30), budget, moment, stellen });
      if (e1) throw e1;
      const { error: e2 } = await db.from("lk_loot_deelnemers").insert(namen.map((n, i) => ({ groep_id: id, nr: i + 1, naam: n, getrokken: r[i] })));
      if (e2) throw e2;
      return antwoord({ g: id, beheer }, 200, origin);
    }
    const gr = g ? await groep(g) : null;
    if (!gr) return antwoord({ fout: "Deze groep bestaat niet (meer). Vraag de organisator om een nieuw linkje." }, 404, origin);
    if (actie === "groep") return antwoord(openbaar(gr, await deelnemers(g)), 200, origin);
    if (actie === "kies") {
      const nr = Number(inv.nr) || 0, token = code(24);
      const { data, error } = await db.from("lk_loot_deelnemers").update({ token, gekozen: new Date().toISOString() }).eq("groep_id", g).eq("nr", nr).is("gekozen", null).select("naam,getrokken");
      if (error) throw error;
      if (!data || !data.length) return antwoord({ fout: "Deze naam is al gekozen. Ben jij dit en zie je je lootje niet? Vraag de organisator om opnieuw te trekken." }, 409, origin);
      return antwoord({ token, naam: data[0].naam, getrokken: data[0].getrokken, groep: gr.naam, budget: gr.budget, moment: gr.moment }, 200, origin);
    }
    if (actie === "mijn") {
      const token = schoon(inv.token, 30);
      if (token.length < 20) return antwoord({ fout: "Dit lootje is niet gevonden." }, 404, origin);
      const { data } = await db.from("lk_loot_deelnemers").select("naam,getrokken").eq("groep_id", g).eq("token", token).maybeSingle();
      if (!data) return antwoord({ fout: "Dit lootje is niet (meer) gevonden. Misschien is er opnieuw getrokken: kies je naam dan opnieuw." }, 404, origin);
      return antwoord({ naam: data.naam, getrokken: data.getrokken, groep: gr.naam, budget: gr.budget, moment: gr.moment }, 200, origin);
    }
    if (actie === "status" || actie === "opnieuw") {
      if (schoon(inv.beheer, 30) !== gr.beheer) return antwoord({ fout: "Alleen de organisator kan dit doen." }, 403, origin);
      if (actie === "opnieuw") {
        const d = await deelnemers(g), namen = d.map((x) => x.naam);
        const ns = new Map<string, string>(); for (const p of (gr.stellen || []) as string[][]) { ns.set(p[0], p[1]); ns.set(p[1], p[0]); }
        const r = trek(namen, ns);
        if (!r) return antwoord({ fout: "Opnieuw trekken lukt niet." }, 400, origin);
        for (let i = 0; i < d.length; i++) {
          const { error } = await db.from("lk_loot_deelnemers").update({ getrokken: r[i], token: null, gekozen: null }).eq("groep_id", g).eq("nr", d[i].nr);
          if (error) throw error;
        }
        await db.from("lk_loot_groepen").update({ ronde: gr.ronde + 1 }).eq("id", g);
        gr.ronde++;
      }
      return antwoord(openbaar(gr, await deelnemers(g)), 200, origin);
    }
    return antwoord({ fout: "Onbekende actie." }, 400, origin);
  } catch (e) {
    console.error("lootjes fout:", String((e as Error)?.message || e).slice(0, 200));
    return antwoord({ fout: "Het lukt even niet. Probeer het over een minuutje opnieuw." }, 500, origin);
  }
});
