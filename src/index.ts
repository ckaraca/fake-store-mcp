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

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
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
          case 'list_products':
            return await listProducts(args || {});
          case 'get_product':
            return await getProduct(args as any);
          case 'list_categories':
            return await listCategories();
          case 'get_products_by_category':
            return await getProductsByCategoryTool(args as any);

          // Carts
          case 'list_carts':
            return await listCarts(args || {});
          case 'get_cart':
            return await getCart(args as any);
          case 'get_user_carts':
            return await getUserCartsTool(args as any);

          // Users
          case 'list_users':
            return await listUsers(args || {});
          case 'get_user':
            return await getUser(args as any);

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
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
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
