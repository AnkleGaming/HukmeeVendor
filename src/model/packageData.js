import PackageModel from "./packageModel";

const packages = [
  new PackageModel({
    id: 1,
    image: "https://weprettify.com/images/clear.webp",
    title: "Complete waxing (tin)",
    subtitle: "Package",
    rating: 4.91,
    reviews: 494000, // Use number instead of "494K"
    price: 1509, // Use number for calculations
    originalPrice: 1580,
    duration: "1 hr 15 mins",
    description:
      "Full arms (including underarms) - RICA gold, Full legs - RICA gold",
  }),
  new PackageModel({
    id: 2,
    image: "https://weprettify.com/images/clear.webp",
    title: "Body Polishing",
    subtitle: "Package",
    rating: 4.85,
    reviews: 289000,
    price: 1699,
    originalPrice: 1999,
    duration: "1 hr 30 mins",
    description:
      "Glow-enhancing full body scrub and polish with essential oils",
  }),
  new PackageModel({
    id: 3,
    image: "https://weprettify.com/images/clear.webp",
    title: "Bridal Glow Facial",
    subtitle: "Package",
    rating: 4.78,
    reviews: 345000,
    price: 1299,
    originalPrice: 1499,
    duration: "50 mins",
    description:
      "Deep cleansing, exfoliation, and glow boost for brides and special occasions",
  }),
  new PackageModel({
    id: 4,
    image: "https://weprettify.com/images/clear.webp",
    title: "Hair Spa + Cut Combo",
    subtitle: "Package",
    rating: 4.93,
    reviews: 152000,
    price: 999,
    originalPrice: 1200,
    duration: "1 hr",
    description:
      "Hair spa for nourishment and professional haircut styling combo",
  }),
];

export default packages;
