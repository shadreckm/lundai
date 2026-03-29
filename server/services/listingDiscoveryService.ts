import { eq, or, ilike, and, gte, lte, desc, sql, arrayContains, inArray } from "drizzle-orm";
import getDb from "../db/index.js";
import { properties, propertyImages, users, type Property, type PropertyImage } from "../db/schema.js";

export interface ListingFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  amenities?: string[];
  university?: string;
  isFurnished?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export class ListingDiscoveryService {
  static async init() {
    console.log("✅ ListingDiscoveryService initialized (PostgreSQL)");
  }

  static async getListings(filters: ListingFilters = {}) {
    const db = getDb();
    if (!db) {
      return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const offset = (page - 1) * limit;

    const conditions = [eq(properties.status, "active")];

    if (filters.search) {
      const q = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(properties.title, q),
          ilike(properties.description, q),
          ilike(properties.city, q),
          ilike(properties.address, q)
        )!
      );
    }
    if (filters.city) {
      conditions.push(ilike(properties.city, filters.city));
    }
    if (filters.type) {
      conditions.push(eq(properties.type, filters.type as any));
    }
    if (filters.minPrice != null) {
      conditions.push(gte(properties.price, filters.minPrice.toString()));
    }
    if (filters.maxPrice != null) {
      conditions.push(lte(properties.price, filters.maxPrice.toString()));
    }
    if (filters.bedrooms != null) {
      conditions.push(gte(properties.bedrooms, filters.bedrooms));
    }
    if (filters.isFurnished != null) {
      conditions.push(eq(properties.isFurnished, filters.isFurnished));
    }
    if (filters.amenities && filters.amenities.length > 0) {
      conditions.push(arrayContains(properties.amenities, filters.amenities));
    }

    if (filters.university) {
      const u = `%${filters.university}%`;
      conditions.push(sql`${properties.nearbyUniversities}::text ILIKE ${u}`);
    }

    const finalCondition = conditions.length > 0 ? and(...conditions)! : sql`1=1`;

    const totalResult = await db
      .select({ count: sql<number>`cast(count(${properties.id}) as int)` })
      .from(properties)
      .where(finalCondition);
    
    const total = totalResult[0]?.count || 0;

    const records = await db
      .select({
        property: properties,
        userRole: users.subscriptionStatus, // Boost agent_pro
      })
      .from(properties)
      .leftJoin(users, eq(properties.landlordId, users.id))
      .where(finalCondition)
      .orderBy(
        desc(sql`CASE WHEN ${users.subscriptionStatus} = 'agent_pro' THEN 1 ELSE 0 END`),
        desc(properties.createdAt)
      )
      .limit(limit)
      .offset(offset);

    const propertyIds = records.map((r) => r.property.id);
    let images: Record<string, string[]> = {};
    
    if (propertyIds.length > 0) {
      const imgRes = await db
        .select()
        .from(propertyImages)
        .where(inArray(propertyImages.propertyId, propertyIds))
        .orderBy(desc(propertyImages.isPrimary));
      
      for (const img of imgRes) {
        if (!images[img.propertyId]) images[img.propertyId] = [];
        images[img.propertyId].push(img.url);
      }
    }

    const data = records.map((r) => ({
      ...r.property,
      images: images[r.property.id] || [],
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getListingById(id: string) {
    const db = getDb();
    if (!db) return null;

    const query = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
    if (query.length === 0) return null;

    const property = query[0];
    const imgs = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, id))
      .orderBy(desc(propertyImages.isPrimary));

    return {
      ...property,
      images: imgs.map((i) => i.url),
    };
  }

  static async createListing(data: any) {
    const db = getDb();
    if (!db) return data; 

    const result = await db.insert(properties).values({
      ...data,
      status: data.status || "pending",
      viewCount: 0,
    }).returning();

    return result[0];
  }
}
