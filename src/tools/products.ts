import { z } from 'zod';
import {
  getAllProducts,
  getProductById,
  getCategories,
  getProductsByCategory,
} from '../api/client.js';
import { formatError, validateId, validateLimit } from '../utils/error-handler.js';

/**
 * Schema definitions for product tools
 */
export const listProductsSchema = z.object({
  limit: z.number().int().positive().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
});

export const getProductSchema = z.object({
  id: z.number().int().positive(),
});

export const getProductsByCategorySchema = z.object({
  category: z.string().min(1),
  limit: z.number().int().positive().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
});

/**
 * Tool: list_products
 * Lists all products with optional limit and sort parameters
 */
export async function listProducts(args: z.infer<typeof listProductsSchema>) {
  try {
    if (args.limit) {
      validateLimit(args.limit);
    }

    const products = await getAllProducts({
      limit: args.limit,
      sort: args.sort,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(products, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${formatError(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Tool: get_product
 * Gets a single product by ID
 */
export async function getProduct(args: z.infer<typeof getProductSchema>) {
  try {
    validateId(args.id, 'product');
    const product = await getProductById(args.id);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(product, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${formatError(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Tool: list_categories
 * Lists all product categories
 */
export async function listCategories() {
  try {
    const categories = await getCategories();

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(categories, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${formatError(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Tool: get_products_by_category
 * Gets products filtered by category
 */
export async function getProductsByCategoryTool(
  args: z.infer<typeof getProductsByCategorySchema>
) {
  try {
    if (args.limit) {
      validateLimit(args.limit);
    }

    const products = await getProductsByCategory(args.category, {
      limit: args.limit,
      sort: args.sort,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(products, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${formatError(error)}`,
        },
      ],
      isError: true,
    };
  }
}
