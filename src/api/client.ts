import type { Product, Cart, User, ListOptions, ApiError } from './types.js';

const BASE_URL = 'https://fakestoreapi.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Sleep helper for retry logic
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * HTTP client with retry logic and error handling
 */
async function fetchWithRetry<T>(
  url: string,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;

      if (attempt < retries - 1) {
        await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Failed to fetch data');
}

/**
 * Build query string from options
 */
function buildQueryString(options?: ListOptions): string {
  if (!options) return '';

  const params = new URLSearchParams();

  if (options.limit !== undefined) {
    params.append('limit', options.limit.toString());
  }

  if (options.sort) {
    params.append('sort', options.sort);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Products API
 */
export async function getAllProducts(
  options?: ListOptions
): Promise<Product[]> {
  const query = buildQueryString(options);
  return fetchWithRetry<Product[]>(`${BASE_URL}/products${query}`);
}

export async function getProductById(id: number): Promise<Product> {
  return fetchWithRetry<Product>(`${BASE_URL}/products/${id}`);
}

export async function getCategories(): Promise<string[]> {
  return fetchWithRetry<string[]>(`${BASE_URL}/products/categories`);
}

export async function getProductsByCategory(
  category: string,
  options?: ListOptions
): Promise<Product[]> {
  const query = buildQueryString(options);
  return fetchWithRetry<Product[]>(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}${query}`
  );
}

/**
 * Carts API
 */
export async function getAllCarts(options?: ListOptions): Promise<Cart[]> {
  const query = buildQueryString(options);
  return fetchWithRetry<Cart[]>(`${BASE_URL}/carts${query}`);
}

export async function getCartById(id: number): Promise<Cart> {
  return fetchWithRetry<Cart>(`${BASE_URL}/carts/${id}`);
}

export async function getUserCarts(userId: number): Promise<Cart[]> {
  return fetchWithRetry<Cart[]>(`${BASE_URL}/carts/user/${userId}`);
}

/**
 * Users API
 */
export async function getAllUsers(options?: ListOptions): Promise<User[]> {
  const query = buildQueryString(options);
  return fetchWithRetry<User[]>(`${BASE_URL}/users${query}`);
}

export async function getUserById(id: number): Promise<User> {
  return fetchWithRetry<User>(`${BASE_URL}/users/${id}`);
}
