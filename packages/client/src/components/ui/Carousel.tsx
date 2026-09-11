type CarouselSlide = {
   image: string;
   alt: string;
};

type CarouselProps = {
   slides: readonly CarouselSlide[];
};

const Carousel = ({ slides }: CarouselProps) => {
   if (!slides.length) return null;

   return (
      <div className="overflow-hidden rounded-xl shadow-lg">
         <div
            id="product-carousel"
            className="carousel slide"
            data-bs-ride="carousel"
         >
            <div className="carousel-inner">
               {slides.map((slide, index) => (
                  <div
                     key={slide.image}
                     className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  >
                     <img
                        src={slide.image}
                        className="d-block h-[280px] w-100 object-cover sm:h-[380px]"
                        alt={slide.alt}
                     />
                  </div>
               ))}
            </div>
            <button
               className="carousel-control-prev"
               type="button"
               data-bs-target="#product-carousel"
               data-bs-slide="prev"
            >
               <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
               ></span>
               <span className="visually-hidden">Previous</span>
            </button>
            <button
               className="carousel-control-next"
               type="button"
               data-bs-target="#product-carousel"
               data-bs-slide="next"
            >
               <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
               ></span>
               <span className="visually-hidden">Next</span>
            </button>
         </div>
      </div>
   );
};

export default Carousel;
