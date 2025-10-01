/**
 * Type definitions for Fake Store API entities
 */

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartProduct {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface Address {
  geolocation: {
    lat: string;
    long: string;
  };
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

export interface UserName {
  firstname: string;
  lastname: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: UserName;
  address: Address;
  phone: string;
}

export type SortOrder = 'asc' | 'desc';

export interface ListOptions {
  limit?: number;
  sort?: SortOrder;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
