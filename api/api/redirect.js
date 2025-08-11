import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { code } = req.query;
  const { data, error } = await supabase.from('links').select('url').eq('code', code).single();
  if (error || !data) {
    return res.status(404).send('Short link not found');
  }
  res.writeHead(302, { Location: data.url });
  res.end();
}
