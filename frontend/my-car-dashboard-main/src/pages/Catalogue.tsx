import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { VehicleCard, Vehicle } from "@/components/vehicles/VehicleCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

// 🔹 Fonction de mapping API → format VehicleCard
function mapApiVehicle(apiVehicle: any): Vehicle {
  const BASE_URL = "http://localhost:8084"; 
  const typeLower = apiVehicle.typeVehicule?.toLowerCase() || "";

  return {
    id: apiVehicle.id.toString(),
    name: apiVehicle.modele,
    brand: apiVehicle.marque,
    type: typeLower.includes("automobile") ? "automobile" : "scooter",
    fuelType: typeLower.includes("electrique") ? "electrique" : "essence",
    price: apiVehicle.prixBase,
    originalPrice: apiVehicle.estSolde ? apiVehicle.prixBase * 1.2 : undefined,
    image: apiVehicle.images && apiVehicle.images.length > 0 
      ? `${BASE_URL}/api/uploads/${apiVehicle.images[0]}` 
      : "/placeholder.jpg",
    isOnSale: apiVehicle.estSolde,
    inStock: apiVehicle.qteStock > 0,
  };
}

export default function Catalogue() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridCols] = useState<1 | 3>(3);
  
  const [filters, setFilters] = useState({
    types: [] as string[],
    fuels: [] as string[],
    priceRange: [0, 200000], 
    brands: [] as string[],
    inStockOnly: false,
    onSaleOnly: false,
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8084/api/vehicules");
        if (!response.ok) throw new Error("Impossible de récupérer les véhicules");
        
        const data = await response.json();
        const mappedData = data.map(mapApiVehicle);
        setVehicles(mappedData);

        if (mappedData.length > 0) {
          const maxPrice = Math.max(...mappedData.map((v: Vehicle) => v.price));
          setFilters(prev => ({ ...prev, priceRange: [0, maxPrice + 5000] }));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // 🔹 Logique de filtrage (sans searchQuery)
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filters.types.length > 0 && !filters.types.includes(vehicle.type)) return false;
    if (filters.fuels.length > 0 && !filters.fuels.includes(vehicle.fuelType)) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(vehicle.brand)) return false;
    if (vehicle.price < filters.priceRange[0] || vehicle.price > filters.priceRange[1]) return false;
    if (filters.inStockOnly && !vehicle.inStock) return false;
    if (filters.onSaleOnly && !vehicle.isOnSale) return false;
    return true;
  });

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Chargement du catalogue...</span>
    </div>
  );
  
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Erreur : {error}</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Notre Catalogue</h1>
          <p className="text-muted-foreground">{filteredVehicles.length} véhicule(s) affiché(s)</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Section Filtres */}
          <aside className="w-full lg:w-64 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-sm uppercase tracking-wider">Filtres</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {/* Prix */}
                <div>
                  <Label className="mb-4 block text-xs font-semibold">Prix maximum</Label>
                  <p className="text-lg font-bold text-primary mb-2">
                    {filters.priceRange[1].toLocaleString()} €
                  </p>
                  <Slider 
                    value={[filters.priceRange[1]]} 
                    max={200000} 
                    step={1000}
                    onValueChange={(val) => setFilters(p => ({ ...p, priceRange: [0, val[0]] }))}
                  />
                </div>

                <Separator className="my-2" />

                {/* Disponibilité */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="stock" 
                      checked={filters.inStockOnly} 
                      onCheckedChange={(c) => setFilters(p => ({ ...p, inStockOnly: !!c }))}
                    />
                    <Label htmlFor="stock" className="cursor-pointer">En stock uniquement</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="sale" 
                      checked={filters.onSaleOnly} 
                      onCheckedChange={(c) => setFilters(p => ({ ...p, onSaleOnly: !!c }))}
                    />
                    <Label htmlFor="sale" className="cursor-pointer text-orange-600 font-medium">Promotions</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Liste des résultats */}
          <main className="flex-1">
            {filteredVehicles.length > 0 ? (
              <div className={`grid gap-6 ${gridCols === 3 ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    variant={gridCols === 1 ? "compact" : "default"}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed">
                <p className="text-muted-foreground mb-4">
                  Aucun véhicule ne correspond à ces critères de filtrage.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({
                    types: [],
                    fuels: [],
                    priceRange: [0, 200000],
                    brands: [],
                    inStockOnly: false,
                    onSaleOnly: false,
                  })}
                >
                  Réinitialiser les filtres
                </Button>
              </Card>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

// Composant Separator interne simple
function Separator({ className }: { className?: string }) {
  return <div className={`h-[1px] bg-border ${className}`} />;
}