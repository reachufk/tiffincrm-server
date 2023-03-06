const Authorization = require('../../utils/authorization_util');
const UserModel = require('../../models/user/user-model');
const UserCartModel = require('../../models/user/user-cart-model')
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
                        return res.status(400).json(error.message);
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


