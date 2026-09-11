import { useState } from 'react';
import useFormSubmit from '../../hooks/useFormSubmit';

const ContactForm = () => {
   const { submitContact, isSubmitting, success, error } = useFormSubmit();

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [message, setMessage] = useState('');

   const handleSubmit = async (
      event: React.SyntheticEvent<HTMLFormElement>
   ) => {
      event.preventDefault();

      await submitContact({
         name,
         email,
         phone,
         message,
      });
   };

   return (
      <form onSubmit={handleSubmit}>
         <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
         />

         <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email"
         />

         <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Your phone"
         />

         <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Your message"
         />

         <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
         </button>

         {success && <p>{success}</p>}

         {error && <p>{error}</p>}
      </form>
   );
};

export default ContactForm;
