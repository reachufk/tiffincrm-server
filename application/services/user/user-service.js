const Authorization = require('../../utils/authorization_util');
const UserModel = require('../../models/user/user-model');
const { interval } = require('rxjs');
const { map } = require('rxjs/internal/operators/map');

exports.RegisterUser = async (req, res) => {
      const User = new UserModel(req.body);
      try {
            const UserExists = await UserModel.find({ phoneNumber: User.phoneNumber });
            if (UserExists.length) {
                  res.status(409).send('phone number is already registered');
            } else {
                  try {
                        await User.save();
                        res.status(201).send('user created');
                  } catch (error) {
                        res.status(500).send(error.message);
                  }
            }
      } catch (error) {
            res.status(400).send(error.message);
      }

}

exports.Login = async (req, res) => {
      const payload = req.body;
      try {
            const User = await UserModel.findOne({ phoneNumber: payload.phoneNumber });
            if (User) {
                  const isMatched = await User.comparePassword(payload.password, User.password);
                  if (isMatched) {
                        const token = Authorization.Authorize(User?._doc);
                        const response = { name: User.name, phoneNumber: User.phoneNumber, token }
                        res.status(200).send(response)
                  } else {
                        res.status(401).send('invalid phone/password');
                  }
            } else {
                  res.status(404).send('invalid phone');
            }
      } catch (error) {
            res.status(404).send('invalid phone');
      }

}

exports.UpdateUser = async (req, res) => {
      const User = req.body;
      const userId = req.query.user
      try {
            const UpdateUser = await UserModel.findOneAndUpdate({ _id: userId }, User);
            if (UpdateUser) {
                  res.status(200).send('user updated');
            } else {
                  res.status(404).send('user not found');
            }
      } catch (error) {
            res.status(400).send(error.message);
      }

}

exports.GetUser = async (req, res) => {
      const userId = req.query.user;
      try {
            const User = await UserModel.findById(userId);
            if (User) {
                  res.status(200).send(User)
            } else {
                  res.status(404).send('user not found')
            }
      } catch (error) {
            res.status(400).send(error.message)
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
                  res.status(200).send({ users, totalCount, totalPages })
            } else {
                  res.status(404).send('no user found')
            }

      } catch (error) {
            res.status(400).send(error.message)
      }
}

exports.GetOrders = async(req,res)=>{
//   res.set("Content-Type", "text/event-stream")
//   res.set("Connection", "keep-alive")
//   res.set("Cache-Control", "no-cache")
//   res.set("Access-Control-Allow-Origin", "*")
//   console.log("client connected to sse")
//   setInterval(function(){
//       res.status(200).write(`data: ${JSON.stringify('H')}\n\n`)
//   }, 100)
}

