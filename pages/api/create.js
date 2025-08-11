import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function randomCode(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, code } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing url" });

  // Ensure code: use provided or generate; check uniqueness
  let finalCode = (code || "").trim();
  if (!finalCode) {
    // try a few random attempts to find unused code
    for (let i = 0; i < 5; i++) {
      const tryCode = randomCode(5 + Math.floor(Math.random() * 3));
      const { data } = await supabase.from("links").select("code").eq("code", tryCode).limit(1);
      if (!data || data.length === 0) { finalCode = tryCode; break; }
    }
    if (!finalCode) finalCode = randomCode(8);
  } else {
    // sanitize a bit: remove spaces and slashes
    finalCode = finalCode.replace(/[^a-zA-Z0-9-_]/g, "");
  }

  // check if code already exists
  const { data: exists } = await supabase.from("links").select("code").eq("code", finalCode).limit(1);
  if (exists && exists.length > 0) {
    return res.status(409).json({ error: "Code already exists. Try another." });
  }

  // insert
  const { error } = await supabase.from("links").insert([{ code: finalCode, url }]);
  if (error) return res.status(500).json({ error: error.message });

  const host = req.headers.host || process.env.VERCEL_URL || "your-domain";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const short = `${proto}://${host}/${finalCode}`;

  return res.status(200).json({ short });
}
