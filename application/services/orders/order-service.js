const config = require('../../../config/config')
const OrderModel = require("../../models/order/order-model");
const AdminOrderModel = require('../../models/order/admin-order-model')
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

exports.CreateRpayOrder = async(req,res)=>{
      const options = req.body
      try {
            const createdOrder = await  instance.orders.create(options);
            if(!createdOrder){
                  return res.status(500).json({message:'payment gateway error'})
            }
             res.status(200).json({ statusCode: 200, data: createdOrder })
      } catch (error) {
            res.status(400).json({ statusCode: 200, message:error.message })
      }
    
}

exports.VerifyPayment = async(req, res) => {
      const {razorpay_order_id,razorpay_payment_id} = req.body
      let body = razorpay_order_id + "|" + razorpay_payment_id;
      var crypto = require("crypto");
      var expectedSignature = crypto.createHmac('sha256', config.Razorpay_Key_Secret)
            .update(body.toString())
            .digest('hex');
      if (expectedSignature === req.body.razorpay_signature){
            const paymentData = await instance.payments.fetch(razorpay_payment_id)
            res.status(200).json({statusCode:200,verified:true,data:paymentData})
      }else{
            res.status(200).json({statusCode:401,verified:false})
      }
}

exports.GetCompletedOrders = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword } = req.body
            const query = {
                  orderStatus: "completed",
                  $or: [
                        { orderAddress: { $regex: keyword, $options: 'i' } },
                        { orderMode: { $regex: keyword, $options: 'i' } }
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
            const orders = await OrderModel.find({ orderStatus: "pending" })
            if (orders && orders.length) {
                  res.status(200).json({ statusCode: 200, orders: orders })
            } else {
                  res.status(404).json({ statusCode: 404, message: 'empty latest orders' })
            }
      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error.message })
      }

}


exports.GetAdminOrders = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword } = req.body
            const query = {
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




