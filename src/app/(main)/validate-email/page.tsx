import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ValidateEmail() {
  return (
    <div className="container mx-auto min-h-screen w-full flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Revisa tu correo electrónico</h1>
        <p className="text-muted-foreground text-lg">
          Hemos enviado un enlace de validación a tu correo electrónico. 
          Por favor, revisa tu bandeja de entrada y haz clic en el enlace para validar tu cuenta.
        </p>
        <p className="text-muted-foreground text-sm">
          Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/auth/v1/login">Volver al inicio de sesión</Link>
      </Button>
    </div>
  );
}
