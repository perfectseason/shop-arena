import type { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } =
      useForm<ChatFormData>();

   const submit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   };

   return (
      <form
         onSubmit={submit}
         onKeyDown={handleKeyDown}
         className="flex flex-col items-end gap-2 rounded-3xl border-2 p-4"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (data) => data.trim().length > 0,
            })}
            autoFocus
            className="w-full resize-none border-0 focus:outline-0"
            placeholder="Ask anything"
            maxLength={1000}
         />

         <button
            type="submit"
            disabled={!formState.isValid}
            className="h-9 w-9 rounded-full max-[445px]:h-[18px] max-[445px]:w-[18px]"
         >
            <FaArrowUp className="h-full w-full" />
         </button>
      </form>
   );
};

export default ChatInput;