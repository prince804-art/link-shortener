import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function getServerSideProps({ params }) {
  const { code } = params;

  // fetch single matching link
  const { data, error } = await supabase
    .from("links")
    .select("url")
    .eq("code", code)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: data.url,
      permanent: false
    }
  };
}

export default function RedirectPage() {
  return null;
}
