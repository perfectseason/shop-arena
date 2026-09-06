import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export type Property = {
  id: number;
  title: string;
  description: string;
  price: string;
  currency: string;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string;
  is_available: boolean;
  is_featured: boolean;
};

export const publicPropertyImages = [
  "/house 1.jpg",
  "/house 2.jpg",
  "/house 3.jpg",
  "/house 4.jpg",
  "/interior 1.jpg",
  "/interior 3.jpg",
  "/interior 4.jpg",
  "/interior 5.jpg",
  "/interior 6.jpg",
];

export const fallbackProperties: Property[] = [
  {
    id: 1,
    title: "Modern Family House",
    description: "A bright detached home with generous living spaces.",
    price: "75000000.00",
    currency: "NGN",
    property_type: "house",
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 4,
    area: "450.00",
    is_available: true,
    is_featured: true,
  },
  {
    id: 2,
    title: "Luxury Apartment",
    description: "A serviced apartment close to shopping and business areas.",
    price: "4500000.00",
    currency: "NGN",
    property_type: "apartment",
    listing_type: "rent",
    bedrooms: 3,
    bathrooms: 3,
    area: "180.00",
    is_available: true,
    is_featured: true,
  },
  {
    id: 3,
    title: "Commercial Block",
    description: "A clean commercial space suitable for offices or retail.",
    price: "120000000.00",
    currency: "NGN",
    property_type: "commercial",
    listing_type: "sale",
    bedrooms: null,
    bathrooms: 2,
    area: "600.00",
    is_available: true,
    is_featured: false,
  },
];

export async function fetchProperties() {
  const { data } = await api.get<Property[]>("/estate/property");
  return data;
}
