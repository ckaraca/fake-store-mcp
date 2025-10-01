import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Import tool handlers
import {
  listProducts,
  getProduct,
  listCategories,
  getProductsByCategoryTool,
  listProductsSchema,
  getProductSchema,
  getProductsByCategorySchema,
} from './tools/products.js';

import {
  listCarts,
  getCart,
  getUserCartsTool,
  listCartsSchema,
  getCartSchema,
  getUserCartsSchema,
} from './tools/carts.js';

import {
  listUsers,
  getUser,
  listUsersSchema,
  getUserSchema,
} from './tools/users.js';

/**
 * MCP Server for Fake Store API
 */
class FakeStoreMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'fake-store-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling - sanitized logging
    this.server.onerror = (error) => {
      console.error('[MCP Error]', {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    };
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Products tools
        {
          name: 'list_products',
          description:
            'Get all products from the store. Supports pagination with limit and sorting.',
          inputSchema: zodToJsonSchema(listProductsSchema),
        },
        {
          name: 'get_product',
          description: 'Get detailed information about a specific product by its ID.',
          inputSchema: zodToJsonSchema(getProductSchema),
        },
        {
          name: 'list_categories',
          description: 'Get all available product categories.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_products_by_category',
          description:
            'Get all products in a specific category. Supports pagination with limit and sorting.',
          inputSchema: zodToJsonSchema(getProductsByCategorySchema),
        },
        // Carts tools
        {
          name: 'list_carts',
          description:
            'Get all shopping carts. Supports pagination with limit and sorting.',
          inputSchema: zodToJsonSchema(listCartsSchema),
        },
        {
          name: 'get_cart',
          description: 'Get detailed information about a specific cart by its ID.',
          inputSchema: zodToJsonSchema(getCartSchema),
        },
        {
          name: 'get_user_carts',
          description: 'Get all shopping carts for a specific user by their user ID.',
          inputSchema: zodToJsonSchema(getUserCartsSchema),
        },
        // Users tools
        {
          name: 'list_users',
          description: 'Get all users. Supports pagination with limit and sorting.',
          inputSchema: zodToJsonSchema(listUsersSchema),
        },
        {
          name: 'get_user',
          description: 'Get detailed information about a specific user by their ID.',
          inputSchema: zodToJsonSchema(getUserSchema),
        },
      ],
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Products
          case 'list_products': {
            const validatedArgs = listProductsSchema.parse(args || {});
            return await listProducts(validatedArgs);
          }
          case 'get_product': {
            const validatedArgs = getProductSchema.parse(args);
            return await getProduct(validatedArgs);
          }
          case 'list_categories':
            return await listCategories();
          case 'get_products_by_category': {
            const validatedArgs = getProductsByCategorySchema.parse(args);
            return await getProductsByCategoryTool(validatedArgs);
          }

          // Carts
          case 'list_carts': {
            const validatedArgs = listCartsSchema.parse(args || {});
            return await listCarts(validatedArgs);
          }
          case 'get_cart': {
            const validatedArgs = getCartSchema.parse(args);
            return await getCart(validatedArgs);
          }
          case 'get_user_carts': {
            const validatedArgs = getUserCartsSchema.parse(args);
            return await getUserCartsTool(validatedArgs);
          }

          // Users
          case 'list_users': {
            const validatedArgs = listUsersSchema.parse(args || {});
            return await listUsers(validatedArgs);
          }
          case 'get_user': {
            const validatedArgs = getUserSchema.parse(args);
            return await getUser(validatedArgs);
          }

          default:
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `Unknown tool: ${name}`,
                },
              ],
              isError: true,
            };
        }
      } catch (error) {
        // Sanitize error message to avoid information disclosure
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        // Log full error internally for debugging
        console.error('[Tool Execution Error]', {
          tool: name,
          error: errorMessage,
          timestamp: new Date().toISOString()
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: `Error executing ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Fake Store MCP server running on stdio');
  }
}

// Start the server
const server = new FakeStoreMcpServer();
server.run().catch(console.error);
