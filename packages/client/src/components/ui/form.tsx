import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 1. Define the validation schema
const FormDataSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters long'),

   email: z.string().email('Please enter a valid email address'),

   message: z.string().min(10, 'Message must be at least 10 characters long'),
});

// 2. Automatically create the TypeScript type from the Zod schema
type FormData = z.infer<typeof FormDataSchema>;

// 3. Form component
const Form = () => {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid },
   } = useForm<FormData>({
      resolver: zodResolver(FormDataSchema),
   });

   // 4. Submit function
   const onSubmit = (data: FormData) => {
      console.log('Form submitted:', data);
   };

   return (
      <form
         className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border-4 border-gray-200"
         onSubmit={handleSubmit(data => {
            onSubmit(data);
            reset();
         })}
      >
         {/* Name */}
         <div className="mb-3">
            <label htmlFor="name" className="block mb-2 font-medium">
               Name
            </label>

            <input
               {...register('name')}
               id="name"
               type="text"
               className="w-full border rounded-md p-2"
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
            <label htmlFor="email" className="block mb-2 font-medium">
               Email
            </label>

            <input
               {...register('email')}
               id="email"
               type="email"
               className="w-full border rounded-md p-2"
               placeholder="Enter your email"
            />

            {errors.email && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
               </p>
            )}
         </div>

         {/* Message */}
         <div className="mb-3">
            <label htmlFor="message" className="block mb-2 font-medium">
               Message
            </label>

            <textarea
               {...register('message')}
               id="message"
               className="w-full border rounded-md p-2"
               placeholder="Enter your message"
               rows={5}
            />

            {errors.message && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
               </p>
            )}
         </div>

         {/* Submit */}
         <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={!isValid}
         >
            Submit
         </button>
      </form>
   );
};

export default Form;
