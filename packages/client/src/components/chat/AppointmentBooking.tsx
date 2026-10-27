import { useState, type FormEvent } from 'react';
import apiClient from '../../services/api-client';

type AppointmentResponse = {
   success: boolean;
   message: string;
   appointment?: { id: number };
   errors?: Record<string, string[] | string>;
};

const AppointmentBooking = () => {
   const [open, setOpen] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [feedback, setFeedback] = useState('');
   const [isError, setIsError] = useState(false);

   const submit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      setSubmitting(true);
      setFeedback('');
      setIsError(false);

      try {
         const { data } = await apiClient.post<AppointmentResponse>('/appointments/', payload);
         setFeedback(data.message);
         form.reset();
      } catch (error) {
         setIsError(true);
         if (typeof error === 'object' && error !== null && 'response' in error) {
            const response = (error as { response?: { data?: AppointmentResponse } }).response?.data;
            const detail = Object.values(response?.errors || {})
               .flatMap((value) => Array.isArray(value) ? value : [value])[0];
            setFeedback(detail || response?.message || 'Could not book the appointment. Please check your details and try again.');
         } else {
            setFeedback('Could not book the appointment. Please try again.');
         }
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <section className="relative mt-3 rounded-xl border border-yellow-500/30 bg-slate-950/50 p-3">
         <button type="button" onClick={() => setOpen((value) => !value)} className="text-sm font-semibold text-yellow-200">
            {open ? 'Close appointment booking' : 'Book an appointment'}
         </button>
         {open && (
            <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-2">
               <input name="name" required minLength={3} placeholder="Full name" className="rounded-lg bg-slate-800 p-2 text-sm text-white" />
               <input name="email" required type="email" placeholder="Email" className="rounded-lg bg-slate-800 p-2 text-sm text-white" />
               <input name="phone" type="tel" placeholder="Phone (optional)" className="rounded-lg bg-slate-800 p-2 text-sm text-white" />
               <input name="service" required placeholder="Service" className="rounded-lg bg-slate-800 p-2 text-sm text-white" />
               <input name="appointment_date" required type="date" min={new Date().toLocaleDateString('en-CA')} className="rounded-lg bg-slate-800 p-2 text-sm text-white" />
               <input name="appointment_time" required type="time" className="rounded-lg bg-slate-800 p-2 text-sm text-white" />
               <textarea name="notes" placeholder="Notes (optional)" rows={2} className="rounded-lg bg-slate-800 p-2 text-sm text-white sm:col-span-2" />
               <button type="submit" disabled={submitting} className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60 sm:col-span-2">
                  {submitting ? 'Booking…' : 'Confirm appointment'}
               </button>
               {feedback && <p role="status" className={`text-sm sm:col-span-2 ${isError ? 'text-red-300' : 'text-green-300'}`}>{feedback}</p>}
            </form>
         )}
      </section>
   );
};

export default AppointmentBooking;
