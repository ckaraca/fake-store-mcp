# Fake Store MCP Server

[![NPM Version](https://img.shields.io/npm/v/fake-store-mcp)](https://www.npmjs.com/package/fake-store-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides AI assistants like Claude with access to the [Fake Store API](https://fakestoreapi.com/) - a free REST API for e-commerce prototyping and testing.

## Features

- **9 Ready-to-Use Tools** for products, carts, and users
- **Full TypeScript Support** with strict type safety
- **Production-Ready** with retry logic and error handling
- **Zero Configuration** - works out of the box
- **Beginner-Friendly** - great for learning MCP development

## Available Tools

### Products
- `list_products` - Get all products with pagination and sorting
- `get_product` - Get detailed product information by ID
- `list_categories` - Get all available product categories
- `get_products_by_category` - Filter products by category

### Carts
- `list_carts` - Get all shopping carts
- `get_cart` - Get cart details by ID
- `get_user_carts` - Get all carts for a specific user

### Users
- `list_users` - Get all users
- `get_user` - Get user details by ID

## Installation

### For Claude Desktop

1. **Install the package:**
```bash
npm install -g fake-store-mcp
```

2. **Configure Claude Desktop:**

Edit your Claude Desktop configuration file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "fake-store": {
      "command": "npx",
      "args": ["-y", "fake-store-mcp"]
    }
  }
}
```

**Alternative (if installed globally):**
```json
{
  "mcpServers": {
    "fake-store": {
      "command": "fake-store-mcp"
    }
  }
}
```

3. **Restart Claude Desktop**

The tools will now be available in your Claude conversations!

### For Other MCP Clients

If you're using another MCP-compatible client, you can run the server directly:

```bash
npx fake-store-mcp
```

Or install it locally in your project:

```bash
npm install fake-store-mcp
```

## Usage Examples

### Example 1: Browsing Products

**User:** "Show me the first 5 products from the store"

**Claude:** *Uses `list_products` tool with `limit: 5`*

### Example 2: Product Search

**User:** "What electronics products are available?"

**Claude:** *Uses `list_categories` first, then `get_products_by_category` with `category: "electronics"`*

### Example 3: User Cart Analysis

**User:** "Show me what user 1 has in their shopping carts"

**Claude:** *Uses `get_user_carts` with `userId: 1`*

### Example 4: Product Details

**User:** "Tell me more about product ID 5"

**Claude:** *Uses `get_product` with `id: 5`*

## Tool Parameters

### list_products
```typescript
{
  limit?: number;      // Limit number of results
  sort?: 'asc' | 'desc'; // Sort order
}
```

### get_product
```typescript
{
  id: number;          // Product ID (required)
}
```

### list_categories
No parameters required.

### get_products_by_category
```typescript
{
  category: string;    // Category name (required)
  limit?: number;      // Limit number of results
  sort?: 'asc' | 'desc'; // Sort order
}
```

### list_carts
```typescript
{
  limit?: number;      // Limit number of results
  sort?: 'asc' | 'desc'; // Sort order
}
```

### get_cart
```typescript
{
  id: number;          // Cart ID (required)
}
```

### get_user_carts
```typescript
{
  userId: number;      // User ID (required)
}
```

### list_users
```typescript
{
  limit?: number;      // Limit number of results
  sort?: 'asc' | 'desc'; // Sort order
}
```

### get_user
```typescript
{
  id: number;          // User ID (required)
}
```

## Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/ckaraca/fake-store-mcp.git
cd fake-store-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode (auto-rebuild on changes)
npm run dev
```

### Project Structure
```
fake-store-mcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/
│   │   ├── products.ts       # Product tools
│   │   ├── carts.ts          # Cart tools
│   │   └── users.ts          # User tools
│   ├── api/
│   │   ├── client.ts         # HTTP client with retry logic
│   │   └── types.ts          # TypeScript type definitions
│   └── utils/
│       └── error-handler.ts  # Error handling utilities
├── dist/                     # Compiled output
└── package.json
```

## Contributing

Contributions are welcome! This project is designed to be beginner-friendly and serves as a reference for learning MCP server development.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## About Fake Store API

This server integrates with [fakestoreapi.com](https://fakestoreapi.com/), a free REST API for e-commerce testing and prototyping. The API provides:
- 20 sample products across 4 categories
- 10 sample users
- 7 sample shopping carts
- No authentication required
- No rate limits

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Fake Store API Documentation](https://fakestoreapi.com/docs)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop](https://claude.ai/download)

## Troubleshooting

### Server not showing in Claude Desktop

1. Verify the configuration file path is correct
2. Ensure the JSON is valid (no trailing commas)
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

### "Command not found" error

Make sure the package is installed globally:
```bash
npm install -g fake-store-mcp
```

### Network errors

The server requires internet access to reach fakestoreapi.com. Check your network connection and firewall settings.

## Acknowledgments

- Thanks to [Fake Store API](https://fakestoreapi.com/) for providing the free API
- Built with the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Inspired by the MCP community

---

**Made with ❤️ for the MCP community**

If you find this useful, please give it a ⭐️ on GitHub!
