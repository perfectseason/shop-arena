import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../components/ui/logo.jpg';

const navLinks = [
   { label: 'Home', to: '/' },
   { label: 'About', to: '/about' },
   { label: 'Properties', to: '/properties' },
   { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);

   const navButtonClass = ({ isActive }: { isActive: boolean }) =>
      [
         'rounded-md border px-4 py-2 text-sm font-semibold transition',
         isActive
            ? 'border-slate-950 bg-slate-950 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-950 hover:bg-slate-950 hover:text-white',
      ].join(' ');

   return (
      <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
         <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link
               to="/"
               aria-label="Perfect Homes home"
               className="flex shrink-0 items-center"
               onClick={() => setIsOpen(false)}
            >
               <img
                  src={logo}
                  alt="Perfect Homes logo"
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover shadow-sm"
               />
            </Link>

            <Link
               to="/"
               className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-base font-bold uppercase tracking-wide text-slate-950 sm:text-xl"
               onClick={() => setIsOpen(false)}
            >
               Perfect Homes
            </Link>

            <div className="hidden items-center gap-2 md:flex">
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

            <button
               type="button"
               aria-label="Toggle navigation menu"
               aria-expanded={isOpen}
               onClick={() => setIsOpen((current) => !current)}
               className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-950 shadow-sm md:hidden"
            >
               <span className="space-y-1.5">
                  <span className="block h-0.5 w-5 bg-current" />
                  <span className="block h-0.5 w-5 bg-current" />
                  <span className="block h-0.5 w-5 bg-current" />
               </span>
            </button>
         </nav>

         {isOpen && (
            <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
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

export default Navbar;
