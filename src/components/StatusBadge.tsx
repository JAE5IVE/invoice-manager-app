import React from "react";
import { PaymentStatus } from "../types";

const statusStyles = {
  paid: {
    bg: "bg-[#33D69F]/10",
    text: "text-[#33D69F]",
    dot: "bg-[#33D69F]",
    label: "Paid",
  },
  pending: {
    bg: "bg-[#FF8F00]/10",
    text: "text-[#FF8F00]",
    dot: "bg-[#FF8F00]",
    label: "Pending",
  },
  draft: {
    bg: "bg-[#373B53]/10 dark:bg-[#DFE3FA]/10",
    text: "text-[#373B53] dark:text-[#DFE3FA]",
    dot: "bg-[#373B53] dark:bg-[#DFE3FA]",
    label: "Draft",
  },
};

export default function StatusBadge({ status }: { status: PaymentStatus }) {
  const style = statusStyles[status];

  return (
    <div className={`${style.bg} ${style.text} w-[104px] h-10 rounded-md flex items-center justify-center font-bold text-xs gap-2 capitalize`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {style.label}
    </div>
  );
}
