import { useState } from "react";

const ReasonToggle = ({ reason }: { reason?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reason) return null;

  return (
    <div className="mb-4">
      <p
        className={`text-sm text-zinc-400 italic bg-black/20 p-3 rounded-xl transition-all duration-200 wrap-break-word ${
          !isExpanded
            ? "line-clamp-2 overflow-hidden" 
            : "line-clamp-none" 
        }`}
      >
        "{reason}"
      </p>

      {reason.length > 60 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2 hover:text-orange-400 transition-colors"
        >
          {isExpanded ? "Show Less" : "Read Full Reason"}
        </button>
      )}
    </div>
  );
};

export default ReasonToggle;