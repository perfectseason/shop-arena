import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import useCart from '../../hooks/useCart';

const navLinks = [
   { label: 'Home', to: '/' },
   { label: 'About', to: '/about' },
   { label: 'Sign in', to: '/signin' },
];

const NavBar = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [isCartOpen, setIsCartOpen] = useState(false);
   const { cartItems, totalItems, updateQuantity, removeFromCart, isLoading } = useCart();

   const navButtonClass = ({ isActive }: { isActive: boolean }) =>
      [
         'rounded-md border px-4 py-2 text-sm font-semibold transition',
         isActive
            ? 'border-slate-950 bg-slate-950 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-950 hover:bg-slate-950 hover:text-white',
      ].join(' ');

   return (
      <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-300 bg-slate-200/90 shadow-lg backdrop-blur-md">
         <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link
               to="/"
               aria-label="Shop Arena"
               className="flex shrink-0 items-center text-border-amber-400"
               onClick={() => setIsOpen(false)}
            >
               <img
                  src={logo}
                  alt="Perfect Homes logo"
                  className="h-9 w-9 rounded-full border border-amber-400 object-cover shadow-sm"
               />
            </Link>

            <Link
               to="/"
               className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-base font-bold uppercase tracking-wide text-slate-950 sm:static sm:translate-x-0 sm:text-xl"
               onClick={() => setIsOpen(false)}
            >
               Shop Arena
            </Link>

            <div className="ml-auto flex items-center gap-2">
               <div className="hidden items-center gap-2 sm:flex">
                  {navLinks.map((link) => (
                     <NavLink
                        key={link.to}
                        to={link.to}
                        className={navButtonClass}
                     >
                        {link.label}
                     </NavLink>
                  ))}
               </div>

               <div className="relative">
                  <button
                     type="button"
                     aria-label={`Cart, ${totalItems} items`}
                     aria-expanded={isCartOpen}
                     onClick={() => setIsCartOpen((open) => !open)}
                     className="relative rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                  >
                     Cart
                     <span className="ml-2 inline-grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-xs text-slate-950">
                        {totalItems}
                     </span>
                  </button>
                  {isCartOpen && (
                     <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
                        <h2 className="mb-2 font-semibold text-slate-900">Your cart</h2>
                        {cartItems.length === 0 ? (
                           <p className="py-3 text-sm text-slate-500">Your cart is empty.</p>
                        ) : (
                           <ul className="max-h-80 space-y-3 overflow-y-auto">
                              {cartItems.map((item) => (
                                 <li key={item.id} className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <img
                                       src={item.product.images?.[0]?.image || '/images/product-placeholder.png'}
                                       alt=""
                                       className="h-12 w-12 shrink-0 rounded object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                       <p className="truncate text-sm font-medium text-slate-900">{item.product.title}</p>
                                       <p className="text-xs text-slate-500">{item.quantity} × {item.unit_price}</p>
                                       <div className="mt-1 flex items-center gap-2">
                                          <button type="button" aria-label={`Decrease ${item.product.title} quantity`} disabled={isLoading || item.quantity <= 1} onClick={() => void updateQuantity(item.id, item.quantity - 1)} className="h-6 w-6 rounded border text-sm disabled:opacity-40">−</button>
                                          <span className="text-xs">{item.quantity}</span>
                                          <button type="button" aria-label={`Increase ${item.product.title} quantity`} disabled={isLoading} onClick={() => void updateQuantity(item.id, item.quantity + 1)} className="h-6 w-6 rounded border text-sm disabled:opacity-40">+</button>
                                          <button type="button" disabled={isLoading} onClick={() => void removeFromCart(item.id)} className="ml-auto text-xs text-red-700 hover:underline disabled:opacity-40">Remove</button>
                                       </div>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                  )}
               </div>

               <button
                  type="button"
                  aria-label="Toggle navigation menu"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((current) => !current)}
                  className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-slate-100 text-slate-950 shadow-sm sm:hidden"
               >
                  <span className="space-y-1.5">
                     <span className="block h-0.5 w-5 bg-current" />
                     <span className="block h-0.5 w-5 bg-current" />
                     <span className="block h-0.5 w-5 bg-current" />
                  </span>
               </button>
            </div>
         </nav>

         {isOpen && (
            <div className="border-t border-slate-300 bg-slate-100/95 px-4 py-3 shadow-lg sm:hidden">
               <div className="mx-auto grid max-w-7xl gap-2">
                  {navLinks.map((link) => (
                     <NavLink
                        key={link.to}
                        to={link.to}
                        className={navButtonClass}
                        onClick={() => setIsOpen(false)}
                     >
                        {link.label}
                     </NavLink>
                  ))}
               </div>
            </div>
         )}
      </header>
   );
};

export default NavBar;
