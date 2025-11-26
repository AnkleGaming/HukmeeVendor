import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import spaImage from "../assets/women_sal.png";
import ServicePromoCard from "./ui/promocard-section";
import GetPopularServices from "../backend/men_women_popular/getpopularservices";

const PromocardSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [maxSlide, setMaxSlide] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchPopularServices = async () => {
      const response = await GetPopularServices();
      setServices(response ?? []);
    };
    fetchPopularServices();
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 1280px)": {
        slides: { perView: 3.2, spacing: 12 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 2.2, spacing: 10 },
      },
      "(max-width: 768px)": {
        slides: { perView: 1.2, spacing: 8 },
      },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      setLoaded(true);
      const totalSlides = s.track.details.slides.length;
      const perView =
        typeof s.options.slides === "object" &&
        s.options.slides &&
        typeof s.options.slides.perView === "number"
          ? s.options.slides.perView
          : 1;
      setMaxSlide(Math.max(0, totalSlides - perView));
    },
  });

  if (services.length === 0) {
    return (
      <section
        id="services"
        className="py-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Explore Popular Services
            </h2>
          </div>
          <div>No services available</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      className="py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            Explore Popular Services
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {loaded && currentSlide > 0 && (
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-[-10px] sm:left-[-32px] md:left-[-24px] lg:left-[-20px] top-1/2 z-20 transform -translate-y-1/2 bg-gray-900 text-white p-2 sm:p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
          )}

          {loaded && currentSlide < maxSlide && (
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-[-10px] sm:right-[-32px] md:right-[-24px] lg:right-[-20px] top-1/2 z-20 transform -translate-y-1/2 bg-gray-900 text-white p-2 sm:p-1 rounded-full hover:bg-gray-700  transition-colors duration-200 shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          )}

          <div ref={sliderRef} className="keen-slider">
            {services.map((service, index) => (
              <div key={index} className="keen-slider__slide">
                <ServicePromoCard
                  title={service.ServiceName}
                  subtitle={service.duration}
                  image={spaImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromocardSection;
