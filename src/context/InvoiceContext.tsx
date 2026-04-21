import React, { createContext, useContext, useEffect, useState } from "react";
import { Invoice } from "../types";

interface InvoiceContextType {
  invoices: Invoice[];
  loading: boolean;
  addInvoice: (invoice: Omit<Invoice, "id">) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const addInvoice = async (invoice: Omit<Invoice, "id">) => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      const newInv = await res.json();
      setInvoices(prev => [...prev, newInv]);
    } catch (err) {
      console.error("Failed to add invoice", err);
    }
  };

  const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
    try {
      await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      setInvoices(prev => prev.map(inv => (inv.id === id ? { ...inv, ...invoice } : inv)));
    } catch (err) {
      console.error("Failed to update invoice", err);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      console.error("Failed to delete invoice", err);
    }
  };

  const markAsPaid = async (id: string) => {
    await updateInvoice(id, { status: "paid" });
  };

  return (
    <InvoiceContext.Provider value={{ invoices, loading, addInvoice, updateInvoice, deleteInvoice, markAsPaid }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error("useInvoices must be used within InvoiceProvider");
  return context;
};
