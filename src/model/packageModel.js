class PackageModel {
  constructor({
    id,
    image,
    title,
    subtitle,
    rating,
    reviews,
    price,
    originalPrice,
    duration,
    description,
  }) {
    this.id = id;
    this.image = image;
    this.title = title;
    this.subtitle = subtitle;
    this.rating = rating;
    this.reviews = reviews;
    this.price = price;
    this.originalPrice = originalPrice;
    this.duration = duration;
    this.description = description;
  }
}

export default PackageModel;
