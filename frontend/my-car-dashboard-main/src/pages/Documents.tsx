import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, FileText, Download, ChevronLeft, Car, FileSignature, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const documentTypes = [
  {
    id: "demande",
    label: "Demande d'immatriculation",
    icon: Car,
    endpoint: "demande",
    description: "Formulaire Cerfa pour l'immatriculation du véhicule",
  },
  {
    id: "cession",
    label: "Certificat de cession",
    icon: FileSignature,
    endpoint: "cession",
    description: "Certificat officiel de transfert de propriété",
  },
  {
    id: "commande",
    label: "Bon de commande",
    icon: Receipt,
    endpoint: "commande",
    description: "Récapitulatif détaillé de votre commande",
  },
];

export default function Documents() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeFormat, setActiveFormat] = useState<"pdf" | "html">("html");
  const [selectedDoc, setSelectedDoc] = useState(documentTypes[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/connexion");
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        window.URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  useEffect(() => {
    if (activeFormat === "pdf") {
      setPreviewBlobUrl(null);
      setPreviewError(null);
      setIsPreviewLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPreviewError("Utilisateur non authentifié");
      return;
    }

    const endpoint = selectedDoc.endpoint;
    const url = `http://localhost:8084/api/documents/html/${endpoint}/download${orderId ? `?orderId=${orderId}` : ""}`;

    let cancelled = false;
    (async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/html",
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Erreur ${res.status}`);
        }

        const blob = await res.blob();
        if (cancelled) return;
        const blobUrl = window.URL.createObjectURL(blob);
        if (previewBlobUrl) window.URL.revokeObjectURL(previewBlobUrl);
        setPreviewBlobUrl(blobUrl);
      } catch (err: any) {
        console.error("Preview error :", err);
        setPreviewError(err?.message || "Impossible de charger l'aperçu");
        setPreviewBlobUrl(null);
      } finally {
        if (!cancelled) setIsPreviewLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedDoc, activeFormat, orderId]);

  const handleDownload = async (docEndpoint: string, format: "pdf" | "html") => {
    setIsDownloading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/connexion");
      return;
    }

    const url = `http://localhost:8084/api/documents/${format}/${docEndpoint}/download${orderId ? `?orderId=${orderId}` : ""}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur de téléchargement");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${docEndpoint}${orderId ? `_${orderId}` : ""}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error("Erreur :", error);
      alert(error?.message || "Impossible de récupérer le document.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/commandes"
            className="text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à mes commandes
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Documents Officiels</h1>
              <p className="text-muted-foreground">
                Commande Nº {orderId ?? "-"} · Sélectionnez un document pour l'imprimer
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Button
                variant={activeFormat === "html" ? "default" : "ghost"}
                size="sm"
                className={cn("rounded-lg px-6", activeFormat === "html" && "shadow-sm")}
                onClick={() => setActiveFormat("html")}
              >
                WEB (HTML)
              </Button>
              <Button
                variant={activeFormat === "pdf" ? "default" : "ghost"}
                size="sm"
                className={cn("rounded-lg px-6", activeFormat === "pdf" && "shadow-sm")}
                onClick={() => setActiveFormat("pdf")}
              >
                PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
              Liasse de documents
            </h2>

            {documentTypes.map((doc) => (
              <Card
                key={doc.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 border-2",
                  selectedDoc.id === doc.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-transparent hover:border-slate-200 bg-card"
                )}
                onClick={() => setSelectedDoc(doc)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      selectedDoc.id === doc.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <doc.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800">{doc.label}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{doc.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDownloading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc.endpoint, activeFormat);
                    }}
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Separator className="my-6" />

            <Button
              className="w-full h-12 gradient-primary shadow-primary gap-2 font-bold"
              onClick={() => handleDownload(selectedDoc.endpoint, activeFormat)}
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="animate-spin" /> : <Download className="w-5 h-5" />}
              Télécharger le document
            </Button>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col overflow-hidden border-none shadow-2xl ring-1 ring-slate-200">
              <CardHeader className="bg-slate-50 border-b py-4">
                <CardTitle className="text-md flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Aperçu en temps réel : {selectedDoc.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 bg-white relative">
                {activeFormat === "html" ? (
                  <>
                    {isPreviewLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60">
                        <Loader2 className="animate-spin" />
                      </div>
                    )}

                    {previewError ? (
                      <div className="p-6">
                        <p className="font-semibold">Impossible de charger l'aperçu</p>
                        <p className="text-sm text-slate-600">{previewError}</p>
                        <div className="mt-4">
                          <Button onClick={() => handleDownload(selectedDoc.endpoint, "html")}>
                            Télécharger le HTML
                          </Button>
                        </div>
                      </div>
                    ) : previewBlobUrl ? (
                      <iframe
                        ref={iframeRef}
                        src={previewBlobUrl}
                        className="w-full h-full border-none shadow-inner"
                        title="Aperçu Document"
                        key={`${selectedDoc.id}-${activeFormat}-${orderId ?? "noOrder"}`}
                      />
                    ) : (
                      <div className="p-6 text-center text-slate-500">
                        <p>Prévisualisation indisponible</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 bg-slate-50">
                    <div className="p-6 bg-white rounded-full shadow-sm">
                      <FileText className="w-16 h-16 text-slate-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 font-medium">L'aperçu PDF direct est désactivé</p>
                      <p className="text-sm text-slate-400">Veuillez télécharger le fichier pour le consulter</p>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={() => handleDownload(selectedDoc.endpoint, "pdf")}>
                      <Download className="w-4 h-4" /> Télécharger le PDF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}