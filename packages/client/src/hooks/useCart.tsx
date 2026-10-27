import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
   type ReactNode,
} from 'react';

import cartService, {
   type CartItem,
} from '../services/cart-services';

type UnknownRecord = Record<string, unknown>;



// Extract cart items from supported API response formats.
const extractCartItems = (data: unknown): CartItem[] => {
   if (Array.isArray(data)) {
      return data as CartItem[];
   }

   if (typeof data !== 'object' || data === null) {
      throw new Error('The cart API returned an invalid response.');
   }

   const response = data as UnknownRecord;

   // Django REST Framework pagination:
   // { count: 4, next: null, previous: null, results: [...] }
   if (Array.isArray(response.results)) {
      return response.results as CartItem[];
   }

   // Cart object:
   // { items: [...] }
   if (Array.isArray(response.items)) {
      return response.items as CartItem[];
   }

   // Alternative response wrappers.
   if (Array.isArray(response.data)) {
      return response.data as CartItem[];
   }

   if (
      typeof response.cart === 'object' &&
      response.cart !== null
   ) {
      return extractCartItems(response.cart);
   }

   if (
      typeof response.data === 'object' &&
      response.data !== null
   ) {
      return extractCartItems(response.data);
   }

   throw new Error(
      'The cart response does not contain an items array.'
   );
};

const getErrorMessage = (
   err: unknown,
   fallback: string
): string => {
   if (typeof err === 'object' && err !== null && 'response' in err) {
      const response = (
         err as {
            response?: {
               data?: {
                  detail?: string;
                  message?: string;
               };
            };
         }
      ).response;

      return (
         response?.data?.detail ||
         response?.data?.message ||
         fallback
      );
   }

   if (err instanceof Error) {
      return err.message || fallback;
   }

   return fallback;
};

const useCartState = () => {
   const [cartItems, setCartItems] = useState<CartItem[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   // GET CART
   const getCart = useCallback(async () => {
      try {
         setIsLoading(true);
         setError('');

         const response = await cartService.getCart();
         const items = extractCartItems(response.data);

         setCartItems(items);
      } catch (err: unknown) {
         setError(getErrorMessage(err, 'Unable to load cart.'));
      } finally {
         setIsLoading(false);
      }
   }, []);

   // Load the cart when the provider mounts.
   useEffect(() => {
      void getCart();
   }, [getCart]);

   // ADD TO CART
   const addToCart = async (
      productId: number,
      quantity: number = 1
   ) => {
      try {
         setIsLoading(true);
         setError('');

         await cartService.addItem({
            product: productId,
            quantity,
         });

         await getCart();
      } catch (err: unknown) {
         setError(
            getErrorMessage(err, 'Unable to add product to cart.')
         );
      } finally {
         setIsLoading(false);
      }
   };

   // UPDATE QUANTITY
   const updateQuantity = async (
      cartItemId: number,
      quantity: number
   ) => {
      if (quantity < 1) {
         return;
      }

      try {
         setIsLoading(true);
         setError('');

         await cartService.updateItem(cartItemId, { quantity });

         await getCart();
      } catch (err: unknown) {
         setError(
            getErrorMessage(err, 'Unable to update cart.')
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
      } catch (err: unknown) {
         setError(
            getErrorMessage(err, 'Unable to remove item.')
         );
      } finally {
         setIsLoading(false);
      }
   };

   // TOTAL NUMBER OF UNITS IN THE CART
   const totalItems = cartItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
   );

   // TOTAL PRICE OF ALL CART ITEMS
   const totalPrice = cartItems.reduce(
      (total, item) => total + Number(item.total_price || 0),
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

type CartContextValue = ReturnType<typeof useCartState>;

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({
   children,
}: {
   children: ReactNode;
}) => {
   const cartState = useCartState();

   return (
      <CartContext.Provider value={cartState}>
         {children}
      </CartContext.Provider>
   );
};

const useCart = () => {
   const cart = useContext(CartContext);

   if (!cart) {
      throw new Error(
         'useCart must be used within a CartProvider'
      );
   }

   return cart;
};

export default useCart;





















// import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// import cartService, { type CartItem } from '../services/cart-services';

// type UnknownRecord = Record<string, unknown>;

// // Convert supported API response formats into a CartItem array.
// const extractCartItems = (data: unknown): CartItem[] => {
//    if (Array.isArray(data)) {
//       return data as CartItem[];
//    }

//    if (typeof data !== 'object' || data === null) {
//       return [];
//    }

//    const response = data as UnknownRecord;

//    // Django CartSerializer may return { items: [...] }.
//    if (Array.isArray(response.items)) {
//       return response.items as CartItem[];
//    }

//    // Django REST Framework pagination may return { results: [...] }.
//    if (Array.isArray(response.results)) {
//       return response.results as CartItem[];
//    }

//    // Some APIs wrap their response in { data: [...] }.
//    if (Array.isArray(response.data)) {
//       return response.data as CartItem[];
//    }

//    // Support nested cart or data objects.
//    if (response.cart && typeof response.cart === 'object') {
//       return extractCartItems(response.cart);
//    }

//    if (response.data && typeof response.data === 'object') {
//       return extractCartItems(response.data);
//    }

//    return [];
// };

// type CartContextValue = ReturnType<typeof useCartState>;
// const CartContext = createContext<CartContextValue | null>(null);

// const useCartState = () => {
//    const [cartItems, setCartItems] = useState<CartItem[]>([]);
//    const [isLoading, setIsLoading] = useState(false);
//    const [error, setError] = useState('');

//    useEffect(() => {
//       void getCart();
//    }, []);

//    // Extract a readable message from an unknown error.
//    const getErrorMessage = (
//       err: unknown,
//       fallback: string
//    ): string => {
//       if (typeof err === 'object' && err !== null && 'response' in err) {
//          const response = (
//             err as {
//                response?: {
//                   data?: {
//                      detail?: string;
//                      message?: string;
//                   };
//                };
//             }
//          ).response;

//          return (
//             response?.data?.detail ||
//             response?.data?.message ||
//             fallback
//          );
//       }

//       if (err instanceof Error) {
//          return err.message || fallback;
//       }

//       return fallback;
//    };

//    // GET CART
//    const getCart = async () => {
//       try {
//          setIsLoading(true);
//          setError('');

//          const response = await cartService.getCart();
//          const rawCartData = response?.data ?? [];
//          const items = extractCartItems(rawCartData);

//          // Avoid silently treating an unexpected API response as an empty cart.
//          const isSupported =
//             Array.isArray(rawCartData) ||
//             (
//                typeof rawCartData === 'object' &&
//                rawCartData !== null &&
//                (
//                   Array.isArray((rawCartData as UnknownRecord).items) ||
//                   Array.isArray((rawCartData as UnknownRecord).results) ||
//                   Array.isArray((rawCartData as UnknownRecord).data) ||
//                   (
//                      typeof (rawCartData as UnknownRecord).cart === 'object' &&
//                      (rawCartData as UnknownRecord).cart !== null
//                   ) ||
//                   (
//                      typeof (rawCartData as UnknownRecord).data === 'object' &&
//                      (rawCartData as UnknownRecord).data !== null
//                   )
//                )
//             );

//          if (!isSupported) {
//             console.error(
//                'Unexpected cart API response:',
//                rawCartData
//             );
//             setCartItems([]);
//             setError('Unexpected cart response. Check the cart API format.');
//             return;
//          }

//          setCartItems(items);
//       } catch (err: unknown) {
//          setError(getErrorMessage(err, 'Unable to load cart.'));
//       } finally {
//          setIsLoading(false);
//       }
//    };

//    // ADD TO CART
//    const addToCart = async (
//       productId: number,
//       quantity: number = 1
//    ) => {
//       try {
//          setIsLoading(true);
//          setError('');

//          await cartService.addItem({
//             product: productId,
//             quantity,
//          });

//          await getCart();
//       } catch (err: unknown) {
//          setError(
//             getErrorMessage(err, 'Unable to add product to cart.')
//          );
//       } finally {
//          setIsLoading(false);
//       }
//    };

//    // UPDATE QUANTITY
//    const updateQuantity = async (
//       cartItemId: number,
//       quantity: number
//    ) => {
//       if (quantity < 1) {
//          return;
//       }

//       try {
//          setIsLoading(true);
//          setError('');

//          await cartService.updateItem(cartItemId, { quantity });

//          await getCart();
//       } catch (err: unknown) {
//          setError(getErrorMessage(err, 'Unable to update cart.'));
//       } finally {
//          setIsLoading(false);
//       }
//    };

//    // REMOVE ITEM
//    const removeFromCart = async (cartItemId: number) => {
//       try {
//          setIsLoading(true);
//          setError('');

//          await cartService.removeItem(cartItemId);

//          await getCart();
//       } catch (err: unknown) {
//          setError(getErrorMessage(err, 'Unable to remove item.'));
//       } finally {
//          setIsLoading(false);
//       }
//    };

//    // TOTAL ITEMS
//    const totalItems = cartItems.reduce(
//       (total, item) => total + Number(item.quantity || 0),
//       0
//    );

//    // TOTAL PRICE
//    const totalPrice = cartItems.reduce(
//       (total, item) => total + Number(item.total_price || 0),
//       0
//    );

//    return {
//       cartItems,
//       totalItems,
//       totalPrice,
//       isLoading,
//       error,
//       getCart,
//       addToCart,
//       updateQuantity,
//       removeFromCart,
//    };
// };

// export const CartProvider = ({ children }: { children: ReactNode }) => (
//    <CartContext.Provider value={useCartState()}>{children}</CartContext.Provider>
// );

// const useCart = () => {
//    const cart = useContext(CartContext);
//    if (!cart) {
//       throw new Error('useCart must be used within a CartProvider');
//    }
//    return cart;
// };

// export default useCart;
