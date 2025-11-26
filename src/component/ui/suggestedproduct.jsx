import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./card";
import { useNavigate } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import spaImage from "../../assets/facialimg.png";
import GetSuggestProduct from "../../backend/getproduct/suggestedproducts";
import GetProductImage from "../../backend/getproduct/getproductimage";
import { AlertCircle } from "lucide-react";

const SuggestProductScreen = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Keen Slider setup
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 5, // Show 5 items by default
      spacing: 16, // Space between cards
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 3, spacing: 12 }, // 3 items on medium screens
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 8 }, // 1 item on mobile
      },
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Autoplay for slider
  useEffect(() => {
    if (!instanceRef.current || isLoading) return;
    const autoplay = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => clearInterval(autoplay);
  }, [instanceRef, isLoading]);

  useEffect(() => {
    const fetchServicesWithImages = async () => {
      try {
        setIsLoading(true);
        const products = await GetSuggestProduct();

        if (!products || products.length === 0) {
          setServices([]);
          return;
        }

        const limitedProducts = products.slice(0, 5);

        const productsWithImages = await Promise.all(
          limitedProducts.map(async (product) => {
            try {
              const images = await GetProductImage(product.ProID);
              return {
                ...product,
                imageUrl: images.length > 0 ? images[0].productImage : spaImage,
              };
            } catch (err) {
              console.error(
                `Error fetching image for product ${product.ProID}:`,
                err
              );
              return { ...product, imageUrl: spaImage };
            }
          })
        );

        setServices(productsWithImages);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesWithImages();
  }, []);

  const handleServiceClick = (service) => {
    navigate("/productmainpage", { state: { subService: service } });
  };

  const SkeletonCard = () => (
    <Card className="flex flex-col h-[360px] rounded-xl shadow-lg border animate-pulse">
      <CardContent className="p-0 flex-grow">
        <div className="h-[200px] bg-gray-200 rounded-t-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        </div>
      </CardContent>
      <div className="mt-3 px-4 py-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </Card>
  );

  return (
    <section
      id="services"
      className="py-12 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
          Suggested Products
        </h2>
        {error && (
          <div className="flex items-center justify-center text-red-600 mb-6">
            <AlertCircle className="w-6 h-6 mr-2" />
            <p>{error}</p>
          </div>
        )}
        <div className="relative">
          {isLoading ? (
            <div className="keen-slider" ref={sliderRef}>
              {Array(5)
                .fill()
                .map((_, index) => (
                  <div key={index} className="keen-slider__slide">
                    <SkeletonCard />
                  </div>
                ))}
            </div>
          ) : services.length > 0 ? (
            <>
              <div ref={sliderRef} className="keen-slider">
                {services.map((service) => (
                  <div key={service.ProID} className="keen-slider__slide">
                    <Card
                      className="flex flex-col cursor-pointer h-[360px] rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-indigo-300 transition-all duration-300"
                      onClick={() => handleServiceClick(service)}
                    >
                      <CardContent className="p-0 flex-grow">
                        <div className="h-[200px] overflow-hidden rounded-t-xl">
                          <img
                            src={service.imageUrl || spaImage}
                            alt={service.ProductName || "Product"}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = spaImage;
                            }}
                          />
                        </div>
                      </CardContent>
                      <div className="px-4 py-4 flex flex-col flex-grow">
                        <span className="text-lg font-semibold text-gray-900 truncate block leading-tight mb-2">
                          {service.ProductName}
                        </span>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {service.ProductDes}
                        </p>
                        <span className="text-base font-medium text-gray-900 mt-auto">
                          ₹{Number(service.Price).toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              {loaded && instanceRef.current && services.length > 1 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-6">
                    <button
                      onClick={() => instanceRef.current?.prev()}
                      className="p-3 bg-black text-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
                      aria-label="Previous slide"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => instanceRef.current?.next()}
                      className="p-3 bg-black text-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
                      aria-label="Next slide"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-[-2.5rem] left-0 right-0 flex justify-center space-x-2">
                    {services.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => instanceRef.current?.moveToIdx(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          currentSlide === index
                            ? "bg-indigo-600 scale-125"
                            : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-gray-600 py-12">
              <p className="text-xl font-medium">
                No products available at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SuggestProductScreen;
