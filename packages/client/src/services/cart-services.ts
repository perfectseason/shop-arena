import apiClient from './api-client';

export interface CartItem {
   id: number;
   product: number;
   product_name: string;
   product_image?: string;
   price: number;
   quantity: number;
   subtotal: number;
}

export interface AddToCartData {
   product: number;
   quantity: number;
}

export interface UpdateCartItemData {
   quantity: number;
}

const cartService = {
   // Get customer's cart
   getCart() {
      return apiClient.get<CartItem[]>('/cart/items/');
   },

   // Add product to cart
   addItem(data: AddToCartData) {
      return apiClient.post<CartItem>('/cart/items/', data);
   },

   // Update quantity
   updateItem(id: number, data: UpdateCartItemData) {
      return apiClient.patch<CartItem>(`/cart/items/${id}/`, data);
   },

   // Remove item
   removeItem(id: number) {
      return apiClient.delete(`/cart/items/${id}/`);
   },
};

export default cartService;

// // services/cart-service.ts

// import apiClient from "./api-client";

// export interface CartItem {
//   id: number;
//   product: number;
//   product_name: string;
//   product_image: string;
//   price: number;
//   quantity: number;
//   subtotal: number;
// }

// export interface Cart {
//   id: number;
//   items: CartItem[];
//   total_items: number;
//   total_price: number;
// }

// export const cartService = {
//   getCart: () =>
//     apiClient.get<Cart>("/cart/"),

//   addItem: (productId: number, quantity: number = 1) =>
//     apiClient.post<Cart>("/cart/items/", {
//       product: productId,
//       quantity,
//     }),

//   updateItem: (itemId: number, quantity: number) =>
//     apiClient.patch<Cart>(
//       `/cart/items/${itemId}/`,
//       { quantity }
//     ),

//   removeItem: (itemId: number) =>
//     apiClient.delete<Cart>(
//       `/cart/items/${itemId}/`
//     ),
// };
