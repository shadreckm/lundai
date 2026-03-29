import { GoogleGenAI } from "@google/genai";
import { ListingDiscoveryService, type ListingFilters } from "./listingDiscoveryService.js";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are LUNA, the AI housing assistant for LUNDAI – an African student housing marketplace.
Your job is to help students find the perfect accommodation near their university.

When a user submits a natural language query, extract structured search filters from it and return a JSON object.
Always respond with ONLY valid JSON, no markdown fences, no explanation.

JSON schema to return:
{
  "city": "string | null",
  "type": "room|apartment|hostel|studio|shared | null",
  "minPrice": "number | null",
  "maxPrice": "number | null",
  "bedrooms": "number | null",
  "isFurnished": "boolean | null",
  "university": "string | null",
  "amenities": "string[] | null",
  "aiMessage": "string – a helpful, friendly 1-2 sentence message to show the student"
}

Currency context: MWK (Malawian Kwacha). 1 USD ≈ 1700 MWK.
Universities in Malawi: University of Malawi (UNIMA), Chancellor College, Malawi Polytechnic, MUST, LUANAR, Mzuzu University, Lilongwe University, KCN.
Cities: Zomba, Blantyre, Lilongwe, Mzuzu.`;

export interface AiSearchResult {
  filters: ListingFilters;
  aiMessage: string;
  results: Awaited<ReturnType<typeof ListingDiscoveryService.getListings>>["data"];
  total: number;
}

export class AiSearchService {
  static async search(userQuery: string): Promise<AiSearchResult> {
    const start = Date.now();

    let filters: ListingFilters = {};
    let aiMessage = "Here are the best matches I found for you!";

    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set – using keyword fallback");
        filters = { search: userQuery };
      } else {
        const response = await genai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nUser query: "${userQuery}"` }] },
          ],
        });

        const text = response.text?.trim() || "{}";
        const parsed = JSON.parse(text);

        aiMessage = parsed.aiMessage || aiMessage;
        filters = {
          city: parsed.city || undefined,
          type: parsed.type || undefined,
          minPrice: parsed.minPrice || undefined,
          maxPrice: parsed.maxPrice || undefined,
          bedrooms: parsed.bedrooms || undefined,
          isFurnished: parsed.isFurnished ?? undefined,
          university: parsed.university || undefined,
          amenities: parsed.amenities || undefined,
        };
      }
    } catch (err) {
      console.error("AI search error:", err);
      filters = { search: userQuery };
    }

    const { data, total } = await ListingDiscoveryService.getListings(filters);
    const responseTimeMs = Date.now() - start;

    console.log(`AI search completed in ${responseTimeMs}ms, found ${total} results`);

    return {
      filters,
      aiMessage,
      results: data,
      total,
    };
  }

  static async generateListingSummary(listing: {
    title: string;
    description: string;
    city: string;
    amenities: string[];
    price: string;
    type: string;
  }): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return `${listing.type} in ${listing.city} for ${listing.price} MWK/month.`;
    }

    const prompt = `Write a compelling 1-sentence AI summary for this student accommodation listing:
      Title: ${listing.title}
      Description: ${listing.description}
      City: ${listing.city}
      Type: ${listing.type}
      Price: ${listing.price} MWK/month
      Amenities: ${listing.amenities.join(", ")}
      
      Keep it under 30 words. Focus on what students care about most.`;

    try {
      const response = await genai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      return response.text?.trim() || "";
    } catch {
      return "";
    }
  }
}
