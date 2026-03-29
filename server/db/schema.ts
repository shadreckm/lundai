import { pgTable, uuid, text, integer, numeric, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["student", "landlord", "admin"]);
export const propertyTypeEnum = pgEnum("property_type", ["room", "apartment", "hostel", "studio", "shared"]);
export const propertyStatusEnum = pgEnum("property_status", ["pending", "active", "inactive", "rejected"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["open", "replied", "closed"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed", "refunded"]);
export const whatsappStatusEnum = pgEnum("whatsapp_status", ["received", "processed", "failed"]);

// ── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("student"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Properties ───────────────────────────────────────────────────────────────
export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  landlordId: uuid("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: propertyTypeEnum("type").notNull().default("room"),
  status: propertyStatusEnum("status").notNull().default("pending"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("MWK"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull().default("Malawi"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  bedrooms: integer("bedrooms").notNull().default(1),
  bathrooms: integer("bathrooms").notNull().default(1),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  availableFrom: timestamp("available_from"),
  isFurnished: boolean("is_furnished").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  nearbyUniversities: jsonb("nearby_universities").$type<string[]>().default([]),
  aiSummary: text("ai_summary"),
  whatsappSourceId: uuid("whatsapp_source_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Property Images ───────────────────────────────────────────────────────────
export const propertyImages = pgTable("property_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id"),
  isPrimary: boolean("is_primary").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Inquiries ─────────────────────────────────────────────────────────────────
export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").references(() => users.id, { onDelete: "set null" }),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderPhone: text("sender_phone"),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  propertyId: uuid("property_id").references(() => properties.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("MWK"),
  status: transactionStatusEnum("status").notNull().default("pending"),
  paychanguRef: text("paychangu_ref"),
  paychanguTxId: text("paychangu_tx_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── AI Search Logs ────────────────────────────────────────────────────────────
export const aiSearchLogs = pgTable("ai_search_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  query: text("query").notNull(),
  parsedFilters: jsonb("parsed_filters").$type<Record<string, unknown>>().default({}),
  resultCount: integer("result_count").notNull().default(0),
  tokensUsed: integer("tokens_used"),
  responseTimeMs: integer("response_time_ms"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── WhatsApp Messages ─────────────────────────────────────────────────────────
export const whatsappMessages = pgTable("whatsapp_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  body: text("body").notNull(),
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]),
  status: whatsappStatusEnum("status").notNull().default("received"),
  twilioSid: text("twilio_sid"),
  extractedData: jsonb("extracted_data").$type<Record<string, unknown>>(),
  generatedPropertyId: uuid("generated_property_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Types ─────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyImage = typeof propertyImages.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type AiSearchLog = typeof aiSearchLogs.$inferSelect;
export type WhatsappMessage = typeof whatsappMessages.$inferSelect;
