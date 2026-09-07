import apiClient from './api-client';

export interface EnquiryData {
   name: string;
   email: string;
   phone?: string;
   product?: number;
   message: string;
}

export interface ContactData {
   name: string;
   email: string;
   phone?: string;
   message: string;
}

const formService = {
   submitEnquiry(data: EnquiryData) {
      return apiClient.post('/enquiries/', data);
   },

   submitContact(data: ContactData) {
      return apiClient.post('/contact/', data);
   },
};

export default formService;
