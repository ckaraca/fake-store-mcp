import { z } from 'zod';
import { getAllUsers, getUserById } from '../api/client.js';
import { formatError, validateId, validateLimit } from '../utils/error-handler.js';

/**
 * Schema definitions for user tools
 */
export const listUsersSchema = z.object({
  limit: z.number().int().positive().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
});

export const getUserSchema = z.object({
  id: z.number().int().positive(),
});

/**
 * Tool: list_users
 * Lists all users with optional limit and sort parameters
 */
export async function listUsers(args: z.infer<typeof listUsersSchema>) {
  try {
    if (args.limit) {
      validateLimit(args.limit);
    }

    const users = await getAllUsers({
      limit: args.limit,
      sort: args.sort,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(users, null, 2),
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
 * Tool: get_user
 * Gets a single user by ID
 */
export async function getUser(args: z.infer<typeof getUserSchema>) {
  try {
    validateId(args.id, 'user');
    const user = await getUserById(args.id);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(user, null, 2),
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
