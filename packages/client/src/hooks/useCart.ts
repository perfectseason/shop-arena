import { useState } from 'react';

import cartService, { type CartItem } from '../services/cart-services';

const useCart = () => {
   const [cartItems, setCartItems] = useState<CartItem[]>([]);

   const [isLoading, setIsLoading] = useState(false);

   const [error, setError] = useState('');

   // GET CART
   const getCart = async () => {
      try {
         setIsLoading(true);
         setError('');

         const response = await cartService.getCart();

         setCartItems(response.data);
      } catch (error: any) {
         setError(
            error.response?.data?.detail ||
               error.response?.data?.message ||
               'Unable to load cart.'
         );
      } finally {
         setIsLoading(false);
      }
   };

   // ADD TO CART
   const addToCart = async (productId: number, quantity: number = 1) => {
      try {
         setIsLoading(true);
         setError('');

         await cartService.addItem({
            product: productId,
            quantity,
         });

         await getCart();
      } catch (error: any) {
         setError(
            error.response?.data?.detail ||
               error.response?.data?.message ||
               'Unable to add product to cart.'
         );
      } finally {
         setIsLoading(false);
      }
   };

   // UPDATE QUANTITY
   const updateQuantity = async (cartItemId: number, quantity: number) => {
      if (quantity < 1) {
         return;
      }

      try {
         setIsLoading(true);
         setError('');

         await cartService.updateItem(cartItemId, { quantity });

         await getCart();
      } catch (error: any) {
         setError(
            error.response?.data?.detail ||
               error.response?.data?.message ||
               'Unable to update cart.'
         );
      } finally {
         setIsLoading(false);
      }
   };

   // REMOVE ITEM
   const removeFromCart = async (cartItemId: number) => {
      try {
         setIsLoading(true);
         setError('');

         await cartService.removeItem(cartItemId);

         await getCart();
      } catch (error: any) {
         setError(
            error.response?.data?.detail ||
               error.response?.data?.message ||
               'Unable to remove item.'
         );
      } finally {
         setIsLoading(false);
      }
   };

   // TOTAL ITEMS
   const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
   );

   // TOTAL PRICE
   const totalPrice = cartItems.reduce(
      (total, item) => total + Number(item.subtotal),
      0
   );

   return {
      cartItems,
      totalItems,
      totalPrice,
      isLoading,
      error,
      getCart,
      addToCart,
      updateQuantity,
      removeFromCart,
   };
};

export default useCart;