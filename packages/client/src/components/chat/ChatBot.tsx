import axios from 'axios';
import { useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import TypingIndicator from './TypingIndicator';
import popSound from '../../assets/sounds/pop.mp3';
import notificationSound from '../../assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   message: string;
};

type ChatFormData = {
   prompt: string;
};

const ChatInput = ({
   onSubmit,
}: {
   onSubmit: (data: ChatFormData) => void;
}) => {
   const [prompt, setPrompt] = useState('');

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const value = prompt.trim();

      if (!value) return;

      onSubmit({ prompt: value });
      setPrompt('');
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="flex w-full gap-2 rounded-xl border border-yellow-500/30 bg-slate-950/50 p-3 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
      >
         <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="flex-1 rounded-lg border border-yellow-600/40 bg-slate-900 px-4 py-2 text-white placeholder:text-slate-400 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            placeholder="Ask something..."
            autoComplete="off"
         />

         <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-700 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.55)] transition hover:scale-105 hover:shadow-[0_0_22px_rgba(250,204,21,0.8)] disabled:cursor-not-allowed disabled:opacity-40 max-[445px]:h-[18px] max-[445px]:w-[18px]"
            disabled={!prompt.trim()}
            aria-label="Send message"
         >
            <FaArrowUp className="h-4 w-4 max-[445px]:h-3 max-[445px]:w-3" />
         </button>
      </form>
   );
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [
            ...prev,
            {
               content: prompt,
               role: 'user',
            },
         ]);

         setIsBotTyping(true);
         setError('');

         popAudio.play().catch((error) => {
            console.error('Pop sound error:', error);
         });

         const { data } = await axios.post<ChatResponse>(
            '/api/chat/',
            {
               prompt,
               conversationId: conversationId.current,
            }
         );

         setMessages((prev) => [
            ...prev,
            {
               content: data.message,
               role: 'bot',
            },
         ]);

         notificationAudio.play().catch((error) => {
            console.error('Notification sound error:', error);
         });
      } catch (error) {
         console.error('Chatbot error:', error);
         setError('Something went wrong, try again!');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div
         className="
            relative
            mx-auto
            mb-5
            mt-5
            flex
            min-h-[550px]
            w-full
            min-w-0
            max-w-xl
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-yellow-700/50
            bg-gradient-to-br
            from-slate-950
            via-yellow-950
            to-slate-800
            p-6
            text-white
            shadow-[0_0_35px_rgba(234,179,8,0.35.1)]
         "
      >
         {/* Golden glow effects */}
         <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />

         <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />

         {/* Golden header */}
         <div className="relative mb-3 flex items-center gap-3 border-b border-yellow-500/30 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-700 text-lg font-bold text-slate-950 shadow-[0_0_18px_rgba(250,204,21,0.6)]">
               CHAT
            </div>

            <div>
               <h2 className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-lg font-bold text-transparent">
                  CUSTOMER ASSISTACE
               </h2>

               <p className="text-md text-yellow-100/70">
                  How can I help you today?
               </p>
            </div>
         </div>

         {/* Messages */}
         <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl bg-black/20 p-3">
            <ChatMessages messages={messages} />

            {isBotTyping && <TypingIndicator />}

            {error && (
               <p className="rounded-lg border border-red-400/30 bg-red-950/50 p-2 text-sm text-red-300">
                  {error}
               </p>
            )}
         </div>

         {/* Input */}
         <div className="relative mt-3">
            <ChatInput onSubmit={onSubmit} />
         </div>
      </div>
   );
};

export default ChatBot;












// import axios from 'axios';
// import { useRef, useState } from 'react';
// import { FaArrowUp } from 'react-icons/fa';
// import type { Message } from './ChatMessages';
// import ChatMessages from './ChatMessages';
// import TypingIndicator from './TypingIndicator';
// import popSound from '../../assets/sounds/pop.mp3';
// import notificationSound from '../../assets/sounds/notification.mp3';

// const popAudio = new Audio(popSound);
// popAudio.volume = 0.2;

// const notificationAudio = new Audio(notificationSound);
// notificationAudio.volume = 0.2;

// type ChatResponse = {
//    message: string;
// };

// type ChatFormData = {
//    prompt: string;
// };

// const ChatInput = ({
//    onSubmit,
// }: {
//    onSubmit: (data: ChatFormData) => void;
// }) => {
//    const [prompt, setPrompt] = useState('');

//    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//       event.preventDefault();

//       const value = prompt.trim();

//       if (!value) return;

//       onSubmit({ prompt: value });
//       setPrompt('');
//    };

//    return (
//       <form
//          onSubmit={handleSubmit}
//          className="flex w-full gap-2 border-t border-slate-200 bg-white p-3"
//       >
//          <input
//             type="text"
//             value={prompt}
//             onChange={(event) => setPrompt(event.target.value)}
//             className="flex-1 rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             placeholder="Ask something..."
//             autoComplete="off"
//          />

//          <button
//             type="submit"
//             className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 max-[445px]:h-[18px] max-[445px]:w-[18px]"
//             disabled={!prompt.trim()}
//             aria-label="Send message"
//          >
//             <FaArrowUp className="h-4 w-4 max-[445px]:h-3 max-[445px]:w-3" />
//          </button>
//       </form>
//    );
// };

// const ChatBot = () => {
//    const [messages, setMessages] = useState<Message[]>([]);
//    const [isBotTyping, setIsBotTyping] = useState(false);
//    const [error, setError] = useState('');

//    const conversationId = useRef(crypto.randomUUID());

//    const onSubmit = async ({ prompt }: ChatFormData) => {
//       try {
//          setMessages((prev) => [
//             ...prev,
//             {
//                content: prompt,
//                role: 'user',
//             },
//          ]);

//          setIsBotTyping(true);
//          setError('');

//          popAudio.play().catch((error) => {
//             console.error('Pop sound error:', error);
//          });

//          const { data } = await axios.post<ChatResponse>(
//             '/api/chat/',
//             {
//                prompt,
//                conversationId: conversationId.current,
//             }
//          );

//          setMessages((prev) => [
//             ...prev,
//             {
//                content: data.message,
//                role: 'bot',
//             },
//          ]);

//          notificationAudio.play().catch((error) => {
//             console.error('Notification sound error:', error);
//          });
//       } catch (error) {
//          console.error('Chatbot error:', error);
//          setError('Something went wrong, try again!');
//       } finally {
//          setIsBotTyping(false);
//       }
//    };

//    return (
//       <div className="max-w-xl mx-auto flex min-h-[550px] w-full min-w-0 flex-col rounded-xl bg-gray-900 p-6 text-black shadow-lg mb-5 mt-5">
//          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
//             <ChatMessages messages={messages} />

//             {isBotTyping && <TypingIndicator />}

//             {error && (
//                <p className="rounded-lg bg-red-50 p-2 text-sm text-red-500">
//                   {error}
//                </p>
//             )}
//          </div>

//          <ChatInput onSubmit={onSubmit} />
//       </div>
//    );
// };

// export default ChatBot;
























// import axios from 'axios';
// import { useRef, useState, type FormEvent } from 'react';
// import type { Message } from './ChatMessages';
// import ChatMessages from './ChatMessages';
// import TypingIndicator from './TypingIndicator';
// import popSound from '../../assets/sounds/pop.mp3';
// import notificationSound from '../../assets/sounds/notification.mp3';

// const popAudio = new Audio(popSound);
// popAudio.volume = 0.2;

// const notificationAudio = new Audio(notificationSound);
// notificationAudio.volume = 0.2;

// type ChatResponse = {
//    message: string;
// };

// type ChatFormData = {
//    prompt: string;
// };

// const ChatInput = ({
//    onSubmit,
// }: {
//    onSubmit: (data: ChatFormData) => void;
// }) => {
//    const [prompt, setPrompt] = useState('');

//    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//       event.preventDefault();
//       const value = prompt.trim();
//       if (!value) return;

//       onSubmit({ prompt: value });
//       setPrompt('');
//    };

//    return (
//       <form onSubmit={handleSubmit} className="flex gap-2">
//          <input
//             value={prompt}
//             onChange={(event) => setPrompt(event.target.value)}
//             className="flex-1"
//             placeholder="Ask something..."
//          />
//          <button type="submit">Send</button>
//       </form>
//    );
// };

// const ChatBot = () => {
//    const [messages, setMessages] = useState<Message[]>([]);
//    const [isBotTyping, setIsBotTyping] = useState(false);
//    const [error, setError] = useState('');
//    const conversationId = useRef(crypto.randomUUID());

//    const onSubmit = async ({ prompt }: ChatFormData) => {
//       try {
//          setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
//          setIsBotTyping(true);
//          setError('');
//          popAudio.play();

//          const { data } = await axios.post<ChatResponse>('/api/chat/', {
//             prompt,
//             conversationId: conversationId.current,
//          });
//          setMessages((prev) => [
//             ...prev,
//             { content: data.message, role: 'bot' },
//          ]);
//          notificationAudio.play();
//       } catch (error) {
//          console.error(error);
//          setError('Something went wrong, try again!');
//       } finally {
//          setIsBotTyping(false);
//       }
//    };

//    return (
//       <div className="flex flex-col h-full">
//          <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
//             <ChatMessages messages={messages} />
//             {isBotTyping && <TypingIndicator />}
//             {error && <p className="text-red-500">{error}</p>}
//          </div>
//          <ChatInput onSubmit={onSubmit} />
//       </div>
//    );
// };

// export default ChatBot;
