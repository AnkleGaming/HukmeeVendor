import { useEffect, useState } from "react";
import { Card, CardContent } from "../component/ui/card";
import HomepageImageShowAPI from "../backend/homepageimage/getcategory";

const ServicesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await HomepageImageShowAPI();
        setServices(data.slice(10, 20));
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-[28px] font-semibold text-black mb-8">
          New and noteworthy
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <div key={service.id}>
              <Card className="overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <img
                    src={`https://api.weprettify.com/Images/${service.ServiceImage}`}
                    alt={service.ServiceName}
                    className="w-full h-[160px] object-cover"
                  />
                </CardContent>
              </Card>

              <div className="mt-3 px-1">
                <span className="text-[15px] text-black font-medium">
                  {service.ServiceName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;
