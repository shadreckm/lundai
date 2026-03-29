import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lundai_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("lundai_token");
      localStorage.removeItem("lundai_user");
    }
    return Promise.reject(err);
  }
);

// ── Listings ──────────────────────────────────────────────────────────────────
export interface Property {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  type: "room" | "apartment" | "hostel" | "studio" | "shared";
  status: "pending" | "active" | "inactive" | "rejected";
  price: string;
  currency: string;
  address: string;
  city: string;
  country: string;
  latitude?: string | null;
  longitude?: string | null;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  isFurnished: boolean;
  isVerified: boolean;
  viewCount: number;
  nearbyUniversities: string[];
  aiSummary?: string | null;
  images: string[];
  availableFrom?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListingsResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListingFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  isFurnished?: boolean;
  university?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const listingsApi = {
  getAll: async (filters: ListingFilters = {}): Promise<ListingsResponse> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
    );
    const { data } = await api.get("/listings", { params });
    return data;
  },

  getById: async (id: string): Promise<Property> => {
    const { data } = await api.get(`/listings/${id}`);
    return data;
  },

  create: async (payload: Partial<Property>): Promise<Property> => {
    const { data } = await api.post("/listings", payload);
    return data;
  },
};

// ── Search ────────────────────────────────────────────────────────────────────
export interface AiSearchResult {
  filters: ListingFilters;
  aiMessage: string;
  results: Property[];
  total: number;
}

export const searchApi = {
  keyword: async (params: ListingFilters): Promise<ListingsResponse> => {
    const { data } = await api.get("/search", { params: { q: params.search, ...params } });
    return data;
  },

  ai: async (query: string): Promise<AiSearchResult> => {
    const { data } = await api.post("/search/ai", { query });
    return data;
  },
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "student" | "landlord" | "admin";
}

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; fullName: string; role?: string; }
export interface AuthResponse { token: string; user: AuthUser; }

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", payload);
    if (data.token) {
      localStorage.setItem("lundai_token", data.token);
      localStorage.setItem("lundai_user", JSON.stringify(data.user));
    }
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/register", payload);
    if (data.token) {
      localStorage.setItem("lundai_token", data.token);
      localStorage.setItem("lundai_user", JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("lundai_token");
    localStorage.removeItem("lundai_user");
  },

  getCurrentUser: (): AuthUser | null => {
    const stored = localStorage.getItem("lundai_user");
    return stored ? JSON.parse(stored) : null;
  },

  me: async (): Promise<{ user: AuthUser }> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsApi = {
  checkout: async (payload: {
    propertyId: string;
    propertyTitle: string;
    amount: number;
    customerEmail: string;
    customerName: string;
  }) => {
    const { data } = await api.post("/payments/checkout", payload);
    return data;
  },
};

export default api;
