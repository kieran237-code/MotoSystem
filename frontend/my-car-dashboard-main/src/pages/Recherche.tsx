import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { VehicleCard, Vehicle } from "@/components/vehicles/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Plus, Loader2 } from "lucide-react";

interface SearchTerm {
  id: string;
  field: "marque" | "modele" | "couleur" | "annee";
  value: string;
  operator: "ET" | "OU" | null;
}

export default function Recherche() {
  const BASE_URL = "http://localhost:8084/api/vehicules";

  // UI state
  const [mode, setMode] = useState<"simple" | "avance">("simple");

  // Simple search state
  const [simpleMarque, setSimpleMarque] = useState("");
  const [simpleModele, setSimpleModele] = useState("");
  const [simpleAnnee, setSimpleAnnee] = useState<number | "">("");
  const [simplePrixOrder, setSimplePrixOrder] = useState<"asc" | "desc">("asc");
  const [simpleSoldesOnly, setSimpleSoldesOnly] = useState(false);

  // Advanced search state
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([
    { id: "1", field: "marque", value: "", operator: null },
  ]);

  // Results + loading
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Helpers for advanced builder
  const addSearchTerm = (operator: "ET" | "OU") => {
    setSearchTerms([
      ...searchTerms,
      { id: Date.now().toString(), field: "marque", value: "", operator },
    ]);
  };

  const removeSearchTerm = (id: string) => {
    if (searchTerms.length > 1) {
      setSearchTerms(searchTerms.filter((t) => t.id !== id));
    }
  };

  const updateSearchTermValue = (id: string, value: string) => {
    setSearchTerms(searchTerms.map((t) => (t.id === id ? { ...t, value } : t)));
  };

  const updateSearchTermField = (id: string, field: SearchTerm["field"]) => {
    setSearchTerms(searchTerms.map((t) => (t.id === id ? { ...t, field } : t)));
  };

  // Map backend entity to Vehicle UI model
  const mapToVehicle = (v: any): Vehicle => ({
    id: String(v.id),
    name: v.modele || "Modèle inconnu",
    brand: v.marque || "Marque inconnue",
    price: v.prixBase,
    
    image:
      v.images && v.images.length > 0
        ? `http://localhost:8084/api/uploads/${v.images[0]}`
        : "/placeholder.jpg",
    isOnSale: !!v.estSolde,
    inStock: (v.qteStock ?? 0) > 0,
    type: v.nombrePortes !== undefined ? "automobile" : "scooter",
    fuelType: v.batterieKwh !== undefined ? "electrique" : "essence",
  });

  // ---------------- Simple searches ----------------

  const runSimpleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      // Priority: if soldes only selected -> call soldees endpoint
      if (simpleSoldesOnly) {
        const res = await fetch(`${BASE_URL}/search/soldees`);
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setResults(data.map(mapToVehicle));
        return;
      }

      // If marque provided
      if (simpleMarque.trim()) {
        const res = await fetch(
          `${BASE_URL}/search/marque?marque=${encodeURIComponent(simpleMarque.trim())}`
        );
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setResults(data.map(mapToVehicle));
        return;
      }

      // If modele provided
      if (simpleModele.trim()) {
        const res = await fetch(
          `${BASE_URL}/search/modele?modele=${encodeURIComponent(simpleModele.trim())}`
        );
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setResults(data.map(mapToVehicle));
        return;
      }

      // If annee provided
      if (simpleAnnee !== "") {
        const res = await fetch(`${BASE_URL}/search/annee?annee=${simpleAnnee}`);
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setResults(data.map(mapToVehicle));
        return;
      }

      // If user asked for price ordering (no other filters)
      if (simplePrixOrder) {
        const res = await fetch(`${BASE_URL}/search/prix?order=${simplePrixOrder}`);
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setResults(data.map(mapToVehicle));
        return;
      }

      // Fallback: get all
      const res = await fetch(`${BASE_URL}`);
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setResults(data.map(mapToVehicle));
    } catch (err) {
      console.error("Erreur simple search:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Advanced search (ET / OU) ----------------

  const runAdvancedSearch = async () => {
    // require at least one non-empty term
    if (!searchTerms.some((t) => t.value.trim() !== "")) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // Build structured query string field:value with operators
      let queryPath = "";
      searchTerms.forEach((term, idx) => {
        if (idx > 0 && term.operator) {
          queryPath += term.operator === "ET" ? " AND " : " OR ";
        } else if (idx > 0 && !term.operator) {
          // default to AND if operator missing between terms
          queryPath += " AND ";
        }
        queryPath += `${term.field}:${term.value}`;
      });

      const res = await fetch(
        `${BASE_URL}/search/keywords?query=${encodeURIComponent(queryPath)}`
      );
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setResults(data.map(mapToVehicle));
    } catch (err) {
      console.error("Erreur advanced search:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI actions ----------------

  const handleSearch = async () => {
    if (mode === "simple") {
      await runSimpleSearch();
    } else {
      await runAdvancedSearch();
    }
  };

  const clearAll = () => {
    // reset simple
    setSimpleMarque("");
    setSimpleModele("");
    setSimpleAnnee("");
    setSimplePrixOrder("asc");
    setSimpleSoldesOnly(false);
    // reset advanced
    setSearchTerms([{ id: "1", field: "marque", value: "", operator: null }]);
    // reset results
    setResults([]);
    setHasSearched(false);
  };

  // ---------------- Render ----------------

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Recherche de véhicules</h1>
            <p className="text-muted-foreground">Choisis un mode : simple ou avancé (ET / OU)</p>
          </div>

          <div className="flex gap-2">
            <Button variant={mode === "simple" ? "default" : "ghost"} onClick={() => setMode("simple")}>
              Recherche simple
            </Button>
            <Button variant={mode === "avance" ? "default" : "ghost"} onClick={() => setMode("avance")}>
              Recherche avancée
            </Button>
          </div>
        </div>

        {mode === "simple" ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recherche simple</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Marque</label>
                  <Input value={simpleMarque} onChange={(e) => setSimpleMarque(e.target.value)} placeholder="Ex: Toyota" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Modèle</label>
                  <Input value={simpleModele} onChange={(e) => setSimpleModele(e.target.value)} placeholder="Ex: Corolla" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <Input value={simpleAnnee} onChange={(e) => setSimpleAnnee(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Ex: 2020" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tri prix</label>
                  <Select value={simplePrixOrder} onValueChange={(v) => setSimplePrixOrder(v as "asc" | "desc")}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Prix croissant</SelectItem>
                      <SelectItem value="desc">Prix décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={simpleSoldesOnly} onChange={(e) => setSimpleSoldesOnly(e.target.checked)} />
                  <span>Véhicules soldés uniquement</span>
                </label>

                <div className="ml-auto flex gap-2">
                  <Button onClick={handleSearch} className="flex items-center" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                    Rechercher
                  </Button>
                  <Button variant="outline" onClick={clearAll}>Réinitialiser</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recherche avancée (ET / OU)</CardTitle>
            </CardHeader>
            <CardContent>
              {searchTerms.map((term, index) => (
                <div key={term.id} className="mb-3">
                  {term.operator && (
                    <div className="flex justify-center mb-2">
                      <Badge className={term.operator === "ET" ? "bg-blue-600" : "bg-orange-600"}>{term.operator}</Badge>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Select value={term.field} onValueChange={(f) => updateSearchTermField(term.id, f as SearchTerm["field"])}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marque">Marque</SelectItem>
                        <SelectItem value="modele">Modèle</SelectItem>
                        <SelectItem value="couleur">Couleur</SelectItem>
                        <SelectItem value="annee">Année</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input value={term.value} onChange={(e) => updateSearchTermValue(term.id, e.target.value)} placeholder="Valeur..." className="flex-1" />

                    {searchTerms.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeSearchTerm(term.id)}>
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 justify-center mt-2">
                <Button variant="outline" onClick={() => addSearchTerm("ET")}>
                  <Plus className="w-4 h-4 mr-1" /> Ajouter ET
                </Button>
                <Button variant="outline" onClick={() => addSearchTerm("OU")}>
                  <Plus className="w-4 h-4 mr-1" /> Ajouter OU
                </Button>
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                  Rechercher
                </Button>
                <Button variant="outline" onClick={clearAll}>Réinitialiser</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasSearched && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{results.length} résultat{results.length > 1 ? "s" : ""}</h2>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-xl font-medium">Aucun résultat trouvé</p>
                <p className="text-muted-foreground">Essayez d'élargir ou modifier vos critères.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
