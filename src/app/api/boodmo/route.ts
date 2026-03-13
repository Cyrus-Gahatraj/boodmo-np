const API_BASE_URL = process.env.BOODMO_API_BASE_URL;
const API_LOGIN = process.env.BOODMO_API_LOGIN;
const API_PASSWORD = process.env.BOODMO_API_PASSWORD;

async function boodmoFetch(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${API_LOGIN}:${API_PASSWORD}`).toString("base64")}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Boodmo API error: ${res.status}`);
  }

  return res.json();
}

/* ---------- ROUTE FUNCTIONS ---------- */

async function getBrands() {
  return boodmoFetch("/api/v1/brand-list");
}

async function getCategoryTree() {
  return boodmoFetch("/api/v1/category-tree");
}

async function getPartInfo(partId: string) {
  return boodmoFetch(`/api/v1/part-info/${partId}`);
}

async function getPartOffers(partId: string) {
  return boodmoFetch(`/api/v1/offers/${partId}`);
}

async function getPartCompatibilities(partId: string, page = 1) {
  return boodmoFetch(
    `/api/v1/part-compatibilities/${partId}?page[number]=${page}`
  );
}

async function getPartReplacements(partId: string, page = 1) {
  return boodmoFetch(
    `/api/v1/part-replacements/${partId}?page[number]=${page}`
  );
}

async function getPartCollection(query: string) {
  return boodmoFetch(`/api/v1/part-collection?${query}`);
}

/* ---------- MAIN HANDLER ---------- */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const action = searchParams.get("action");
  const partId = searchParams.get("partId");
  const query = searchParams.get("query");

  try {
    let data;

    switch (action) {
      case "brands":
        data = await getBrands();
        break;

      case "categories":
        data = await getCategoryTree();
        break;

      case "part":
        if (!partId) throw new Error("Missing partId");
        data = await getPartInfo(partId);
        break;

      case "offers":
        if (!partId) throw new Error("Missing partId");
        data = await getPartOffers(partId);
        break;

      case "compat":
        if (!partId) throw new Error("Missing partId");
        data = await getPartCompatibilities(partId);
        break;

      case "replacements":
        if (!partId) throw new Error("Missing partId");
        data = await getPartReplacements(partId);
        break;

      case "collection":
        if (!query) throw new Error("Missing filter query");
        data = await getPartCollection(query);
        break;

      default:
        return Response.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return Response.json(data);
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
