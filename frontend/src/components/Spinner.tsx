import { Clock3 } from "lucide-react";

const Spinner = () => {
  return (
    <div className="text-white flex flex-col gap-4 justify-center items-center min-h-screen bg-[#050505]">
      <Clock3 size={48} className="text-orange-500 animate-spin" />
      <p className="text-zinc-500 font-medium tracking-widest uppercase text-sm">
        Loading your workspace...
      </p>
    </div>
  );
};

export default Spinner;
