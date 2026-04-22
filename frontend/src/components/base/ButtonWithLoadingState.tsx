import { Timer } from "lucide-react";

interface Props {
  loading?: boolean;
  buttonText: string;
  disabled?: boolean;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}
const ButtonWithLoadingState = ({
  loading,
  buttonText,
  disabled,
  onClick,
  variant = "primary",
}: Props) => {
  const variants = {
    primary:
      "bg-orange-500 hover:bg-orange-400 text-white border-orange-500/30",
    secondary:
      "bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-400 hover:text-white border-zinc-800",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:text-red-300",
  };
  return (
    <button
      className={`group relative px-10 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]
backdrop-blur-xl transition-all duration-300 active:scale-95
disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:text-zinc-400
border ${variants[variant ?? "secondary"]}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {loading && (
          <Timer size={14} className="animate-spin text-orange-500" />
        )}
        <span>{loading ? "Syncing..." : buttonText}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-orange-500/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default ButtonWithLoadingState;
