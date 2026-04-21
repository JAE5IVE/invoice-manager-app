import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Invoice } from "../types";
import StatusBadge from "./StatusBadge";
import { useInvoices } from "../context/InvoiceContext";
import { motion, AnimatePresence } from "motion/react";
import InvoiceForm from "./InvoiceForm";

interface Props {
  invoice: Invoice;
  onBack: () => void;
}

export default function InvoiceDetail({ invoice, onBack }: Props) {
  const { deleteInvoice, markAsPaid } = useInvoices();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    await deleteInvoice(invoice.id);
    onBack();
  };

  return (
    <div className="pb-20">
      <button onClick={onBack} className="flex items-center gap-6 text-[#0C0E16] dark:text-white font-bold text-xs mb-8 group">
        <ChevronLeft size={16} className="text-primary group-hover:scale-110 transition-transform" />
        Go Back
      </button>

      {/* Header Card */}
      <div className="bg-light-card dark:bg-dark-card p-6 md:px-8 rounded-lg invoice-shadow flex items-center justify-between mb-6">
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4">
          <span className="text-text-grey text-xs">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className="hidden md:flex gap-2">
          <button onClick={() => setIsEditing(true)} className="bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold px-6 py-4 rounded-full hover:bg-[#DFE3FA] dark:hover:bg-white transition-colors">
            Edit
          </button>
          <button onClick={() => setIsDeleting(true)} className="bg-danger text-white font-bold px-6 py-4 rounded-full hover:bg-danger-hover transition-colors">
            Delete
          </button>
          {invoice.status !== "paid" && (
            <button onClick={() => markAsPaid(invoice.id)} className="bg-primary text-white font-bold px-6 py-4 rounded-full hover:bg-primary-hover transition-colors">
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-light-card dark:bg-dark-card p-6 md:p-12 rounded-lg invoice-shadow">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          <div>
            <h2 className="font-bold text-base md:text-xl dark:text-white mb-1 uppercase">
              <span className="text-text-grey font-medium">#</span>
              {invoice.id}
            </h2>
            <p className="text-text-grey text-xs md:text-sm">{invoice.description}</p>
          </div>
          <div className="text-text-grey text-xs md:text-right leading-5">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-text-grey text-xs mb-3">Invoice Date</h4>
              <p className="text-text-navy dark:text-white font-bold text-base md:text-lg">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <h4 className="text-text-grey text-xs mb-3">Payment Due</h4>
              <p className="text-text-navy dark:text-white font-bold text-base md:text-lg">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-text-grey text-xs mb-3">Bill To</h4>
            <p className="text-text-navy dark:text-white font-bold text-base md:text-lg mb-2">{invoice.clientName}</p>
            <div className="text-text-grey text-xs leading-5">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-text-grey text-xs mb-3">Sent to</h4>
            <p className="text-text-navy dark:text-white font-bold text-base md:text-lg break-all">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Item List Display */}
        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-6 md:p-8">
          <div className="hidden md:grid grid-cols-[1fr,40px,100px,100px] gap-4 mb-8 text-text-grey text-xs">
            <span>Item Name</span>
            <span>QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="flex md:grid md:grid-cols-[1fr,40px,100px,100px] md:gap-4 items-center justify-between">
                <div>
                  <p className="font-bold text-sm dark:text-white mb-2 md:mb-0">{item.name}</p>
                  <p className="md:hidden text-text-grey font-bold text-sm">
                    {item.quantity} x £{item.price.toFixed(2)}
                  </p>
                </div>
                <span className="hidden md:block text-center text-text-grey text-sm font-bold">{item.quantity}</span>
                <span className="hidden md:block text-right text-text-grey text-sm font-bold">£{item.price.toFixed(2)}</span>
                <span className="text-text-navy dark:text-white text-sm font-bold text-right">£{item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg p-6 md:px-8 flex items-center justify-between text-white">
          <span className="text-xs font-medium">Amount Due</span>
          <span className="text-xl md:text-2xl font-bold">£{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-light-card dark:bg-dark-card p-6 flex justify-between gap-2 z-10 transition-colors">
        <button onClick={() => setIsEditing(true)} className="bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold px-6 py-4 rounded-full transition-colors">Edit</button>
        <button onClick={() => setIsDeleting(true)} className="bg-danger text-white font-bold px-6 py-4 rounded-full transition-colors">Delete</button>
        {invoice.status !== "paid" && (
          <button onClick={() => markAsPaid(invoice.id)} className="bg-primary text-white font-bold px-6 py-4 rounded-full transition-colors">Mark as Paid</button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(false)} className="absolute inset-0 bg-black/50" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-card p-8 md:p-12 rounded-lg max-w-[480px] w-full z-10"
            >
              <h2 className="text-2xl font-bold dark:text-white mb-3">Confirm Deletion</h2>
              <p className="text-text-grey text-sm leading-6 mb-4">
                Are you sure you want to delete invoice #{invoice.id}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsDeleting(false)} className="bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold px-6 py-4 rounded-full hover:bg-[#DFE3FA] transition-colors">Cancel</button>
                <button onClick={handleDelete} className="bg-danger text-white font-bold px-6 py-4 rounded-full hover:bg-danger-hover transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <InvoiceForm 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        invoiceToEdit={invoice} 
      />
    </div>
  );
}
