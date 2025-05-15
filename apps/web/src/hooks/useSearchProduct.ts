import { Product } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useQueryState, parseAsInteger } from "nuqs";

async function fetchProducts(
  query: string,
  limit: number,
  skip: number
): Promise<{
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}> {
  const res = await axios.get("https://dummyjson.com/products/search", {
    params: { q: query, limit, skip },
  });
  return res.data;
}

export function useSearchProduct() {
  const [query] = useQueryState("q");

  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));

  const [skip] = useQueryState("skip", parseAsInteger.withDefault(0));

  const enabled = (query?.length || 0) >= 2;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", query, limit, skip],
    queryFn: () => fetchProducts(query!, limit!, skip!),
    enabled,
  });

  return {
    products: data?.products || [],
    total: data?.total || 0,
    limit: data?.limit || 0,
    skip: data?.skip || 0,
    isLoading,
    isError,
  };
}
