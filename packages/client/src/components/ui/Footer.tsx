import { Link } from 'react-router-dom';

const footerLinks = [
   { label: 'Home', to: '/' },
   { label: 'About', to: '/about' },
   { label: 'Properties', to: '/properties' },
   { label: 'Contact', to: '/contact' },
];

const Footer = () => {
   return (
      <footer className="border-t border-slate-200 bg-slate-950 text-white">
         <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
            <div>
               <h2 className="text-xl font-bold uppercase tracking-wide">
                  Perfect Homes
               </h2>
               <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                  Simple, trusted real estate support for finding, listing, and
                  choosing homes in the right locations.
               </p>
            </div>

            <div>
               <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
                  Pages
               </h3>
               <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                  {footerLinks.map((link) => (
                     <Link
                        key={link.to}
                        to={link.to}
                        className="rounded-md border border-white/10 px-3 py-2 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                     >
                        {link.label}
                     </Link>
                  ))}
               </div>
            </div>

            <div>
               <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
                  Contact
               </h3>
               <div className="mt-4 grid gap-2 text-sm text-slate-300">
                  <a
                     href="mailto:support@perfecthomes.com"
                     className="transition hover:text-white"
                  >
                     support@perfecthomes.com
                  </a>
                  <a
                     href="tel:+2348106978741"
                     className="transition hover:text-white"
                  >
                     +234 810 697 8741
                  </a>
               </div>
            </div>
         </div>

         <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Perfect Homes. All rights
            reserved.
         </div>
      </footer>
   );
};

export default Footer;
