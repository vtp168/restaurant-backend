import { invoiceModel} from "../models/invoice.model.js";
import { orderModel } from "../models/order.model.js";
import asyncHandler from 'express-async-handler';

export const printInvoice = asyncHandler(async (req, res) => {
  const invoce = await invoiceModel.findById(req.params.invoiceId)
  .populate('tableId')
  .populate({
    path: 'orderIds',
    select: '_id orderNo items total createdAt',
    populate: {
      path: 'items.menuItemId',
      select: 'name name_kh', // បន្ថែម field ផ្សេងៗបាន
    },
  })
  .populate({
    path: 'paidBy',
    select: '_id username fullname',
  });
  if (!invoce) {
    return res.status(404).json({ message: "Invoice not found" });
  }
  return res.status(200).json(invoce);
});


// Checkout Order and Create Invoice
export const checkoutOrder = asyncHandler(async (req, res) => {
  const { tableId, items, paymentMethod } = req.body;
    // 1. Create Order
    const orderNo = await getNextOrderNo();
    const order = await orderModel.create({
      orderNo,
      tableId,
      items,
      status: "paid" // Mark paid after checkout
    });

    // 2. Calculate totals
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subTotal * 0.1; // Example: 10% tax
    const total = subTotal + tax;

    // 3. Create Invoice
    const invoiceNo = await getNextInvoiceNo();
    const invoice = await invoiceModel.create({
      invoiceNo,
      orderIds: [order._id],
      tableId,
      subTotal,
      tax,
      total,
      paymentMethod,
      paidBy: req.user._id, // from authMiddleware
      paidAt: new Date()
    });

    res.json({
      message: "Checkout successful",
      order,
      invoice
    });
});

// Auto increment helper (basic)
async function getNextOrderNo() {
  const lastOrder = await orderModel.findOne().sort({ orderNo: -1 });
  return lastOrder ? lastOrder.orderNo + 1 : 1;
}

async function getNextInvoiceNo() {
  const lastInvoice = await invoiceModel.findOne().sort({ invoiceNo: -1 });
  return lastInvoice ? lastInvoice.invoiceNo + 1 : 1;
}

export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await invoiceModel.find()
    .populate('tableId')
    .populate({path:'orderIds',
       select: '_id orderNo items total createdAt'
    });
    res.status(200).json(invoices);
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await invoiceModel.findById(req.params.id)
    .populate('tableId')
    .populate({path:'orderIds',
       select: '_id orderNo items total createdAt'
    });
  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }
  return res.status(200).json(invoice);
});

// Additional functions like updateInvoice, deleteInvoice can be added similarly
// depending on the requirements.

// Note: This is a basic implementation. In a production environment,
// consider using more robust methods for generating unique order/invoice numbers.
// Also, handle edge cases and errors as needed.

// You can also add authentication and authorization as needed. 
