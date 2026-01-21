// src/types/vehicle.ts
export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: "automobile" | "scooter";
  fuelType: "essence" | "electrique" | string; // Permettre d'autres types
  price: number;
  originalPrice?: number;
  image: string;
  isOnSale?: boolean;
  inStock: boolean;
  // Champs supplémentaires optionnels
  description?: string;
  year?: number;
  mileage?: number;
  transmission?: string;
}

// Type pour les données brutes de l'API
export interface ApiVehicle {
  id: string | number;
  nom?: string;
  name?: string;
  marque?: string;
  brand?: string;
  type: string;
  carburant?: string;
  fuelType?: string;
  prix?: number;
  price?: number;
  disponible?: boolean;
  inStock?: boolean;
  enPromo?: boolean;
  isOnSale?: boolean;
  image?: string;
  imageUrl?: string;
  description?: string;
  [key: string]: any; // Pour les champs supplémentaires
}