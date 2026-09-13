import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import chat from '../../assets/chat.jpg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// 1. Validation schema
const FormDataSchema = z.object({
   name: z
      .string()
      .min(3, 'Name must be at least 3 characters long'),

   email: z
      .string()
      .email('Please enter a valid email address'),

   phone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters long'),
});

// 2. TypeScript type
type FormData = z.infer<typeof FormDataSchema>;

// 3. Component
const ChatBotForm = () => {
   const navigate = useNavigate();

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [serverError, setServerError] = useState('');

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid },
   } = useForm<FormData>({
      resolver: zodResolver(FormDataSchema),
      mode: 'onChange',
   });

   // 4. Submit function
   const onSubmit = async (data: FormData) => {
      setIsSubmitting(true);
      setServerError('');

      try {
         const response = await fetch(
            'http://127.0.0.1:8000/api/chatbot/clients/',
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
            }
         );

         const responseData = await response.json();

         // Django validation/server error
         if (!response.ok) {
            throw new Error(
               responseData.detail ||
                  'Unable to submit your information.'
            );
         }

         // Database save was successful
         reset();

         // Redirect to React chatbot page
         navigate('/chatbot');
      } catch (error) {
         console.error('Chatbot form submission error:', error);

         setServerError(
            error instanceof Error
               ? error.message
               : 'Something went wrong. Please try again.'
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
    <>
   <h2 className="text-center bg-emerald-50 max-w-md mx-auto rounded-xl text-2xl font-bold uppercase tracking-wide text-slate-950 sm:text-3xl mb-3 mt-4">
        TALK TO OUR CUSTOMER<br></br> SERVICE AGENT
   </h2>
    <div className="flex justify-center mb-4">
            <img
               src={chat}
               alt="Chat"
               className="h-30 w-30 rounded-full max-w-xs h-auto"
            />
         </div>
      <form
         className="max-w-md mx-auto flex min-h-[350px] w-full min-w-0 flex-col rounded-xl bg-gray-900 p-6 text-white shadow-lg"
         onSubmit={handleSubmit(onSubmit)}
      >
         {/* Name */}
         <div className="mb-3">
            <label
               htmlFor="name"
               className="block mb-2 font-medium"
            >
               Name
            </label>

            <input
               {...register('name')}
               id="name"
               type="text"
               className="w-full border rounded-lg p-2"
               placeholder="Enter your name"
            />

            {errors.name && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
               </p>
            )}
         </div>

         {/* Email */}
         <div className="mb-3">
            <label
               htmlFor="email"
               className="block mb-2 font-medium"
            >
               Email
            </label>

            <input
               {...register('email')}
               id="email"
               type="email"
               className="w-full border rounded-lg p-2"
               placeholder="Enter your email"
            />

            {errors.email && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
               </p>
            )}
         </div>

         {/* Phone */}
         <div className="mb-3">
            <label
               htmlFor="phone"
               className="block mb-2 font-medium"
            >
               Phone
            </label>

            <input
               {...register('phone')}
               id="phone"
               type="tel"
               className="w-full border rounded-lg p-2"
               placeholder="Enter your phone number"
            />

            {errors.phone && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
               </p>
            )}
         </div>

         {/* Server error */}
         {serverError && (
            <p className="text-red-500 text-sm mb-3">
               {serverError}
            </p>
         )}

         {/* Submit */}
         <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-xl hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed"
         >
            {isSubmitting ? 'Submitting...' : 'Submit'}
         </button>
      </form>
    </>
   );
};

export default ChatBotForm;

