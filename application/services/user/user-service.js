const Authorization = require('../../utils/authorization_util');
const UserModel = require('../../models/user/user-model');
const UserCartModel = require('../../models/user/user-cart-model')

exports.RegisterUser = async (req, res) => {
      const User = new UserModel(req.body);
      try {
            const UserExists = await UserModel.find({ phoneNumber: User.phoneNumber });
            if (UserExists.length) {
                  res.status(409).json('phone number is already registered');
            } else {
                  try {
                        await User.save();
                        res.status(201).json({statusCode:200,message:'Account created sucessfully!...'});
                  } catch (error) {
                        res.status(500).json(error.message);
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
                  if (isMatched) {
                        const token = Authorization.Authorize(User?._doc);
                        const loggedUser = { user: User._id, username: User.username, email: User.email, phoneNumber: User.phoneNumber, token }
                        res.status(200).json({ statusCode: 200, message: "login success", user: loggedUser })
                  } else {
                        res.status(200).json({ statusCode: 401, message: "invalid credentials" });
                  }
            } else {
                  res.status(200).json({ statusCode: 404, message: "invalid username" });
            }
      } catch (error) {
            res.status(404).json(error.message);
      }

}

exports.UpdateUser = async (req, res) => {
      const User = req.body;
      const userId = req.query.user
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
            const User = await UserModel.findById(user);
            if (User) {
                  const userCart = await UserCartModel.findOne({ user: user })
                  if (!userCart) {
                        const newCart = new UserCartModel({ user, cartItems: [] });
                        await newCart.save();
                  }
                  const isExists = await UserCartModel.findOne({ user, cartItems: { $elemMatch: { itemId: item.itemId } } });;
                  if (isExists) {
                        return res.status(200).json({ statusCode: 409, message: 'item already exists in cart' })
                  }
                  const addedToCart = await UserCartModel.findOneAndUpdate({ user },
                        { $push: { cartItems: item } },
                        { new: true }
                  );
                  res.status(200).json({ statusCode: 200, data: addedToCart, message: 'cart item added' });
            } else {
                  res.status(200).json({ statusCode: 404, message: 'user not found' });
            }
      } catch (error) {
            res.status(400).json(error.message);
      }
}
exports.RemoveCartItem = async (req, res) => {
      const { user } = req.params;
      const item = req.body;
      try {
            const itemRemoved = await UserCartModel.findOneAndUpdate({ user },
                  { $pull: { cartItems: { itemId: item.itemId } } },
                  { new: true }
            );
            if (itemRemoved) {
                  res.status(200).json({ statusCode: 200, message: 'item removed', data: item?.itemId });
            } else {
                  res.status(200).json({ statusCode: 404, message: 'item not removed' });
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
            if(!updatedCart){
                 return res.status(200).json({statusCode:404,message:'cart not found'})
            }
            res.status(200).json({statusCode:200,message:'cart item updated',update:updatedCart})
      } catch (error) {
            res.status(400).json({statusCode:400,message:error.message})
      }
      

}


