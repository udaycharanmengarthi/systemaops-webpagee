import logo from "../assets/systemaops-icon-color.svg";
import LoginNetwork from "./LoginNetwork.jsx";

/* SYSTEMAOPS TECHNOLOGY ENVIRONMENT — living orchestration visual:
   six service capabilities around the central hub; one spoke at a
   time sends a thin light streak in, the hub answers, and the
   streak returns along the same line. Decorative only. */

export default function BrandExperience() {
  return (
    <section
      aria-label="SystemaOps technology"
      className="relative hidden overflow-hidden bg-[#050A0D] md:flex md:w-[45%] md:flex-col lg:w-[58%]"
    >
      {/* atmosphere: faint grid + controlled light */}
      <div aria-hidden="true" className="absolute inset-0 login-grid" />
      <div aria-hidden="true" className="absolute -left-32 top-[-10%] h-[24rem] w-[24rem] rounded-full bg-brand-600/[0.06] blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-[-20%] right-[-10%] h-80 w-80 rounded-full bg-white/[0.015] blur-3xl" />

      {/* top branding */}
      <div className="relative z-10 flex items-start justify-between px-8 pt-7 lg:px-11">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="SystemaOps" className="h-7 w-7" />
          <div className="leading-tight">
            <div className="text-[13px] font-bold tracking-[0.18em] text-white">SYSTEMAOPS</div>
            <div className="text-[10px] font-medium tracking-[0.24em] text-slate-400">OPERATIONS CONSOLE</div>
          </div>
        </div>
        <div className="hidden pt-1 text-[10px] font-medium tracking-[0.22em] text-slate-500 lg:block" aria-hidden="true">
          AUTOMATE • INTEGRATE • SCALE
        </div>
      </div>

      {/* living orchestration scene */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 py-2">
        <LoginNetwork />
      </div>

      {/* bottom statement */}
      <div className="relative z-10 px-8 pb-9 lg:px-11">
        <div className="text-[11px] font-semibold tracking-[0.3em] text-teal-300/80">
          SYSTEMS • AUTOMATION • INTELLIGENCE
        </div>
        <p className="mt-2.5 max-w-sm text-xl font-semibold leading-snug text-white">
          Technology that moves operations forward.
        </p>
      </div>
    </section>
  );
}
