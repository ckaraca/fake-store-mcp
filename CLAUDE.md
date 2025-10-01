# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that provides AI assistants with access to the Fake Store API. The server exposes 9 tools for interacting with products, carts, and users from a fake e-commerce API.

## Commands

### Build and Development
```bash
npm run build        # Compile TypeScript to dist/ using tsup
npm run dev          # Build and watch for changes
npm run prepare      # Pre-publish build (runs automatically)
```

### Testing the Server
```bash
node dist/index.js   # Run the compiled server directly
npx fake-store-mcp   # Run via npx (requires global install)
```

## Architecture

### MCP Server Structure

**Entry Point**: `src/index.ts`
- `FakeStoreMcpServer` class orchestrates the MCP server
- Uses `@modelcontextprotocol/sdk` for MCP protocol implementation
- Communicates via stdio transport (`StdioServerTransport`)
- Registers tool handlers in `setupToolHandlers()` method
- Tool schemas are converted from Zod to JSON Schema using `zod-to-json-schema`

### Three-Layer Architecture

1. **Tool Layer** (`src/tools/`)
   - `products.ts` - 4 product-related tools
   - `carts.ts` - 3 cart-related tools
   - `users.ts` - 2 user-related tools
   - Each exports Zod schemas and async handler functions
   - Handlers return MCP-formatted responses with `content` array
   - All errors are caught and returned as `{isError: true}` responses

2. **API Client Layer** (`src/api/client.ts`)
   - Centralized HTTP client with retry logic (3 retries, exponential backoff)
   - `fetchWithRetry<T>()` handles all HTTP requests
   - `buildQueryString()` constructs URL parameters from `ListOptions`
   - Base URL: `https://fakestoreapi.com`
   - Exports typed functions: `getAllProducts()`, `getProductById()`, etc.

3. **Type Layer** (`src/api/types.ts`)
   - TypeScript interfaces for all API entities: `Product`, `Cart`, `User`
   - Shared types: `ListOptions` (limit, sort), `SortOrder` ('asc' | 'desc')
   - No runtime validation - types are for compile-time checking only

### Error Handling

**Centralized in** `src/utils/error-handler.ts`:
- `formatError()` - Converts errors to user-friendly messages
- `validateId()` - Ensures IDs are positive integers
- `validateLimit()` - Validates pagination limits

Error handling pattern used throughout:
```typescript
try {
  // validation
  // API call
  return { content: [...] };
} catch (error) {
  return { content: [...], isError: true };
}
```

### Build Configuration

- **TypeScript**: Strict mode enabled, targets ES2022 with NodeNext modules
- **tsup**: Bundles to ESM format targeting Node 18+, adds shebang for CLI execution
- **Output**: Single executable in `dist/index.js` with sourcemaps and type declarations

## Development Guidelines

### Adding New Tools
1. Create handler function and Zod schema in appropriate `src/tools/*.ts` file
2. Import and register in `src/index.ts`:
   - Add to `ListToolsRequestSchema` handler (tools array)
   - Add case to `CallToolRequestSchema` switch statement
3. Add corresponding API client function in `src/api/client.ts` if needed

### Tool Return Format
All tools must return MCP-formatted responses:
```typescript
{
  content: [{ type: 'text' as const, text: string }],
  isError?: boolean
}
```

### API Client Pattern
- All external API calls go through `src/api/client.ts`
- Use `fetchWithRetry<T>()` for automatic retry logic
- Apply `ListOptions` for pagination/sorting where applicable
