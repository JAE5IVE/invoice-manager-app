import React, { useState, useEffect } from "react";
import { Invoice, InvoiceItem, PaymentStatus } from "../types";
import { Trash2, Plus, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useInvoices } from "../context/InvoiceContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoiceToEdit?: Invoice;
}

const initialFormState = {
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientName: "",
  clientEmail: "",
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: "",
  items: [] as InvoiceItem[],
};

export default function InvoiceForm({ isOpen, onClose, invoiceToEdit }: Props) {
  const { addInvoice, updateInvoice } = useInvoices();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoiceToEdit) {
      setFormData({
        senderAddress: invoiceToEdit.senderAddress,
        clientName: invoiceToEdit.clientName,
        clientEmail: invoiceToEdit.clientEmail,
        clientAddress: invoiceToEdit.clientAddress,
        createdAt: invoiceToEdit.createdAt,
        paymentTerms: invoiceToEdit.paymentTerms,
        description: invoiceToEdit.description,
        items: invoiceToEdit.items,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [invoiceToEdit, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName) newErrors.clientName = "can't be empty";
    if (!formData.clientEmail) newErrors.clientEmail = "can't be empty";
    else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) newErrors.clientEmail = "invalid email";
    if (!formData.senderAddress.street) newErrors.senderStreet = "can't be empty";
    if (!formData.clientAddress.street) newErrors.clientStreet = "can't be empty";
    if (formData.items.length === 0) newErrors.items = "- An item must be added";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === "quantity" || field === "price") {
        newItems[index].total = newItems[index].quantity * newItems[index].price;
      }
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (status: PaymentStatus) => {
    if (!validate()) return;

    const total = formData.items.reduce((acc, item) => acc + item.total, 0);
    const paymentDue = new Date(new Date(formData.createdAt).getTime() + formData.paymentTerms * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const finalInvoice = {
      ...formData,
      status,
      total,
      paymentDue,
    };

    if (invoiceToEdit) {
      await updateInvoice(invoiceToEdit.id, finalInvoice);
    } else {
      await addInvoice(finalInvoice);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 lg:left-[103px] w-full md:w-[616px] lg:w-[719px] bg-white dark:bg-dark-main z-[70] p-6 md:p-14 overflow-y-auto"
          >
            <button onClick={onClose} className="md:hidden flex items-center gap-4 text-[#0C0E16] dark:text-white font-bold text-xs mb-8">
              <ChevronLeft size={16} className="text-primary" />
              Go Back
            </button>

            <h2 className="text-2xl font-bold dark:text-white mb-12">
              {invoiceToEdit ? `Edit #${invoiceToEdit.id}` : "New Invoice"}
            </h2>

            <div className="space-y-10 pb-20">
              {/* Bill From */}
              <section>
                <h4 className="text-primary font-bold text-xs mb-6">Bill From</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3">
                    <Label label="Street Address" error={errors.senderStreet} />
                    <Input 
                      value={formData.senderAddress.street} 
                      onChange={v => setFormData(p => ({ ...p, senderAddress: { ...p.senderAddress, street: v }}))}
                      error={!!errors.senderStreet}
                    />
                  </div>
                  <div>
                    <Label label="City" />
                    <Input 
                      value={formData.senderAddress.city} 
                      onChange={v => setFormData(p => ({ ...p, senderAddress: { ...p.senderAddress, city: v }}))}
                    />
                  </div>
                  <div>
                    <Label label="Post Code" />
                    <Input 
                      value={formData.senderAddress.postCode} 
                      onChange={v => setFormData(p => ({ ...p, senderAddress: { ...p.senderAddress, postCode: v }}))}
                    />
                  </div>
                  <div>
                    <Label label="Country" />
                    <Input 
                      value={formData.senderAddress.country} 
                      onChange={v => setFormData(p => ({ ...p, senderAddress: { ...p.senderAddress, country: v }}))}
                    />
                  </div>
                </div>
              </section>

              {/* Bill To */}
              <section>
                <h4 className="text-primary font-bold text-xs mb-6">Bill To</h4>
                <div className="space-y-6">
                  <div>
                    <Label label="Client's Name" error={errors.clientName} />
                    <Input 
                      value={formData.clientName} 
                      onChange={v => setFormData(p => ({ ...p, clientName: v }))}
                      error={!!errors.clientName}
                    />
                  </div>
                  <div>
                    <Label label="Client's Email" error={errors.clientEmail} />
                    <Input 
                      placeholder="e.g. email@example.com"
                      value={formData.clientEmail} 
                      onChange={v => setFormData(p => ({ ...p, clientEmail: v }))}
                      error={!!errors.clientEmail}
                    />
                  </div>
                  <div>
                    <Label label="Street Address" error={errors.clientStreet} />
                    <Input 
                      value={formData.clientAddress.street} 
                      onChange={v => setFormData(p => ({ ...p, clientAddress: { ...p.clientAddress, street: v }}))}
                      error={!!errors.clientStreet}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <Label label="City" />
                      <Input 
                        value={formData.clientAddress.city} 
                        onChange={v => setFormData(p => ({ ...p, clientAddress: { ...p.clientAddress, city: v }}))}
                      />
                    </div>
                    <div>
                      <Label label="Post Code" />
                      <Input 
                        value={formData.clientAddress.postCode} 
                        onChange={v => setFormData(p => ({ ...p, clientAddress: { ...p.clientAddress, postCode: v }}))}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Label label="Country" />
                      <Input 
                        value={formData.clientAddress.country} 
                        onChange={v => setFormData(p => ({ ...p, clientAddress: { ...p.clientAddress, country: v }}))}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Dates & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label label="Invoice Date" />
                  <Input type="date" value={formData.createdAt} onChange={v => setFormData(p => ({ ...p, createdAt: v }))} />
                </div>
                <div>
                  <Label label="Payment Terms" />
                  <select 
                    value={formData.paymentTerms}
                    onChange={e => setFormData(p => ({ ...p, paymentTerms: Number(e.target.value) }))}
                    className="w-full bg-white dark:bg-dark-card border border-[#DFE3FA] dark:border-[#252945] rounded-md px-5 py-4 text-sm font-bold dark:text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value={1}>Next 1 Day</option>
                    <option value={7}>Next 7 Days</option>
                    <option value={14}>Next 14 Days</option>
                    <option value={30}>Next 30 Days</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label label="Project Description" />
                  <Input value={formData.description} onChange={v => setFormData(p => ({ ...p, description: v }))} placeholder="e.g. Graphic Design Service" />
                </div>
              </div>

              {/* Item List */}
              <section>
                <h3 className="text-[#777F98] font-bold text-lg mb-4">Item List</h3>
                <div className="space-y-4">
                  <div className="hidden md:grid grid-cols-[1fr,60px,100px,80px,40px] gap-4 text-text-grey text-xs">
                    <span>Item Name</span>
                    <span>Qty.</span>
                    <span>Price</span>
                    <span>Total</span>
                    <span></span>
                  </div>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 md:grid-cols-[1fr,60px,100px,80px,40px] gap-4 items-center">
                      <div className="col-span-4 md:col-span-1">
                        <Label label="Item Name" className="md:hidden" />
                        <Input value={item.name} onChange={v => handleItemChange(index, "name", v)} />
                      </div>
                      <div className="col-span-1">
                        <Label label="Qty." className="md:hidden" />
                        <Input type="number" value={item.quantity} onChange={v => handleItemChange(index, "quantity", Number(v))} />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label label="Price" className="md:hidden" />
                        <Input type="number" value={item.price} onChange={v => handleItemChange(index, "price", Number(v))} />
                      </div>
                      <div className="col-span-1 flex flex-col justify-center">
                        <Label label="Total" className="md:hidden text-transparent" />
                        <span className="font-bold text-text-grey dark:text-[#DFE3FA] text-sm md:mt-0">
                          {item.total.toFixed(2)}
                        </span>
                      </div>
                      <button onClick={() => removeItem(index)} className="mt-6 md:mt-0 text-[#888EB0] hover:text-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.items && <p className="text-danger text-xs font-semibold mt-4">{errors.items}</p>}
                <button 
                  onClick={addItem}
                  className="w-full bg-[#F9FAFE] dark:bg-[#252945] text-text-grey dark:text-[#DFE3FA] font-bold py-4 rounded-full mt-4 flex items-center justify-center gap-2 hover:bg-[#DFE3FA] dark:hover:bg-white transition-colors"
                >
                  <Plus size={16} /> Add New Item
                </button>
              </section>
            </div>

            <div className={`fixed bottom-0 left-0 lg:left-[103px] w-full md:w-[616px] lg:w-[719px] bg-white dark:bg-[#1E2139] p-6 md:px-14 flex items-center ${invoiceToEdit ? "justify-end" : "justify-between"} gap-2`}>
              {!invoiceToEdit && (
                <button 
                  onClick={onClose}
                  className="bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold px-6 md:px-8 py-4 rounded-full hover:bg-[#DFE3FA] transition-colors"
                >
                  Discard
                </button>
              )}
              
              <div className="flex gap-2">
                {!invoiceToEdit && (
                  <button 
                    onClick={() => handleSubmit("draft")}
                    className="bg-[#373B53] dark:bg-[#1E2139] text-[#888EB0] dark:text-[#DFE3FA] font-bold px-6 md:px-8 py-4 rounded-full hover:bg-[#0C0E16] dark:hover:bg-dark-main transition-colors"
                  >
                    Save as Draft
                  </button>
                )}
                <button 
                  onClick={() => handleSubmit("pending")}
                  className="bg-primary text-white font-bold px-6 md:px-8 py-4 rounded-full hover:bg-primary-hover transition-colors"
                >
                  {invoiceToEdit ? "Save Changes" : "Save & Send"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const Label = ({ label, error, className = "" }: { label: string, error?: string, className?: string }) => (
  <div className={`flex justify-between items-center mb-2 ${className}`}>
    <span className={`text-xs font-medium ${error ? "text-danger" : "text-text-grey dark:text-[#DFE3FA]"}`}>{label}</span>
    {error && <span className="text-danger text-[10px] font-semibold">{error}</span>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text", error }: { value: any, onChange: (v: any) => void, placeholder?: string, type?: string, error?: boolean }) => (
  <input 
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full bg-white dark:bg-dark-card border rounded-md px-5 py-4 text-sm font-bold dark:text-white focus:outline-none focus:border-primary transition-colors ${error ? "border-danger" : "border-[#DFE3FA] dark:border-[#252945]"}`}
  />
);
