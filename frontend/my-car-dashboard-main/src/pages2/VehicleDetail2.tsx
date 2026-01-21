import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { mockVehicles, mockOptions, VehicleOption } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Fuel, 
  Zap, 
  Shield, 
  Truck,
  AlertTriangle,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function VehicleDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const vehicle = mockVehicles.find((v) => v.id === id) || mockVehicles[0];
  
  const [selectedOptions, setSelectedOptions] = useState<VehicleOption[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  // Images de démonstration
  const images = [
    vehicle.image,
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop",
  ];

  const isOptionIncompatible = (option: VehicleOption) => {
    return selectedOptions.some(
      (selected) => option.incompatibleWith?.includes(selected.id)
    );
  };

  const getIncompatibleOption = (option: VehicleOption) => {
    const incompatibleId = option.incompatibleWith?.find((id) =>
      selectedOptions.some((s) => s.id === id)
    );
    return mockOptions.find((o) => o.id === incompatibleId);
  };

  const toggleOption = (option: VehicleOption) => {
    if (isOptionIncompatible(option)) {
      const incompatible = getIncompatibleOption(option);
      toast({
        title: "Option incompatible",
        description: `"${option.name}" n'est pas compatible avec "${incompatible?.name}"`,
        variant: "destructive",
      });
      return;
    }

    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const totalOptionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const totalPrice = vehicle.price + totalOptionsPrice;

  const discount = vehicle.originalPrice
    ? Math.round((1 - vehicle.price / vehicle.originalPrice) * 100)
    : 0;

  const addToCart = () => {
    toast({
      title: "Ajouté au panier ! 🎉",
      description: `${vehicle.brand} ${vehicle.name} avec ${selectedOptions.length} option(s)`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/catalogue" className="text-muted-foreground hover:text-primary flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Retour au catalogue
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{vehicle.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src={images[currentImage]}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {vehicle.isOnSale && (
                  <Badge className="gradient-secondary text-secondary-foreground font-bold text-lg px-4 py-1">
                    -{discount}% SOLDES
                  </Badge>
                )}
                <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                  {vehicle.type === "automobile" ? "🚗 Automobile" : "🛵 Scooter"}
                </Badge>
              </div>

              {/* Fuel Badge */}
              <Badge
                className={cn(
                  "absolute top-4 right-4 gap-1",
                  vehicle.fuelType === "electrique"
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground/80 text-background"
                )}
              >
                {vehicle.fuelType === "electrique" ? (
                  <><Zap className="w-4 h-4" /> Électrique</>
                ) : (
                  <><Fuel className="w-4 h-4" /> Essence</>
                )}
              </Badge>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
                    currentImage === index
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-primary font-medium mb-1">{vehicle.brand}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{vehicle.name}</h1>
              
              <div className="flex items-end gap-4">
                <div>
                  {vehicle.originalPrice && (
                    <p className="text-lg text-muted-foreground line-through">
                      {vehicle.originalPrice.toLocaleString("fr-FR")} Fcfa
                    </p>
                  )}
                  <p className="text-4xl font-bold text-primary">
                    {vehicle.price.toLocaleString("fr-FR")} Fcfa
                  </p>
                </div>
                
                {!vehicle.inStock && (
                  <Badge variant="outline" className="text-destructive border-destructive">
                    Rupture de stock
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Garantie 2 ans</p>
                  <p className="text-xs text-muted-foreground">Pièces et main d'œuvre</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Livraison gratuite</p>
                  <p className="text-xs text-muted-foreground">Partout en Europe</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Options */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personnalisez votre véhicule</h2>
              
              <div className="space-y-3">
                {mockOptions.map((option) => {
                  const isIncompatible = isOptionIncompatible(option);
                  const isSelected = selectedOptions.includes(option);
                  const incompatibleWith = getIncompatibleOption(option);

                  return (
                    <Card
                      key={option.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        isSelected && "border-primary bg-primary/5",
                        isIncompatible && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => toggleOption(option)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            disabled={isIncompatible}
                            className="pointer-events-none"
                          />
                          <div>
                            <p className="font-medium">{option.name}</p>
                            {isIncompatible && incompatibleWith && (
                              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3 h-3" />
                                Incompatible avec "{incompatibleWith.name}"
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-semibold text-primary">
                          +{option.price.toLocaleString("fr-FR")} €
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Selected Options Summary */}
            {selectedOptions.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Options sélectionnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedOptions.map((option) => (
                    <div key={option.id} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        {option.name}
                      </span>
                      <span className="text-muted-foreground">
                        +{option.price.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Sous-total options</span>
                    <span className="text-primary">
                      +{totalOptionsPrice.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Total & Actions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total</span>
                <span className="text-3xl font-bold text-primary">
                  {totalPrice.toLocaleString("fr-FR")} €
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gradient-primary shadow-primary h-14 text-lg"
                  disabled={!vehicle.inStock}
                  onClick={addToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </Button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
