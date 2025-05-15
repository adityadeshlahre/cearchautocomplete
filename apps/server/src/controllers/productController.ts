import { Request, Response } from "express";
import { cachedProducts } from "../data/products";
import { validateQuery } from "../utils/validateQuery";
import { Product } from "@repo/types/index";

export function productsRoute(req: Request, res: Response) {
  try {
    const q = (req.query.q as string)?.trim().toLowerCase();
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = parseInt(req.query.skip as string) || 0;

    validateQuery(q);

    const filtered = cachedProducts.filter((p: Product) => {
      return (
        p?.title?.toLowerCase().includes(q) ||
        p?.brand?.toLowerCase().includes(q)
      );
    });

    const paginated = filtered.slice(skip, skip + limit);

    res.json({
      products: paginated,
      total: filtered.length,
      skip,
      limit,
    });
  } catch (err) {
    res
      .status((err as any).status || 500)
      .json({ error: (err as Error).message });
  }
}

export function allProductsRoute(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;

    const paginated = cachedProducts.slice(skip, skip + limit);

    res.json({
      products: paginated,
      total: cachedProducts.length,
      skip,
      limit,
    });
  } catch (err) {
    res
      .status((err as any).status || 500)
      .json({ error: (err as Error).message });
  }
}
