import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, code } = req.body;
    if (!url || !code) {
      return res.status(400).json({ error: 'Missing URL or code' });
    }
    const { error } = await supabase.from('links').insert([{ code, url }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ short: `https://${req.headers.host}/${code}` });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
