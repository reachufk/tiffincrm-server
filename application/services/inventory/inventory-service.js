const CatagoryModel = require('../../models/inventory/catagory-model');
const CatagoryItemModel = require('../../models/inventory/catagoryItem-model');
const AwsUtility = require('../../utils/aws-utils');
const SearchAndPaginate = require('../../utils/paginator_util');
const CheckDocument = require('../../utils/docExists_util');

exports.SaveCatagory = async (req, res) => {
      const Catagory = new CatagoryModel(req.body);
      const isExists = await CatagoryModel.find({ catagoryName: Catagory?.catagoryName });
      if (isExists && isExists.length) {
            res.status(409).json('catagory name alraedy exists');
      } else {
            try {
                  const imageData = {
                        fileName: Catagory._id,
                        fileType: Catagory.catagoryImageType?.split('/')[1],
                        fileData: new Buffer.from(Catagory?.catagoryImage?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                  }
                  const awsImageLocation = await AwsUtility.UploadCatagoryImage(imageData);
                  if (awsImageLocation) {
                        Catagory.catagoryImage = awsImageLocation
                        await Catagory.save();
                        res.status(201).json({ message: 'catagory saved', statusCode: 200, catagory: Catagory });
                  }
            } catch (error) {
                  res.status(400).json(error.message);
            }
      }
}

exports.UpdateCatagory = async (req, res) => {
      const CatagoryID = req.params.catagoryId;
      const Catagory = req.body;
      try {
            if (Catagory?.catagoryImage?.includes('base64')) {
                  const imageData = {
                        fileName: Catagory._id,
                        fileType: Catagory.catagoryImageType,
                        fileData: new Buffer.from(Catagory?.catagoryImage?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                  }
                  const awsImageLocation = await AwsUtility.UploadCatagoryImage(imageData);
                  Catagory.catagoryImage = awsImageLocation
            }
            const CatagoryUpdated = await CatagoryModel.findOneAndUpdate({ _id: CatagoryID }, Catagory);
            if (CatagoryUpdated) {
                  res.status(200).json({ message: 'catagory updated', statusCode: 200, catagory: Catagory });
            } else {
                  res.status(404).json('catagory not found');
            }
      } catch (error) {
            res.status(400).json(error.message);
      }

}

exports.DeleteCatagory = async (req, res) => {
      const CatagoryID = req.params.catagoryId;
      try {
            const CatagoryDeleted = await CatagoryModel.findByIdAndDelete(CatagoryID);
            if (CatagoryDeleted) {
                  const fileName = CatagoryDeleted._id + '.' + CatagoryDeleted.catagoryImageType.split('/')[1]
                  const isDeleted = await AwsUtility.DeleteCatagoryImage(fileName)
                  if(isDeleted){
                        res.status(200).json({ message: 'catagory deletd', statusCode: 200 });
                  }else{
                        res.status(200).json({ message: 'catagory deletd', statusCode: 200,awsError:'image not deleted' }); 
                  }  
            } else {
                  res.status(404).json('catagory not found');
            }
      } catch (error) {
            res.status(404).json(error.message);
      }

}

exports.GetCatagories = async (req, res) => {
      try {
            const Catagories = await CatagoryModel.find({});
            if (Catagories && Catagories.length) {
                  res.status(200).json(Catagories)
            } else {
                  res.status(204).send({ message: 'no catagories found', statusCode: 204 });
            }
      } catch (error) {
            res.status(400).json(error.message);
      }

}

exports.SaveCatagoryItem = async (req, res) => {
      console.log('here')
      const CatagoryItem = new CatagoryItemModel(req.body);
      const catagoryID = CatagoryItem.catagory ? CatagoryItem.catagory : ''
      try {
            const catagoryExists = await CheckDocument(CatagoryModel, catagoryID);
            if (catagoryExists) {
                  const isExists = await CatagoryItemModel.find({ itemName: CatagoryItem.itemName });
                  if (isExists && isExists.length) {
                        res.status(409).json({ message: 'item already exists', statusCode: 409 });
                  } else {
                        try {
                              await CatagoryItem.save();
                              res.status(201).json({ message: 'item added', statusCode: 200, catagoryItem: CatagoryItem });
                        } catch (error) {
                              res.status(400).json(error.message)
                        }
                  }
            } else {
                  res.status(404).json('catagory not found')
            }
      } catch (error) {
            res.status(400).json(error.message)
      }


}

exports.UpdateCatagoryItem = async (req, res) => {
      const CatagoryItemID = req.query.catagoryItem;
      const CatagoryItem = req.body;
      const UpdateResponse = await CatagoryItemModel.findOneAndUpdate({ _id: CatagoryItemID }, CatagoryItem);
      if (UpdateResponse) {
            res.status(200).json('catagory item updated')
      } else {
            res.status(404).json('catagory item not found')
      }
}

exports.DeleteCatagoryItem = async (req, res) => {
      const CatagoryItemID = req.query.catagoryItem;
      const DeleteResponse = await CatagoryItemModel.findOneAndDelete({ _id: CatagoryItemID });
      if (DeleteResponse) {
            res.status(200).json('catagory item deleted')
      } else {
            res.status(404).json('catagory item not found')
      }
}

exports.GetCatagoryItems = async (req, res) => {
      try {
            const { pageNo, pageSize, keyword, catagory } = req.body
            const query = {
                  catagory,
                  itemName: { $regex: keyword, $options: "i" },
            };
            const totalCount = await CatagoryItemModel.countDocuments(query);
            const totalPages = Math.ceil(+totalCount / +pageSize);
            const items = await CatagoryItemModel.find(query)
                  .skip((+pageNo - 1) * +pageSize)
                  .limit(+pageSize)
                  .exec();

            if (items && items.length) {
                  res.status(200).json({
                        items, totalCount, totalPages,statusCode:200
                  });
            } else {
                  res.status(204).json({ message: 'no items found',statusCode:204 });
            }

      } catch (err) {
            res.status(500).json(err.message ? err.message : err);
      }

}