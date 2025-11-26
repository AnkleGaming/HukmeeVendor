import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SpecialForYouCard from "./specialforyoucard";
import GetSpecialforyou from "../../backend/specialforyou/getspecialforyou";

const SpecialForYou = () => {
  const [services, setServices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 3, spacing: 16 },
    breakpoints: {
      "(max-width: 1280px)": { slides: { perView: 3.2, spacing: 12 } },
      "(max-width: 1024px)": { slides: { perView: 2.2, spacing: 10 } },
      "(max-width: 768px)": { slides: { perView: 1.2, spacing: 8 } },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      const totalSlides = s.track.details.slides.length;
      const perView =
        typeof s.options.slides === "object" && s.options.slides?.perView
          ? s.options.slides.perView
          : 1;
      setMaxSlide(Math.max(0, totalSlides - perView));
    },
  });

  useEffect(() => {
    const fetchSpecialForYou = async () => {
      try {
        const data = await GetSpecialforyou();
        // Map API data to match SpecialForYouCard props
        const mappedData = data.map((item) => ({
          id: item.id || item.ID,
          name: item.PackageName || item.name,
          duration: item.PackageTime || item.duration,
          image: item.PackageImage || item.image,
        }));
        setServices(mappedData);
      } catch (error) {
        console.error("Error fetching Special For You data:", error);
      }
    };

    fetchSpecialForYou();
  }, []);

  return (
    <section id="services" className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-10">
          Special For You
        </h2>

        <div className="relative">
          {currentSlide > 0 && (
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md border border-gray-200 shadow-md hover:scale-105 transition-all p-2 md:p-3 rounded-full"
            >
              <ChevronLeft size={15} />
            </button>
          )}

          {currentSlide < maxSlide && (
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md border border-gray-200 shadow-md hover:scale-105 transition-all p-2 md:p-3 rounded-full"
            >
              <ChevronRight size={15} />
            </button>
          )}

          <div ref={sliderRef} className="keen-slider">
            {services.map((service) => (
              <div key={service.id} className="keen-slider__slide">
                <SpecialForYouCard
                  title={service.name}
                  subtitle={service.duration}
                  image={service.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialForYou;
