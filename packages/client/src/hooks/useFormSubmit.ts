import { useState } from 'react';

import formService, {
   type EnquiryData,
   type ContactData,
} from '../services/form-service';

const useFormSubmit = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [success, setSuccess] = useState('');

   const [error, setError] = useState('');

   const submitEnquiry = async (data: EnquiryData) => {
      try {
         setIsSubmitting(true);
         setSuccess('');
         setError('');

         await formService.submitEnquiry(data);

         setSuccess('Your enquiry was submitted successfully.');
      } catch (error: any) {
         setError(
            error.response?.data?.detail ||
               error.response?.data?.message ||
               'Unable to submit enquiry.'
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   const submitContact = async (data: ContactData) => {
      try {
         setIsSubmitting(true);
         setSuccess('');
         setError('');

         await formService.submitContact(data);

         setSuccess('Your message was sent successfully.');
      } catch (error: any) {
         setError(
            error.response?.data?.detail ||
               error.response?.data?.message ||
               'Unable to send message.'
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   return {
      submitEnquiry,
      submitContact,
      isSubmitting,
      success,
      error,
   };
};

export default useFormSubmit;
