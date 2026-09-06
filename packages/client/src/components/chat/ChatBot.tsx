import axios from 'axios';
import { useRef, useState, type FormEvent } from 'react';
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

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const value = prompt.trim();
      if (!value) return;

      onSubmit({ prompt: value });
      setPrompt('');
   };

   return (
      <form onSubmit={handleSubmit} className="flex gap-2">
         <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="flex-1"
            placeholder="Ask something..."
         />
         <button type="submit">Send</button>
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
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         popAudio.play();

         const { data } = await axios.post<ChatResponse>('/api/chat/', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.error(error);
         setError('Something went wrong, try again!');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
