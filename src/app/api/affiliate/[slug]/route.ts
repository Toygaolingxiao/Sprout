const FALLBACK_URL = 'https://sprout-rose.vercel.app';

function resolveAffiliateUrl(slug: string) {
  if (slug === 'amazon-baby') {
    const url = new URL('https://www.amazon.co.jp/s');
    url.searchParams.set('k', '出産準備 ベビー用品');
    const tag = process.env.AMAZON_ASSOCIATE_TAG;
    if (tag) {
      url.searchParams.set('tag', tag);
    }
    return url.toString();
  }

  if (slug === 'rakuten-baby') {
    return 'https://search.rakuten.co.jp/search/mall/%E5%87%BA%E7%94%A3%E6%BA%96%E5%82%99/';
  }

  if (slug === 'insurance') {
    return 'https://hokench.com/';
  }

  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const target = resolveAffiliateUrl(slug);

  if (!target) {
    return Response.redirect(FALLBACK_URL, 302);
  }

  return Response.redirect(target, 302);
}
