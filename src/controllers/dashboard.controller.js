import { orderModel } from "../models/order.model.js";

// 🧾 Dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments()
    const totalDelivered = await orderModel.countDocuments({ status: 'completed' })
    const totalCanceled = await orderModel.countDocuments({ status: 'canceled' })
    const totalRevenueAgg = await orderModel.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0

    const recentOrders = await orderModel.find()
      .populate('createdBy', 'fullname')
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
