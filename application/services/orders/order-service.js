
const OrderModel = require("../../models/order/order-model")
const socket = require('../../../server');


exports.PlaceOrder = async (req, res) => {
      try {
            const order = new OrderModel(req.body);
            const { user } = req?.body
            const savedOrder = await order.save();
            socket.ioObject.sockets.in("order").emit("newOrder", savedOrder);
            res.status(201).json({ statusCode: 201, message: 'order placed', order: savedOrder })
      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error?.message })
      }
}

exports.OrderPayment = async (req, res) => {

}

exports.GetCompletedOrders = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword } = req.body
            const query = {
                  orderStatus: "completed",
                  $or: [
                        { orderAddress: { $regex: keyword, $options: 'i' } },
                        { orderMode: { $regex: keyword, $options: 'i' } },
                        { orderAmount: { $regex: keyword, $options: 'i' } }
                  ]
            }
            const totalCount = await OrderModel.countDocuments(query);
            const totalPages = Math.ceil(+totalCount / +pageSize);
            const orders = await OrderModel.find(query)
                  .skip((+pageNo - 1) * +pageSize)
                  .limit(+pageSize)
                  .exec();
            if (orders && orders?.length) {
                  res.status(200).json({ statusCode: 200, orders, totalCount, totalPages })
            } else {
                  res.status(404).json('no order found')
            }
      } catch (error) {
            res.status(400).json(error.message)
      }



}

exports.GetLatestOrders = async (req, res) => {
      try {
            const orders = await OrderModel.aggregate([
                  {
                        $match: { orderStatus: "pending" }
                  },
                  {
                        $lookup: {
                              from: 'Users',
                              let: { userId: '$user' },
                              pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                                    { $project: { email: 1, phoneNumber: 1, firstName: 1, lastName: 1 } }
                              ],
                              as: 'userInfo'
                        }
                  }
            ])
            if (orders && orders.length) {
                  res.status(200).json({ statusCode: 200, orders: orders })
            } else {
                  res.status(404).json({ statusCode: 404, message: 'empty latest orders' })
            }



      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error.message })
      }

}


