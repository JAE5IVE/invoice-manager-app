import React, { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useInvoices } from "../context/InvoiceContext";
import InvoiceCard from "./InvoiceCard";
import InvoiceForm from "./InvoiceForm";
import InvoiceDetail from "./InvoiceDetail";
import { PaymentStatus, Invoice } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function InvoiceList() {
  const { invoices, loading } = useInvoices();
  const [filter, setFilter] = useState<PaymentStatus[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const toggleFilter = (status: PaymentStatus) => {
    setFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredInvoices = filter.length > 0 
    ? invoices.filter(inv => filter.includes(inv.status))
    : invoices;

  if (selectedInvoice) {
    // We handle the detail view by checking if an invoice is selected
    // In a real app we'd use a router, but for a single-page task this is cleaner
    const currentInvoice = invoices.find(inv => inv.id === selectedInvoice.id) || selectedInvoice;
    return <InvoiceDetail invoice={currentInvoice} onBack={() => setSelectedInvoice(null)} />;
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold dark:text-white mb-1 md:mb-2 transition-all">Invoices</h1>
          <p className="text-text-grey text-xs md:text-sm">
            {loading ? "Loading..." : filteredInvoices.length === 0 ? "No invoices" : `There are ${filteredInvoices.length} total invoices`}
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 text-text-navy dark:text-white font-bold text-xs md:text-sm hover:text-primary transition-colors"
            >
              Filter <span className="hidden md:inline">by status</span>
              {isFilterOpen ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-primary" />}
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-dark-card p-6 rounded-lg shadow-xl z-20 min-w-[192px] space-y-4"
                >
                  {(["draft", "pending", "paid"] as PaymentStatus[]).map(status => (
                    <label key={status} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-sm border border-transparent bg-[#DFE3FA] dark:bg-[#252945] flex items-center justify-center transition-all group-hover:border-primary ${filter.includes(status) ? "bg-primary" : ""}`}>
                        {filter.includes(status) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 4.5L3.83333 6.83333L8.5 2.16667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" className="hidden" checked={filter.includes(status)} onChange={() => toggleFilter(status)} />
                      <span className="text-xs font-bold dark:text-white capitalize">{status}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-primary hover:bg-primary-hover p-2 md:pl-2 md:pr-4 rounded-full flex items-center gap-2 md:gap-4 transition-all text-white font-bold text-xs md:text-sm"
          >
            <div className="bg-white rounded-full p-2 text-primary">
              <Plus size={16} />
            </div>
            New <span className="hidden md:inline">Invoice</span>
          </button>
        </div>
      </header>

      {filteredInvoices.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <img src="https://picsum.photos/seed/empty/240/200" alt="Empty" referrerPolicy="no-referrer" className="mb-10 opacity-50 grayscale" />
          <h2 className="text-xl font-bold dark:text-white mb-6">There is nothing here</h2>
          <p className="text-text-grey text-xs max-w-[220px]">
            Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map(invoice => (
            <InvoiceCard key={invoice.id} invoice={invoice} onClick={() => setSelectedInvoice(invoice)} />
          ))}
        </div>
      )}

      <InvoiceForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
