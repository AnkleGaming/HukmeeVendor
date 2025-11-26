import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card, CardContent } from "../component/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import spaImage from "../assets/women_sal.png";

const ServicesCarousel3 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [maxSlide, setMaxSlide] = useState(0);

  const services = [
    {
      id: 1,
      name: "Rejuvenating Facial",
      duration: "90 minutes",
      price: "₹150",
      rating: 4.9,
      image: spaImage,
    },
    {
      id: 2,
      name: "Hot Stone Massage",
      duration: "75 minutes",
      price: "₹130",
      rating: 4.8,
      image: spaImage,
    },
    {
      id: 3,
      name: "Lymphatic Drainage",
      duration: "60 minutes",
      price: "₹120",
      rating: 4.9,
      image: spaImage,
    },
    {
      id: 4,
      name: "Aromatherapy Treatment",
      duration: "75 minutes",
      price: "₹140",
      rating: 4.7,
      image: spaImage,
    },
    {
      id: 5,
      name: "Diamond Microdermabrasion",
      duration: "45 minutes",
      price: "₹180",
      rating: 4.9,
      image: spaImage,
    },
    {
      id: 6,
      name: "Deep Tissue Massage",
      duration: "90 minutes",
      price: "₹160",
      rating: 4.8,
      image: spaImage,
    },
    {
      id: 7,
      name: "Facial Glow Treatment",
      duration: "60 minutes",
      price: "₹110",
      rating: 4.6,
      image: spaImage,
    },
  ];

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: 5,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1280px)": {
        slides: { perView: 4.2, spacing: 12 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 3.2, spacing: 12 },
      },
      "(max-width: 768px)": {
        slides: { perView: 2.2, spacing: 10 },
      },
      "(max-width: 500px)": {
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
      const max = Math.max(0, totalSlides - perView);
      setMaxSlide(max);
    },
  });

  const handlePrev = () => instanceRef.current?.prev();
  const handleNext = () => instanceRef.current?.next();

  return (
    <section id="services" className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-[30px] font-medium text-black mb-10">
          <h2>Saloon For women</h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Arrow Buttons */}
          {loaded && currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-[-10px] top-[115px] z-10 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {loaded && currentSlide < maxSlide && (
            <button
              onClick={handleNext}
              className="absolute right-[-10px] top-[115px] z-10 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Keen Slider */}
          <div ref={sliderRef} className="keen-slider">
            {services.map((service) => (
              <div key={service.id} className="keen-slider__slide px-2">
                <div className="">
                  <Card className="flex flex-col cursor-pointer hover:scale-[1.01] transition-all h-[300px] overflow-hidden rounded-lg shadow-md border">
                    {/* Text on Top */}
                    <div className="p-3 mb-4">
                      <span className="text-[16px] font-medium text-black">
                        {service.name}
                      </span>
                    </div>
                    <CardContent className="p-0 flex-grow">
                      <div className="h-full">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel3;
