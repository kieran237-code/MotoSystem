import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Car, Upload, Loader2, CheckCircle2, Settings2, Trash2 } from "lucide-react";

export default function PublierVehicule() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [category, setCategory] = useState<"automobile" | "scooter">("automobile");
    const [fuel, setFuel] = useState<"essence" | "electrique">("essence");

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // revoke old previews
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    useEffect(() => {
        // create previews when files change
        const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
        // revoke previous
        previews.forEach((url) => URL.revokeObjectURL(url));
        setPreviews(newPreviews);
        // cleanup when component unmounts handled above
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        if (filesArray.length + selectedFiles.length > 10) {
            toast({
                title: "Limite dépassée",
                description: "Vous pouvez importer au maximum 10 images.",
                variant: "destructive",
            });
            // reset input so user can reselect
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const imagesOnly = filesArray.filter((f) => f.type.startsWith("image/"));
        if (imagesOnly.length !== filesArray.length) {
            toast({
                title: "Fichiers ignorés",
                description: "Seules les images sont acceptées.",
                variant: "destructive",
            });
        }

        setSelectedFiles((prev) => [...prev, ...imagesOnly]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFileAt = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            toast({
                title: "Image requise",
                description: "Veuillez importer au moins une image pour publier le véhicule.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            toast({ title: "Erreur", description: "Vous devez être connecté", variant: "destructive" });
            navigate("/connexion");
            setIsLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        // ensure booleans and optional fields are normalized
        const estSolde = formData.get("estSolde") === "on" ? "true" : "false";
        formData.set("estSolde", estSolde);
        if (category === "scooter" && fuel === "essence") {
            const injection = formData.get("injectionDirecte") === "on" ? "true" : "false";
            formData.set("injectionDirecte", injection);
        }

        // append images under the key "images" (backend expects this)
        selectedFiles.forEach((file) => formData.append("images", file));

        try {
            const url = `http://localhost:8084/api/vehicules/${category}/${fuel}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // DO NOT set Content-Type for FormData
                },
                body: formData,
            });

            if (response.ok) {
                toast({ title: "Succès", description: "Le véhicule a été publié avec succès." });
                navigate("/catalogue");
            } else {
                const err = await response.json().catch(() => null);
                const message = err?.message || `Erreur ${response.status}`;
                toast({ title: "Erreur de publication", description: message, variant: "destructive" });
            }
        } catch (error: any) {
            toast({ title: "Erreur", description: error?.message || "Erreur réseau", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                        <Car className="text-primary w-8 h-8" />
                        Publier un nouveau véhicule
                    </h1>
                    <p className="text-muted-foreground mt-2">Remplissez les informations pour mettre en vente un véhicule</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-6">
                                <Label>Catégorie du véhicule</Label>
                                <Select value={category} onValueChange={(v) => setCategory(v as "automobile" | "scooter")}>
                                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="automobile">Automobile</SelectItem>
                                        <SelectItem value="scooter">Scooter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-6">
                                <Label>Type d'énergie</Label>
                                <Select value={fuel} onValueChange={(v) => setFuel(v as "essence" | "electrique")}>
                                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="essence">Essence</SelectItem>
                                        <SelectItem value="electrique">Électrique</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-blue-200 bg-blue-50/30">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-blue-500" />
                                Spécifications spécifiques
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            {category === "automobile" && (
                                <div className="space-y-2">
                                    <Label htmlFor="nombrePortes">Nombre de portes</Label>
                                    <Input id="nombrePortes" name="nombrePortes" type="number" placeholder="5" defaultValue={4} required />
                                </div>
                            )}

                            {fuel === "electrique" && (
                                <div className="space-y-2">
                                    <Label htmlFor="batterieKwh">Capacité batterie (kWh)</Label>
                                    <Input id="batterieKwh" name="batterieKwh" type="number" step="0.1" placeholder="ex: 75.5" required />
                                </div>
                            )}

                            {category === "scooter" && fuel === "essence" && (
                                <div className="flex items-center space-x-2 pt-8">
                                    <Checkbox id="injectionDirecte" name="injectionDirecte" />
                                    <Label htmlFor="injectionDirecte" className="text-sm font-medium leading-none cursor-pointer">
                                        Système d'injection directe
                                    </Label>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                Informations Techniques
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="reference">Référence</Label>
                                <Input id="reference" name="reference" placeholder="REF-123" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="marque">Marque</Label>
                                <Input id="marque" name="marque" placeholder="Toyota" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modele">Modèle</Label>
                                <Input id="modele" name="modele" placeholder="Corolla" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="annee">Année</Label>
                                <Input id="annee" name="annee" type="number" defaultValue={new Date().getFullYear()} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="couleur">Couleur</Label>
                                <Input id="couleur" name="couleur" placeholder="Noir" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kilometrage">Kilométrage</Label>
                                <Input id="kilometrage" name="kilometrage" type="number" defaultValue={0} required />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Upload className="w-5 h-5 text-primary" />
                                Vente & Media
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prixBase">Prix de base (€)</Label>
                                    <Input id="prixBase" name="prixBase" type="number" placeholder="50000" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="qteStock">Quantité</Label>
                                    <Input id="qteStock" name="qteStock" type="number" defaultValue={1} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateArrivee">Date d'arrivée</Label>
                                    <Input id="dateArrivee" name="dateArrivee" type="date" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">État</Label>
                                    <Select name="status" defaultValue="NEUF">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEUF">Neuf</SelectItem>
                                            <SelectItem value="OCCASION">Occasion</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-4 md:col-span-2">
                                <Checkbox id="estSolde" name="estSolde" />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="estSolde"
                                        className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                        Appliquer une promotion (En solde)
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Cochez cette case pour afficher un badge "Soldes" sur le véhicule.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Images (max 10)</Label>
                                <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">
                                        {selectedFiles.length > 0 ? `${selectedFiles.length} fichier(s) sélectionné(s)` : "Cliquez pour uploader (ou glisser-déposer)"}
                                    </p>

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4 grid grid-cols-5 gap-2">
                                            {previews.map((src, idx) => (
                                                <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                                                    <img src={src} alt={selectedFiles[idx].name} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFileAt(idx)}
                                                        className="absolute top-1 right-1 bg-white/80 rounded p-1 hover:bg-white"
                                                        aria-label={`Supprimer ${selectedFiles[idx].name}`}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
                        <Button type="submit" className="gradient-primary px-8" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publication ...
                                </>
                            ) : (
                                "Publier le véhicule"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
