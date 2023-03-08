const config = require('../../../config/config')
const OrderModel = require("../../models/order/order-model");
const CompletedOrderModel = require("../../models/order/completed-order-model");
const AdminOrderModel = require('../../models/order/admin-order-model');
const UserCartModel = require('../../models/user/user-cart-model')
const socket = require('../../../server');
const Razorpay = require('razorpay');
var instance = new Razorpay({
      key_id: config.Razorpay_Key_Id,
      key_secret: config.Razorpay_Key_Secret,
});

exports.PlaceOrder = async (req, res) => {
      const body = req.body
      try {
            const order = new OrderModel(body);
            const savedOrder = await order.save();
            await UserCartModel.findOneAndUpdate({user:body.user},{$set:{cartItems:[]}});
            socket.ioObject.sockets.in("order").emit("newOrder", savedOrder);
            res.status(201).json({ statusCode: 201, message: 'order placed', order: savedOrder });
      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error?.message })
      }
}

exports.PlaceAdminOrder = async (req, res) => {
      try {
            const order = new AdminOrderModel(req.body);
            const savedOrder = await order.save();
            res.status(201).json({ statusCode: 201, message: 'order placed by admin', order: savedOrder });
      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error?.message })
      }
}

exports.CreateRpayOrder = async (req, res) => {
      const options = req.body
      try {
            const createdOrder = await instance.orders.create(options);
            if (!createdOrder) {
                  return res.status(500).json({ message: 'payment gateway error' })
            }
            res.status(200).json({ statusCode: 200, data: createdOrder })
      } catch (error) {
            res.status(400).json({ statusCode: 200, message: error.message })
      }

}

exports.VerifyPayment = async (req, res) => {
      const { razorpay_order_id, razorpay_payment_id } = req.body
      let body = razorpay_order_id + "|" + razorpay_payment_id;
      var crypto = require("crypto");
      var expectedSignature = crypto.createHmac('sha256', config.Razorpay_Key_Secret)
            .update(body.toString())
            .digest('hex');
      if (expectedSignature === req.body.razorpay_signature) {
            const paymentData = await instance.payments.fetch(razorpay_payment_id)
            res.status(200).json({ statusCode: 200, verified: true, data: paymentData })
      } else {
            res.status(200).json({ statusCode: 401, verified: false })
      }
}

exports.GetCompletedOrders = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword } = req.body
            const query = {
                  $or: [
                        { orderAddress: { $regex: keyword, $options: 'i' } },
                        { orderMode: { $regex: keyword, $options: 'i' } }
                  ]
            }
            const totalCount = await CompletedOrderModel.countDocuments(query);
            const totalPages = Math.ceil(+totalCount / +pageSize);
            const orders = await CompletedOrderModel.find(query)
                  .skip((+pageNo - 1) * +pageSize)
                  .limit(+pageSize)
                  .exec();
            if (orders && orders?.length) {
                  res.status(200).json({ statusCode: 200, orders, totalCount, totalPages })
            } else {
                  res.status(200).json({ statusCode: 404, message: 'no orders found' })
            }
      } catch (error) {
            res.status(400).json(error.message)
      }
}

exports.SetCompletedOrder = async (req, res) => {
      const { orderId } = req.params;
      let order = req.body;
      try {
            const existCompleted = await CompletedOrderModel.findOne({ prevOrderId: orderId });
            if (existCompleted) {
                  return res.status(200).json({ statusCode: 409, message: 'order already completed' })
            }
            delete order._id;
            order.prevOrderId = orderId;
            order.orderStatus = 'completed';
            const completedOrder = new CompletedOrderModel(order)
            const isSaved = await completedOrder.save();
            if (!isSaved) {
                  return res.status(500).json({ statusCode: 500, message: 'failed to save' })
            }
            const deleteFromOrders = await OrderModel.findByIdAndDelete(orderId)
            if (!deleteFromOrders) {
                  return res.status(200).json({ statusCode: 200, message: 'failed to delete order from orders' })
            }
            return res.status(200).json({ statusCode: 200, message: 'order processed to complete' })
      } catch (error) {
            res.status(400).json(error.message)
      }
}

exports.GetLatestOrders = async (req, res) => {
      const currentDate = new Date().toISOString().slice(0, 10);
      try {
            const orders = await OrderModel.find({ orderStatus: "pending", orderDeliveryTime: { $regex: currentDate } })
            if (orders && orders.length) {
                  res.status(200).json({ statusCode: 200, data: orders })
            } else {
                  res.status(404).json({ statusCode: 404, message: 'empty latest orders' })
            }
      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error.message })
      }

}

exports.GetFutureOrders = async (req, res) => {
      const currentDate = new Date().toISOString().slice(0, 10);
      try {
            const orders = await OrderModel.find({ orderStatus: "pending" })
            if (orders && orders.length) {
                  const futureOrders = orders.filter((order) => {
                        const deliveryDate = order.orderDeliveryTime.slice(0, 10)
                        return deliveryDate !== currentDate;
                  });
                  return res.status(200).json({ statusCode: 200, data: futureOrders, message: 'success' })
            } else {
                  res.status(200).json({ statusCode: 404, message: 'empty latest orders' })
            }
      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error.message })
      }
}

exports.GetAdminOrders = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword } = req.body
            const query = {
                  orderPaymentStatus:'pending',
                  $or: [
                        { username: { $regex: keyword, $options: 'i' } },
                        { phoneNumber: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                        { orderAddress: { $regex: keyword, $options: 'i' } },
                        { orderMode: { $regex: keyword, $options: 'i' } }
                  ]
            }
            const totalCount = await AdminOrderModel.countDocuments(query);
            const totalPages = Math.ceil(+totalCount / +pageSize);
            const orders = await AdminOrderModel.find(query)
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

exports.GetAdminCompletedOrders = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword } = req.body
            const query = {
                  orderPaymentStatus:'completed',
                  $or: [
                        { username: { $regex: keyword, $options: 'i' } },
                        { phoneNumber: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                        { orderAddress: { $regex: keyword, $options: 'i' } },
                        { orderMode: { $regex: keyword, $options: 'i' } }
                  ]
            }
            const totalCount = await AdminOrderModel.countDocuments(query);
            const totalPages = Math.ceil(+totalCount / +pageSize);
            const orders = await AdminOrderModel.find(query)
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

exports.UpdateAdminCreatedOrder = async(req,res)=>{
      const {id} = req.params;
      const {body} = req;
      try {
            const updated = await AdminOrderModel.findOneAndUpdate({_id:id},body);
            if(!updated){
                  return res.status(200).json({statusCode:404,message:'order not found to update'})
            }
            res.status(200).json({statusCode:200,message:'odrder updated'})
      } catch (error) {
            res.status(400).json(error.message)
      }
}

exports.GetUserOrders = async (req, res) => {
      const { user } = req.params;
      try {
            const userOrders = await OrderModel.find({ user });
            if (userOrders && userOrders.length) {
                  res.status(200).json({ statusCode: 200, data: userOrders, message: 'success' })
            } else {
                  res.status(200).json({ statusCode: 404, message: 'no orders made for user' })
            }
      } catch (error) {
            res.status(400).json({ statusCode: 400, message: res.message })
      }
}


