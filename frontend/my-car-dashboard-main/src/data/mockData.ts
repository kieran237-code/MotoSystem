import { Vehicle } from "@/components/vehicles/VehicleCard";

// Données de démonstration pour les maquettes
export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Model S Performance",
    brand: "Tesla",
    type: "automobile",
    fuelType: "electrique",
    price: 89990,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "2",
    name: "Golf 8 GTI",
    brand: "Volkswagen",
    type: "automobile",
    fuelType: "essence",
    price: 42500,
    originalPrice: 48000,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop",
    isOnSale: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Vespa Elettrica",
    brand: "Vespa",
    type: "scooter",
    fuelType: "electrique",
    price: 7490,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "4",
    name: "Série 3 330e",
    brand: "BMW",
    type: "automobile",
    fuelType: "electrique",
    price: 54900,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "5",
    name: "Forza 125",
    brand: "Honda",
    type: "scooter",
    fuelType: "essence",
    price: 5299,
    originalPrice: 5899,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop",
    isOnSale: true,
    inStock: true,
  },
  {
    id: "6",
    name: "Classe A 250e",
    brand: "Mercedes",
    type: "automobile",
    fuelType: "electrique",
    price: 47650,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop",
    inStock: false,
  },
  {
    id: "7",
    name: "RS e-tron GT",
    brand: "Audi",
    type: "automobile",
    fuelType: "electrique",
    price: 142500,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "8",
    name: "Peugeot Metropolis",
    brand: "Peugeot",
    type: "scooter",
    fuelType: "essence",
    price: 12990,
    originalPrice: 14500,
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&auto=format&fit=crop",
    isOnSale: true,
    inStock: true,
  },
];

export interface CartItem {
  vehicle: Vehicle;
  options: VehicleOption[];
  quantity: number;
}

export interface VehicleOption {
  id: string;
  name: string;
  price: number;
  incompatibleWith?: string[];
}

export const mockOptions: VehicleOption[] = [
  { id: "opt1", name: "Sièges en cuir", price: 2500, incompatibleWith: ["opt2"] },
  { id: "opt2", name: "Sièges sportifs", price: 1800, incompatibleWith: ["opt1"] },
];

export const mockCartItems: CartItem[] = [
  {
    vehicle: mockVehicles[0],
    
    options: [mockOptions[0]], 
    quantity: 1,
  },
  {
    vehicle: mockVehicles[4],
    options: [], 
    quantity: 1,
  },
];

export interface Order {
  id: string;
  date: string;
  status: "en_cours" | "validee" | "livree";
  items: CartItem[];
  total: number;
  country: string;
  taxRate: number;
}

export const mockOrders: Order[] = [
  {
    id: "CMD-2026-001",
    date: "2026-01-10",
    status: "livree",
    items: [mockCartItems[0]],
    total: 94790,
    country: "France",
    taxRate: 20,
  },
  {
    id: "CMD-2026-002",
    date: "2026-01-12",
    status: "validee",
    items: [mockCartItems[1]],
    total: 6049,
    country: "Belgique",
    taxRate: 21,
  },
  {
    id: "CMD-2026-003",
    date: "2026-01-13",
    status: "en_cours",
    items: mockCartItems,
    total: 100839,
    country: "France",
    taxRate: 20,
  },
];

export const countries = [
  { code: "FR", name: "France", taxRate: 20 },
  { code: "BE", name: "Belgique", taxRate: 21 },
  { code: "DE", name: "Allemagne", taxRate: 19 },
  { code: "ES", name: "Espagne", taxRate: 21 },
  { code: "IT", name: "Italie", taxRate: 22 },
  { code: "CH", name: "Suisse", taxRate: 7.7 },
];
