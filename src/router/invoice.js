const express = require("express");
const Invoice = require("../models/invoice"); // adjust path if needed
const { userAuth } = require("../middlewares/userAuth");

const invoiceRouter = express.Router();

invoiceRouter.post("/api/generate-invoice", userAuth, async (req, res) => {
    try {
        const {
            invoiceNumber,
            date,
            billingTo,
            companyName,
            gstin,
            address,
            email,
            phone,
            items
        } = req.body;

        const newInvoice = new Invoice({
            invoiceNumber,
            date,
            billingTo,
            companyName,
            gstin,
            address,
            email,
            phone,
            items
        });

        await newInvoice.save();

        res.status(201).json({
            message: "Invoice generated and saved successfully",
            invoice: newInvoice
        });
    } catch (err) {
        console.error("Error generating invoice:", err.message);
        res.status(500).json({ error: "Failed to generate invoice" });
    }
});

invoiceRouter.get('/api/invoices', userAuth, async (req, res) => {
    try {

        const invoices = await Invoice.find({});
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: "Failed to get invoices" });

    }
});

invoiceRouter.get('/api/preview/:id', userAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const matchedInvoice = await Invoice.findById(id);
        if (!matchedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(matchedInvoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = invoiceRouter;
