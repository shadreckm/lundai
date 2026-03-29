import { Router, type Request, type Response } from "express";
import { ListingDiscoveryService } from "../services/listingDiscoveryService.js";
import { AiSearchService } from "../services/aiSearchService.js";
import { authMiddleware, optionalAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/listings
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      city,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      isFurnished,
      university,
      search,
      page,
      limit,
    } = req.query;

    const result = await ListingDiscoveryService.getListings({
      city: city as string,
      type: type as string,
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms as string) : undefined,
      isFurnished: isFurnished === "true" ? true : isFurnished === "false" ? false : undefined,
      university: university as string,
      search: search as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 12,
    });

    res.json(result);
  } catch (err: any) {
    console.error("GET /listings error:", err);
    res.status(500).json({ error: "Failed to fetch listings", message: err.message });
  }
});

// GET /api/listings/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const listing = await ListingDiscoveryService.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch listing", message: err.message });
  }
});

// POST /api/listings
router.post("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      price,
      currency,
      address,
      city,
      country,
      bedrooms,
      bathrooms,
      amenities,
      isFurnished,
      nearbyUniversities,
      availableFrom,
    } = req.body;

    if (!title || !description || !price || !address || !city) {
      return res.status(400).json({ error: "Missing required fields: title, description, price, address, city" });
    }

    // Auto-generate AI summary
    let aiSummary: string | undefined;
    try {
      aiSummary = await AiSearchService.generateListingSummary({
        title,
        description,
        city,
        amenities: amenities || [],
        price,
        type: type || "room",
      });
    } catch {
      // non-fatal
    }

    const listing = await ListingDiscoveryService.createListing({
      landlordId: (req as any).user?.id || "anonymous",
      title,
      description,
      type: type || "room",
      price: price.toString(),
      currency: currency || "MWK",
      address,
      city,
      country: country || "Malawi",
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      amenities: amenities || [],
      isFurnished: isFurnished || false,
      nearbyUniversities: nearbyUniversities || [],
      latitude: null,
      longitude: null,
      availableFrom: availableFrom ? new Date(availableFrom) : null,
      aiSummary: aiSummary || null,
      whatsappSourceId: null,
      status: "pending",
      viewCount: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(listing);
  } catch (err: any) {
    console.error("POST /listings error:", err);
    res.status(500).json({ error: "Failed to create listing", message: err.message });
  }
});

export default router;
