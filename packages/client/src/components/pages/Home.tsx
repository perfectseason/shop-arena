import { useState, type CSSProperties, type SubmitEvent } from 'react';
import useCart from '../../hooks/useCart';
import { Button } from '../ui/button';
import ChatBotForm from '../ui/ChatBotForm';
import Carousel from '../ui/Carousel';

type Product = {
   id: number;
   image: string;
   name: string;
   price: string;
};

const featuredProducts: Product[] = [
   {
      id: 1,
      image: '/images/watches.jpg',
      name: 'Smart Watch',
      price: '$120',
   },
   {
      id: 2,
      image: '/images/watches1.jpg',
      name: 'Classic Watch',
      price: '$85',
   },
   {
      id: 3,
      image: '/images/watches2.jpg',
      name: 'Premium Watch',
      price: '$450',
   },
];

const electronics: Product[] = [
   {
      id: 4,
      image: '/images/ifone.jpg',
      name: 'iPhone',
      price: '$850',
   },
   {
      id: 5,
      image: '/images/ifone2.jpg',
      name: 'iPhone Pro',
      price: '$920',
   },
   {
      id: 6,
      image: '/images/ifone3.jpg',
      name: 'iPhone Mini',
      price: '$550',
   },
   {
      id: 7,
      image: '/images/tablet.jpg',
      name: 'Tablet',
      price: '$320',
   },
];

const fashion: Product[] = [
   {
      id: 8,
      image: '/images/ladies shoe.jpg',
      name: 'Ladies Shoes',
      price: '$95',
   },
   {
      id: 9,
      image: '/images/ladies shoe1.jpg',
      name: 'Casual Shoes',
      price: '$130',
   },
   {
      id: 10,
      image: '/images/ladies shoe2.jpg',
      name: 'Elegant Shoes',
      price: '$180',
   },
   {
      id: 11,
      image: '/images/ladies shoe3.jpg',
      name: 'Everyday Shoes',
      price: '$110',
   },
   {
      id: 12,
      image: '/images/ladies shoe4.jpg',
      name: 'Comfort Shoes',
      price: '$65',
   },
];

const homeCollection: Product[] = [
   {
      id: 13,
      image: '/images/bag.jpg',
      name: 'Leather Bag',
      price: '$440',
   },
   {
      id: 14,
      image: '/images/bag1.jpg',
      name: 'Traveller Bag',
      price: '$570',
   },
   {
      id: 15,
      image: '/images/bag2.jpg',
      name: 'Ladies Bag',
      price: '$320',
   },
];

const carouselSlides = [
   { image: '/images/fone.jpg', alt: 'Latest smartphone collection' },
   { image: '/images/laptop.jpg', alt: 'Laptop collection' },
   { image: '/images/camera.jpg', alt: 'Camera collection' },
] as const;

function ProductCard({
   product,
   onAddToCart,
   isAdding,
}: {
   product: Product;
   onAddToCart: (product: Product) => void;
   isAdding: boolean;
}) {
   return (
      <div className="w-full min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
         {' '}
         <div className="aspect-square w-full overflow-hidden bg-gray-100">
            {' '}
            <img
               src={product.image}
               alt={product.name}
               className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />{' '}
         </div>
         <div className="p-4">
            <h3 className="truncate text-lg font-semibold text-gray-900">
               {product.name}
            </h3>

            <p className="mt-2 text-xl font-bold text-gray-900">
               {product.price}
            </p>

            <Button
               type="button"
               onClick={() => onAddToCart(product)}
               disabled={isAdding}
               className="mt-4 w-full bg-black px-4 py-2 font-medium text-white hover:bg-gray-700"
            >
               {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
         </div>
      </div>
   );
}

export default function Home() {
   const { addToCart, isLoading, error } = useCart();
   const [chatMessage, setChatMessage] = useState('');
   const [chatResponse, setChatResponse] = useState(
      'Hello! How can I help you?'
   );
   const heroStyle: CSSProperties = {
      backgroundImage: "url('/images/fone.jpg')",
   };

   const handleAddToCart = async (product: Product) => {
      await addToCart(product.id, 1);
   };

   const handleShopNow = () => {
      document.getElementById('featured-products')?.scrollIntoView({
         behavior: 'smooth',
      });
   };

   const handleChatSubmit = (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const message = chatMessage.trim();
      if (!message) return;

      setChatResponse(
         'Thanks for your message. Our shopping assistant will help you shortly.'
      );
      setChatMessage('');
   };

   return (
      <div className="w-full">
         {/* HERO */}{' '}
         <section className="relative min-h-screen w-full overflow-hidden">
            {/* HERO IMAGE */}{' '}
            <div
               className="absolute inset-0 bg-cover bg-center bg-no-repeat my-6 mx-4 rounded-sm"
               style={heroStyle}
            />
            {/* HERO FADE / OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
            {/* HERO CONTENT */}
            <div className="relative flex min-h-screen items-center p-6 sm:p-10 md:p-16 lg:p-24">
               <div className="w-full max-w-2xl text-white">
                  <p className="pt-1 text-sm font-medium uppercase tracking-widest sm:text-base">
                     New Collection
                  </p>

                  <h1 className="mt-2 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                     Shop Everything
                  </h1>

                  <p className="mt-3 max-w-md text-sm sm:text-base md:text-lg">
                     Discover quality products at great prices.
                  </p>

                  <Button
                     type="button"
                     variant="secondary"
                     size="lg"
                     onClick={handleShopNow}
                     className="mt-5 bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 sm:px-8 sm:py-4"
                  >
                     Shop Now
                  </Button>
               </div>
            </div>
            <div className="mt-5 mb-5 w-full text-center text-xl font-bold uppercase tracking-wide text-slate-950 sm:text-2xl">
               THE LOWEST PRICE EVER
            </div>
         </section>
         <div>
            <p className='text-center text-2xl font-bold uppercase tracking-wide text-slate-950 sm:text-3xl mb-4 mt-4'>
               YOUR DREAM GADGETS
            </p>
         </div>
         {/* Carousel */}
         <section className="relative min-h-screen w-full overflow-hidden px-4 py-8 sm:px-6 md:px-8 lg:px-10">
            <Carousel slides={carouselSlides} />
         </section>
         {/* FEATURED PRODUCTS - 3 COLUMNS */}
         <section
            id="featured-products"
            className="w-full bg-stone-50 px-4 py-8 sm:px-6 md:px-8 lg:px-10"
         >
            <div>
               <h2 className="mb-8 text-center text-2xl font-bold text-yellow-200 sm:text-3xl dark:text-sky-200">
                  FEATURED PRODUCTS
               </h2>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {featuredProducts.map((product) => (
                  <div key={product.image} className="w-full min-w-0">
                     <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        isAdding={isLoading}
                     />
                  </div>
               ))}
            </div>
         </section>
         {/* ELECTRONICS - 4 COLUMNS */}
         <section className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-10">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Electronics</h2>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
               {electronics.map((product) => (
                  <div key={product.image} className="w-full min-w-0">
                     <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        isAdding={isLoading}
                     />
                  </div>
               ))}
            </div>
         </section>
         {/* FASHION - 5 COLUMNS */}
         <section className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-10">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Fashion</h2>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
               {fashion.map((product) => (
                  <div key={product.image} className="w-full min-w-0">
                     <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        isAdding={isLoading}
                     />
                  </div>
               ))}
            </div>
         </section>
         {/* HOME COLLECTION - 3 PRODUCTS + CHATBOT */}
         <section className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-10">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
               Home Collection
            </h2>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
               {homeCollection.map((product) => (
                  <div key={product.image} className="w-full min-w-0">
                     <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        isAdding={isLoading}
                     />
                  </div>
               ))}

               {/* CHATBOT */}
               <div className="flex min-h-[350px] w-full min-w-0 flex-col rounded-xl bg-gray-900 p-6 text-white shadow-lg">
                  <h3 className="text-xl font-bold">Shopping Assistant</h3>

                  <p className="mt-2 text-sm text-gray-300">
                     Ask about products, prices, orders, or recommendations.
                  </p>

                  <div className="mt-auto">
                     <div className="mb-3 rounded-lg bg-gray-800 p-3 text-sm">
                        {chatResponse}
                     </div>

                     <form className="flex gap-2" onSubmit={handleChatSubmit}>
                        <input
                           type="text"
                           placeholder="Ask something..."
                           value={chatMessage}
                           onChange={(event) =>
                              setChatMessage(event.target.value)
                           }
                           className="min-w-0 flex-1 rounded-lg px-3 py-2 text-black outline-none"
                        />

                        <Button
                           type="submit"
                           variant="secondary"
                           className="shrink-0 bg-white px-4 py-2 font-semibold text-black hover:bg-gray-200"
                        >
                           Send
                        </Button>
                     </form>
                  </div>
               </div>
            </div>
            {error && (
               <p
                  className="mt-4 text-sm font-medium text-red-600"
                  role="alert"
               >
                  {error}
               </p>
            )}
         </section>
         <div className='mb-5 mt-5 w-full text-center text-xl font-bold uppercase tracking-wide text-slate-950 sm:text-2xl'>
              <ChatBotForm />
         </div>
      </div>
   );
}
