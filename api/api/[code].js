import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function getServerSideProps({ params }) {
  const { code } = params;
  const { data } = await supabase
    .from('links')
    .select('url')
    .eq('code', code)
    .single();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: data.url,
      permanent: false,
    },
  };
}

export default function RedirectPage() {
  return null;
}
