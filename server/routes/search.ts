import { Router, type Request, type Response } from "express";
import { AiSearchService } from "../services/aiSearchService.js";
import { ListingDiscoveryService } from "../services/listingDiscoveryService.js";

const router = Router();

// GET /api/search?q=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { q, city, type, minPrice, maxPrice, bedrooms, isFurnished, university } = req.query;

    const result = await ListingDiscoveryService.getListings({
      search: q as string,
      city: city as string,
      type: type as string,
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms as string) : undefined,
      isFurnished: isFurnished === "true" ? true : undefined,
      university: university as string,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "Search failed", message: err.message });
  }
});

// POST /api/search-ai
router.post("/ai", async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return res.status(400).json({ error: "Query must be at least 3 characters" });
    }

    const result = await AiSearchService.search(query.trim());
    res.json(result);
  } catch (err: any) {
    console.error("AI search error:", err);
    res.status(500).json({ error: "AI search failed", message: err.message });
  }
});

export default router;
