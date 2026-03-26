import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  Bell,
  Shield,
  BarChart3,
  Users,
  CheckCircle2,
  Zap,
  Lock,
  ArrowRight,
  MousePointerClick,
  History,
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

const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};
interface Props {
  user: UserType | null;
}

const Homepage = ({ user }: Props) => {
  return (
    <div className="text-slate-200 bg-[#050505] selection:bg-orange-500/30 font-sans antialiased">
      <section className="relative flex items-center justify-center min-h-[90vh] overflow-hidden pt-24 pb-12 lg:pt-32 px-6">
        <div className="absolute top-20 left-10 w-150 h-150 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-10 w-125 h-125 bg-zinc-600/10 rounded-full blur-[100px]" />

        <Wrapper>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
              className="relative z-10 lg:col-span-6 lg:text-left text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 mb-8 backdrop-blur-md">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                  Enterprise Ready • JWT Secured
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight lg:leading-none">
                Clockly<span className="text-orange-500">.</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
                The full-stack workforce OS.{" "}
                <span className="text-white">Track hours</span>, automate{" "}
                <span className="text-white">break calculations</span>, and
                manage
                <span className="text-white"> leave requests</span> in one
                secure ecosystem.
              </p>

              {user && (
                <p className="mb-5 text-orange-400">
                  You are already logged in !{" "}
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link
                  to={user ? "/calendar" : "/register"}
                  className="group px-10 py-5 bg-orange-500 text-white font-bold rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:bg-orange-400 transition-all flex items-center gap-3 text-lg"
                >
                  {user ? "Go to Your Profile" : "Get Started Free"}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                {!user ? (
                  <Link
                    to="/"
                    className="px-10 py-5 bg-zinc-900 text-white font-bold rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all text-lg"
                  >
                    View Demo
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroImageVariants}
              className="lg:col-span-6 z-10"
            >
              <div className="relative p-2 lg:p-3 bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-5 bg-zinc-800 rounded-b-xl z-20 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                </div>

                <div className="relative aspect-16/10 overflow-hidden rounded-4xl bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center group">
                  <img src="/img/clockly-week-calendar.png" alt="Hero Image" />
                  {/* <div className="absolute inset-0 bg-linear-to-br from-zinc-800 via-zinc-900 to-black p-8 text-center flex flex-col items-center justify-center text-zinc-600">
                    <BarChart3
                      size={60}
                      strokeWidth={1}
                      className="mb-4 text-orange-500/60"
                    />
                    <p className="font-bold text-lg mb-1 text-zinc-300">
                      Product Dashboard Mockup
                    </p>
                    <p className="text-sm">
                      Place a screenshot of the Clockly UI here.
                    </p>
                    <p className="text-xs font-mono mt-2 p-2 bg-black/40 rounded">
                      aspect-[16/10]
                    </p>
                  </div> */}

                  <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </Wrapper>
      </section>

      <Wrapper>
        <div className="grid md:grid-cols-3 gap-8 py-24">
          <FeatureCard
            icon={<MousePointerClick />}
            title="Instant Clock-In"
            text="One-click daily logging with full support for break times and automatic overtime math."
          />
          <FeatureCard
            icon={<History />}
            title="Work History"
            text="Access comprehensive daily and weekly work logs stored securely in our database."
          />
          <FeatureCard
            icon={<Bell />}
            title="Smart Notifications"
            text="Real-time updates for time-off approvals and admin actions. Mark as read instantly."
          />
        </div>
      </Wrapper>

      <section className="py-24 bg-zinc-900/20 border-y border-zinc-800/50">
        <Wrapper>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold mb-4 italic">
                The Complete Feature Set
              </h2>
              <p className="text-zinc-500 text-lg">
                We've combined essential time tracking with the advanced
                management tools your growing team actually needs.
              </p>
            </div>
            <div className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg border border-orange-500/20 font-mono text-sm">
              v2.4.0 Live
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BentoItem
              icon={<Lock size={20} />}
              title="JWT Authentication"
              desc="Secure role-based login."
            />
            <BentoItem
              icon={<Shield size={20} />}
              title="Protected API Routes"
              desc="Your data is encrypted."
            />
            <BentoItem
              icon={<Users size={20} />}
              title="Admin User Control"
              desc="Total employee management."
            />
            <BentoItem
              icon={<BarChart3 size={20} />}
              title="Productivity KPIs"
              desc="Live work statistics."
            />
            <BentoItem
              icon={<Calendar size={20} />}
              title="Holiday Calendar"
              desc="Automated public holidays."
            />
            <BentoItem
              icon={<Zap size={20} />}
              title="One-Click Approvals"
              desc="Approve or Reject instantly."
            />
          </div>
        </Wrapper>
      </section>

      <Wrapper>
        <section className="py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">
              Two Roles, One Fluid Experience
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative p-12 bg-zinc-900 rounded-[3rem] border border-zinc-800 hover:border-zinc-700 transition-colors group cursor-default">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-orange-500 mb-8 group-hover:rotate-6 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-6 italic">
                The Employee Hub
              </h3>
              <ul className="space-y-5">
                <CheckItem text="Clock in/out with break detection" />
                <CheckItem text="Submit time-off (Vacation/Sick Leave)" />
                <CheckItem text="Track remaining vacation balance" />
                <CheckItem text="Real-time notification center" />
              </ul>
            </div>

            <div className="relative p-12 bg-orange-500 rounded-[3rem] text-black overflow-hidden shadow-2xl group cursor-default">
              <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-1000">
                <Shield size={240} />
              </div>
              <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center text-orange-950 mb-8">
                <Shield size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-6 italic">
                The Admin Command
              </h3>
              <ul className="space-y-5">
                <CheckItem dark text="Manage user accounts & permissions" />
                <CheckItem dark text="Review detailed employee work logs" />
                <CheckItem dark text="Approve/Reject requests instantly" />
                <CheckItem dark text="Set annual leave & holiday limits" />
              </ul>
            </div>
          </div>
        </section>
      </Wrapper>

      <div className="py-20 border-t border-zinc-900">
        <Wrapper>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Lock /> JWT SECURED
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Shield /> ROLE-BASED
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <BarChart3 /> DATA-DRIVEN
            </div>
          </div>
        </Wrapper>
      </div>

      <section className="relative py-40 bg-white text-black text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-zinc-500 to-orange-500" />

        <Wrapper>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-tight mb-6 md:mb-8"
          >
            Ready to Scale Your Team?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-600 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium"
          >
            Unlock full workforce transparency with Clockly — track hours,
            leave, and productivity all in one platform.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-16 py-6 bg-linear-to-r from-orange-500 to-orange-600 text-white font-extrabold text-2xl rounded-3xl shadow-2xl hover:from-orange-600 hover:to-orange-500 transition-all flex items-center gap-3 mx-auto"
          >
            Launch Clockly Now <ArrowRight size={24} />
          </motion.button>

          {/* <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-zinc-400 uppercase tracking-widest font-bold text-sm"
          >
            No credit card required • 1 MONTH free trial
          </motion.p> */}
        </Wrapper>

        <div className="absolute -z-10 top-1/2 left-1/2 w-200 h-200 bg-orange-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      </section>
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, text }: FeatureCardTypes) => (
  <div className="p-10 bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800/50 hover:bg-zinc-900 transition-all group cursor-default shadow-xl">
    <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-zinc-500 leading-relaxed text-lg">{text}</p>
  </div>
);

const BentoItem = ({ icon, title, desc }: BentoItemProps) => (
  <div className="p-8 bg-zinc-900/60 rounded-3xl border border-zinc-800/50 hover:border-orange-500/30 transition-all flex flex-col gap-3">
    <div className="text-orange-500">{icon}</div>
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-sm text-zinc-500">{desc}</p>
    </div>
  </div>
);

const CheckItem = ({ text, dark = false }: CheckItemProps) => (
  <li className="flex items-center gap-4 group cursor-default">
    <div
      className={`shrink-0 p-1 rounded-lg ${dark ? "bg-black/10 text-black group-hover:bg-black/20" : "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white"} transition-colors`}
    >
      <CheckCircle2 size={20} />
    </div>
    <span
      className={`text-lg font-semibold ${dark ? "text-orange-950" : "text-zinc-300"}`}
    >
      {text}
    </span>
  </li>
);

export default Homepage;
