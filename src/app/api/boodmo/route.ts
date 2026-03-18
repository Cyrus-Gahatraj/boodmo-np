const API_BASE_URL = process.env.BOODMO_API_BASE_URL;
const API_LOGIN = process.env.BOODMO_API_LOGIN;
const API_PASSWORD = process.env.BOODMO_API_PASSWORD;

async function boodmoFetch(path: string) {
  const url = `${API_BASE_URL}${path}`;
  
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${API_LOGIN}:${API_PASSWORD}`).toString("base64")}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Boodmo API Error (${res.status}):`, errorText);
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

async function getMakers() {
  return boodmoFetch("/api/v1/vehicle-tree/maker");
}

async function getLines(query: string){
  return boodmoFetch(`/api/v1/vehicle-tree/line?makerId=${query}`);
}

async function getModels(makerId: string, lineId: string){
	return boodmoFetch(`/api/v1/vehicle-tree/model?makerId=${makerId}&lineId=${lineId}`);
}

async function getConfigurations(makerId: string, lineId: string, modelId: string){
	return boodmoFetch(`/api/v1/vehicle-tree/configuration?makerId=${makerId}&lineId=${lineId}&modelId=${modelId}`);
}

async function getSmartSearch(params: URLSearchParams) {
  return boodmoFetch(`/api/v1/smartsearch?${params.toString()}`);
}

/* ---------- MAIN HANDLER ---------- */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const action = searchParams.get("action");
  const partId = searchParams.get("partId");
  const categoryId = searchParams.get("categoryId") || searchParams.get("filter[categoryId]");
  const query = searchParams.get("query");
  const makerId = searchParams.get("makerId");
  const lineId = searchParams.get("lineId");
  const modelId = searchParams.get("modelId");

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

      case "collection": {
        const params = new URLSearchParams();
        
        // Add category filter if present
        if (categoryId) {
          params.set("filter[categoryId]", categoryId);
        }

        // Pass through ALL filter and page parameters from the request
        searchParams.forEach((value, key) => {
          if (key.startsWith("filter[") || key.startsWith("page[")) {
            params.append(key, value);
          }
        });

        // Add any additional query parameters passed from the frontend
        if (query) {
          const extraParams = new URLSearchParams(query);
          extraParams.forEach((value, key) => {
            params.set(key, value);
          });
        }

        // Ensure at least one filter is present as per API requirements
        if (params.toString() === "") {
          throw new Error("API requires at least one filter (e.g., categoryId)");
        }

        data = await getPartCollection(params.toString());
        break;
      }

      case "makers":
        data = await getMakers();
        break;
		
      case "lines": 
        if (!makerId) throw new Error("Missing makerId");
         data = await getLines(makerId);
        break;
      
      case "models": 
        if (!makerId || !lineId) throw new Error("Missing lineId");
        data = await getModels(makerId, lineId);
        break;

      case "configs": 
        if (!makerId || !lineId || !modelId) throw new Error("Missing modelId");
        data = await getConfigurations(makerId, lineId, modelId);
        break;

	  case "smartsearch": {
		const params = new URLSearchParams(new URL(req.url).search);
		params.delete("action");
		if (!params.has("languageCode")) {
			params.set("languageCode", "en");
		}

		const queryString = params.toString();
		data = await boodmoFetch(`/api/v1/smartsearch/?${queryString}`);
		break;
      }

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
