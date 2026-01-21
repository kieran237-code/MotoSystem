import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

const BASE_URL = "http://localhost:8084/api";

export default function Verification() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupération de l'email passé via navigate(..., { state: { email } })
  const email = location.state?.email || "";
  
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(59);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate("/auth"); // Sécurité : retour si pas d'email
  }, [email, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/activation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      if (response.ok) {
        alert("Compte activé avec succès !");
        navigate("/connexion"); // Retour vers connexion
      } else {
        const data = await response.json();
        alert(data.message || "Code invalide");
      }
    } catch (error) {
      alert("Erreur lors de l'activation");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${BASE_URL}/resend-activation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setTimer(59);
        alert("Nouveau code envoyé");
      }
    } catch (error) {
      alert("Erreur de réseau");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <Card className="border-none shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Vérifiez votre email</CardTitle>
              <CardDescription>Code envoyé à <b>{email}</b></CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold"
                    />
                  ))}
                </div>

                <Button disabled={loading || code.some(d => d === "")} type="submit" className="w-full gradient-primary">
                  {loading ? "Vérification..." : "Confirmer le compte"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0 || isResending}
                    className="text-primary text-sm flex items-center gap-2 mx-auto"
                  >
                    {isResending && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {timer > 0 ? `Renvoyer (${timer}s)` : "Renvoyer un code"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}