const About = () => {
   return (
      <>
         <section className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-6 py-20">
               <h1 className="text-2xl font-bold text-gray-800">About Us</h1>

               <p className="mt-6 text-gray-600 leading-relaxed">
                  Perfect Season is committed to delivering top-quality
                  ecommerce services globally. Our mission is to connect
                  customers with premium products while ensuring fast delivery
                  and secure payment systems.
               </p>
               <p className="mt-6 text-gray-600 leading-relaxed">
                  Perfect Season: Our main objective is make our customer
                  satisfaction our top priority. Maintain the quality of our
                  products and services, in other to be above our competitors.
                  We are committed to providing
               </p>

               <div className="mt-12 grid md:grid-cols-2 gap-10">
                  <div className="bg-gray-100 p-6 rounded-lg">
                     <h3 className="text-xl font-semibold">Our Vision</h3>
                     <p className="text-gray-600 mt-3">
                        To become a globally trusted ecommerce brand.
                     </p>
                  </div>

                  <div className="bg-gray-100 p-6 rounded-lg">
                     <h3 className="text-xl font-semibold">Our Mission</h3>
                     <p className="text-gray-600 mt-3">
                        Deliver excellence and build lasting customer
                        relationships.
                     </p>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
};

export default About;
