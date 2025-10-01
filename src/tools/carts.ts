import { z } from 'zod';
import {
  getAllCarts,
  getCartById,
  getUserCarts,
} from '../api/client.js';
import { formatError, validateId, validateLimit } from '../utils/error-handler.js';

/**
 * Schema definitions for cart tools
 */
export const listCartsSchema = z.object({
  limit: z.number().int().positive().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
});

export const getCartSchema = z.object({
  id: z.number().int().positive(),
});

export const getUserCartsSchema = z.object({
  userId: z.number().int().positive(),
});

/**
 * Tool: list_carts
 * Lists all carts with optional limit and sort parameters
 */
export async function listCarts(args: z.infer<typeof listCartsSchema>) {
  try {
    if (args.limit) {
      validateLimit(args.limit);
    }

    const carts = await getAllCarts({
      limit: args.limit,
      sort: args.sort,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(carts, null, 2),
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
 * Tool: get_cart
 * Gets a single cart by ID
 */
export async function getCart(args: z.infer<typeof getCartSchema>) {
  try {
    validateId(args.id, 'cart');
    const cart = await getCartById(args.id);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(cart, null, 2),
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
 * Tool: get_user_carts
 * Gets all carts for a specific user
 */
export async function getUserCartsTool(
  args: z.infer<typeof getUserCartsSchema>
) {
  try {
    validateId(args.userId, 'user');
    const carts = await getUserCarts(args.userId);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(carts, null, 2),
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
