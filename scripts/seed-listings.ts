import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../server/db/schema.js";
import 'dotenv/config'; // loads .env into process.env

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL missing in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const db = drizzle(pool, { schema });

const CITIES = ["Zomba", "Blantyre", "Lilongwe", "Mzuzu"];
const TYPES = ["room", "apartment", "hostel", "studio", "shared"] as const;
const AMENITIES = ["WiFi", "Water", "Generator", "Parking", "Security", "DSTV"];

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAmenities() {
  const count = Math.floor(Math.random() * 4) + 1;
  const picked = new Set<string>();
  while (picked.size < count) {
    picked.add(getRandom(AMENITIES));
  }
  return Array.from(picked);
}

// Generate ~1000 listings
async function seedDatabase() {
  console.log("🌱 Starting Seed Pipeline...");
  
  // Create a default admin/landlord user to own the seed properties
  const userResult = await db.insert(schema.users).values({
    email: "admin@lundai.com",
    passwordHash: "not-a-real-hash", // don't use this login
    fullName: "LUNDAI Admin",
    role: "admin",
    isVerified: true
  }).returning({ id: schema.users.id }).onConflictDoNothing();

  const usersCheck = await db.select({ id: schema.users.id }).from(schema.users).limit(1);
  const landlordId = userResult?.[0]?.id || usersCheck?.[0]?.id;

  if (!landlordId) {
    console.error("Failed to acquire a landlord ID.");
    process.exit(1);
  }

  const batchSize = 100;
  let totalSeeded = 0;

  for (let b = 0; b < 10; b++) { // 10 batches of 100
    const batch = [];
    for (let i = 0; i < batchSize; i++) {
      const type = getRandom(TYPES);
      let price = 0;
      let bedrooms = 1;

      if (type === "room" || type === "hostel") {
        price = Math.floor(Math.random() * 20000) + 10000;
      } else if (type === "studio") {
        price = Math.floor(Math.random() * 30000) + 25000;
      } else {
        price = Math.floor(Math.random() * 80000) + 40000;
        bedrooms = Math.floor(Math.random() * 3) + 2;
      }

      batch.push({
        landlordId,
        title: `Affordable ${type} near Campus`,
        description: `This is a great, well-maintained ${type} available for immediate occupation. Secure neighborhood, conducive for studying.`,
        type,
        status: "active" as const,
        price: price.toString(),
        currency: "MWK",
        address: "Area " + (Math.floor(Math.random() * 49) + 1),
        city: getRandom(CITIES),
        country: "Malawi",
        bedrooms,
        bathrooms: type === "shared" || type === "hostel" ? 2 : 1,
        amenities: getRandomAmenities(),
        isFurnished: Math.random() > 0.6,
        isVerified: Math.random() > 0.3, // 70% verified
        viewCount: Math.floor(Math.random() * 500),
        nearbyUniversities: ["Local University"],
        aiSummary: `Comfortable ${type} ideal for a student, featuring ${getRandomAmenities().join(", ")}.`,
      });
    }

    const insertedProps = await db.insert(schema.properties).values(batch).returning({ id: schema.properties.id });

    // Insert dummy images
    const imageBatch = insertedProps.map((p, index) => ({
      propertyId: p.id,
      url: `https://images.unsplash.com/photo-${1555041469 + index}?w=800&q=80`,
      isPrimary: true,
      order: 0,
    }));

    // Some images may error if Unsplash string matches a bad char but since we use mostly numeric offsets, we can just use static arrays.
    // To be perfectly safe let's just use static dummy links:
    const safeImageBatch = insertedProps.map((p) => ({
      propertyId: p.id,
      url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      isPrimary: true,
      order: 0,
    }));

    await db.insert(schema.propertyImages).values(safeImageBatch);

    totalSeeded += batch.length;
    console.log(`✅ Seeded batch ${b + 1}/10. Total listings: ${totalSeeded}`);
  }

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seedDatabase().catch((e) => {
  console.error("Seeding failed", e);
  process.exit(1);
});
