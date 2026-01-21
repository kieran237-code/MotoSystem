import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, Zap, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: "automobile" | "scooter";
  fuelType: "essence" | "electrique";
  price: number;
  originalPrice?: number;
  image: string;
  isOnSale?: boolean;
  inStock: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: "default" | "compact";
}

export function VehicleCard({ vehicle, variant = "default" }: VehicleCardProps) {
  const discount = vehicle.originalPrice
    ? Math.round((1 - vehicle.price / vehicle.originalPrice) * 100)
    : 0;

  return (
    <Card className={cn(
      "group overflow-hidden card-hover bg-card border-0 shadow-md",
      variant === "compact" && "flex"
    )}>
      {/* Image */}
      <div className={cn(
        "relative overflow-hidden bg-gradient-to-br from-muted to-muted/50",
        variant === "default" ? "aspect-[4/3]" : "w-32 h-32 flex-shrink-0"
      )}>
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.isOnSale && (
            <Badge className="gradient-secondary text-secondary-foreground font-bold animate-pulse-slow">
              -{discount}% SOLDES
            </Badge>
          )}
          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
            {vehicle.type === "automobile" ? "🚗 Auto" : "🛵 Scooter"}
          </Badge>
        </div>

        {/* Fuel Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={cn(
            "gap-1",
            vehicle.fuelType === "electrique" 
              ? "bg-accent text-accent-foreground" 
              : "bg-foreground/80 text-background"
          )}>
            {vehicle.fuelType === "electrique" ? (
              <><Zap className="w-3 h-3" /> Électrique</>
            ) : (
              <><Fuel className="w-3 h-3" /> Essence</>
            )}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button size="icon" variant="secondary" className="rounded-full" asChild>
            <Link to={`/vehicule/${vehicle.id}`}>
              <Eye className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className={cn(
        "p-4",
        variant === "compact" && "flex-1 flex flex-col justify-center"
      )}>
        <div className="mb-2">
          <p className="text-sm text-muted-foreground font-medium">{vehicle.brand}</p>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {vehicle.name}
          </h3>
        </div>

        <div className="flex items-end justify-between">
          <div>
            {vehicle.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {vehicle.originalPrice.toLocaleString("fr-FR")} XAF
              </p>
            )}
            <p className="text-xl font-bold text-primary">
              {vehicle.price.toLocaleString("fr-FR")} XAF
            </p>
          </div>

          {!vehicle.inStock && (
            <Badge variant="outline" className="text-destructive border-destructive">
              Rupture
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
