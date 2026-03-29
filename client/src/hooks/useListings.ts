import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listingsApi, searchApi, type ListingFilters, type Property } from "../services/api.ts";

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => listingsApi.getAll(filters),
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Property>) => listingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useAiSearch() {
  return useMutation({
    mutationFn: (query: string) => searchApi.ai(query),
  });
}

export function useKeywordSearch(filters: ListingFilters, enabled = true) {
  return useQuery({
    queryKey: ["search", filters],
    queryFn: () => searchApi.keyword(filters),
    enabled,
  });
}
