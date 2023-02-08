const Authorization = require('../../utils/authorization_util');
const AdminModel = require('../../models/admin/admin-model')

exports.RegisterAdmin = async (req, res) => {
      const Admin = new AdminModel(req.body)
      const AdminExists = await AdminModel.find({ email: Admin.email });
      if (AdminExists.length) {
            res.status(409).send('phone number is already registered');
      } else {
            const AdminSaved = await Admin.save();
            if (AdminSaved) {
                  res.status(201).send('admin created');
            }else{
                  res.status(500).send('internal server error');
            }
      }
}

exports.Login = async (req, res) => {
      const {email,password} = req.body;
      const Admin = await AdminModel.findOne({ email });
      if (Admin) {
           const isMatched = await Admin.comparePassword(password,Admin.password);
           if(isMatched){
            const token = Authorization.Authorize(Admin);
            const response ={name:Admin.name,email:Admin.email,token}
            res.status(200).send(response)
           }else{
            res.status(401).send('invalid phone/password');
           }
      }else{
            res.status(404).send('invalid phone');
      }
}

