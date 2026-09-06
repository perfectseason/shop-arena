import { useEffect, useState, type FormEvent } from 'react';
import ChatBot from '../chat/ChatBot';
import { Button } from './button';

type Visitor = {
   name: string;
   email: string;
   phone?: string;
};

const storageKey = 'perfecthomes-chat-visitor';

export default function ChatGateway() {
   const [visitor, setVisitor] = useState<Visitor | null>(null);
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');

   useEffect(() => {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
         setVisitor(JSON.parse(stored) as Visitor);
      }
   }, []);

   const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextVisitor = {
         name: name.trim(),
         email: email.trim(),
         phone: phone.trim() || undefined,
      };

      if (!nextVisitor.name || !nextVisitor.email) {
         return;
      }

      window.localStorage.setItem(storageKey, JSON.stringify(nextVisitor));
      setVisitor(nextVisitor);
   };

   if (visitor) {
      return (
         <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
               <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                     Chat Support
                  </h2>
                  <p className="text-sm text-gray-500">
                     Signed in as {visitor.name}
                  </p>
               </div>
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                     window.localStorage.removeItem(storageKey);
                     setVisitor(null);
                  }}
               >
                  Change
               </Button>
            </div>
            <div className="h-[460px]">
               <ChatBot />
            </div>
         </section>
      );
   }

   return (
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
         <h2 className="text-lg font-semibold text-gray-800">Chat Access</h2>
         <form onSubmit={submit} className="mt-4 grid gap-4">
            <label className="grid gap-1 text-sm font-medium text-gray-700">
               Name
               <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
               />
            </label>
            <label className="grid gap-1 text-sm font-medium text-gray-700">
               Email
               <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
               />
            </label>
            <label className="grid gap-1 text-sm font-medium text-gray-700">
               Phone
               <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
               />
            </label>
            <Button type="submit" className="w-full">
               Continue to Chat
            </Button>
         </form>
      </section>
   );
}
