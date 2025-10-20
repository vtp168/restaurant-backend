import { orderModel } from "../models/order.model.js";
import { invoiceModel } from "../models/invoice.model.js";

// 🧾 Dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments()
    const totalDelivered = await orderModel.countDocuments({ status: 'completed' })
    const totalCanceled = await orderModel.countDocuments({ status: 'canceled' })
    const totalRevenueAgg = await invoiceModel.aggregate([
      // { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0

    const recentOrders = await orderModel.find({status:'pending'})
      .populate('createdBy', 'fullname')
      .populate('tableId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)

    res.status(200).json({
      totalOrders,
      totalDelivered,
      totalCanceled,
      totalRevenue,
      recentOrders,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch dashboard data' })
  }
}
