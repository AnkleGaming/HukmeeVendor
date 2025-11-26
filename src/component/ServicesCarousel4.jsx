import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card, CardContent } from "../component/ui/card";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import spaImage from "../assets/facialimg.png";
import GetMenServices from "../backend/men_women_popular/getmenservices";

const ServicesCarousel4 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [maxSlide, setMaxSlide] = useState(0);
  const [subServices, setSubServices] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 5, spacing: 16 },
    drag: true,
    friction: 0.2,
    duration: 600,
    breakpoints: {
      "(max-width: 1280px)": { slides: { perView: 4, spacing: 12 } },
      "(max-width: 1024px)": { slides: { perView: 3, spacing: 12 } },
      "(max-width: 768px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 500px)": { slides: { perView: 1, spacing: 8 } },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      setLoaded(true);
      updateMaxSlide(s);
    },
    updated(s) {
      updateMaxSlide(s);
    },
  });

  const updateMaxSlide = (s) => {
    const totalSlides = s.track.details.slides.length;
    const perView =
      typeof s.options.slides === "object" && s.options.slides?.perView
        ? s.options.slides.perView
        : 1;
    setMaxSlide(Math.max(0, totalSlides - perView));
  };

  // Update slider when services change
  useEffect(() => {
    if (loaded && instanceRef.current && subServices.length > 0) {
      instanceRef.current.update();
    }
  }, [subServices, loaded, instanceRef]);

  // Fetch Men Services
  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        setIsLoading(true);
        const data = await GetMenServices();
        setSubServices(data || []);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularServices();
  }, []);

  const handlePrev = () => instanceRef.current?.prev();
  const handleNext = () => instanceRef.current?.next();

  const handleServiceClick = (service) => {
    navigate("/womensaloonIn", { state: { subService: service } });
  };

  const imageBaseUrl = "https://api.weprettify.com/Images/";

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="keen-slider__slide px-2">
      <Card className="flex flex-col h-[280px] rounded-lg shadow-lg border animate-pulse">
        <CardContent className="p-0 flex-grow">
          <div className="h-[200px] bg-gray-200 rounded-t-lg"></div>
        </CardContent>
        <div className="mt-3 px-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    </div>
  );

  return (
    <section id="services" className="py-5 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-8 text-center md:text-left">
          Men Services
        </h2>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center mb-6 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Slider Container */}
        <div className="relative min-h-[300px] w-full">
          {/* Arrow Buttons */}
          {loaded && subServices.length > 0 && currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-[-12px] sm:left-[-24px] md:left-[-28px] lg:left-[-32px] top-1/2 z-20 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {loaded && subServices.length > 0 && currentSlide < maxSlide && (
            <button
              onClick={handleNext}
              className="absolute right-[-12px] sm:right-[-24px] md:right-[-28px] lg:right-[-32px] top-1/2 z-20 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Keen Slider */}
          <div ref={sliderRef} className="keen-slider">
            {isLoading ? (
              Array(5)
                .fill()
                .map((_, index) => <SkeletonCard key={index} />)
            ) : subServices.length > 0 ? (
              subServices.map((service) => (
                <div key={service.id} className="keen-slider__slide px-2">
                  <div
                    className="m-0"
                    onClick={() => handleServiceClick(service)}
                  >
                    <Card className="flex flex-col cursor-pointer h-[280px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-300">
                      <CardContent className="p-0 flex-grow">
                        <div className="h-[200px] overflow-hidden rounded-t-lg">
                          <img
                            src={
                              service.image
                                ? `${imageBaseUrl}${service.image}`
                                : spaImage
                            }
                            alt={service.text}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = spaImage;
                            }}
                          />
                        </div>
                      </CardContent>
                      <div className="px-4 py-3">
                        <span className="text-base font-medium text-gray-900 truncate block">
                          {service.text}
                        </span>
                      </div>
                    </Card>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No services available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel4;
