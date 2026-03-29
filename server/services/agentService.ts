import { eq, count } from "drizzle-orm";
import getDb from "../db/index.js";
import { users, properties } from "../db/schema.js";

export class AgentService {
  /**
   * Evaluates if a user can create a new property listing based on their subscription tier.
   */
  static async canCreateListing(userId: string): Promise<boolean> {
    const db = getDb();
    if (!db) return true; // mock mode fallback

    const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userRecords.length === 0) return false;

    const user = userRecords[0];

    // Unlimited for agent_pro
    if (user.subscriptionStatus === "agent_pro" || user.subscriptionPlan === "agent_pro") {
      return true;
    }

    // Free tier max 3 listings
    const listingCounts = await db
      .select({ val: count() })
      .from(properties)
      .where(eq(properties.landlordId, userId));

    const totalListings = listingCounts[0]?.val || 0;

    return totalListings < 3;
  }

  /**
   * Request agent verification
   */
  static async requestVerification(userId: string, agencyName: string, licenseNumber: string) {
    const db = getDb();
    if (!db) return false;

    await db
      .update(users)
      .set({
        agencyName,
        licenseNumber,
        agentVerified: false, // Pending admin approval
      })
      .where(eq(users.id, userId));

    return true;
  }

  /**
   * Approves an agent (Admin only conceptually)
   */
  static async approveAgent(userId: string) {
    const db = getDb();
    if (!db) return false;

    await db
      .update(users)
      .set({
        agentVerified: true,
        verificationBadge: true,
        role: "agent",
      })
      .where(eq(users.id, userId));

    return true;
  }
}
