"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirmando seu e-mail com segurança...");
  useEffect(() => {
    let active = true;
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const errorDescription = params.get("error_description");
      if (errorDescription) {
        if (active) setMessage("O link de confirmação expirou ou não é válido. Solicite um novo e-mail de confirmação.");
        return;
      }
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (active) setMessage("Não foi possível confirmar este link. Ele pode ter expirado; solicite um novo e-mail.");
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (active) {
          setMessage("E-mail confirmado! Abrindo seu painel...");
          router.replace("/");
        }
      } else if (active) {
        setMessage("Não encontramos uma sessão válida. Volte ao login e tente entrar novamente.");
      }
    })();
    return () => { active = false; };
  }, [router]);
  return <main className="min-h-screen grid place-items-center bg-[#f7f7fb] p-5"><section className="w-full max-w-md rounded-3xl border border-[#e9e7f2] bg-white p-8 text-center shadow-sm"><div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-[#6654d9]"><ShieldCheck size={24}/></div><h1 className="text-xl font-bold">Laser Day Pro</h1><p className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={16} className="animate-spin"/>{message}</p><a href="/" className="mt-6 inline-flex rounded-xl bg-[#6654d9] px-4 py-3 text-sm font-semibold text-white">Voltar ao sistema</a></section></main>;
}
