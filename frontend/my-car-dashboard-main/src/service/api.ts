// src/services/api.ts
import { Vehicle, ApiVehicle } from '@/type/vehicle';

const API_BASE_URL = 'http://localhost:8084';

// Fonction de transformation
const transformApiVehicle = (apiVehicle: ApiVehicle): Vehicle => {
  // Image par défaut si aucune n'est fournie
  const defaultImage = apiVehicle.type?.toLowerCase() === 'scooter' 
    ? '/placeholder-scooter.jpg'
    : '/placeholder-car.jpg';

  return {
    id: apiVehicle.id.toString(),
    name: apiVehicle.nom || apiVehicle.name || 'Nom inconnu',
    brand: apiVehicle.marque || apiVehicle.brand || 'Marque inconnue',
    type: (apiVehicle.type?.toLowerCase() === 'scooter' ? 'scooter' : 'automobile') as "automobile" | "scooter",
    fuelType: (apiVehicle.carburant || apiVehicle.fuelType || 'essence').toLowerCase() as "essence" | "electrique",
    price: Number(apiVehicle.prix || apiVehicle.price || 0),
    originalPrice: apiVehicle.originalPrice || 
                  (apiVehicle.isOnSale ? Number(apiVehicle.prix || apiVehicle.price || 0) * 1.2 : undefined),
    image: apiVehicle.image || apiVehicle.imageUrl || defaultImage,
    isOnSale: Boolean(apiVehicle.enPromo || apiVehicle.isOnSale),
    inStock: Boolean(apiVehicle.disponible !== undefined ? apiVehicle.disponible : apiVehicle.inStock),
    description: apiVehicle.description,
  };
};

export const vehicleApi = {
  async getAll(): Promise<Vehicle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicules`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiVehicle[] = await response.json();
      
      console.log('Données brutes de l\'API:', data);
      
      // Transformer les données
      const transformedData = data.map(transformApiVehicle);
      
      console.log('Données transformées:', transformedData);
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Vehicle> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicules/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiVehicle = await response.json();
      return transformApiVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  },

  // ... autres méthodes si nécessaire
};