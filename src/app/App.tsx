import { useState, useRef } from "react";
import {
  LayoutDashboard, Zap, ArrowRightLeft, Building2, FileText, BarChart3,
  Settings, Bell, Search, TrendingUp, Gauge, Clock, ChevronRight,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, Droplets, Flame,
  ArrowRight, Download, SlidersHorizontal, X, ChevronDown, Plus,
  Pencil, MessageSquare, Ban, Send, Eye, ChevronLeft, ChevronUp, MoreHorizontal,
  User, Phone, Shield, Package, MessageCircle, Terminal, Activity,
  Filter, Calendar, Printer, Home, Hash, Wallet, ChevronsRight, ArrowLeft,
} from "lucide-react";

// ── Colour tokens (inline so components can reference them) ────────────────
const G = "#1A6B3C";   // primary green
const N = "#0F1F3D";   // dark navy
const GLight = "#F0FAF4";
const border = "rgba(15,31,61,0.1)";
const muted = "#6B7280";

// ── Shared tiny helpers ────────────────────────────────────────────────────

function Badge({
  children, variant = "default",
}: { children: React.ReactNode; variant?: "green" | "blue" | "amber" | "red" | "navy" | "default" | "gray" }) {
  const cls: Record<string, string> = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    navy: "bg-[#0F1F3D] text-white border-transparent",
    default: "bg-[#F0FAF4] text-[#1A6B3C] border-green-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls[variant]}`}>
      {children}
    </span>
  );
}

function Select({
  value, onChange, options, placeholder,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 pr-7 text-xs text-[#374151] focus:outline-none focus:border-[#1A6B3C] cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(15,31,61,0.08)] shrink-0">
          <h2 className="text-sm font-semibold text-[#0F1F3D]">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(15,31,61,0.06)]">
        <h3 className="text-sm font-semibold text-[#0F1F3D]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Success: "green", Failed: "red", Pending: "amber",
    Paid: "green", Draft: "gray", Void: "red", "Partially Paid": "amber", Overdue: "red",
    Active: "green", Inactive: "gray",
    Delivered: "green", Failed_SMS: "red",
    Prepay: "default", Postpay: "blue",
  };
  const icons: Record<string, React.ReactNode> = {
    Success: <CheckCircle2 size={10} />, Failed: <XCircle size={10} />, Pending: <Clock size={10} />,
    Paid: <CheckCircle2 size={10} />, Void: <Ban size={10} />, Overdue: <AlertTriangle size={10} />,
    Active: <CheckCircle2 size={10} />,
  };
  return <Badge variant={(map[status] || "gray") as any}>{icons[status]}{status}</Badge>;
}

// ── Nav ────────────────────────────────────────────────────────────────────
type NavId = "dashboard" | "vend" | "transactions" | "properties" | "invoices" | "disbursements" | "reports" | "settings";

const navItems = [
  { id: "dashboard" as NavId, label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "vend" as NavId, label: "Vend Token", icon: <Zap size={16} /> },
  { id: "transactions" as NavId, label: "Transactions", icon: <ArrowRightLeft size={16} /> },
  { id: "properties" as NavId, label: "Properties & Meters", icon: <Building2 size={16} /> },
  { id: "invoices" as NavId, label: "Invoices", icon: <FileText size={16} /> },
  { id: "disbursements" as NavId, label: "Settlements", icon: <Wallet size={16} /> },
  { id: "reports" as NavId, label: "Reports", icon: <BarChart3 size={16} /> },
  { id: "settings" as NavId, label: "Settings", icon: <Settings size={16} /> },
];

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

const dashTxns = [
  { ref: "TXN-8821", meter: "MPY-00421", property: "Sunset Apartments", type: "KPLC Token" as const, amount: "KES 500", status: "Success" as const, time: "09:42 AM" },
  { ref: "TXN-8820", meter: "MPY-00388", property: "Riverside Court", type: "Water Token" as const, amount: "KES 200", status: "Success" as const, time: "09:38 AM" },
  { ref: "TXN-8819", meter: "MPY-00512", property: "Sunset Apartments", type: "KPLC Token" as const, amount: "KES 1,000", status: "Success" as const, time: "09:21 AM" },
  { ref: "TXN-8818", meter: "MPY-00290", property: "Garden Estate", type: "KPLC Token" as const, amount: "KES 350", status: "Pending" as const, time: "09:15 AM" },
  { ref: "TXN-8817", meter: "MPY-00471", property: "Riverside Court", type: "KPLC Token" as const, amount: "KES 200", status: "Success" as const, time: "08:57 AM" },
  { ref: "TXN-8816", meter: "MPY-00103", property: "Parkview Flats", type: "Water Token" as const, amount: "KES 750", status: "Failed" as const, time: "08:44 AM" },
];
const revenueData = [
  { day: "Mon", electricity: 62000, water: 14000 },
  { day: "Tue", electricity: 75000, water: 18000 },
  { day: "Wed", electricity: 58000, water: 12000 },
  { day: "Thu", electricity: 91000, water: 21000 },
  { day: "Fri", electricity: 84000, water: 19000 },
  { day: "Sat", electricity: 47000, water: 9000 },
  { day: "Sun", electricity: 38000, water: 7500 },
];
const formatKES = (v: number) => `KES ${v.toLocaleString()}`;

function TypePill({ type }: { type: "KPLC Token" | "Water Token" }) {
  return type === "KPLC Token"
    ? <Badge variant="green"><Zap size={9} />{type}</Badge>
    : <Badge variant="blue"><Droplets size={9} />{type}</Badge>;
}

function KpiCard({ title, value, sub, icon, iconColor, dimSub }: {
  title: string; value: string; sub: string; icon: React.ReactNode; iconColor: string; dimSub?: boolean;
}) {
  return (
    <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-[#0F1F3D] tracking-tight">{value}</div>
        <div className={`text-xs mt-1 font-medium ${dimSub ? "text-amber-600" : "text-[#6B7280]"}`}>{sub}</div>
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: { day: string; electricity: number; water: number }[] }) {
  const W = 560, H = 180, padL = 36, padR = 8, padT = 8, padB = 24;
  const allVals = data.flatMap(d => [d.electricity, d.water]);
  const maxVal = Math.max(...allVals);
  const xStep = (W - padL - padR) / (data.length - 1);
  const yScale = (v: number) => padT + (H - padT - padB) * (1 - v / maxVal);
  const pts = (key: "electricity" | "water") =>
    data.map((d, i) => `${padL + i * xStep},${yScale(d[key])}`).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxVal * f / 1000) * 1000);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 200 }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width) * W;
          const i = Math.round((mx - padL) / xStep);
          if (i >= 0 && i < data.length) setHover({ i, x: padL + i * xStep, y: 0 });
        }}
      >
        {/* grid lines */}
        {yTicks.map(t => (
          <g key={`g-${t}`}>
            <line x1={padL} x2={W - padR} y1={yScale(t)} y2={yScale(t)} stroke="rgba(15,31,61,0.06)" strokeDasharray="3 3" />
            <text x={padL - 4} y={yScale(t) + 4} textAnchor="end" fontSize={10} fill="#9CA3AF" fontFamily="DM Mono">
              {t >= 1000 ? `${t / 1000}k` : t}
            </text>
          </g>
        ))}
        {/* x labels */}
        {data.map((d, i) => (
          <text key={`x-${d.day}`} x={padL + i * xStep} y={H - 4} textAnchor="middle" fontSize={10} fill="#9CA3AF" fontFamily="DM Mono">{d.day}</text>
        ))}
        {/* lines */}
        <polyline points={pts("electricity")} fill="none" stroke="#1A6B3C" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={pts("water")} fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {/* hover indicator */}
        {hover && (
          <>
            <line x1={hover.x} x2={hover.x} y1={padT} y2={H - padB} stroke="rgba(15,31,61,0.1)" strokeWidth={1} />
            <circle cx={hover.x} cy={yScale(data[hover.i].electricity)} r={4} fill="#1A6B3C" />
            <circle cx={hover.x} cy={yScale(data[hover.i].water)} r={4} fill="#3B82F6" />
          </>
        )}
      </svg>
      {hover && (
        <div
          className="absolute pointer-events-none bg-white border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs shadow-md"
          style={{ left: Math.min(hover.x / 560 * 100, 75) + "%", top: 16, transform: "translateX(-50%)" }}
        >
          <div className="font-medium text-[#0F1F3D] mb-1">{data[hover.i].day}</div>
          <div className="flex items-center gap-1.5 text-[#1A6B3C]"><span className="w-2 h-2 rounded-full bg-[#1A6B3C]" />KES {data[hover.i].electricity.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[#3B82F6] mt-0.5"><span className="w-2 h-2 rounded-full bg-[#3B82F6]" />KES {data[hover.i].water.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

function DashboardScreen({ onNav }: { onNav: (id: NavId) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Today's Revenue" value="KES 84,200" sub="+8% vs yesterday" icon={<TrendingUp size={18} className="text-green-700" />} iconColor="bg-green-50" />
        <KpiCard title="Tokens Issued Today" value="347" sub="KPLC: 281 · Water: 66" icon={<Zap size={18} className="text-blue-600" />} iconColor="bg-blue-50" />
        <KpiCard title="Active Meters" value="1,842" sub="38 new this week" icon={<Gauge size={18} className="text-violet-600" />} iconColor="bg-violet-50" />
        <KpiCard title="Pending Payments" value="KES 12,500" sub="3 transactions pending" icon={<Clock size={18} className="text-amber-600" />} iconColor="bg-amber-50" dimSub />
      </div>

      <div className="flex gap-3">
        <button onClick={() => onNav("vend")} className="flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#155c33] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <Zap size={15} />Vend Electricity Token
        </button>
        <button onClick={() => onNav("vend")} className="flex items-center gap-2 border border-[#0F1F3D] text-[#0F1F3D] hover:bg-[#F7F8FA] px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Droplets size={15} />Vend Water Token
        </button>
        <button onClick={() => onNav("invoices")} className="flex items-center gap-2 border border-[rgba(15,31,61,0.2)] text-[#6B7280] hover:border-[#0F1F3D] hover:text-[#0F1F3D] px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <FileText size={15} />Generate Postpay Invoice
        </button>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <SectionCard title="Recent Transactions" action={
            <button onClick={() => onNav("transactions")} className="flex items-center gap-1 text-xs text-[#1A6B3C] font-medium hover:underline">View All <ChevronRight size={12} /></button>
          }>
            <table className="w-full text-sm">
              <thead><tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-medium">
                {["Ref #", "Meter No.", "Property", "Type", "Amount", "Status", "Time"].map(h => <th key={h} className="px-4 py-2.5 text-left">{h}</th>)}
              </tr></thead>
              <tbody>
                {dashTxns.map(t => (
                  <tr key={t.ref} className="border-t border-[rgba(15,31,61,0.04)] hover:bg-[#F7F8FA] transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{t.ref}</td>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[#0F1F3D]">{t.meter}</td>
                    <td className="px-4 py-3 text-xs text-[#374151]">{t.property}</td>
                    <td className="px-4 py-3"><TypePill type={t.type} /></td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#0F1F3D]">{t.amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-[#9CA3AF]">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-[#0F1F3D]">Revenue This Week</h3>
              <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1A6B3C]" />Electricity</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />Water</span>
              </div>
            </div>
            <RevenueChart data={revenueData} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SectionCard title="Token Delivery" action={<span className="text-[10px] text-[#6B7280]">SMS</span>}>
            <div className="px-5 py-1">
              {[{ meter: "MPY-00421", time: "07:12 PM", ok: true }, { meter: "MPY-00388", time: "07:10 PM", ok: true }, { meter: "MPY-00512", time: "06:58 PM", ok: false }].map(s => (
                <div key={s.meter} className="flex items-center justify-between py-3 border-b border-[rgba(15,31,61,0.05)] last:border-0">
                  <div><div className="font-mono text-xs font-medium text-[#0F1F3D]">{s.meter}</div><div className="text-[10px] text-[#9CA3AF] mt-0.5">{s.time}</div></div>
                  {s.ok ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                </div>
              ))}
              <button className="flex items-center gap-1 text-xs text-[#1A6B3C] font-medium my-3 hover:underline">View All Notifications <ChevronRight size={11} /></button>
            </div>
          </SectionCard>

          <SectionCard title="Properties Overview" action={<Building2 size={14} className="text-[#9CA3AF]" />}>
            <div className="px-5 py-1">
              {[{ name: "Sunset Apartments", total: 24, active: 22 }, { name: "Riverside Court", total: 18, active: 18 }, { name: "Parkview Flats", total: 12, active: 10 }].map(p => (
                <div key={p.name} className="flex items-center justify-between py-3 border-b border-[rgba(15,31,61,0.05)] last:border-0">
                  <div><div className="text-xs font-medium text-[#0F1F3D]">{p.name}</div><div className="text-[10px] text-[#9CA3AF] mt-0.5">{p.total} meters</div></div>
                  <Badge variant="green">{p.active} active</Badge>
                </div>
              ))}
              <button onClick={() => onNav("properties")} className="flex items-center gap-1 text-xs text-[#1A6B3C] font-medium my-3 hover:underline">Manage Properties <ChevronRight size={11} /></button>
            </div>
          </SectionCard>

          <SectionCard title="Alerts" action={<span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">2</span>}>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0"><div className="text-xs font-medium text-red-800">Token SMS failed</div><div className="text-[10px] text-red-600 mt-0.5 font-mono">Meter MPY-00512</div></div>
                <button className="flex items-center gap-1 text-[10px] text-red-700 font-semibold border border-red-200 bg-white px-2 py-1 rounded-lg hover:bg-red-50 whitespace-nowrap"><RefreshCw size={9} />Retry</button>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0"><div className="text-xs font-medium text-amber-800">Postpay invoice overdue</div><div className="text-[10px] text-amber-600 mt-0.5 font-mono">MPY-00290 · Sunset Apts</div></div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VEND TOKEN WIZARD
// ══════════════════════════════════════════════════════════════════════════════

const STEPS = ["Meter Lookup", "Select Utility", "Enter Amount", "Confirm & Pay"];

function VendTokenScreen() {
  const [step, setStep] = useState(1);
  const [utility, setUtility] = useState<"electricity" | "water" | "gas" | null>("electricity");
  const [amount, setAmount] = useState<number | null>(500);
  const [paymentMethod, setPaymentMethod] = useState<"stk" | "paybill" | "manual">("stk");

  const total = amount ?? 0;
  const kwh = amount ? (amount / 11.82).toFixed(1) : "0";

  return (
    <div className="flex flex-col gap-6 max-w-[680px] mx-auto w-full">
      <div>
        <h1 className="text-xl font-semibold text-[#0F1F3D]">Vend Utility Token</h1>
        <p className="text-sm text-[#6B7280] mt-1">Quick, secure token purchase in under 10 seconds</p>
      </div>
      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => {
          const n = i + 1; const active = n === step; const done = n < step;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done || active ? "bg-[#1A6B3C] border-[#1A6B3C] text-white" : "bg-white border-[rgba(15,31,61,0.2)] text-[#9CA3AF]"}`}>
                  {done ? <CheckCircle2 size={14} /> : n}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-[#1A6B3C]" : done ? "text-[#6B7280]" : "text-[#9CA3AF]"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 mx-2 mb-4 ${done ? "bg-[#1A6B3C]" : "bg-[rgba(15,31,61,0.12)]"}`} />}
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      <div className="bg-white border border-[rgba(15,31,61,0.1)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(15,31,61,0.06)] flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step > 1 ? "bg-[#1A6B3C] text-white" : "bg-[#0F1F3D] text-white"}`}>{step > 1 ? <CheckCircle2 size={12} /> : "1"}</div>
          <h3 className="text-sm font-semibold text-[#0F1F3D]">Find Meter</h3>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex gap-2">
            <input defaultValue="MPY-00421" placeholder="Enter meter number e.g. MPY-00421" className="flex-1 bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] font-mono placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
            <button className="bg-[#1A6B3C] hover:bg-[#155c33] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"><Search size={14} />Look Up Meter</button>
          </div>
          <div className="border-l-4 border-[#1A6B3C] bg-[#F0FAF4] rounded-r-xl p-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
            {[["Meter Number", "MPY-00421"], ["Property", "Sunset Apartments"], ["Unit", "Flat 3B"], ["Master Meter", "KPLC-9921-A"], ["Last Token", "KES 500 — 3 days ago"], ["Phone (SMS to)", "+254 712 345 678"]].map(([l, v]) => (
              <div key={l}><div className="text-[10px] uppercase tracking-wide text-[#6B7280] font-medium mb-0.5">{l}</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{v}</div></div>
            ))}
            <div><div className="text-[10px] uppercase tracking-wide text-[#6B7280] font-medium mb-0.5">Billing Type</div><Badge variant="navy">PREPAY</Badge></div>
            <div><div className="text-[10px] uppercase tracking-wide text-[#6B7280] font-medium mb-0.5">Status</div><span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700"><CheckCircle2 size={12} />Active</span></div>
          </div>
          {step === 1 && <button onClick={() => setStep(2)} className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">Continue to Select Utility <ArrowRight size={15} /></button>}
        </div>
      </div>

      {/* Step 2 */}
      <div className={`bg-white border rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden transition-all ${step >= 2 ? "border-[rgba(15,31,61,0.1)]" : "border-[rgba(15,31,61,0.06)] opacity-40 pointer-events-none"}`}>
        <div className="px-6 py-4 border-b border-[rgba(15,31,61,0.06)] flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step > 2 ? "bg-[#1A6B3C] text-white" : step === 2 ? "bg-[#0F1F3D] text-white" : "bg-[rgba(15,31,61,0.1)] text-[#9CA3AF]"}`}>{step > 2 ? <CheckCircle2 size={12} /> : "2"}</div>
          <h3 className="text-sm font-semibold text-[#0F1F3D]">Select Utility</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3">
            {[{ id: "electricity", label: "Electricity (KPLC)", icon: <Zap size={22} /> }, { id: "water", label: "Water (Nairobi Water)", icon: <Droplets size={22} /> }, { id: "gas", label: "Gas Token", icon: <Flame size={22} /> }].map(u => (
              <button key={u.id} onClick={() => { setUtility(u.id as typeof utility); if (step === 2) setStep(3); }} className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 text-center transition-all ${utility === u.id ? "border-[#1A6B3C] bg-[#F0FAF4] text-[#1A6B3C]" : "border-[rgba(15,31,61,0.1)] text-[#6B7280] hover:border-[rgba(15,31,61,0.25)]"}`}>
                <div className={utility === u.id ? "text-[#1A6B3C]" : "text-[#9CA3AF]"}>{u.icon}</div>
                <span className="text-xs font-semibold leading-tight">{u.label}</span>
              </button>
            ))}
          </div>
          {step === 2 && <button onClick={() => setStep(3)} className="w-full mt-4 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">Continue <ArrowRight size={15} /></button>}
        </div>
      </div>

      {/* Step 3 */}
      <div className={`bg-white border rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden transition-all ${step >= 3 ? "border-[rgba(15,31,61,0.1)]" : "border-[rgba(15,31,61,0.06)] opacity-40 pointer-events-none"}`}>
        <div className="px-6 py-4 border-b border-[rgba(15,31,61,0.06)] flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step > 3 ? "bg-[#1A6B3C] text-white" : step === 3 ? "bg-[#0F1F3D] text-white" : "bg-[rgba(15,31,61,0.1)] text-[#9CA3AF]"}`}>{step > 3 ? <CheckCircle2 size={12} /> : "3"}</div>
          <h3 className="text-sm font-semibold text-[#0F1F3D]">Enter Amount</h3>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex gap-2">
            {[100, 200, 500, 1000].map(v => (
              <button key={v} onClick={() => setAmount(v)} className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${amount === v ? "border-[#1A6B3C] bg-[#F0FAF4] text-[#1A6B3C]" : "border-[rgba(15,31,61,0.1)] text-[#6B7280] hover:border-[rgba(15,31,61,0.25)]"}`}>KES {v.toLocaleString()}</button>
            ))}
          </div>
          <input type="number" placeholder="Enter custom amount (KES)" onChange={(e) => setAmount(Number(e.target.value) || null)} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
          {amount && (
            <div className="flex items-center justify-between bg-[#F0FAF4] border border-green-200 rounded-xl px-4 py-3">
              <div><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Token Amount</div><div className="font-mono text-lg font-bold text-[#0F1F3D]">KES {amount.toLocaleString()}.00</div></div>
              <div className="text-right"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Est. Units</div><div className="font-mono text-lg font-bold text-[#1A6B3C]">~{kwh} kWh</div></div>
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-[#374151] mb-2">Payment Method</div>
            <div className="flex gap-4">
              {[{ id: "stk", label: "M-Pesa STK Push" }, { id: "paybill", label: "M-Pesa Paybill" }, { id: "manual", label: "Manual Entry" }].map(m => (
                <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id as typeof paymentMethod)} className="accent-[#1A6B3C]" />
                  <span className="text-xs text-[#374151] font-medium">{m.label}</span>
                </label>
              ))}
            </div>
            {paymentMethod === "stk" && (
              <div className="mt-3 flex items-center gap-2 bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5">
                <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-medium">STK Push to</span>
                <span className="font-mono text-sm text-[#0F1F3D] font-medium">+254 712 345 678</span>
              </div>
            )}
          </div>
          {step === 3 && <button onClick={() => setStep(4)} className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">Continue to Confirm & Pay <ArrowRight size={15} /></button>}
        </div>
      </div>

      {/* Step 4 */}
      <div className={`bg-white border rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden transition-all ${step >= 4 ? "border-[rgba(15,31,61,0.1)]" : "border-[rgba(15,31,61,0.06)] opacity-40 pointer-events-none"}`}>
        <div className="px-6 py-4 border-b border-[rgba(15,31,61,0.06)] flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 4 ? "bg-[#0F1F3D] text-white" : "bg-[rgba(15,31,61,0.1)] text-[#9CA3AF]"}`}>4</div>
          <h3 className="text-sm font-semibold text-[#0F1F3D]">Confirm & Pay</h3>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-[#0F1F3D] rounded-xl p-5 text-white">
            <div className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.4)] font-medium mb-4">Transaction Summary</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[["Meter", "MPY-00421 — Flat 3B, Sunset Apartments"], ["Utility", utility === "electricity" ? "KPLC Electricity Token" : utility === "water" ? "Water Token" : "Gas Token"], ["Amount", `KES ${total.toLocaleString()}.00`], ["Est. kWh", `~${kwh} kWh`], ["Deliver to", "+254 712 345 678 via SMS"], ["Payment", "M-Pesa STK Push"]].map(([l, v]) => (
                <div key={l}><div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide mb-0.5">{l}</div><div className="text-sm font-semibold text-white">{v}</div></div>
              ))}
            </div>
          </div>
          <button className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white py-4 rounded-lg font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-md">
            <CheckCircle2 size={18} />PURCHASE TOKEN — KES {total.toLocaleString()}.00
          </button>
          <p className="text-center text-[11px] text-[#9CA3AF]">Token will be delivered via SMS within 10 seconds of M-Pesa confirmation.</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TRANSACTIONS
// ══════════════════════════════════════════════════════════════════════════════

type TxnRow = {
  ref: string; meter: string; property: string; unit: string;
  utility: string; amount: number;
  source: "STK" | "Paybill" | "Manual";
  status: "Success" | "Pending" | "Failed";
  datetime: string;
};

const ALL_TXNS: TxnRow[] = [
  { ref: "TXN-8821", meter: "MPY-00421", property: "Sunset Apartments", unit: "Flat 3B", utility: "KPLC", amount: 500, source: "STK", status: "Success", datetime: "2026-06-25 09:42" },
  { ref: "TXN-8820", meter: "MPY-00388", property: "Riverside Court", unit: "Unit 7", utility: "Water", amount: 200, source: "STK", status: "Success", datetime: "2026-06-25 09:38" },
  { ref: "TXN-8819", meter: "MPY-00512", property: "Sunset Apartments", unit: "Flat 11A", utility: "KPLC", amount: 1000, source: "Paybill", status: "Success", datetime: "2026-06-25 09:21" },
  { ref: "TXN-8818", meter: "MPY-00290", property: "Garden Estate", unit: "House 4", utility: "KPLC", amount: 350, source: "STK", status: "Pending", datetime: "2026-06-25 09:15" },
  { ref: "TXN-8817", meter: "MPY-00471", property: "Riverside Court", unit: "Unit 2", utility: "KPLC", amount: 200, source: "STK", status: "Success", datetime: "2026-06-25 08:57" },
  { ref: "TXN-8816", meter: "MPY-00103", property: "Parkview Flats", unit: "Flat B2", utility: "Water", amount: 750, source: "Manual", status: "Failed", datetime: "2026-06-25 08:44" },
  { ref: "TXN-8815", meter: "MPY-00233", property: "Garden Estate", unit: "House 9", utility: "KPLC", amount: 2000, source: "Paybill", status: "Success", datetime: "2026-06-24 18:22" },
  { ref: "TXN-8814", meter: "MPY-00309", property: "Sunset Apartments", unit: "Flat 6C", utility: "KPLC", amount: 500, source: "STK", status: "Success", datetime: "2026-06-24 17:05" },
  { ref: "TXN-8813", meter: "MPY-00144", property: "Parkview Flats", unit: "Flat A1", utility: "Water", amount: 300, source: "STK", status: "Success", datetime: "2026-06-24 15:48" },
  { ref: "TXN-8812", meter: "MPY-00562", property: "Riverside Court", unit: "Unit 14", utility: "KPLC", amount: 1500, source: "Manual", status: "Pending", datetime: "2026-06-24 14:30" },
];

function TransactionDetailDrawer({ txn, onClose }: { txn: TxnRow; onClose: () => void }) {
  const [payloadOpen, setPayloadOpen] = useState(false);
  return (
    <Drawer open title={`Transaction — ${txn.ref}`} onClose={onClose}>
      <div className="p-6 flex flex-col gap-5">
        {/* Header status */}
        <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
          <div><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1">Status</div><StatusBadge status={txn.status} /></div>
          <div className="text-right"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1">Amount</div><div className="text-lg font-bold text-[#0F1F3D]">KES {txn.amount.toLocaleString()}</div></div>
        </div>

        {/* Meter details */}
        <div>
          <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-3">Meter Details</div>
          <div className="grid grid-cols-2 gap-3">
            {[["Ref #", txn.ref], ["Meter Number", txn.meter], ["Property", txn.property], ["Unit", txn.unit], ["Utility", txn.utility], ["Source", txn.source], ["Date & Time", txn.datetime]].map(([l, v]) => (
              <div key={l} className="bg-[#F7F8FA] rounded-lg p-3">
                <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">{l}</div>
                <div className="text-xs font-semibold text-[#0F1F3D] font-mono">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between bg-[#F0FAF4] border border-green-200 rounded-xl px-4 py-3">
          <div><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Token Amount</div><div className="font-mono text-xl font-bold text-[#0F1F3D]">KES {txn.amount.toLocaleString()}.00</div></div>
          <div className="text-right"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Source</div><Badge variant="gray">{txn.source}</Badge></div>
        </div>

        {/* M-Pesa Ref */}
        <div>
          <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">M-Pesa Reference</div>
          <div className="bg-[#F7F8FA] rounded-lg px-4 py-2.5 font-mono text-xs text-[#0F1F3D]">QHZ7K3MP8W</div>
        </div>

        {/* Token number */}
        {txn.status === "Success" && (
          <div>
            <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">Token Number</div>
            <div className="bg-[#F0FAF4] border border-green-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="font-mono text-base font-bold text-[#0F1F3D] tracking-widest">
                {/* deterministic fake token derived from ref so each row looks different */}
                {(() => {
                  const seed = txn.ref.replace("TXN-", "");
                  const n = parseInt(seed) * 7919;
                  return `${String(n).padStart(4,"0").slice(-4)}-${String(n*3).padStart(4,"0").slice(-4)}-${String(n*7).padStart(4,"0").slice(-4)}-${String(n*13).padStart(4,"0").slice(-4)}`;
                })()}
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText("")}
                className="text-[10px] text-[#1A6B3C] font-semibold border border-green-200 bg-white px-2.5 py-1 rounded-lg hover:bg-green-50 transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-1.5">This is the token delivered to the sub-meter.</p>
          </div>
        )}

        {/* SMS Delivery */}
        <div>
          <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">SMS Delivery Status</div>
          <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold ${txn.status === "Success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {txn.status === "Success" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {txn.status === "Success" ? "Token delivered via SMS to +254 712 345 678" : "SMS delivery failed — tap Retry to resend"}
            {txn.status === "Failed" && <button className="ml-auto flex items-center gap-1 bg-red-100 px-2 py-1 rounded"><RefreshCw size={10} />Retry</button>}
          </div>
        </div>

        {/* Raw payload — admin only */}
        <div>
          <button onClick={() => setPayloadOpen(!payloadOpen)} className="flex items-center gap-2 text-xs text-[#9CA3AF] font-medium hover:text-[#0F1F3D] transition-colors">
            <Terminal size={12} />{payloadOpen ? "Hide" : "Show"} Raw Callback Payload
          </button>
          {payloadOpen && (
            <pre className="mt-2 bg-[#0F1F3D] text-green-300 text-[10px] font-mono p-4 rounded-xl overflow-auto leading-relaxed">{JSON.stringify({ ResultCode: 0, ResultDesc: "The service request is processed successfully.", Body: { stkCallback: { MerchantRequestID: "29115-34620561-1", CheckoutRequestID: "ws_CO_191220191020363925", ResultCode: 0, CallbackMetadata: { Item: [{ Name: "Amount", Value: txn.amount }, { Name: "MpesaReceiptNumber", Value: "QHZ7K3MP8W" }, { Name: "TransactionDate", Value: 20260625094200 }, { Name: "PhoneNumber", Value: 254712345678 }] } } } }, null, 2)}</pre>
          )}
        </div>
      </div>
    </Drawer>
  );
}

function TransactionsScreen() {
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [selectedTxn, setSelectedTxn] = useState<TxnRow | null>(null);

  const filtered = ALL_TXNS.filter(t => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (typeFilter && t.utility !== typeFilter) return false;
    if (sourceFilter && t.source !== sourceFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      {selectedTxn && <TransactionDetailDrawer txn={selectedTxn} onClose={() => setSelectedTxn(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#0F1F3D]">Transactions</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Full ledger of all vend and payment events</p>
        </div>
        <button className="flex items-center gap-2 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
          <Download size={13} />Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white border border-[rgba(15,31,61,0.08)] rounded-xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <SlidersHorizontal size={14} className="text-[#9CA3AF] shrink-0" />
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Statuses" options={[{ value: "Success", label: "Success" }, { value: "Pending", label: "Pending" }, { value: "Failed", label: "Failed" }]} />
          <Select value={typeFilter} onChange={setTypeFilter} placeholder="All Utilities" options={[{ value: "KPLC", label: "KPLC" }, { value: "Water", label: "Water" }]} />
          <Select value={sourceFilter} onChange={setSourceFilter} placeholder="All Sources" options={[{ value: "STK", label: "STK Push" }, { value: "Paybill", label: "Paybill" }, { value: "Manual", label: "Manual" }]} />
          <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2">
            <Calendar size={12} className="text-[#9CA3AF]" />
            <input type="date" defaultValue="2026-06-25" className="bg-transparent text-xs text-[#374151] outline-none" />
            <span className="text-[#9CA3AF] text-xs">→</span>
            <input type="date" defaultValue="2026-06-25" className="bg-transparent text-xs text-[#374151] outline-none" />
          </div>
        </div>
        {(statusFilter || typeFilter || sourceFilter) && (
          <button onClick={() => { setStatusFilter(""); setTypeFilter(""); setSourceFilter(""); }} className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#0F1F3D]">
            <X size={12} />Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
              {["Ref #", "Meter No.", "Property", "Unit", "Utility", "Amount", "Source", "Status", "Date & Time", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-xs text-[#9CA3AF]">No transactions match the selected filters.</td></tr>
            )}
            {filtered.map(t => (
              <tr key={t.ref} onClick={() => setSelectedTxn(t)} className="border-t border-[rgba(15,31,61,0.04)] hover:bg-[#F7F8FA] transition-colors cursor-pointer group">
                <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{t.ref}</td>
                <td className="px-4 py-3 font-mono text-xs font-medium text-[#0F1F3D]">{t.meter}</td>
                <td className="px-4 py-3 text-xs text-[#374151]">{t.property}</td>
                <td className="px-4 py-3 text-xs text-[#6B7280]">{t.unit}</td>
                <td className="px-4 py-3">
                  {t.utility === "KPLC" ? <Badge variant="green"><Zap size={9} />KPLC</Badge> : <Badge variant="blue"><Droplets size={9} />Water</Badge>}
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-[#0F1F3D]">KES {t.amount.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge variant="gray">{t.source}</Badge></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 font-mono text-[10px] text-[#9CA3AF] whitespace-nowrap">{t.datetime}</td>
                <td className="px-4 py-3"><Eye size={13} className="text-[#9CA3AF] group-hover:text-[#1A6B3C] transition-colors" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-[rgba(15,31,61,0.06)] flex items-center justify-between">
          <span className="text-[11px] text-[#9CA3AF]">Showing {filtered.length} of {ALL_TXNS.length} transactions</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F7F8FA] text-[#9CA3AF]"><ChevronLeft size={14} /></button>
            <span className="text-xs font-medium text-[#374151] px-2">Page 1 of 1</span>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F7F8FA] text-[#9CA3AF]"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROPERTIES & METERS  (3 layers: Landlord → Property → Meters)
// ══════════════════════════════════════════════════════════════════════════════

type SubMeter = { id: string; unit: string; tenant?: string; billing: "Prepay" | "Postpay"; product: string; lastTxn: string; status: "Active" | "Inactive" };
type Property = { id: string; name: string; address: string; masterMeter: string; units: SubMeter[] };
type SettlementRecord = { id: string; date: string; amount: number; ref: string; method: string };
type Landlord = {
  id: string; name: string; contact: string; email: string; idNumber: string;
  paymentMethod: "M-Pesa Paybill" | "Bank Transfer";
  paybillNumber?: string; paybillAccount?: string;   // M-Pesa
  bankName?: string; bankAccount?: string; bankAccountName?: string; // Bank
  totalCollected: number; pendingSettlement: number; lastSettled: string;
  properties: Property[];
  settlementHistory: SettlementRecord[];
};

function fmtPayment(l: Pick<Landlord, "paymentMethod"|"paybillNumber"|"paybillAccount"|"bankName"|"bankAccount"|"bankAccountName">) {
  return l.paymentMethod === "M-Pesa Paybill"
    ? `Paybill ${l.paybillNumber ?? "—"} · Acc ${l.paybillAccount ?? "—"}`
    : `${l.bankName ?? "—"} · ${l.bankAccountName ?? ""}${l.bankAccountName ? " · " : ""}${l.bankAccount ?? "—"}`;
}

const LANDLORDS: Landlord[] = [
  {
    id: "L1", name: "Wanjiru Holdings Ltd", contact: "+254 722 100 001", email: "accounts@wanjiru.co.ke",
    idNumber: "ID-051234567A", paymentMethod: "M-Pesa Paybill",
    paybillNumber: "522522", paybillAccount: "100421",
    totalCollected: 148200, pendingSettlement: 28200, lastSettled: "2026-06-20",
    settlementHistory: [
      { id: "SH1-3", date: "2026-06-20", amount: 42000, ref: "MPY-STL-0041", method: "M-Pesa Paybill" },
      { id: "SH1-2", date: "2026-05-31", amount: 38500, ref: "MPY-STL-0033", method: "M-Pesa Paybill" },
      { id: "SH1-1", date: "2026-04-30", amount: 39500, ref: "MPY-STL-0021", method: "M-Pesa Paybill" },
    ],
    properties: [
      {
        id: "P1", name: "Sunset Apartments", address: "Kileleshwa, Nairobi", masterMeter: "KPLC-9921-A",
        units: [
          { id: "M1", unit: "Flat 3B", tenant: "James Mwangi", billing: "Prepay", product: "KPLC Standard", lastTxn: "KES 500 · 3 days ago", status: "Active" },
          { id: "M2", unit: "Flat 6C", tenant: "Grace Achieng", billing: "Prepay", product: "KPLC Standard", lastTxn: "KES 500 · 1 day ago", status: "Active" },
          { id: "M3", unit: "Flat 11A", tenant: "Daniel Otieno", billing: "Postpay", product: "KPLC Postpay", lastTxn: "Invoice INV-2220 · Jun 2026", status: "Active" },
          { id: "M4", unit: "Flat 2D", billing: "Prepay", product: "KPLC Standard", lastTxn: "—", status: "Inactive" },
        ],
      },
      {
        id: "P1B", name: "Wanjiru Garden Villas", address: "Runda, Nairobi", masterMeter: "KPLC-9945-A",
        units: [
          { id: "M13", unit: "Villa 1", tenant: "Robert Maina", billing: "Prepay", product: "KPLC Standard", lastTxn: "KES 1,000 · 2 days ago", status: "Active" },
          { id: "M14", unit: "Villa 2", tenant: "Susan Waweru", billing: "Prepay", product: "KPLC Standard", lastTxn: "KES 500 · today", status: "Active" },
          { id: "M15", unit: "Villa 3", billing: "Prepay", product: "KPLC Standard", lastTxn: "—", status: "Inactive" },
        ],
      },
    ],
  },
  {
    id: "L2", name: "Oduya Properties", contact: "+254 733 200 002", email: "oduya@properties.ke",
    idNumber: "ID-062345678B", paymentMethod: "M-Pesa Paybill",
    paybillNumber: "522522", paybillAccount: "100388",
    totalCollected: 94500, pendingSettlement: 0, lastSettled: "2026-06-25",
    settlementHistory: [
      { id: "SH2-3", date: "2026-06-25", amount: 38500, ref: "MPY-STL-0044", method: "M-Pesa Paybill" },
      { id: "SH2-2", date: "2026-05-31", amount: 29000, ref: "MPY-STL-0035", method: "M-Pesa Paybill" },
      { id: "SH2-1", date: "2026-04-30", amount: 27000, ref: "MPY-STL-0022", method: "M-Pesa Paybill" },
    ],
    properties: [
      {
        id: "P2", name: "Riverside Court", address: "Westlands, Nairobi", masterMeter: "KPLC-8812-B",
        units: [
          { id: "M5", unit: "Unit 2", tenant: "Fatuma Hassan", billing: "Prepay", product: "KPLC Standard", lastTxn: "KES 200 · today", status: "Active" },
          { id: "M6", unit: "Unit 7", tenant: "Peter Kamau", billing: "Prepay", product: "Water Prepay", lastTxn: "KES 200 · today", status: "Active" },
          { id: "M7", unit: "Unit 14", billing: "Postpay", product: "KPLC Postpay", lastTxn: "Invoice INV-2218 · Jun 2026", status: "Active" },
        ],
      },
    ],
  },
  {
    id: "L3", name: "Muchiri & Sons", contact: "+254 711 300 003", email: "info@muchiri.co.ke",
    idNumber: "ID-073456789C", paymentMethod: "Bank Transfer",
    bankName: "Equity Bank", bankAccount: "****4421", bankAccountName: "Muchiri & Sons",
    totalCollected: 57300, pendingSettlement: 17300, lastSettled: "2026-06-18",
    settlementHistory: [
      { id: "SH3-2", date: "2026-06-18", amount: 22000, ref: "MPY-STL-0039", method: "Bank Transfer" },
      { id: "SH3-1", date: "2026-05-31", amount: 18000, ref: "MPY-STL-0029", method: "Bank Transfer" },
    ],
    properties: [
      {
        id: "P3", name: "Parkview Flats", address: "Lavington, Nairobi", masterMeter: "KPLC-7703-C",
        units: [
          { id: "M8", unit: "Flat A1", tenant: "Amina Yusuf", billing: "Prepay", product: "Water Prepay", lastTxn: "KES 300 · yesterday", status: "Active" },
          { id: "M9", unit: "Flat B2", billing: "Prepay", product: "Water Prepay", lastTxn: "KES 750 · today", status: "Active" },
          { id: "M10", unit: "Flat C3", billing: "Prepay", product: "KPLC Standard", lastTxn: "—", status: "Inactive" },
        ],
      },
    ],
  },
  {
    id: "L4", name: "Njoroge Developers", contact: "+254 700 400 004", email: "finance@njoroge.ke",
    idNumber: "ID-084567890D", paymentMethod: "M-Pesa Paybill",
    paybillNumber: "522522", paybillAccount: "100290",
    totalCollected: 112800, pendingSettlement: 0, lastSettled: "2026-06-24",
    settlementHistory: [
      { id: "SH4-3", date: "2026-06-24", amount: 41800, ref: "MPY-STL-0043", method: "M-Pesa Paybill" },
      { id: "SH4-2", date: "2026-05-31", amount: 36000, ref: "MPY-STL-0032", method: "M-Pesa Paybill" },
      { id: "SH4-1", date: "2026-04-30", amount: 35000, ref: "MPY-STL-0020", method: "M-Pesa Paybill" },
    ],
    properties: [
      {
        id: "P4", name: "Garden Estate", address: "Ruaka, Nairobi", masterMeter: "KPLC-6694-D",
        units: [
          { id: "M11", unit: "House 4", tenant: "Josephine Waithera", billing: "Postpay", product: "KPLC Postpay", lastTxn: "Invoice INV-2215 · Jun 2026", status: "Active" },
          { id: "M12", unit: "House 9", tenant: "Samuel Njeru", billing: "Prepay", product: "KPLC Standard", lastTxn: "KES 2,000 · yesterday", status: "Active" },
        ],
      },
    ],
  },
];

// All transactions keyed by property name for the landlord view
const TXN_BY_PROPERTY: Record<string, TxnRow[]> = {
  "Sunset Apartments": ALL_TXNS.filter(t => t.property === "Sunset Apartments"),
  "Riverside Court": ALL_TXNS.filter(t => t.property === "Riverside Court"),
  "Parkview Flats": ALL_TXNS.filter(t => t.property === "Parkview Flats"),
  "Garden Estate": ALL_TXNS.filter(t => t.property === "Garden Estate"),
};

// ── flattened derived lists for the tables ──────────────────────────────────
const ALL_PROPERTIES = LANDLORDS.flatMap(l => l.properties.map(p => ({ ...p, landlordId: l.id, landlordName: l.name })));
const ALL_METERS = LANDLORDS.flatMap(l =>
  l.properties.flatMap(p =>
    p.units.map(u => ({ ...u, propertyId: p.id, propertyName: p.name, landlordName: l.name, masterMeter: p.masterMeter }))
  )
);

type PropTab = "landlords" | "properties" | "meters";

function AddLandlordDrawer({ onClose, onSave }: { onClose: () => void; onSave: (l: Landlord) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", contact: "", email: "", idNumber: "", paymentMethod: "M-Pesa Paybill", paybillNumber: "", paybillAccount: "", bankName: "", bankAccount: "", bankAccountName: "" });
  const [propForm, setPropForm] = useState({ name: "", address: "", masterMeter: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const setP = (k: string, v: string) => setPropForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    const newLandlord: Landlord = {
      id: `L${Date.now()}`, name: form.name, contact: form.contact, email: form.email, idNumber: form.idNumber,
      paymentMethod: form.paymentMethod as Landlord["paymentMethod"],
      paybillNumber: form.paybillNumber, paybillAccount: form.paybillAccount,
      bankName: form.bankName, bankAccount: form.bankAccount, bankAccountName: form.bankAccountName,
      totalCollected: 0, pendingSettlement: 0, lastSettled: "—",
      settlementHistory: [],
      properties: [{
        id: `P${Date.now()}`, name: propForm.name, address: propForm.address, masterMeter: propForm.masterMeter,
        units: [],
      }],
    };
    onSave(newLandlord);
    onClose();
  };

  const steps = ["Landlord Details", "Add Property"];

  return (
    <Drawer open title="Add New Landlord" onClose={onClose}>
      <div className="p-6 flex flex-col gap-5">
        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {steps.map((label, i) => {
            const n = (i + 1) as 1 | 2;
            const done = n < step; const active = n === step;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${done || active ? "bg-[#1A6B3C] border-[#1A6B3C] text-white" : "bg-white border-[rgba(15,31,61,0.2)] text-[#9CA3AF]"}`}>
                    {done ? <CheckCircle2 size={12} /> : n}
                  </div>
                  <span className={`text-[9px] font-medium whitespace-nowrap ${active ? "text-[#1A6B3C]" : done ? "text-[#6B7280]" : "text-[#9CA3AF]"}`}>{label}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-px flex-1 mx-1.5 mb-4 ${done ? "bg-[#1A6B3C]" : "bg-[rgba(15,31,61,0.12)]"}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-[#0F1F3D]">Landlord / Company Details</div>
            {([["Full Name / Company", "name", "e.g. Wanjiru Holdings Ltd"], ["Phone Number", "contact", "+254 7xx xxx xxx"], ["Email Address", "email", "accounts@example.co.ke"], ["ID Number", "idNumber", "e.g. ID-051234567A"]] as [string,string,string][]).map(([label, key, ph]) => (
              <div key={key}>
                <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{label}</label>
                <input value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} placeholder={ph}
                  className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Payment Method</label>
              <div className="flex gap-3">
                {["M-Pesa Paybill", "Bank Transfer"].map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pm" value={m} checked={form.paymentMethod === m} onChange={() => set("paymentMethod", m)} className="accent-[#1A6B3C]" />
                    <span className="text-xs text-[#374151] font-medium">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            {form.paymentMethod === "M-Pesa Paybill" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Paybill Number</label>
                  <input value={form.paybillNumber} onChange={e => set("paybillNumber", e.target.value)} placeholder="e.g. 522522"
                    className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Account Number</label>
                  <input value={form.paybillAccount} onChange={e => set("paybillAccount", e.target.value)} placeholder="e.g. 100421"
                    className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Bank Name</label>
                  <input value={form.bankName} onChange={e => set("bankName", e.target.value)} placeholder="e.g. Equity Bank"
                    className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Account Name</label>
                  <input value={form.bankAccountName} onChange={e => set("bankAccountName", e.target.value)} placeholder="e.g. Wanjiru Holdings Ltd"
                    className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Account Number</label>
                  <input value={form.bankAccount} onChange={e => set("bankAccount", e.target.value)} placeholder="e.g. 1234567890"
                    className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
                </div>
              </div>
            )}
            <button onClick={() => setStep(2)} className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-2">
              Continue — Add Property <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-[#0F1F3D]">First Property for {form.name || "this landlord"}</div>
            {([["Property Name", "name", "e.g. Sunset Apartments"], ["Address", "address", "e.g. Kileleshwa, Nairobi"], ["KPLC Master Meter ID", "masterMeter", "e.g. KPLC-9921-A"]] as [string,string,string][]).map(([label, key, ph]) => (
              <div key={key}>
                <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{label}</label>
                <input value={propForm[key as keyof typeof propForm]} onChange={e => setP(key, e.target.value)} placeholder={ph}
                  className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
              </div>
            ))}
            {/* Summary preview */}
            <div className="bg-[#F0FAF4] border border-green-200 rounded-xl p-4 text-xs">
              <div className="font-semibold text-[#0F1F3D] mb-2">Summary</div>
              {[["Landlord", form.name || "—"], ["Property", propForm.name || "—"], ["Address", propForm.address || "—"], ["Master Meter", propForm.masterMeter || "—"]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-1 border-b border-green-100 last:border-0">
                  <span className="text-[#6B7280]">{l}</span><span className="font-medium text-[#0F1F3D]">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setStep(1)} className="flex-1 border border-[rgba(15,31,61,0.15)] text-[#374151] py-3 rounded-lg text-sm font-semibold hover:bg-[#F7F8FA] transition-colors">Back</button>
              <button onClick={handleCreate} className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 size={14} />Create Landlord
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

function AddPropertyDrawer({ onClose, onSave }: { onClose: () => void; onSave: (landlordId: string, p: Property, landlordName: string) => void }) {
  const [landlordId, setLandlordId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [masterMeter, setMasterMeter] = useState("");
  const allL = [...LANDLORDS]; // snapshot — component mounts once

  const handleAdd = () => {
    if (!landlordId || !name) return;
    const l = allL.find(x => x.id === landlordId);
    onSave(landlordId, { id: `P${Date.now()}`, name, address, masterMeter, units: [] }, l?.name ?? "");
    onClose();
  };

  return (
    <Drawer open title="Add Property to Landlord" onClose={onClose}>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Landlord</label>
          <div className="relative">
            <select value={landlordId} onChange={e => setLandlordId(e.target.value)} className="w-full appearance-none bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]">
              <option value="">Select landlord…</option>
              {allL.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>
        {([["Property Name", name, setName, "e.g. Parkview Flats"], ["Address", address, setAddress, "e.g. Lavington, Nairobi"], ["KPLC Master Meter ID", masterMeter, setMasterMeter, "e.g. KPLC-7703-C"]] as [string, string, (v:string)=>void, string][]).map(([l, v, sv, ph]) => (
          <div key={l}>
            <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{l}</label>
            <input value={v} onChange={e => sv(e.target.value)} placeholder={ph} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
          </div>
        ))}
        <button onClick={handleAdd} disabled={!landlordId || !name} className="w-full mt-2 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white py-3 rounded-lg text-sm font-semibold transition-colors">
          Add Property
        </button>
      </div>
    </Drawer>
  );
}

function AddMeterDrawer({ onClose, onSave, defaultPropertyId }: { onClose: () => void; onSave: (propertyId: string, meter: SubMeter) => void; defaultPropertyId?: string }) {
  const [billing, setBilling] = useState("Prepay");
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? "");
  const [meterId, setMeterId] = useState("");
  const [unit, setUnit] = useState("");
  const [product, setProduct] = useState("KPLC Standard");

  const handleAdd = () => {
    if (!propertyId || !meterId || !unit) return;
    onSave(propertyId, { id: meterId, unit, billing: billing as "Prepay"|"Postpay", product, lastTxn: "—", status: "Active" });
    onClose();
  };

  const handleAddAnother = () => {
    if (!propertyId || !meterId || !unit) return;
    onSave(propertyId, { id: meterId, unit, billing: billing as "Prepay"|"Postpay", product, lastTxn: "—", status: "Active" });
    setMeterId("");
    setUnit("");
    setBilling("Prepay");
    setProduct("KPLC Standard");
  };

  const valid = propertyId && meterId && unit;

  return (
    <Drawer open title="Add Sub-Meter" onClose={onClose}>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Property</label>
          <div className="relative">
            <select value={propertyId} onChange={e => setPropertyId(e.target.value)} className="w-full appearance-none bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]">
              <option value="">Select property…</option>
              {ALL_PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name} ({p.landlordName})</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Meter ID <span className="text-red-500">*</span></label>
          <input value={meterId} onChange={e => setMeterId(e.target.value)} placeholder="e.g. MPY-00421" className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] font-mono placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
        </div>
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Unit / Flat Name <span className="text-red-500">*</span></label>
          <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. Flat 3B" className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
        </div>
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Billing Type</label>
          <div className="flex gap-3">
            {["Prepay", "Postpay"].map(b => (
              <label key={b} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="am_billing" value={b} checked={billing === b} onChange={() => setBilling(b)} className="accent-[#1A6B3C]" />
                <span className="text-xs text-[#374151] font-medium">{b}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Product</label>
          <div className="relative">
            <select value={product} onChange={e => setProduct(e.target.value)} className="w-full appearance-none bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]">
              <option>KPLC Standard</option><option>KPLC Postpay</option><option>Water Prepay</option><option>Gas Token Standard</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={handleAdd} disabled={!valid} className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white py-3 rounded-lg text-sm font-semibold transition-colors">
            Add Meter
          </button>
          <button onClick={handleAddAnother} disabled={!valid} className="flex-1 border border-[#1A6B3C] text-[#1A6B3C] hover:bg-[#F0FAF4] disabled:opacity-40 py-3 rounded-lg text-sm font-semibold transition-colors">
            Save & Add Another
          </button>
        </div>
      </div>
    </Drawer>
  );
}

function PropertiesScreen() {
  const [tab, setTab] = useState<PropTab>("landlords");
  const [search, setSearch] = useState("");
  const [filterSettlement, setFilterSettlement] = useState("");
  const [filterLandlord, setFilterLandlord] = useState("");
  const [filterBilling, setFilterBilling] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddLandlord, setShowAddLandlord] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddMeter, setShowAddMeter] = useState(false);
  const [addMeterPropertyId, setAddMeterPropertyId] = useState<string | undefined>(undefined);
  const [expandedLandlordId, setExpandedLandlordId] = useState<string | null>(null);
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);
  const [editPropertyForm, setEditPropertyForm] = useState({ name: "", address: "", masterMeter: "" });
  const [editLandlordId, setEditLandlordId] = useState<string | null>(null);
  const [editLandlordForm, setEditLandlordForm] = useState({ name: "", contact: "", email: "", idNumber: "", paymentMethod: "M-Pesa Paybill" as string, paybillNumber: "", paybillAccount: "", bankName: "", bankAccount: "", bankAccountName: "" });
  const [filterProperty, setFilterProperty] = useState("");

  // Front-end state — new records live here until page refresh
  const [extraLandlords, setExtraLandlords] = useState<Landlord[]>([]);
  const [extraProperties, setExtraProperties] = useState<(Property & { landlordId: string; landlordName: string })[]>([]);
  const [extraMeters, setExtraMeters] = useState<(SubMeter & { propertyId: string; propertyName: string; landlordName: string; masterMeter: string })[]>([]);

  const allLandlords = [...LANDLORDS, ...extraLandlords];
  const allProperties = [
    ...ALL_PROPERTIES,
    ...extraProperties,
    ...extraLandlords.flatMap(l => l.properties.map(p => ({ ...p, landlordId: l.id, landlordName: l.name }))),
  ];
  const allMeters = [
    ...ALL_METERS,
    ...extraMeters,
    ...extraLandlords.flatMap(l => l.properties.flatMap(p => p.units.map(u => ({ ...u, propertyId: p.id, propertyName: p.name, landlordName: l.name, masterMeter: p.masterMeter })))),
  ];

  const tabs: { id: PropTab; label: string; count: number }[] = [
    { id: "landlords", label: "Landlords", count: allLandlords.length },
    { id: "properties", label: "Properties", count: allProperties.length },
    { id: "meters", label: "Sub-Meters", count: allMeters.length },
  ];

  const s = search.toLowerCase();
  const filteredLandlords = allLandlords.filter(l => {
    if (s && !l.name.toLowerCase().includes(s) && !l.contact.includes(s) && !l.idNumber.toLowerCase().includes(s)) return false;
    if (filterSettlement === "pending" && l.pendingSettlement === 0) return false;
    if (filterSettlement === "settled" && l.pendingSettlement > 0) return false;
    return true;
  });

  const filteredProperties = allProperties.filter(p => {
    if (s && !p.name.toLowerCase().includes(s) && !p.masterMeter.toLowerCase().includes(s) && !p.landlordName.toLowerCase().includes(s)) return false;
    if (filterLandlord && p.landlordId !== filterLandlord) return false;
    return true;
  });

  const filteredMeters = allMeters.filter(m => {
    if (s && !m.id.toLowerCase().includes(s) && !m.unit.toLowerCase().includes(s)) return false;
    if (filterLandlord && !allProperties.find(p => p.id === m.propertyId && p.landlordId === filterLandlord)) return false;
    if (filterProperty && m.propertyId !== filterProperty) return false;
    if (filterBilling && m.billing !== filterBilling) return false;
    if (filterStatus && m.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      {showAddLandlord && <AddLandlordDrawer onClose={() => setShowAddLandlord(false)} onSave={l => setExtraLandlords(prev => [...prev, l])} />}
      {showAddProperty && <AddPropertyDrawer onClose={() => setShowAddProperty(false)} onSave={(pid, p, lName) => setExtraProperties(prev => [...prev, { ...p, landlordId: pid, landlordName: lName }])} />}
      {showAddMeter && <AddMeterDrawer defaultPropertyId={addMeterPropertyId} onClose={() => { setShowAddMeter(false); setAddMeterPropertyId(undefined); }} onSave={(pid, m) => { const prop = allProperties.find(p => p.id === pid); setExtraMeters(prev => [...prev, { ...m, propertyId: pid, propertyName: prop?.name ?? "", landlordName: prop?.landlordName ?? "", masterMeter: prop?.masterMeter ?? "" }]); }} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#0F1F3D]">Properties & Meters</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">{allLandlords.length} landlords · {allProperties.length} properties · {allMeters.length} sub-meters</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setAddMeterPropertyId(undefined); setShowAddMeter(true); }} className="flex items-center gap-1.5 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-3 py-2 rounded-lg text-xs font-semibold transition-colors"><Plus size={12} />Add Meter</button>
          <button onClick={() => setShowAddProperty(true)} className="flex items-center gap-1.5 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-3 py-2 rounded-lg text-xs font-semibold transition-colors"><Plus size={12} />Add Property</button>
          <button onClick={() => setShowAddLandlord(true)} className="flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#155c33] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"><Plus size={13} />Add Landlord</button>
        </div>
      </div>

      {/* Tabs + filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-xl p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); setFilterSettlement(""); setFilterLandlord(""); setFilterBilling(""); setFilterStatus(""); setFilterProperty(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? "bg-white shadow-sm text-[#0F1F3D] border border-[rgba(15,31,61,0.08)]" : "text-[#6B7280] hover:text-[#0F1F3D]"}`}>
              {t.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-[#0F1F3D] text-white" : "bg-[rgba(15,31,61,0.08)] text-[#6B7280]"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={13} className="text-[#9CA3AF] shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === "landlords" ? "Search by name or phone…" : tab === "properties" ? "Search by name or master meter…" : "Search by meter ID or unit…"}
            className="bg-transparent text-xs text-[#374151] placeholder:text-[#9CA3AF] outline-none w-full" />
          {search && <button onClick={() => setSearch("")}><X size={12} className="text-[#9CA3AF]" /></button>}
        </div>

        {tab === "landlords" && (
          <Select value={filterSettlement} onChange={setFilterSettlement} placeholder="All Statuses" options={[{ value: "pending", label: "Pending Settlement" }, { value: "settled", label: "Fully Settled" }]} />
        )}
        {(tab === "properties" || tab === "meters") && (
          <Select value={filterLandlord} onChange={v => { setFilterLandlord(v); setFilterProperty(""); }} placeholder="All Landlords" options={LANDLORDS.map(l => ({ value: l.id, label: l.name }))} />
        )}
        {tab === "meters" && (
          <>
            <Select value={filterProperty} onChange={setFilterProperty} placeholder="All Properties" options={allProperties.filter(p => !filterLandlord || p.landlordId === filterLandlord).map(p => ({ value: p.id, label: p.name }))} />
            <Select value={filterBilling} onChange={setFilterBilling} placeholder="All Billing" options={[{ value: "Prepay", label: "Prepay" }, { value: "Postpay", label: "Postpay" }]} />
            <Select value={filterStatus} onChange={setFilterStatus} placeholder="All Statuses" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} />
          </>
        )}
        {(search || filterSettlement || filterLandlord || filterProperty || filterBilling || filterStatus) && (
          <button onClick={() => { setSearch(""); setFilterSettlement(""); setFilterLandlord(""); setFilterProperty(""); setFilterBilling(""); setFilterStatus(""); }} className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#0F1F3D]"><X size={12} />Clear</button>
        )}
      </div>

      {/* ── Landlords table (with inline expansion) ── */}
      {tab === "landlords" && (
        <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
              {["Landlord", "Contact", "Properties", "Meters", "Payment", "Settlement", ""].map(h => <th key={h} className="px-5 py-3 text-left whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {filteredLandlords.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-xs text-[#9CA3AF]">No landlords match your search.</td></tr>}
              {filteredLandlords.map(l => {
                const totalM = l.properties.flatMap(p => p.units).length;
                const activeM = l.properties.flatMap(p => p.units).filter(u => u.status === "Active").length;
                const expanded = expandedLandlordId === l.id;
                return (
                  <>
                  <tr key={l.id} onClick={() => setExpandedLandlordId(expanded ? null : l.id)} className={`border-t border-[rgba(15,31,61,0.04)] transition-colors cursor-pointer group ${expanded ? "bg-[#F0FAF4]" : "hover:bg-[#F7F8FA]"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0F1F3D] flex items-center justify-center text-white text-[10px] font-bold shrink-0">{l.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
                        <div><div className="text-sm font-semibold text-[#0F1F3D]">{l.name}</div><div className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">{l.idNumber}</div></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="text-xs text-[#374151]">{l.contact}</div><div className="text-[10px] text-[#9CA3AF] mt-0.5">{l.email}</div></td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#0F1F3D]">{l.properties.length}</td>
                    <td className="px-5 py-4"><div className="text-xs font-semibold text-[#0F1F3D]">{activeM}<span className="text-[#9CA3AF] font-normal">/{totalM}</span></div><div className="text-[10px] text-[#9CA3AF]">active</div></td>
                    <td className="px-5 py-4"><div className="font-mono text-[10px] text-[#374151]">{fmtPayment(l)}</div><div className="text-[10px] text-[#9CA3AF] mt-0.5">{l.paymentMethod}</div></td>
                    <td className="px-5 py-4">
                      {l.pendingSettlement > 0
                        ? <div><div className="text-xs font-bold text-amber-600">KES {l.pendingSettlement.toLocaleString()}</div><div className="text-[10px] text-amber-500">pending</div></div>
                        : <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle2 size={11} />Settled</span>
                      }
                    </td>
                    <td className="px-5 py-4"><Eye size={13} className="text-[#9CA3AF] group-hover:text-[#1A6B3C] transition-colors" /></td>
                  </tr>
                  {expanded && (
                  <tr key={`${l.id}-detail`}>
                    <td colSpan={7} className="px-5 py-4 bg-[#F7F8FA] border-t border-[rgba(15,31,61,0.08)]">
                      <div className="max-h-[400px] overflow-y-auto">
                        <div className="flex flex-col gap-4">
                          {/* Close header */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#0F1F3D]">Landlord Details</span>
                            <button onClick={() => setExpandedLandlordId(null)} className="text-[10px] text-[#1A6B3C] font-semibold hover:underline flex items-center gap-1"><ChevronUp size={12} />Collapse</button>
                          </div>

                          {/* Edit view */}
                          {editLandlordId === l.id && (
                            <div className="bg-white rounded-xl border border-[rgba(15,31,61,0.08)] p-4 grid grid-cols-3 gap-3">
                              {([["Full Name", "name"], ["Phone", "contact"], ["Email", "email"], ["ID Number", "idNumber"]] as [string,string][]).map(([label, key]) => (
                                <div key={key}>
                                  <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{label}</label>
                                  <input value={editLandlordForm[key as keyof typeof editLandlordForm] as string} onChange={e => setEditLandlordForm(f => ({ ...f, [key]: e.target.value }))}
                                    className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]" />
                                </div>
                              ))}
                              <div>
                                <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Payment Method</label>
                                <div className="flex gap-2">
                                  {["M-Pesa Paybill", "Bank Transfer"].map(m => (
                                    <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                                      <input type="radio" name="el_pm" value={m} checked={editLandlordForm.paymentMethod === m} onChange={() => setEditLandlordForm(f => ({ ...f, paymentMethod: m }))} className="accent-[#1A6B3C]" />
                                      <span className="text-[10px] text-[#374151] font-medium">{m === "M-Pesa Paybill" ? "M-Pesa" : "Bank"}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              {editLandlordForm.paymentMethod === "M-Pesa Paybill" && (
                                <><div><label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Paybill</label><input value={editLandlordForm.paybillNumber} onChange={e => setEditLandlordForm(f => ({ ...f, paybillNumber: e.target.value }))} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]" /></div>
                                <div><label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Account</label><input value={editLandlordForm.paybillAccount} onChange={e => setEditLandlordForm(f => ({ ...f, paybillAccount: e.target.value }))} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]" /></div></>
                              )}
                              {editLandlordForm.paymentMethod === "Bank Transfer" && (
                                <>                                <div><label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Bank Name</label><input value={editLandlordForm.bankName} onChange={e => setEditLandlordForm(f => ({ ...f, bankName: e.target.value }))} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]" /></div>
                                <div><label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Account Name</label><input value={editLandlordForm.bankAccountName} onChange={e => setEditLandlordForm(f => ({ ...f, bankAccountName: e.target.value }))} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]" /></div>
                                <div><label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Account</label><input value={editLandlordForm.bankAccount} onChange={e => setEditLandlordForm(f => ({ ...f, bankAccount: e.target.value }))} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]" /></div></>
                              )}
                              <div className="flex items-end gap-2 col-span-3">
                                <button onClick={() => setEditLandlordId(null)} className="flex-1 border border-[rgba(15,31,61,0.15)] text-[#374151] py-2 rounded-lg text-xs font-semibold hover:bg-white transition-colors">Cancel</button>
                                <button onClick={() => {
                                  const idx = extraLandlords.findIndex(el => el.id === l.id);
                                  if (idx >= 0) {
                                    const updated = [...extraLandlords];
                                    updated[idx] = { ...updated[idx], ...editLandlordForm, paymentMethod: editLandlordForm.paymentMethod as Landlord["paymentMethod"] };
                                    setExtraLandlords(updated);
                                  }
                                  setEditLandlordId(null);
                                }} className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2 rounded-lg text-xs font-semibold transition-colors">Save</button>
                              </div>
                            </div>
                          )} {editLandlordId !== l.id && (
                            <div className="flex items-start justify-between">
                              <div className="grid grid-cols-3 gap-3 flex-1">
                                {[["Phone", l.contact], ["Email", l.email], ["ID Number", l.idNumber], ["Payment Method", l.paymentMethod], ["Settlement Account", fmtPayment(l)], ["Last Settled", l.lastSettled]].map(([label, v]) => (
                                  <div key={label} className="bg-white rounded-xl p-3 border border-[rgba(15,31,61,0.06)]"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">{label}</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{v}</div></div>
                                ))}
                                {l.paymentMethod === "M-Pesa Paybill" && (
                                  <><div className="bg-white rounded-xl p-3 border border-[rgba(15,31,61,0.06)]"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Paybill No.</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{l.paybillNumber ?? "—"}</div></div>
                                  <div className="bg-white rounded-xl p-3 border border-[rgba(15,31,61,0.06)]"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Account No.</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{l.paybillAccount ?? "—"}</div></div></>
                                )}
                                {l.paymentMethod === "Bank Transfer" && (
                                  <><div className="bg-white rounded-xl p-3 border border-[rgba(15,31,61,0.06)]"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Bank Name</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{l.bankName ?? "—"}</div></div>
                                  <div className="bg-white rounded-xl p-3 border border-[rgba(15,31,61,0.06)]"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Account Name</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{l.bankAccountName ?? "—"}</div></div>
                                  <div className="bg-white rounded-xl p-3 border border-[rgba(15,31,61,0.06)]"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Account No.</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{l.bankAccount ?? "—"}</div></div></>
                                )}
                              </div>
                              <button onClick={() => { setEditLandlordForm({ name: l.name, contact: l.contact, email: l.email, idNumber: l.idNumber, paymentMethod: l.paymentMethod, paybillNumber: l.paybillNumber ?? "", paybillAccount: l.paybillAccount ?? "", bankName: l.bankName ?? "", bankAccount: l.bankAccount ?? "", bankAccountName: l.bankAccountName ?? "" }); setEditLandlordId(l.id); }} className="ml-3 flex items-center gap-1 text-xs text-[#1A6B3C] font-semibold hover:underline shrink-0"><Pencil size={12} />Edit</button>
                            </div>
                          )}

                          {l.pendingSettlement > 0 && (
                            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                              <span className="text-xs text-amber-800 font-medium">KES {l.pendingSettlement.toLocaleString()} pending settlement</span>
                              <Badge variant="amber">Pending</Badge>
                            </div>
                          )}

                          <button onClick={() => { setTab("properties"); setFilterLandlord(l.id); setFilterProperty(""); setExpandedLandlordId(null); }} className="flex items-center justify-center gap-2 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors"><Building2 size={14} />View {l.properties.length} Propert{l.properties.length === 1 ? "y" : "ies"}</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  )}
                  </>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-[rgba(15,31,61,0.06)]">
            <span className="text-[11px] text-[#9CA3AF]">Showing {filteredLandlords.length} of {allLandlords.length} landlords</span>
          </div>
        </div>
      )}

      {/* ── Properties table (inline expansion + edit) ── */}
      {tab === "properties" && (
        <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
              {["Property", "Landlord", "Address", "Master Meter", "Units", "Active Meters", ""].map(h => <th key={h} className="px-5 py-3 text-left whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {filteredProperties.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-xs text-[#9CA3AF]">No properties match your search.</td></tr>}
              {filteredProperties.map(p => {
                const active = p.units.filter(u => u.status === "Active").length;
                const expanded = expandedPropertyId === p.id;
                const editing = editPropertyId === p.id;
                return (
                  <>
                  <tr key={p.id} onClick={() => setExpandedPropertyId(expanded ? null : p.id)} className={`border-t border-[rgba(15,31,61,0.04)] transition-colors cursor-pointer group ${expanded ? "bg-[#F0FAF4]" : "hover:bg-[#F7F8FA]"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F0FAF4] flex items-center justify-center text-[#1A6B3C] shrink-0"><Building2 size={13} /></div>
                        <div className="text-sm font-semibold text-[#0F1F3D]">{p.name}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#6B7280]">{p.landlordName}</td>
                    <td className="px-5 py-4 text-xs text-[#374151]">{p.address}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#0F1F3D]">{p.masterMeter}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#0F1F3D]">{p.units.length}</td>
                    <td className="px-5 py-4"><Badge variant={active === p.units.length ? "green" : "amber"}>{active}/{p.units.length} active</Badge></td>
                    <td className="px-5 py-4">
                      <button onClick={e => { e.stopPropagation(); setAddMeterPropertyId(p.id); setShowAddMeter(true); }} className="text-[10px] text-[#1A6B3C] font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">+ Add Meter</button>
                    </td>
                  </tr>
                  {expanded && (
                  <tr key={`${p.id}-detail`}>
                    <td colSpan={7} className="px-5 py-4 bg-[#F7F8FA] border-t border-[rgba(15,31,61,0.08)]">
                      <div className="max-h-[400px] overflow-y-auto">
                        <div className="flex flex-col gap-4">
                          {/* Close header */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#0F1F3D]">Property Details</span>
                            <button onClick={() => setExpandedPropertyId(null)} className="text-[10px] text-[#1A6B3C] font-semibold hover:underline flex items-center gap-1"><ChevronUp size={12} />Collapse</button>
                          </div>
                          {editing ? (
                            <div className="bg-white rounded-xl border border-[rgba(15,31,61,0.08)] p-4 grid grid-cols-3 gap-3">
                              {([["Property Name", "name", "e.g. Sunset Apartments"], ["Address", "address", "e.g. Kileleshwa, Nairobi"], ["Master Meter", "masterMeter", "e.g. KPLC-9921-A"]] as [string,string,string][]).map(([label, key, ph]) => (
                                <div key={key}>
                                  <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{label}</label>
                                  <input value={editPropertyForm[key as keyof typeof editPropertyForm]} onChange={e => setEditPropertyForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                                    className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2 text-xs text-[#0F1F3D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1A6B3C]" />
                                </div>
                              ))}
                              <div className="flex items-end gap-2">
                                <button onClick={() => { setEditPropertyId(null); }} className="flex-1 border border-[rgba(15,31,61,0.15)] text-[#374151] py-2 rounded-lg text-xs font-semibold hover:bg-white transition-colors">Cancel</button>
                                <button onClick={() => {
                                  if (editPropertyId === p.id) {
                                    const idx = extraProperties.findIndex(ep => ep.id === p.id);
                                    if (idx >= 0) {
                                      const updated = [...extraProperties];
                                      updated[idx] = { ...updated[idx], ...editPropertyForm };
                                      setExtraProperties(updated);
                                    }
                                  }
                                  setEditPropertyId(null);
                                }} className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2 rounded-lg text-xs font-semibold transition-colors">Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="grid grid-cols-3 gap-3 flex-1">
                                {[["Address", p.address], ["Landlord", p.landlordName], ["Master Meter", p.masterMeter]].map(([label, v]) => (
                                  <div key={label} className="bg-white rounded-xl p-3 border border-[rgba(15,31,61,0.06)]"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">{label}</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{v}</div></div>
                                ))}
                              </div>
                              <button onClick={e => { e.stopPropagation(); setEditPropertyForm({ name: p.name, address: p.address, masterMeter: p.masterMeter }); setEditPropertyId(p.id); }} className="ml-3 flex items-center gap-1 text-xs text-[#1A6B3C] font-semibold hover:underline shrink-0"><Pencil size={12} />Edit</button>
                            </div>
                          )}

                          {/* Meters list */}
                          <div>
                            <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">Sub-Meters ({p.units.length})</div>
                            {p.units.length === 0
                              ? <div className="text-xs text-[#9CA3AF] py-3 text-center bg-white rounded-xl border border-[rgba(15,31,61,0.06)]">No meters added yet.</div>
                              : p.units.map(u => (
                              <div key={u.id} className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[rgba(15,31,61,0.05)] last:border-0 text-xs">
                                <div><span className="font-mono font-semibold text-[#0F1F3D]">{u.id}</span><span className="text-[#9CA3AF] ml-2">{u.unit}</span></div>
                                <div className="flex items-center gap-2"><StatusBadge status={u.billing} /><StatusBadge status={u.status} /></div>
                              </div>
                            ))}
                          </div>

                          <button onClick={() => { setAddMeterPropertyId(p.id); setShowAddMeter(true); }} className="flex items-center justify-center gap-1.5 border border-dashed border-[rgba(15,31,61,0.2)] text-[#6B7280] hover:border-[#1A6B3C] hover:text-[#1A6B3C] py-2.5 rounded-xl text-xs font-semibold transition-colors"><Plus size={12} />Add Meter to {p.name}</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  )}
                  </>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-[rgba(15,31,61,0.06)]">
            <span className="text-[11px] text-[#9CA3AF]">Showing {filteredProperties.length} of {allProperties.length} properties</span>
          </div>
        </div>
      )}

      {/* ── Meters table ── */}
      {tab === "meters" && (
        <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
              {["Meter ID", "Unit", "Property", "Landlord", "Billing", "Product", "Last Txn", "Status", ""].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {filteredMeters.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-xs text-[#9CA3AF]">No meters match your filters.</td></tr>}
              {filteredMeters.map(m => (
                <tr key={m.id} className="border-t border-[rgba(15,31,61,0.04)] hover:bg-[#F7F8FA] transition-colors group">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0F1F3D]">{m.id}</td>
                  <td className="px-4 py-3"><div className="text-xs font-medium text-[#374151]">{m.unit}</div></td>
                  <td className="px-4 py-3 text-xs text-[#374151]">{m.propertyName}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">{m.landlordName}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.billing} /></td>
                  <td className="px-4 py-3 text-xs text-[#374151]">{m.product}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">{m.lastTxn}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3"><button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0FAF4] text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-[rgba(15,31,61,0.06)]">
            <span className="text-[11px] text-[#9CA3AF]">Showing {filteredMeters.length} of {allMeters.length} meters</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INVOICES
// ══════════════════════════════════════════════════════════════════════════════

type Invoice = {
  id: string; meter: string; property: string; unit: string;
  period: string; units: number; amount: number;
  status: "Draft" | "Pending" | "Paid" | "Partially Paid" | "Void";
  phone: string;
};

const INVOICES: Invoice[] = [
  { id: "INV-2220", meter: "MPY-00512", property: "Sunset Apartments", unit: "Flat 11A", period: "June 2026", units: 312, amount: 4250, status: "Pending", phone: "+254 712 345 678" },
  { id: "INV-2219", meter: "MPY-00290", property: "Garden Estate", unit: "House 4", period: "June 2026", units: 187, amount: 2800, status: "Pending", phone: "+254 722 111 333" },
  { id: "INV-2218", meter: "MPY-00562", property: "Riverside Court", unit: "Unit 14", period: "June 2026", units: 430, amount: 6100, status: "Paid", phone: "+254 733 222 444" },
  { id: "INV-2215", meter: "MPY-00290", property: "Garden Estate", unit: "House 4", period: "May 2026", units: 201, amount: 3050, status: "Partially Paid", phone: "+254 722 111 333" },
  { id: "INV-2210", meter: "MPY-00512", property: "Sunset Apartments", unit: "Flat 11A", period: "May 2026", units: 298, amount: 4100, status: "Paid", phone: "+254 712 345 678" },
  { id: "INV-2201", meter: "MPY-00562", property: "Riverside Court", unit: "Unit 14", period: "April 2026", units: 380, amount: 5400, status: "Void", phone: "+254 733 222 444" },
  { id: "INV-2198", meter: "MPY-00309", property: "Sunset Apartments", unit: "Flat 6C", period: "June 2026", units: 155, amount: 2300, status: "Draft", phone: "+254 799 000 111" },
];

function InvoiceDrawer({ inv, onClose }: { inv: Invoice; onClose: () => void }) {
  return (
    <Drawer open title={`Invoice ${inv.id}`} onClose={onClose}>
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-xl">
          <div><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1">Status</div><StatusBadge status={inv.status} /></div>
          <div className="text-right"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1">Total Amount</div><div className="text-xl font-bold text-[#0F1F3D]">KES {inv.amount.toLocaleString()}</div></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[["Invoice #", inv.id], ["Meter", inv.meter], ["Property", inv.property], ["Unit", inv.unit], ["Period", inv.period], ["Units (kWh)", inv.units + " kWh"]].map(([l, v]) => (
            <div key={l} className="bg-[#F7F8FA] rounded-lg p-3">
              <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">{l}</div>
              <div className="text-xs font-semibold text-[#0F1F3D] font-mono">{v}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-[#F0FAF4] border border-green-200 rounded-xl px-4 py-3">
          <div><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Consumption ({inv.units} kWh)</div><div className="font-mono text-lg font-bold text-[#0F1F3D]">KES {inv.amount.toLocaleString()}.00</div></div>
          <div className="text-right"><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">Total Due</div><div className="font-mono text-lg font-bold text-[#1A6B3C]">KES {inv.amount.toLocaleString()}.00</div></div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">Actions</div>
          {inv.status !== "Paid" && inv.status !== "Void" && (
            <button className="flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#155c33] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors">
              <CheckCircle2 size={13} />Mark as Paid
            </button>
          )}
          <button className="flex items-center gap-2 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors">
            <Send size={13} />Send SMS Reminder to {inv.phone}
          </button>
          <button className="flex items-center gap-2 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors">
            <Printer size={13} />Download PDF
          </button>
          {inv.status !== "Void" && (
            <button className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors">
              <Ban size={13} />Void Invoice
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}

function InvoicesScreen() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);

  const filtered = INVOICES.filter(inv => !statusFilter || inv.status === statusFilter);

  const statusVariant: Record<string, string> = {
    Paid: "green", Pending: "amber", Draft: "gray", "Partially Paid": "amber", Void: "red",
  };

  return (
    <div className="flex flex-col gap-5">
      {selectedInv && <InvoiceDrawer inv={selectedInv} onClose={() => setSelectedInv(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#0F1F3D]">Invoices</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Postpay meter billing — generate, track, and collect</p>
        </div>
        <button onClick={() => setShowGenerate(true)} className="flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#155c33] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
          <Plus size={13} />Generate Invoices
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white border border-[rgba(15,31,61,0.08)] rounded-xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Filter size={14} className="text-[#9CA3AF] shrink-0" />
        <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Statuses" options={["Draft", "Pending", "Paid", "Partially Paid", "Void"].map(s => ({ value: s, label: s }))} />
        <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-3 py-2">
          <Calendar size={12} className="text-[#9CA3AF]" />
          <input type="month" defaultValue="2026-06" className="bg-transparent text-xs text-[#374151] outline-none" />
        </div>
        {statusFilter && <button onClick={() => setStatusFilter("")} className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#0F1F3D]"><X size={12} />Clear</button>}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"><Download size={12} />Export CSV</button>
        </div>
      </div>

      <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
              {["Invoice #", "Meter No.", "Property", "Unit", "Period", "kWh", "Total Amount", "Status", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} onClick={() => setSelectedInv(inv)} className="border-t border-[rgba(15,31,61,0.04)] hover:bg-[#F7F8FA] transition-colors cursor-pointer group">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0F1F3D]">{inv.id}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{inv.meter}</td>
                <td className="px-4 py-3 text-xs text-[#374151]">{inv.property}</td>
                <td className="px-4 py-3 text-xs text-[#6B7280]">{inv.unit}</td>
                <td className="px-4 py-3 text-xs text-[#374151]">{inv.period}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#374151]">{inv.units}</td>
                <td className="px-4 py-3 text-xs font-semibold text-[#0F1F3D]">KES {inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge variant={(statusVariant[inv.status] || "gray") as any}>{inv.status}</Badge></td>
                <td className="px-4 py-3"><Eye size={13} className="text-[#9CA3AF] group-hover:text-[#1A6B3C] transition-colors" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-[rgba(15,31,61,0.06)] flex items-center justify-between">
          <span className="text-[11px] text-[#9CA3AF]">Showing {filtered.length} of {INVOICES.length} invoices</span>
          <div className="flex gap-4 text-[11px]">
            <span className="text-green-600 font-medium">Paid: KES {INVOICES.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0).toLocaleString()}</span>
            <span className="text-amber-600 font-medium">Outstanding: KES {INVOICES.filter(i => ["Pending", "Partially Paid"].includes(i.status)).reduce((s, i) => s + i.amount, 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Generate Invoices Modal */}
      {showGenerate && (
        <Drawer open title="Generate Postpay Invoices" onClose={() => setShowGenerate(false)}>
          <div className="p-6 flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 font-medium">
              Invoices will be generated for all active Postpay meters in the selected billing period. This action is reversible — invoices start as Draft.
            </div>
            {[["Billing Period", "month"], ["Properties", "select"]].map(([l, type]) => (
              <div key={l}>
                <label className="block text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1.5">{l}</label>
                {type === "month"
                  ? <input type="month" defaultValue="2026-06" className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]" />
                  : <select className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] focus:outline-none focus:border-[#1A6B3C]">
                      <option>All Properties</option>
                      {PROPERTIES.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                }
              </div>
            ))}
            <div className="bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-xl p-4">
              <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">Preview</div>
              <div className="flex justify-between text-xs"><span className="text-[#6B7280]">Postpay meters eligible</span><span className="font-semibold text-[#0F1F3D]">5 meters</span></div>
              <div className="flex justify-between text-xs mt-1.5"><span className="text-[#6B7280]">Invoices to generate</span><span className="font-semibold text-[#0F1F3D]">5 drafts</span></div>
            </div>
            <button className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white py-3 rounded-lg text-sm font-semibold transition-colors">Generate 5 Draft Invoices</button>
          </div>
        </Drawer>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════════════════════════════════════════

const REPORT_TYPES = [
  { id: "revenue", title: "Revenue Summary", desc: "Total revenue by date range — broken down by utility type, property, and payment source.", icon: <TrendingUp size={20} className="text-green-600" />, color: "bg-green-50" },
  { id: "token_sales", title: "Token Sales Breakdown", desc: "Volume and value of tokens vended by utility type (KPLC vs Water) and by property.", icon: <Zap size={20} className="text-blue-600" />, color: "bg-blue-50" },
  { id: "collection", title: "Invoice Collection Rate", desc: "Postpay meter performance — paid vs outstanding vs overdue invoices by period.", icon: <FileText size={20} className="text-violet-600" />, color: "bg-violet-50" },
  { id: "sms", title: "SMS Delivery Report", desc: "Token SMS success rate — sent vs failed vs retried, with per-property breakdown.", icon: <MessageSquare size={20} className="text-amber-600" />, color: "bg-amber-50" },
  { id: "source", title: "Transaction Source Breakdown", desc: "Volume and revenue split across STK Push, Paybill, and Manual Entry channels.", icon: <ArrowRightLeft size={20} className="text-[#0F1F3D]" />, color: "bg-[#F7F8FA]" },
];

function ReportsScreen() {
  const [dates, setDates] = useState<Record<string, { from: string; to: string }>>({});
  const [running, setRunning] = useState<string | null>(null);

  const getDate = (id: string) => dates[id] || { from: "2026-06-01", to: "2026-06-25" };
  const setDate = (id: string, key: "from" | "to", val: string) =>
    setDates(prev => ({ ...prev, [id]: { ...getDate(id), [key]: val } }));

  const handleRun = (id: string) => {
    setRunning(id);
    setTimeout(() => setRunning(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[#0F1F3D]">Reports</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Generate and export operational reports for any date range</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {REPORT_TYPES.map(r => {
          const d = getDate(r.id);
          const isRunning = running === r.id;
          return (
            <div key={r.id} className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>{r.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-[#0F1F3D]">{r.title}</div>
                  <div className="text-xs text-[#6B7280] mt-1 leading-relaxed">{r.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-xl p-3">
                <Calendar size={12} className="text-[#9CA3AF] shrink-0" />
                <input type="date" value={d.from} onChange={e => setDate(r.id, "from", e.target.value)} className="bg-transparent text-xs text-[#374151] outline-none flex-1" />
                <span className="text-[#D1D5DB] text-xs">→</span>
                <input type="date" value={d.to} onChange={e => setDate(r.id, "to", e.target.value)} className="bg-transparent text-xs text-[#374151] outline-none flex-1" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRun(r.id)} disabled={isRunning} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isRunning ? "bg-[#E8F5EE] text-[#1A6B3C] cursor-wait" : "bg-[#1A6B3C] hover:bg-[#155c33] text-white"}`}>
                  {isRunning ? <><RefreshCw size={12} className="animate-spin" />Generating…</> : "Run Report"}
                </button>
                <button className="flex items-center gap-1.5 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors">
                  <Download size={12} />CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════════════════════════════

type SettingsTab = "profile" | "products" | "sms" | "system";

const PRODUCTS = [
  { id: "P1", name: "KPLC Standard Prepay", type: "Prepay", utility: "KPLC", active: true },
  { id: "P2", name: "KPLC Postpay Monthly", type: "Postpay", utility: "KPLC", active: true },
  { id: "P3", name: "Nairobi Water Prepay", type: "Prepay", utility: "Water", active: true },
  { id: "P4", name: "Gas Token Standard", type: "Prepay", utility: "Gas", active: false },
];

const AUDIT_LOG = [
  { time: "2026-06-25 09:42", user: "James Kariuki", action: "Vended KPLC token", detail: "MPY-00421 · KES 500" },
  { time: "2026-06-25 09:21", user: "James Kariuki", action: "Vended KPLC token", detail: "MPY-00512 · KES 1,000" },
  { time: "2026-06-25 08:44", user: "James Kariuki", action: "Vend attempt failed", detail: "MPY-00103 · KES 750" },
  { time: "2026-06-24 18:22", user: "Admin System", action: "Generated invoices", detail: "5 draft invoices for June 2026" },
  { time: "2026-06-24 16:10", user: "James Kariuki", action: "Marked invoice paid", detail: "INV-2218 · KES 6,100" },
  { time: "2026-06-24 11:05", user: "Admin System", action: "SMS gateway health check", detail: "All systems OK" },
];

function SettingsScreen() {
  const [tab, setTab] = useState<SettingsTab>("profile");

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={14} /> },
    { id: "products", label: "Products", icon: <Package size={14} /> },
    { id: "sms", label: "SMS & Notifications", icon: <MessageCircle size={14} /> },
    { id: "system", label: "System", icon: <Terminal size={14} /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[#0F1F3D]">Settings</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Platform configuration, products, notifications, and audit</p>
      </div>

      <div className="flex gap-1 bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? "bg-white shadow-sm text-[#0F1F3D] border border-[rgba(15,31,61,0.08)]" : "text-[#6B7280] hover:text-[#0F1F3D]"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <div className="grid grid-cols-2 gap-4">
          <SectionCard title="Agent Profile">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-[#F7F8FA] rounded-xl">
                <div className="w-14 h-14 rounded-2xl bg-[#1A6B3C] flex items-center justify-center text-white text-xl font-bold shrink-0">JK</div>
                <div><div className="text-base font-semibold text-[#0F1F3D]">James Kariuki</div><div className="text-xs text-[#6B7280] mt-0.5">+254 712 000 999</div><Badge variant="navy" >Admin Agent</Badge></div>
              </div>
              {[["Full Name", "James Kariuki"], ["Email", "james.kariuki@mpaya.co.ke"], ["Phone", "+254 712 000 999"], ["Role", "Admin Agent"], ["Agent ID", "AGT-0042"]].map(([l, v]) => (
                <div key={l}>
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{l}</div>
                  <div className="bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-lg px-4 py-2.5 text-sm text-[#374151] font-mono">{v}</div>
                </div>
              ))}
              <p className="text-[10px] text-[#9CA3AF]">Profile fields are read-only for non-superadmin roles. Contact your system administrator to update.</p>
            </div>
          </SectionCard>

          <SectionCard title="Access & Security">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {[["Two-Factor Auth", "Enabled via SMS", "green"], ["Last Login", "2026-06-25, 08:30 AM", "gray"], ["IP Address", "197.248.44.12", "gray"], ["Session Expires", "In 6 hours", "gray"]].map(([l, v, c]) => (
                  <div key={l as string} className="flex items-center justify-between py-3 border-b border-[rgba(15,31,61,0.05)] last:border-0">
                    <div className="flex items-center gap-2"><Shield size={13} className="text-[#9CA3AF]" /><span className="text-xs font-medium text-[#374151]">{l as string}</span></div>
                    <Badge variant={(c as any)}>{v as string}</Badge>
                  </div>
                ))}
              </div>
              <button className="w-full border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] py-2.5 rounded-lg text-xs font-semibold transition-colors">Change Password</button>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Products */}
      {tab === "products" && (
        <SectionCard title="Active Products" action={
          <button className="flex items-center gap-1.5 bg-[#1A6B3C] hover:bg-[#155c33] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"><Plus size={11} />Add Product</button>
        }>
          <table className="w-full">
            <thead><tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
              {["Product Name", "Type", "Utility", "Status", ""].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {PRODUCTS.map(p => (
                <tr key={p.id} className="border-t border-[rgba(15,31,61,0.04)] hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-[#0F1F3D]">{p.name}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.type} /></td>
                  <td className="px-5 py-3.5 text-xs text-[#374151]">{p.utility}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.active ? "Active" : "Inactive"} /></td>
                  <td className="px-5 py-3.5"><button className="flex items-center gap-1 text-xs text-[#1A6B3C] font-medium hover:underline"><Pencil size={11} />Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {/* SMS & Notifications */}
      {tab === "sms" && (
        <div className="grid grid-cols-2 gap-4">
          <SectionCard title="SMS Gateway">
            <div className="p-5 flex flex-col gap-4">
              {[["Gateway Provider", "Africa's Talking"], ["API Key", "•••••••••••••••••••"], ["Sender ID", "M-PAYA"]].map(([l, v]) => (
                <div key={l}>
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{l}</div>
                  <input defaultValue={v} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-sm text-[#0F1F3D] font-mono focus:outline-none focus:border-[#1A6B3C]" />
                </div>
              ))}
              <div className="flex gap-2">
                <button className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors">Save Gateway</button>
                <button className="flex items-center gap-1.5 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"><Phone size={12} />Test SMS</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Notification Templates">
            <div className="p-5 flex flex-col gap-4">
              {[["Token Delivery", "Your {utility} token for meter {meter_no} is: {token}. Units: {kwh} kWh. Powered by M-Paya."], ["Invoice Alert", "Invoice {invoice_no} of KES {amount} for {period} is due. Pay via M-Pesa Paybill {paybill_no}. M-Paya."], ["Invoice Reminder", "REMINDER: Invoice {invoice_no} of KES {amount} is overdue. Please pay to avoid disconnection. M-Paya."]].map(([l, v]) => (
                <div key={l as string}>
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-1">{l as string}</div>
                  <textarea defaultValue={v as string} rows={3} className="w-full bg-[#F7F8FA] border border-[rgba(15,31,61,0.1)] rounded-lg px-4 py-2.5 text-xs text-[#374151] font-mono focus:outline-none focus:border-[#1A6B3C] resize-none leading-relaxed" />
                </div>
              ))}
              <button className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors">Save Templates</button>
            </div>
          </SectionCard>
        </div>
      )}

      {/* System */}
      {tab === "system" && (
        <div className="grid grid-cols-[1fr_340px] gap-4">
          <SectionCard title="Audit Log" action={<button className="flex items-center gap-1.5 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"><Download size={11} />Export</button>}>
            <table className="w-full">
              <thead><tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
                {["Timestamp", "Agent", "Action", "Detail"].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}
              </tr></thead>
              <tbody>
                {AUDIT_LOG.map((entry, i) => (
                  <tr key={i} className="border-t border-[rgba(15,31,61,0.04)] hover:bg-[#F7F8FA] transition-colors">
                    <td className="px-5 py-3 font-mono text-[10px] text-[#9CA3AF] whitespace-nowrap">{entry.time}</td>
                    <td className="px-5 py-3 text-xs font-medium text-[#374151]">{entry.user}</td>
                    <td className="px-5 py-3 text-xs text-[#374151]">{entry.action}</td>
                    <td className="px-5 py-3 font-mono text-[10px] text-[#6B7280]">{entry.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <SectionCard title="Active Sessions">
            <div className="p-4 flex flex-col gap-3">
              {[{ agent: "James Kariuki", device: "Chrome · Mac OS", ip: "197.248.44.12", since: "08:30 AM", current: true }, { agent: "Admin System", device: "Server Process", ip: "10.0.0.1", since: "00:00 AM", current: false }].map((s, i) => (
                <div key={i} className={`p-3 rounded-xl border ${s.current ? "border-[#1A6B3C] bg-[#F0FAF4]" : "border-[rgba(15,31,61,0.08)] bg-[#F7F8FA]"}`}>
                  <div className="flex items-start justify-between">
                    <div><div className="text-xs font-semibold text-[#0F1F3D]">{s.agent}</div><div className="text-[10px] text-[#9CA3AF] mt-0.5">{s.device}</div></div>
                    {s.current && <Badge variant="green">Current</Badge>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[10px] font-mono text-[#9CA3AF]">{s.ip} · since {s.since}</div>
                    {!s.current && <button className="text-[10px] text-red-600 font-semibold hover:underline">Revoke</button>}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SETTLEMENTS  (formerly Disbursements — now landlord-centric, one-click)
// ══════════════════════════════════════════════════════════════════════════════

function SettlementsScreen() {
  const [viewing, setViewing] = useState<Landlord | null>(null);
  const [confirming, setConfirming] = useState<Landlord | null>(null);
  const [settled, setSettled] = useState<Set<string>>(new Set());

  const totalCollected = LANDLORDS.reduce((s, l) => s + l.totalCollected, 0);
  const totalSettled = LANDLORDS.reduce((s, l) => s + (l.totalCollected - l.pendingSettlement), 0);
  const totalPending = LANDLORDS.reduce((s, l) => s + l.pendingSettlement, 0);
  const pendingCount = LANDLORDS.filter(l => l.pendingSettlement > 0 && !settled.has(l.id)).length;

  return (
    <div className="flex flex-col gap-5">

      {/* Detail drawer: properties + settlement history */}
      {viewing && (
        <Drawer open title={viewing.name} onClose={() => setViewing(null)}>
          <div className="p-6 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-xl p-4">
              {([["Contact", viewing.contact], ["Email", viewing.email], ["Payment Method", viewing.paymentMethod], ["Settlement Account", fmtPayment(viewing)]] as [string,string][]).map(([l, v]) => (
                <div key={l}><div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-0.5">{l}</div><div className="text-xs font-semibold text-[#0F1F3D] font-mono">{v}</div></div>
              ))}
            </div>

            <div>
              <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">Properties ({viewing.properties.length})</div>
              <div className="flex flex-col gap-2">
                {viewing.properties.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-xl px-4 py-3">
                    <div>
                      <div className="text-xs font-semibold text-[#0F1F3D]">{p.name}</div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1"><Home size={9} />{p.address}</span>
                        <span className="flex items-center gap-1"><Gauge size={9} />{p.masterMeter}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-green-600 font-medium">{p.units.filter(u => u.status === "Active").length}/{p.units.length}</div>
                      <div className="text-[10px] text-[#9CA3AF]">active meters</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">Settlement History</div>
              <div className="border border-[rgba(15,31,61,0.08)] rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold px-4 py-2.5 border-b border-[rgba(15,31,61,0.06)]">
                  <span>Date</span><span>Amount</span><span>Ref</span>
                </div>
                {viewing.settlementHistory.length === 0
                  ? <div className="px-4 py-6 text-center text-xs text-[#9CA3AF]">No settlements recorded yet.</div>
                  : viewing.settlementHistory.map(s => (
                    <div key={s.id} className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 border-b border-[rgba(15,31,61,0.04)] last:border-0 items-center">
                      <div>
                        <div className="text-xs font-medium text-[#374151]">{s.date}</div>
                        <div className="text-[10px] text-[#9CA3AF] mt-0.5">{s.method}</div>
                      </div>
                      <div className="font-mono text-xs font-bold text-green-600">KES {s.amount.toLocaleString()}</div>
                      <div className="font-mono text-[10px] text-[#9CA3AF]">{s.ref}</div>
                    </div>
                  ))
                }
                {viewing.settlementHistory.length > 0 && (
                  <div className="flex justify-between px-4 py-2.5 bg-[#F7F8FA] border-t-2 border-[rgba(15,31,61,0.08)]">
                    <span className="text-xs text-[#6B7280] font-medium">Total settled to date</span>
                    <span className="font-mono text-xs font-bold text-[#0F1F3D]">KES {viewing.settlementHistory.reduce((s, r) => s + r.amount, 0).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {!settled.has(viewing.id) && viewing.pendingSettlement > 0 ? (
              <button onClick={() => { setConfirming(viewing); setViewing(null); }} className="w-full flex items-center justify-center gap-2 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-3 rounded-lg text-sm font-semibold transition-colors">
                <ChevronsRight size={16} />Settle KES {viewing.pendingSettlement.toLocaleString()} Now
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-semibold">
                <CheckCircle2 size={16} />All collections fully settled
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Confirm settle drawer */}
      {confirming && (
        <Drawer open title={`Confirm Settlement — ${confirming.name}`} onClose={() => setConfirming(null)}>
          <div className="p-6 flex flex-col gap-5">
            <div className="bg-[#0F1F3D] rounded-xl p-5 text-white">
              <div className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.4)] font-medium mb-4">Settlement Details</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  ["Landlord", confirming.name],
                  ["Payment Method", confirming.paymentMethod],
                  ["Settlement Account", fmtPayment(confirming)],
                  ["Last Settled", confirming.lastSettled],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide mb-0.5">{l}</div>
                    <div className="text-sm font-semibold text-white font-mono">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Total Collected", `KES ${confirming.totalCollected.toLocaleString()}`, "text-[#0F1F3D]"],
                ["Pending Settlement", `KES ${confirming.pendingSettlement.toLocaleString()}`, "text-amber-600"],
              ].map(([l, v, cls]) => (
                <div key={l as string} className="bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-xl p-4 text-center">
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1">{l as string}</div>
                  <div className={`font-mono text-lg font-bold ${cls as string}`}>{v as string}</div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 font-medium">
              This will send <strong>KES {confirming.pendingSettlement.toLocaleString()}</strong> to {confirming.name} via {fmtPayment(confirming)}. Confirm before proceeding.
            </div>

            {settled.has(confirming.id) ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-semibold">
                <CheckCircle2 size={16} />Settlement sent successfully
              </div>
            ) : (
              <button onClick={() => { setSettled(prev => new Set([...prev, confirming.id])); }}
                className="w-full flex items-center justify-center gap-2 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-4 rounded-lg text-base font-bold transition-colors shadow-md">
                <ChevronsRight size={18} />Settle KES {confirming.pendingSettlement.toLocaleString()} Now
              </button>
            )}
            <button className="w-full flex items-center justify-center gap-2 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] py-2.5 rounded-lg text-xs font-semibold transition-colors">
              <Download size={13} />Download Statement
            </button>
          </div>
        </Drawer>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#0F1F3D]">Settlements</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Click any row to view settlement history and all properties for that landlord</p>
        </div>
        <button className="flex items-center gap-2 border border-[rgba(15,31,61,0.15)] text-[#374151] hover:bg-[#F7F8FA] px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
          <Download size={13} />Export All
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Collected", value: `KES ${totalCollected.toLocaleString()}`, sub: "Across all landlords", bg: "bg-[#0F1F3D]", valCls: "text-white", subCls: "text-[rgba(255,255,255,0.5)]", labelCls: "text-[rgba(255,255,255,0.5)]" },
          { label: "Total Settled", value: `KES ${totalSettled.toLocaleString()}`, sub: "Successfully paid out", bg: "bg-green-50", valCls: "text-[#0F1F3D]", subCls: "text-[#6B7280]", labelCls: "text-[#6B7280]" },
          { label: "Pending Settlement", value: `KES ${totalPending.toLocaleString()}`, sub: `${pendingCount} landlord${pendingCount !== 1 ? "s" : ""} awaiting payout`, bg: "bg-amber-50", valCls: "text-amber-700", subCls: "text-amber-600", labelCls: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-5 border border-[rgba(15,31,61,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]`}>
            <div className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${k.labelCls}`}>{k.label}</div>
            <div className={`text-2xl font-bold tracking-tight ${k.valCls}`}>{k.value}</div>
            <div className={`text-xs mt-1 ${k.subCls}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Per-landlord rows */}
      <div className="bg-white border border-[rgba(15,31,61,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F8FA] text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">
              {["Landlord", "Properties", "Payment Details", "Total Collected", "Pending", "Last Settled", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LANDLORDS.map(l => {
              const isSettled = settled.has(l.id);
              const pending = isSettled ? 0 : l.pendingSettlement;
              return (
                <tr key={l.id} onClick={() => setViewing(l)} className="border-t border-[rgba(15,31,61,0.04)] hover:bg-[#F7F8FA] transition-colors cursor-pointer group">
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-[#0F1F3D]">{l.name}</div>
                    <div className="text-[10px] text-[#9CA3AF] mt-0.5">{l.contact}</div>
                  </td>
                  <td className="px-5 py-4">{l.properties.map(p => <div key={p.id} className="text-xs text-[#374151] leading-5">{p.name}</div>)}</td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-[10px] text-[#374151]">{fmtPayment(l)}</div>
                    <div className="text-[10px] text-[#9CA3AF] mt-0.5">{l.paymentMethod}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-[#0F1F3D]">KES {l.totalCollected.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    {pending > 0
                      ? <span className="font-mono text-xs font-bold text-amber-600">KES {pending.toLocaleString()}</span>
                      : <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle2 size={11} />Settled</span>
                    }
                  </td>
                  <td className="px-5 py-4 font-mono text-[10px] text-[#9CA3AF]">{isSettled ? "Today" : l.lastSettled}</td>
                  <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    {pending > 0
                      ? <button onClick={() => setConfirming(l)} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1A6B3C] bg-[#F0FAF4] border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 whitespace-nowrap transition-colors">
                          <ChevronsRight size={12} />Settle
                        </button>
                      : <span className="text-[10px] text-[#9CA3AF] group-hover:text-[#6B7280]">View history →</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");

  const pageTitles: Record<NavId, string> = {
    dashboard: "Dashboard", vend: "Vend Token", transactions: "Transactions",
    properties: "Properties & Meters", invoices: "Invoices", disbursements: "Settlements",
    reports: "Reports", settings: "Settings",
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F8FA]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 bg-[#0F1F3D] flex flex-col h-full">
        <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A6B3C] flex items-center justify-center"><Zap size={16} className="text-white" /></div>
            <span className="text-white font-bold text-base tracking-tight">M-Paya</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
          {navItems.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all relative ${isActive ? "text-white bg-[rgba(26,107,60,0.2)]" : "text-[rgba(255,255,255,0.55)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]"}`}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[#1A6B3C]" />}
                <span className={isActive ? "text-[#4ADE80]" : ""}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A6B3C] flex items-center justify-center text-white text-xs font-bold shrink-0">JK</div>
            <div className="min-w-0"><div className="text-white text-xs font-semibold truncate">James Kariuki</div><span className="text-[10px] text-[rgba(255,255,255,0.4)]">Admin Agent</span></div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-[rgba(15,31,61,0.08)] px-6 py-3.5 flex items-center gap-4 shrink-0">
          <h1 className="font-semibold text-[#0F1F3D] text-lg flex-1">{pageTitles[activeNav]}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[rgba(15,31,61,0.08)] rounded-lg px-3 py-1.5 w-52">
              <Search size={13} className="text-[#9CA3AF]" />
              <input placeholder="Search meters, properties..." className="bg-transparent text-xs text-[#374151] placeholder:text-[#9CA3AF] outline-none w-full" />
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F8FA] transition-colors text-[#6B7280]">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 border border-[rgba(15,31,61,0.1)] rounded-lg px-2.5 py-1.5">
              <div className="w-5 h-5 rounded-full bg-[#1A6B3C] flex items-center justify-center text-white text-[9px] font-bold">JK</div>
              <span className="text-xs text-[#374151] font-medium">James K.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-green-700">System Online</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "none" }}>
          {activeNav === "dashboard" && <DashboardScreen onNav={setActiveNav} />}
          {activeNav === "vend" && <VendTokenScreen />}
          {activeNav === "transactions" && <TransactionsScreen />}
          {activeNav === "properties" && <PropertiesScreen />}
          {activeNav === "invoices" && <InvoicesScreen />}
          {activeNav === "disbursements" && <SettlementsScreen />}
          {activeNav === "reports" && <ReportsScreen />}
          {activeNav === "settings" && <SettingsScreen />}
        </main>
      </div>
    </div>
  );
}
