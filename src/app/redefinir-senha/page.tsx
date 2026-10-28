"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (password.length < 8) {
      setMessage("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage("Não foi possível redefinir a senha. Solicite um novo link e tente novamente.");
    else {
      setSaved(true);
      setMessage("Senha redefinida com sucesso. Você já pode entrar no Laser Day Pro.");
    }
    setBusy(false);
  }

  return <main className="min-h-screen grid place-items-center bg-[#f7f7fb] p-5">
    <section className="w-full max-w-md rounded-3xl border border-[#e9e7f2] bg-white p-7 sm:p-8 shadow-sm">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-[#6654d9]"><ShieldCheck size={23}/></div>
      <h1 className="text-2xl font-bold">Criar nova senha</h1>
      <p className="mt-2 text-sm text-slate-500">Escolha uma senha com pelo menos 8 caracteres.</p>
      {!saved&&<form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">Nova senha
          <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={event=>setPassword(event.target.value)} className="field mt-1"/>
        </label>
        <label className="block text-sm font-medium">Confirmar nova senha
          <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} className="field mt-1"/>
        </label>
        <button disabled={busy} className="w-full rounded-xl bg-[#6654d9] text-white font-semibold py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
          {busy?<LoaderCircle className="animate-spin"/>:"Salvar nova senha"}
        </button>
      </form>}
      {message&&<p role="status" className={`mt-4 rounded-xl p-3 text-sm ${saved?"bg-emerald-50 text-emerald-800":"bg-violet-50 text-violet-800"}`}>{saved&&<CheckCircle2 className="inline mr-1" size={16}/>}{message}</p>}
      {saved?<a href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6654d9]"><ArrowLeft size={16}/> Ir para o login</a>:<a href="/recuperar-senha" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6654d9]"><ArrowLeft size={16}/> Solicitar outro link</a>}
    </section>
  </main>;
}
