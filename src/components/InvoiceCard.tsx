import React from "react";
import { ChevronRight } from "lucide-react";
import { Invoice } from "../types";
import StatusBadge from "./StatusBadge";
import { motion } from "motion/react";

interface InvoiceCardProps {
  invoice: Invoice;
  onClick: () => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="bg-light-card dark:bg-dark-card p-6 md:px-8 md:py-4 rounded-lg invoice-shadow border border-transparent hover:border-primary transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-center justify-between md:justify-start md:gap-8">
        <h3 className="font-bold text-xs md:text-sm dark:text-white uppercase md:w-20">
          <span className="text-text-grey font-medium">#</span>
          {invoice.id}
        </h3>
        
        <span className="text-text-grey text-xs md:hidden">
          {invoice.clientName}
        </span>
      </div>

      <div className="flex items-center justify-between md:grow">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
          <span className="text-text-grey text-xs md:w-32">
            Due {formatDate(invoice.paymentDue)}
          </span>
          
          <div className="hidden md:block text-text-grey text-xs md:w-32">
             {invoice.clientName}
          </div>
        </div>

        <div className="flex items-center gap-5 md:gap-10">
          <span className="text-text-navy dark:text-white font-bold text-sm md:text-lg">
             £{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <StatusBadge status={invoice.status} />
          <ChevronRight size={16} className="text-primary hidden md:block" />
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceCard;
