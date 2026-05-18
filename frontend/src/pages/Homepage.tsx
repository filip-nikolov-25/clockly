import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Bell,
  Shield,
  BarChart3,
  Users,
  CheckCircle2,
  Zap,
  Lock,
  ArrowRight,
  MousePointerClick,
  Building2,
  Globe,
  Mail,
  Clock,
  TrendingUp,
} from "lucide-react";
import Wrapper from "../components/base/Wrapper";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import type {
  BentoItemProps,
  CheckItemProps,
  FeatureCardTypes,
  UserType,
} from "../interfaces/types";

const fadeInScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

interface Props {
  user: UserType | null;
}

const Homepage = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState<"employee" | "admin">("employee");

  return (
    <div className="text-slate-200 bg-[#050505] selection:bg-orange-500/30 font-sans antialiased overflow-x-hidden">
      <section className="relative flex items-center justify-center min-h-[95vh] pt-28 pb-16 lg:pt-36 px-6">
        <div className="absolute top-20 left-10 w-150 h-150 bg-orange-500/15 rounded-full blur-[140px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-125 h-125 bg-zinc-700/10 rounded-full blur-[120px] pointer-events-none" />

        <Wrapper>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
              className="relative z-10 lg:col-span-6 lg:text-left text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-zinc-800/80 mb-8 backdrop-blur-md shadow-2xl">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                  v2.4 Live • Multi-Company Isolated Architecture
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-none">
                Clockly<span className="text-orange-500">.</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
                The full-stack workforce OS.{" "}
                <span className="text-white font-medium">
                  Track operational hours
                </span>
                , isolate data landscapes per organization, automate{" "}
                <span className="text-white font-medium">
                  multi-country holidays
                </span>
                , and manage workflows natively.
              </p>

              {user && (
                <p className="mb-6 text-orange-400 font-medium flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 size={18} /> You are actively logged in.
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link
                  to={user ? "/calendar" : "/register"}
                  className="group w-full sm:w-auto px-10 py-5 bg-orange-500 text-white font-bold rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.25)] hover:bg-orange-400 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {user ? "Go to Your Dashboard" : "Get Started Free"}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-10 py-5 bg-zinc-900/80 text-white font-bold rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all text-lg text-center backdrop-blur-sm"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroImageVariants}
              className="lg:col-span-6 z-10"
            >
              {" "}
              <div className="relative p-2 lg:p-3 bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                {" "}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-5 bg-zinc-800 rounded-b-xl z-20 flex items-center justify-center gap-2">
                  {" "}
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>{" "}
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>{" "}
                </div>{" "}
                <div className="relative aspect-16/10 overflow-hidden rounded-4xl bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center group">
                  {" "}
                  <img src="/img/week-calendar.png?v=2" alt="Hero Image" />{" "}
                  <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>{" "}
                </div>{" "}
              </div>{" "}
            </motion.div>
          </div>
        </Wrapper>
      </section>

      <div className="py-12 border-y border-zinc-900 bg-zinc-950/40">
        <Wrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-black text-orange-500 mb-1">100%</h3>
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                Data Isolation
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-1">
                MK • CH • DE
              </h3>
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                Native Holiday Engine
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-1">
                &lt; 100ms
              </h3>
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                JWT Token Auth
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-orange-500 mb-1">
                Resend
              </h3>
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                Automated Alerts
              </p>
            </div>
          </div>
        </Wrapper>
      </div>

      <section className="py-24 relative">
        <Wrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
              Built for High-Growth Workspaces
            </h2>
            <p className="text-zinc-400 text-lg">
              Engineered with dedicated multi-tenant infrastructure to isolate
              companies completely under one modern stack.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MousePointerClick />}
              title="Instant Time Logging"
              text="Track standard clock-ins, clock-outs, break deductions, and automated daily overtime analytics instantly."
            />
            <FeatureCard
              icon={<Building2 />}
              title="Isolated Multi-Company"
              text="Completely independent data pools, administrative controls, and secure employee structural workflows."
            />
            <FeatureCard
              icon={<Bell />}
              title="Real-Time Engine"
              text="Receive live contextual notification dispatches for absences, administrative balances, and status alterations."
            />
          </div>
        </Wrapper>
      </section>

      <section className="py-24 bg-zinc-900/10 border-y border-zinc-900/60 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] bg-size-[16px_1px] opacity-20 pointer-events-none" />
        <Wrapper>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">
                The Architecture Grid
              </span>
              <h2 className="text-4xl font-bold mb-4 tracking-tight">
                Enterprise Ecosystem. Ready Out-of-the-Box.
              </h2>
              <p className="text-zinc-400">
                A unified, secure interface packed with performance
                optimizations and structured PostgreSQL storage rules.
              </p>
            </div>
            <div className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-xl border border-orange-500/20 font-mono text-xs font-semibold backdrop-blur-md">
              Secure HTTP-Only Cookies Enabled
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <BentoItem
              icon={<Lock size={22} />}
              title="JWT Access Protection"
              desc="Role-fortified login maps containing automated validation loops and secure token handling parameters."
            />
            <BentoItem
              icon={<Globe size={22} />}
              title="Multi-Country Calendars"
              desc="Live localized filtering across MK, CH, and DE parameters with automated holiday insertions."
            />
            <BentoItem
              icon={<Shield size={22} />}
              title="Protected Backend API"
              desc="Strict CORS rules, rate-limiting protections, and structured Node/Express security middleware."
            />
            <BentoItem
              icon={<TrendingUp size={22} />}
              title="Productivity Overviews"
              desc="Real-time employee metrics, cumulative log configurations, and direct visual workload tables."
            />
            <BentoItem
              icon={<Mail size={22} />}
              title="Resend Integration"
              desc="Automated branded emails dispatched instantly to administrators for any new leave actions."
            />
            <BentoItem
              icon={<Clock size={22} />}
              title="Break Math Prevention"
              desc="Clever conflict checks mapping calendar blocks to eliminate overlap requests automatically."
            />
          </div>
        </Wrapper>
      </section>

      <section className="py-24">
        <Wrapper>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Two Roles. One Fluid Interface.
            </h2>
            <p className="text-zinc-400">
              Toggle between the optimized workflows designed natively for both
              your operators and management leaders.
            </p>

            <div className="inline-flex p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl mt-8">
              <button
                onClick={() => setActiveTab("employee")}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "employee" ? "bg-orange-500 text-white shadow-md" : "text-zinc-400 hover:text-white"}`}
              >
                Employee Hub
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "admin" ? "bg-orange-500 text-white shadow-md" : "text-zinc-400 hover:text-white"}`}
              >
                Admin Command
              </button>
            </div>
          </div>

          <div className="min-h-95">
            {activeTab === "employee" ? (
              <motion.div
                key="employee-tab"
                initial="hidden"
                animate="visible"
                variants={fadeInScaleVariants}
                className="p-8 md:p-12 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800/80 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <div className="w-12 h-12 bg-zinc-800 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    The Employee Center
                  </h3>
                  <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                    Designed for swift daily interactions. Log working
                    schedules, process absences, check balance counts, and
                    maintain schedule visibility down to the single minute.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                    POST /api/time-logs/clock-in
                  </div>
                </div>
                <ul className="space-y-4">
                  <CheckItem text="Clock In/Out with structural break detection" />
                  <CheckItem text="Submit Absence Requests (Vacation, Personal, Sick)" />
                  <CheckItem text="Track real-time active holiday balances" />
                  <CheckItem text="Instant interactive notifications pipeline" />
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="admin-tab"
                initial="hidden"
                animate="visible"
                variants={fadeInScaleVariants}
                className="p-8 md:p-12 bg-orange-500 rounded-[2.5rem] text-black max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
                  <Shield size={320} />
                </div>
                <div>
                  <div className="w-12 h-12 bg-black/10 text-orange-950 rounded-xl flex items-center justify-center mb-6">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-orange-950">
                    The Admin Command
                  </h3>
                  <p className="text-orange-900/80 mb-6 text-sm leading-relaxed">
                    Total control across organization assets. Provision secure
                    accounts, regulate corporate profiles, approve or discard
                    workflow operations, and review full compliance logs.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-950 bg-black/5 px-3 py-1.5 rounded-lg border border-black/10">
                    PUT /api/admin/requests/:id
                  </div>
                </div>
                <ul className="space-y-4">
                  <CheckItem
                    dark
                    text="Complete Account & Privilege provisioning"
                  />
                  <CheckItem
                    dark
                    text="Review operational real-time corporate log data"
                  />
                  <CheckItem
                    dark
                    text="Approve or Reject team time-off with single clicks"
                  />
                  <CheckItem
                    dark
                    text="Configure public calendar rules and vacation bounds"
                  />
                </ul>
              </motion.div>
            )}
          </div>
        </Wrapper>
      </section>

      <div className="py-16 border-t border-zinc-900/60 bg-linear-to-b from-transparent to-zinc-950/50">
        <Wrapper>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-30 grayscale hover:opacity-50 transition-opacity duration-300">
            <div className="flex items-center gap-2 font-black tracking-widest text-sm">
              <Lock size={16} /> JWT PROTECTED
            </div>
            <div className="flex items-center gap-2 font-black tracking-widest text-sm">
              <BarChart3 size={16} /> POSTGRESQL ENGINE
            </div>
            <div className="flex items-center gap-2 font-black tracking-widest text-sm">
              <Zap size={16} /> NODE.JS ARCHITECTURE
            </div>
            <div className="flex items-center gap-2 font-black tracking-widest text-sm">
              <Globe size={16} /> TAILWIND UI FRAMEWORK
            </div>
          </div>
        </Wrapper>
      </div>

      <section className="relative py-36 bg-white text-black text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500 via-zinc-400 to-orange-600" />

        <Wrapper>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8"
          >
            Scale Your Operational Workflows.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-zinc-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Unlock total multi-tenant visibility with Clockly. Track metrics,
            manage absence balances, and centralize communications under one
            dashboard.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link
              to={user ? "/calendar" : "/register"}
              className="px-14 py-5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              Launch Clockly System <ArrowRight size={22} />
            </Link>
          </motion.div>
        </Wrapper>

        <div className="absolute -z-10 top-1/2 left-1/2 w-160 h-160 bg-orange-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      </section>

      <Footer />
    </div>
  );
};


const FeatureCard = ({ icon, title, text }: FeatureCardTypes) => (
  <div className="p-8 lg:p-10 bg-zinc-900/30 rounded-[2.2rem] border border-zinc-800/40 hover:bg-zinc-900/80 hover:border-zinc-700/60 transition-all duration-300 group cursor-default shadow-xl backdrop-blur-xs">
    <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-8 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-inner">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white tracking-tight">
      {title}
    </h3>
    <p className="text-zinc-400 leading-relaxed text-sm">{text}</p>
  </div>
);

const BentoItem = ({ icon, title, desc }: BentoItemProps) => (
  <div className="p-7 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 hover:border-orange-500/20 hover:bg-zinc-900/70 transition-all duration-300 flex flex-col justify-between gap-4">
    <div className="text-orange-500 bg-orange-500/5 border border-orange-500/10 w-10 h-10 flex items-center justify-center rounded-xl">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white text-base mb-1 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const CheckItem = ({ text, dark = false }: CheckItemProps) => (
  <li className="flex items-start gap-3.5 group cursor-default">
    <div
      className={`shrink-0 p-1 rounded-md mt-0.5 ${
        dark
          ? "bg-black/10 text-orange-950 group-hover:bg-black/15"
          : "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20"
      } transition-colors`}
    >
      <CheckCircle2 size={16} />
    </div>
    <span
      className={`text-sm font-medium leading-relaxed ${dark ? "text-orange-950 font-semibold" : "text-zinc-300"}`}
    >
      {text}
    </span>
  </li>
);

export default Homepage;
