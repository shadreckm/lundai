import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "../db/index.js";
import { properties } from "../db/schema.js";

export class DuplicateDetectionService {
  /**
   * Checks if a listing is a duplicate based on phone number, city, and similar price.
   */
  static async checkDuplicateListing(
    phone: string | null | undefined,
    city: string | null | undefined,
    price: number | string
  ): Promise<boolean> {
    if (!phone || !city) return false;

    const db = getDb();
    if (!db) return false;

    const priceNum = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(priceNum)) return false;

    // Price similarity: +/- 5%
    const minPrice = priceNum * 0.95;
    const maxPrice = priceNum * 1.05;

    // Define a timeframe, e.g., the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const duplicates = await db
      .select({ id: properties.id })
      .from(properties)
      .where(
        and(
          eq(properties.contactPhone, phone),
          eq(properties.city, city),
          gte(properties.price, minPrice.toString()),
          lte(properties.price, maxPrice.toString()),
          gte(properties.createdAt, thirtyDaysAgo)
        )
      )
      .limit(1);

    return duplicates.length > 0;
  }
}
