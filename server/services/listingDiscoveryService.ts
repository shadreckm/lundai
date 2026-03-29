import type { Property } from "../db/schema.js";

// ── Mock data for development without a database ─────────────────────────────
export const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-001",
    landlordId: "user-001",
    title: "Modern Studio Near University of Malawi",
    description:
      "Bright, self-contained studio apartment just 5 minutes walk from Chancellor College. Fully furnished with high-speed WiFi, 24/7 security, and a backup generator. Perfect for serious students.",
    type: "studio",
    status: "active",
    price: "25000",
    currency: "MWK",
    address: "12 Capital Hill Road",
    city: "Zomba",
    country: "Malawi",
    latitude: "-15.3833",
    longitude: "35.3167",
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Generator", "Security", "Furnished", "Water"],
    availableFrom: new Date("2025-02-01"),
    isFurnished: true,
    isVerified: true,
    viewCount: 142,
    nearbyUniversities: ["University of Malawi - Chancellor College"],
    aiSummary: "Ideal studio for postgraduate students seeking quiet, secure accommodation close to campus.",
    whatsappSourceId: null,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "prop-002",
    landlordId: "user-002",
    title: "Shared 3-Bedroom House – Polytechnic Area",
    description:
      "Spacious 3-bedroom house available for sharing between 3 students. Each bedroom is private with shared kitchen and bathrooms. Located 10 minutes from Malawi Polytechnic. Borehole water supply.",
    type: "shared",
    status: "active",
    price: "18000",
    currency: "MWK",
    address: "Naperi Housing Estate",
    city: "Blantyre",
    country: "Malawi",
    latitude: "-15.7833",
    longitude: "35.0",
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Borehole Water", "Parking", "Garden"],
    availableFrom: new Date("2025-03-01"),
    isFurnished: false,
    isVerified: true,
    viewCount: 89,
    nearbyUniversities: ["Malawi University of Science and Technology", "Malawi Polytechnic"],
    aiSummary: "Budget-friendly shared house ideal for engineering students at MUST or Poly.",
    whatsappSourceId: null,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "prop-003",
    landlordId: "user-001",
    title: "Executive Apartment – Lilongwe City Centre",
    description:
      "Premium 2-bedroom apartment in the heart of Lilongwe, minutes from Mzuzu University Lilongwe campus. En-suite master bedroom, modern kitchen, DSTV, fibre internet, and 24-hour security.",
    type: "apartment",
    status: "active",
    price: "75000",
    currency: "MWK",
    address: "Area 3, City Centre",
    city: "Lilongwe",
    country: "Malawi",
    latitude: "-13.9626",
    longitude: "33.7741",
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi Fibre", "DSTV", "Security", "Generator", "Parking", "AC", "Furnished"],
    availableFrom: new Date("2025-02-15"),
    isFurnished: true,
    isVerified: true,
    viewCount: 210,
    nearbyUniversities: ["Mzuzu University – Lilongwe Campus", "KCN"],
    aiSummary: "Premium furnished apartment for graduate students or professionals near Lilongwe capital.",
    whatsappSourceId: null,
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: "prop-004",
    landlordId: "user-003",
    title: "Single Room in Student Hostel – Mzuzu",
    description:
      "Affordable self-contained room in a registered student hostel. Ground floor, clean, peaceful neighbourhood. All utilities included in price. Common study room available.",
    type: "hostel",
    status: "active",
    price: "12000",
    currency: "MWK",
    address: "Katoto Township",
    city: "Mzuzu",
    country: "Malawi",
    latitude: "-11.4667",
    longitude: "34.0167",
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Study Room", "Water Included", "Electricity Included", "Security"],
    availableFrom: new Date("2025-01-01"),
    isFurnished: false,
    isVerified: false,
    viewCount: 56,
    nearbyUniversities: ["Mzuzu University"],
    aiSummary: "Affordable hostel room with utilities included – perfect for first-year students at Mzuzu University.",
    whatsappSourceId: null,
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
  },
  {
    id: "prop-005",
    landlordId: "user-002",
    title: "Furnished Room – Walking Distance to LUANAR",
    description:
      "Newly renovated self-contained room with modern fittings. 3 minutes walk to Lilongwe University of Agriculture and Natural Resources. Quiet compound, reliable ESCOM supply.",
    type: "room",
    status: "active",
    price: "20000",
    currency: "MWK",
    address: "Area 25, Bunda",
    city: "Lilongwe",
    country: "Malawi",
    latitude: "-13.9800",
    longitude: "33.7400",
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Water", "Security", "Furnished"],
    availableFrom: new Date("2025-03-15"),
    isFurnished: true,
    isVerified: true,
    viewCount: 74,
    nearbyUniversities: ["LUANAR"],
    aiSummary: "Renovated self-contained room right next to LUANAR, ideal for agri-science students.",
    whatsappSourceId: null,
    createdAt: new Date("2025-01-22"),
    updatedAt: new Date("2025-01-22"),
  },
  {
    id: "prop-006",
    landlordId: "user-003",
    title: "2-Bedroom Apartment – Chichiri, Blantyre",
    description:
      "Spacious apartment in Chichiri near the Polytechnic and MUST campuses. 2 bedrooms ideal for two students splitting rent. Car parking available. Water tank with pump.",
    type: "apartment",
    status: "active",
    price: "40000",
    currency: "MWK",
    address: "Chichiri Shopping Mall Area",
    city: "Blantyre",
    country: "Malawi",
    latitude: "-15.7967",
    longitude: "35.0083",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Parking", "Water Tank", "WiFi", "Generator"],
    availableFrom: new Date("2025-02-01"),
    isFurnished: false,
    isVerified: true,
    viewCount: 118,
    nearbyUniversities: ["Malawi Polytechnic", "MUST"],
    aiSummary: "Spacious 2-bed apartment in Chichiri – great for two students splitting costs near Poly/MUST.",
    whatsappSourceId: null,
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-18"),
  },
];

export const MOCK_IMAGES: Record<string, string[]> = {
  "prop-001": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  ],
  "prop-002": [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  ],
  "prop-003": [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  ],
  "prop-004": [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  ],
  "prop-005": [
    "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  ],
  "prop-006": [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  ],
};

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
    console.log("✅ ListingDiscoveryService initialized (mock mode)");
  }

  static async getListings(filters: ListingFilters = {}) {
    let results = [...MOCK_PROPERTIES].filter((p) => p.status === "active");

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }
    if (filters.city) {
      results = results.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters.type) {
      results = results.filter((p) => p.type === filters.type);
    }
    if (filters.minPrice != null) {
      results = results.filter((p) => parseFloat(p.price) >= filters.minPrice!);
    }
    if (filters.maxPrice != null) {
      results = results.filter((p) => parseFloat(p.price) <= filters.maxPrice!);
    }
    if (filters.bedrooms != null) {
      results = results.filter((p) => p.bedrooms >= filters.bedrooms!);
    }
    if (filters.isFurnished != null) {
      results = results.filter((p) => p.isFurnished === filters.isFurnished);
    }
    if (filters.university) {
      const uni = filters.university.toLowerCase();
      results = results.filter((p) =>
        (p.nearbyUniversities as string[]).some((u) => u.toLowerCase().includes(uni))
      );
    }
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter((p) =>
        filters.amenities!.every((a) => (p.amenities as string[]).includes(a))
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    return {
      data: paginated.map((p) => ({
        ...p,
        images: MOCK_IMAGES[p.id] || [],
      })),
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit),
    };
  }

  static async getListingById(id: string) {
    const property = MOCK_PROPERTIES.find((p) => p.id === id);
    if (!property) return null;
    return {
      ...property,
      images: MOCK_IMAGES[id] || [],
    };
  }

  static async createListing(data: Omit<NewListing, "id">) {
    const newId = `prop-${Date.now()}`;
    const newProp = {
      id: newId,
      ...data,
      status: "pending" as const,
      viewCount: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    MOCK_PROPERTIES.push(newProp as Property);
    return newProp;
  }
}

interface NewListing {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  type: Property["type"];
  price: string;
  currency: string;
  address: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  isFurnished: boolean;
  nearbyUniversities: string[];
  latitude?: string | null;
  longitude?: string | null;
  availableFrom?: Date | null;
  aiSummary?: string | null;
  whatsappSourceId?: string | null;
  status: Property["status"];
  viewCount: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
