const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    hsn: { type: String },
    desc: { type: String },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    amount: { type: Number }, // qty * price
    cgstAmount: { type: Number },
    sgstAmount: { type: Number },
    igstAmount: { type: Number },
    total: { type: Number }, // amount + all taxes
});

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    date: { type: Date, required: true },
    billingTo: { type: String, required: true },
    companyName: { type: String },
    gstin: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
    items: [ItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
