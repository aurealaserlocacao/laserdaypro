"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, LoaderCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
    });
    setMessage(error
      ? "Não foi possível solicitar a recuperação agora. Confira o e-mail e tente novamente."
      : "Se houver uma conta vinculada a esse e-mail, você receberá um link para redefinir a senha.");
    setBusy(false);
  }

  return <main className="min-h-screen grid place-items-center bg-[#f7f7fb] p-5">
    <section className="w-full max-w-md rounded-3xl border border-[#e9e7f2] bg-white p-7 sm:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-[#6654d9]"><Mail size={23}/></div>
      <h1 className="text-2xl font-bold">Recuperar senha</h1>
      <p className="mt-2 text-sm text-slate-500">Informe o e-mail da sua conta. Se estiver cadastrado, enviaremos um link seguro para redefinição.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">E-mail
          <input type="email" required autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} className="field mt-1" placeholder="voce@clinica.com.br"/>
        </label>
        <button disabled={busy} className="w-full rounded-xl bg-[#6654d9] text-white font-semibold py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
          {busy?<LoaderCircle className="animate-spin"/>:"Enviar link de recuperação"}
        </button>
      </form>
      {message&&<p role="status" className="mt-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-800">{message}</p>}
      <a href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6654d9]"><ArrowLeft size={16}/> Voltar ao login</a>
    </section>
  </main>;
}
