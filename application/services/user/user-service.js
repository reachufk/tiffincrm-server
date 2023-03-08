const Authorization = require('../../utils/authorization_util');
const UserModel = require('../../models/user/user-model');
const OrderModel = require('../../models/order/order-model');
const UserCartModel = require('../../models/user/user-cart-model');
const CompletedOrderModel = require('../../models/order/completed-order-model');

const { sendSMS, verifyOTP } = require('./../../utils/sendSMS');

exports.RegisterUser = async (req, res) => {
      try {
            const { phoneNumber } = req.body;
            const UserExists = await UserModel.find({ phoneNumber });
            if (UserExists.length) {
                  res.status(409).json('phone number is already registered');
            } else {
                  try {
                        const status = await sendSMS(phoneNumber);
                        if (status !== 'pending') {
                              return res.status(500).json({ statusCode: 500, message: 'Something went wrong.' });
                        }
                        return res.status(200).json({ statusCode: 200, message: 'SMS sent successfully.' });
                  } catch (error) {
                        return res.status(500).json(error.message);
                  }
            }
      } catch (error) {
            res.status(400).json(error.message);
      }
}

exports.Login = async (req, res) => {
      const { phoneNumber, password } = req.body;
      try {
            const User = await UserModel.findOne({ phoneNumber: +phoneNumber });
            if (User) {
                  const isMatched = await User.comparePassword(password, User.password);
                  if (!isMatched) {
                        return res.status(200).json({ statusCode: 401, message: "invalid credentials" });
                  }
                  let token = '';
                  const { username, phoneNumber, role } = User
                  if (role == 'user') {
                        token = Authorization.authorizeUser({ username, phoneNumber, role });
                  } else {
                        if (role == 'admin') {
                              //admin
                              token = Authorization.authorizeAdmin({ username, phoneNumber, role });
                        } else {
                              //super admin
                              token = Authorization.authorizeSuperAdmin({ username, phoneNumber, role });
                        }
                  }
                  const loggedUser = { user: User._id, username: User.username, email: User.email, phoneNumber: User.phoneNumber, role: User.role, token }
                  res.status(200).json({ statusCode: 200, message: "login success", user: loggedUser })
            } else {
                  res.status(200).json({ statusCode: 404, message: "invalid username" });
            }
      } catch (error) {
            res.status(400).json(error.message);
      }
}

exports.VerifyUsersOTP = async (req, res) => {
      const { phoneNumber, otp } = req.body;
      try {
            const valid = await verifyOTP(phoneNumber, otp);
            if (!valid) {
                  return res.status(400).json({ statusCode: 400, message: 'Invalid OPT.' });
            }
            const User = new UserModel(req.body);
            await User.save();
            return res.status(201).json({ statusCode: 201, message: 'User registered successfully.' });
      } catch (error) {
            return res.status(500).json(error.message);
      }
}

exports.UpdateUser = async (req, res) => {
      const User = req.body;
      const userId = req.params.user
      try {
            const UpdateUser = await UserModel.findOneAndUpdate({ _id: userId }, User);
            if (UpdateUser) {
                  res.status(200).json({ statusCode: 200, message: "user updated" });
            } else {
                  res.status(404).json({ statusCode: 404, message: "user not found" });
            }
      } catch (error) {
            res.status(400).json(error.message);
      }

}

exports.GetUser = async (req, res) => {
      const userId = req.query.user;
      try {
            const User = await UserModel.findById(userId);
            if (User) {
                  res.status(200).json(User);
            } else {
                  res.status(404).json('user not found');
            }
      } catch (error) {
            res.status(400).json(error.message);
      }
}

exports.GetUsers = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword } = req.body
            const projection = { password: 0 }
            const query = {
                  $or: [
                        { firstName: { $regex: keyword, $options: 'i' } },
                        { lastName: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } }
                  ]
            }
            const totalCount = await UserModel.countDocuments(query);
            const totalPages = Math.ceil(+totalCount / +pageSize);
            const users = await UserModel.find(query, projection)
                  .skip((+pageNo - 1) * +pageSize)
                  .limit(+pageSize)
                  .exec();
            if (users && users?.length) {
                  res.status(200).json({ users, totalCount, totalPages })
            } else {
                  res.status(404).json('no user found')
            }
      } catch (error) {
            res.status(400).json(error.message)
      }
}

exports.TodaysUser = async (req, res) => {
      const currentDate = new Date();
      try {
            const results = await UserModel.aggregate([
                  {
                        $match: {
                              createdAt: {
                                    $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                                    $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
                              },
                        },
                  },
                  {
                        $group: {
                              _id: null,
                              count: { $sum: 1 },
                        },
                  },
            ]);
            res.status(200).send({
                  data: results.length > 0 ? results[0].count : 0,
                  message: 'Users analytics data',
                  statusCode: 200
            })
      } catch (err) {
            res.status(200).send({
                  data: null,
                  message: err?.message || 'Something went wrong',
                  statusCode: 500
            })
      }
}

exports.TodaysOrder = async (req, res) => {
      const currentDate = new Date();
      try {
            const results = await OrderModel.aggregate([
                  {
                        $match: {
                              createdAt: {
                                    $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                                    $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
                              },
                        },
                  },
                  {
                        $group: {
                              _id: null,
                              count: { $sum: 1 },
                        },
                  },
            ]);
            res.status(200).send({
                  data: results.length > 0 ? results[0].count : 0,
                  message: 'Orders analytics data',
                  statusCode: 200
            })
      } catch (err) {
            res.status(200).send({
                  data: null,
                  message: err?.message || 'Something went wrong',
                  statusCode: 500
            })
      }
}

exports.GetTodaysSales = async (req, res) => {
      const today = new Date();
      try {
            today.setHours(0, 0, 0, 0);
            const query = { created_date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } };
            const sales = await CompletedOrderModel.find(query, { _id: 0, name: 1 });
            let totalSalesAmount = 0;
            sales.forEach(doc => totalSalesAmount += doc.orderAmount);
            res.status(200).send({
                  data: totalSalesAmount,
                  message: 'Sales analytics data',
                  statusCode: 200
            })
      } catch (err) {
            res.status(500).send({
                  data: null,
                  message: err?.message || 'Something went wrong',
                  statusCode: 500
            })
      }
}

exports.GetUsersAnalyticsDaily = async (req, res) => {
      let data = [];
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
      try {
            for (let i = 0; i < 7; i++) {
                  const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
                  const startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                  const endTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
                  const tempData = await UserModel.aggregate([
                        {
                              $match: {
                                    createdAt: {
                                          $gte: startTime,
                                          $lt: endTime,
                                    },
                              },
                        },
                        {
                              $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                              },
                        }
                  ]);
                  if (tempData?.length) {
                        data.push({
                              count: tempData[0]['count'] || 0,
                              day: new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(currentDate).split(',')[0],
                        })
                  } else {
                        data.push({
                              count: 0,
                              day: new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(currentDate).split(',')[0],
                        })

                  }
            }
            res.status(200).send({
                  data,
                  message: 'User analytics data',
                  statusCode: 200
            })
      } catch (err) {
            res.status(200).send({
                  data: null,
                  message: err?.message || 'Something went wrong',
                  statusCode: 500
            })
      }
}

exports.GetOrdersAnalyticsDaily = async (req, res) => {
      let data = [];
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
      try {
            for (let i = 0; i < 7; i++) {
                  const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
                  const startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                  const endTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
                  const tempData = await OrderModel.aggregate([
                        {
                              $match: {
                                    createdAt: {
                                          $gte: startTime,
                                          $lt: endTime,
                                    },
                              },
                        },
                        {
                              $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                              },
                        }
                  ]);
                  if (tempData?.length) {
                        data.push({
                              count: tempData[0]['count'] || 0,
                              day: new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(currentDate).split(',')[0],
                        })
                  } else {
                        data.push({
                              count: 0,
                              day: new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(currentDate).split(',')[0],
                        })

                  }
            }
            res.status(200).send({
                  data,
                  message: 'Order analytics data',
                  statusCode: 200
            })
      } catch (err) {
            res.status(200).send({
                  data: null,
                  message: err?.message || 'Something went wrong',
                  statusCode: 500
            })
      }
}

exports.GetUsersAnalyticsMonthly = async (req, res) => {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year
      const endDate = new Date(currentDate.getFullYear(), 11, 31); // December
      try {
            const tempData = await UserModel.aggregate([
                  {
                        $match: {
                              createdAt: {
                                    $gte: startDate,
                                    $lte: endDate,
                              },
                        },
                  },
                  {
                        $group: {
                              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                              count: { $sum: 1 },
                        },
                  },
            ])
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthsCount = Array(12).fill(0);

            for (const result of tempData) {
                  const [year, month] = result._id.split('-');
                  monthsCount[parseInt(month) - 1] = result.count;
            }
            const monthlyCounts = months.map((month, index) => ({ month, count: monthsCount[index] }));
            res.status(200).send({
                  data: monthlyCounts,
                  message: 'Users analytics data',
                  statusCode: 200
            })
      } catch (err) {
            res.status(200).send({
                  data: null,
                  message: err?.message || 'Something went wrong',
                  statusCode: 500
            })
      }
}

exports.GetOrdersAnalyticsMonthly = async (req, res) => {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year
      const endDate = new Date(currentDate.getFullYear(), 11, 31); // December
      try {
            const tempData = await OrderModel.aggregate([
                  {
                        $match: {
                              createdAt: {
                                    $gte: startDate,
                                    $lte: endDate,
                              },
                        },
                  },
                  {
                        $group: {
                              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                              count: { $sum: 1 },
                        },
                  },
            ])
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthsCount = Array(12).fill(0);

            for (const result of tempData) {
                  const [year, month] = result._id.split('-');
                  monthsCount[parseInt(month) - 1] = result.count;
            }
            const monthlyCounts = months.map((month, index) => ({ month, count: monthsCount[index] }));
            res.status(200).send({
                  data: monthlyCounts,
                  message: 'Users analytics data',
                  statusCode: 200
            })
      } catch (err) {
            res.status(200).send({
                  data: null,
                  message: err?.message || 'Something went wrong',
                  statusCode: 500
            })
      }
}

exports.GetCart = async (req, res) => {
      const { user } = req.params;
      try {
            const User = await UserModel.findById(user);
            if (User) {
                  const userCart = await UserCartModel.findOne({ user: user })
                  if (userCart) {
                        res.status(200).json({ statusCode: 200, data: userCart, message: 'success' });
                  } else {
                        res.status(200).json({ statusCode: 404, message: 'user cart not found' });
                  }
            } else {
                  res.status(200).json({ statusCode: 404, message: 'user not found' });
            }
      } catch (error) {
            res.status(400).json(error.message);
      }
}

exports.AddCartItem = async (req, res) => {
      const { user } = req.params;
      const item = req.body
      try {
            let cart = await UserCartModel.findOne({ user });
            if (!cart) {
                  cart = await UserCartModel.create({ user, cartItem: [] });
            }
            const existingItemIndex = cart.cartItems.findIndex(
                  (existed) => existed.itemId === item.itemId
            );
            if (existingItemIndex !== -1) {
                  return res.status(200).json({ statusCode: 409, message: 'item already exists in your cart' });
            } else {
                  cart.cartItems.push(item);
                  await cart.save();
                  return res.status(200).json({ statusCode: 200, message: 'item added to cart' });
            }
      } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
      }
}

exports.RemoveCartItem = async (req, res) => {
      const { user } = req.params;
      const item = req.body;
      try {
            const itemRemoved = await UserCartModel.findOneAndUpdate({ user: user },
                  { $pull: { cartItems: { itemId: item.itemId } } }
            );
            if (itemRemoved) {
                  res.status(200).json({ statusCode: 200, message: 'item removed', data: item?.itemId });
            } else {
                  res.status(200).json({ statusCode: 404, message: 'item not found' });
            }
      } catch (error) {
            res.status(400).json({ statusCode: 400, error: error.message });
      }

}

exports.UpdateCartItem = async (req, res) => {
      const { user } = req.params;
      const item = req.body;
      try {
            const updatedCart = await UserCartModel.findOneAndUpdate(
                  { user, 'cartItems.itemId': item?.itemId },
                  { $set: { 'cartItems.$': item } },
                  { new: true }
            );
            if (!updatedCart) {
                  return res.status(200).json({ statusCode: 404, message: 'cart not found' })
            }
            res.status(200).json({ statusCode: 200, message: 'cart item updated', update: updatedCart })
      } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message })
      }

}


