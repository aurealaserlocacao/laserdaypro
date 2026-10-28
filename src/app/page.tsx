"use client";

import { useState } from "react";
import {
  Activity, CalendarDays, ChevronDown, CircleHelp, Clock3, CreditCard,
  LayoutDashboard, LogOut, Menu, Plus, Search, Settings, Users, Wallet,
  X, CheckCircle2, Bell, ArrowUpRight, CalendarCheck,
} from "lucide-react";

const menu = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Agenda", icon: CalendarDays },
  { label: "Clientes", icon: Users },
  { label: "Financeiro", icon: Wallet },
  { label: "Documentos", icon: CreditCard },
  { label: "Relatórios", icon: Activity },
];
const appointments = [
  { time: "09:00", name: "Mariana Costa", service: "Axilas + virilha", status: "Confirmado", color: "violet" },
  { time: "10:30", name: "Camila Oliveira", service: "Perna completa", status: "Aguardando", color: "amber" },
  { time: "13:00", name: "Fernanda Lima", service: "Buço + queixo", status: "Confirmado", color: "violet" },
  { time: "14:30", name: "Juliana Santos", service: "Axilas", status: "Em atendimento", color: "green" },
];

export default function Home() {
  const [active, setActive] = useState("Visão geral");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen flex">
      <aside className={`fixed inset-y-0 left-0 z-30 w-[250px] bg-white border-r border-[var(--line)] p-5 flex flex-col transition-transform lg:static lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-1 mb-9">
          <div className="w-10 h-10 rounded-2xl bg-[#6654d9] text-white grid place-items-center font-bold text-lg">L</div>
          <div><div className="font-bold tracking-tight text-[17px]">Laser Day <span className="text-[#6654d9]">Pro</span></div><div className="text-xs text-slate-400">Gestão inteligente</div></div>
          <button className="ml-auto lg:hidden" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X size={18}/></button>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400 px-3 mb-3">Menu principal</div>
        <nav className="space-y-1">
          {menu.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileMenu(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${active === label ? "bg-[#f0edff] text-[#5d4bd0]" : "text-slate-500 hover:bg-slate-50"}`}><Icon size={18}/>{label}</button>)}
        </nav>
        <div className="mt-auto">
          <button className="w-full flex gap-3 items-center text-sm text-slate-500 px-3 py-3 hover:bg-slate-50 rounded-xl"><Settings size={18}/> Configurações</button>
          <button className="w-full flex gap-3 items-center text-sm text-slate-500 px-3 py-3 hover:bg-slate-50 rounded-xl"><CircleHelp size={18}/> Central de ajuda</button>
          <div className="border-t border-[var(--line)] mt-4 pt-4 flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#eeeaff] text-[#6654d9] grid place-items-center text-sm font-bold">AD</div>
            <div className="min-w-0"><div className="text-sm font-semibold truncate">Admin da clínica</div><div className="text-xs text-slate-400">Plano demonstração</div></div>
            <LogOut size={16} className="ml-auto text-slate-400"/>
          </div>
        </div>
      </aside>
      {mobileMenu && <button className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"/>}
      <section className="min-w-0 flex-1">
        <header className="h-[76px] bg-white border-b border-[var(--line)] flex items-center justify-between px-5 md:px-9">
          <div className="flex items-center gap-3"><button className="lg:hidden text-slate-500" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu/></button><div><div className="font-semibold text-sm md:text-base">Clínica Aurea</div><div className="text-xs text-slate-400">Quarta-feira, 28 de outubro</div></div></div>
          <div className="flex items-center gap-3"><button className="w-10 h-10 grid place-items-center rounded-xl text-slate-500 hover:bg-slate-50 relative" aria-label="Notificações"><Bell size={19}/><span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-rose-500"/></button><div className="hidden sm:flex items-center gap-2 border-l border-[var(--line)] pl-4"><div className="w-9 h-9 rounded-full bg-[#eeeaff] text-[#6654d9] grid place-items-center text-sm font-bold">AD</div><ChevronDown size={15} className="text-slate-400"/></div></div>
        </header>
        <div className="max-w-[1400px] mx-auto p-5 md:p-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"><div><p className="text-sm text-slate-400 mb-1">Bem-vinda de volta 👋</p><h1 className="text-2xl md:text-[30px] font-bold tracking-tight">{active}</h1><p className="text-sm text-slate-500 mt-2">Acompanhe a rotina e os resultados da sua clínica.</p></div><button className="flex items-center justify-center gap-2 rounded-xl bg-[#6654d9] hover:bg-[#5846ca] text-white px-4 py-3 text-sm font-semibold shadow-sm"><Plus size={17}/> Novo agendamento</button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            <Metric label="Atendimentos hoje" value="12" detail="4 próximos" icon={<CalendarCheck size={19}/>} tint="violet"/>
            <Metric label="Receita recebida no mês" value="R$ 8.450" detail="Valores registrados" icon={<Wallet size={19}/>} tint="green"/>
            <Metric label="Clientes ativos" value="86" detail="No cadastro da clínica" icon={<Users size={19}/>} tint="blue"/>
            <Metric label="Próximo atendimento" value="09:00" detail="Mariana Costa" icon={<Clock3 size={19}/>} tint="amber"/>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5">
            <div className="bg-white rounded-2xl border border-[var(--line)] p-5 md:p-6">
              <div className="flex items-center justify-between mb-6"><div><h2 className="font-bold text-base">Agenda de hoje</h2><p className="text-xs text-slate-400 mt-1">Resumo dos próximos atendimentos</p></div><button onClick={() => setActive("Agenda")} className="text-sm font-semibold text-[#6654d9]">Ver agenda <ArrowUpRight size={15} className="inline"/></button></div>
              <div className="space-y-2">{appointments.map((a) => <div key={a.time} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0"><div className="text-sm font-semibold text-slate-500 w-12">{a.time}</div><div className={`w-1 h-10 rounded-full ${a.color === "violet" ? "bg-violet-400" : a.color === "amber" ? "bg-amber-400" : "bg-emerald-400"}`}/><div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{a.name}</div><div className="text-xs text-slate-400 mt-1">{a.service}</div></div><span className={`text-[11px] rounded-full px-2.5 py-1 font-medium ${a.color === "violet" ? "bg-violet-50 text-violet-700" : a.color === "amber" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{a.status}</span></div>)}</div>
            </div>
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[var(--line)] p-5 md:p-6"><div className="flex justify-between items-center mb-5"><div><h2 className="font-bold">Resumo financeiro</h2><p className="text-xs text-slate-400 mt-1">Outubro · valores de demonstração</p></div><Wallet size={18} className="text-slate-400"/></div><div className="text-3xl font-bold tracking-tight">R$ 8.450,00</div><div className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><ArrowUpRight size={14}/> Entradas efetivamente recebidas</div><div className="h-2 bg-slate-100 rounded-full mt-5 overflow-hidden"><div className="h-full w-[68%] bg-[#8172e8] rounded-full"/></div><div className="flex justify-between text-xs text-slate-400 mt-2"><span>Meta mensal</span><span>68%</span></div></div>
              <div className="bg-[#6654d9] text-white rounded-2xl p-5 md:p-6"><div className="flex items-center gap-2 text-white/80 text-sm"><CheckCircle2 size={17}/> Tudo organizado</div><h3 className="text-lg font-bold mt-3">Sua clínica em um só lugar</h3><p className="text-sm text-white/75 mt-2 leading-relaxed">Agenda, clientes e gestão financeira em uma experiência simples.</p><button onClick={() => setActive("Relatórios")} className="mt-4 text-sm font-semibold bg-white/15 hover:bg-white/20 rounded-lg px-3 py-2">Explorar relatórios</button></div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-400 mt-8">Prévia de interface · Dados ilustrativos, ainda não conectados ao Supabase</div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, detail, icon, tint }: { label: string; value: string; detail: string; icon: React.ReactNode; tint: string }) {
  const styles: Record<string, string> = { violet: "bg-violet-50 text-violet-600", green: "bg-emerald-50 text-emerald-600", blue: "bg-sky-50 text-sky-600", amber: "bg-amber-50 text-amber-600" };
  return <div className="bg-white rounded-2xl border border-[var(--line)] p-5"><div className="flex justify-between items-start"><div className="text-sm text-slate-500">{label}</div><div className={`w-9 h-9 rounded-xl grid place-items-center ${styles[tint]}`}>{icon}</div></div><div className="text-2xl font-bold tracking-tight mt-4">{value}</div><div className="text-xs text-slate-400 mt-1">{detail}</div></div>;
}