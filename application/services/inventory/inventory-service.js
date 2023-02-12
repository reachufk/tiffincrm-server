const CatagoryModel = require('../../models/inventory/catagory-model');
const CatagoryItemModel = require('../../models/inventory/catagoryItem-model');
const AwsUtility = require('../../utils/aws-utils');
const SearchAndPaginate = require('../../utils/paginator_util');
const CheckDocument = require('../../utils/docExists_util');

exports.SaveCatagory = async (req, res) => {
      const Catagory = new CatagoryModel(req.body);
      const isExists = await CatagoryModel.find({ catagoryName: Catagory?.catagoryName });
      if (isExists && isExists.length) {
            res.status(409).send('catagory name alraedy exists');
      } else {
            try {
                  const imageData = {
                        fileName: Catagory.catagoryImageName,
                        fileType: Catagory.catagoryImageType,
                        fileData: new Buffer.from(Catagory?.catagoryImage?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                  }
                  const awsImageLocation = await AwsUtility.UploadCatagoryImage(imageData);
                  if (awsImageLocation) {
                        Catagory.catagoryImage = awsImageLocation
                        await Catagory.save();
                        res.status(201).send('catagory saved');
                  }
            } catch (error) {
                  res.status(400).send(error.message);
            }
      }
}


exports.GetCatagory = async (req, res) => {
      const CatagoryID = req.query.catagory;
      try {
            const CatagoryExists = await CatagoryModel.findById({ CatagoryID });
            if (CatagoryExists) {
                  res.status(200).send(CatagoryExists);
            } else {
                  res.status(404).send('catagory not found');
            }
      } catch (error) {
            res.status(404).send(error.message);
      }

}

exports.UpdateCatagory = async (req, res) => {
      const CatagoryID = req.query.catagory;
      const Catagory = req.body;
      try {
            const CatagoryUpdated = await CatagoryModel.findOneAndUpdate({ _id: CatagoryID }, Catagory);
            if (CatagoryUpdated) {
                  res.status(200).send('catagory updated');
            } else {
                  res.status(404).send('catagory not found');
            }
      } catch (error) {
            res.status(400).send(error.message);
      }

}

exports.DeleteCatagory = async (req, res) => {
      const CatagoryID = req.query.catagory;
      try {
            const CatagoryDeleted = await CatagoryModel.findByIdAndDelete(CatagoryID);
            if (CatagoryDeleted) {
                  res.status(200).send('catagory deleted');
            } else {
                  res.status(404).send('catagory not found');
            }
      } catch (error) {
            res.status(404).send(error.message);
      }

}

exports.GetCatagories = async (req, res) => {
      try {
            const Catagories = await CatagoryModel.find({});
            if (Catagories && Catagories.length) {
                  res.status(200).send(Catagories)
            } else {
                  res.status(404).send('no catagories found');
            }
      } catch (error) {
            res.status(400).send(error.message);
      }

}

exports.SaveCatagoryItem = async (req, res) => {
      const CatagoryItem = new CatagoryItemModel(req.body);
      const catagoryID = CatagoryItem.catagory ? CatagoryItem.catagory : ''
      try {
            const catagoryExists = await CheckDocument(CatagoryModel, catagoryID);
            if (catagoryExists) {
                  const isExists = await CatagoryItemModel.find({ itemName: CatagoryItem.itemName });
                  if (isExists && isExists.length) {
                        res.status(409).send('item name already exists');
                  } else {
                        try {
                              await CatagoryItem.save();
                              res.status(201).send('item added to catagory')
                        } catch (error) {
                              res.status(400).send(error.message)
                        }
                  }
            } else {
                  res.status(404).send('catagory not found')
            }
      } catch (error) {
            res.status(400).send(error.message)
      }


}

exports.GetCatagoryItem = async (req, res) => {
      const CatagoryItemID = req.query.catagoryItemID;
      try {
            const CatagoryItem = await CatagoryItemModel.findById(CatagoryItemID);
            if (CatagoryItem) {
                  res.status(200).send(CatagoryItem)
            } else {
                  res.status(404).send({ message: 'item not found' })
            }
      } catch (error) {
            res.status(400).send(error.message)
      }

}

exports.UpdateCatagoryItem = async (req, res) => {
      const CatagoryItemID = req.query.catagoryItemID;
      const CatagoryItem = req.body;
      const UpdateResponse = await CatagoryItemModel.findOneAndUpdate({ _id: CatagoryItemID }, CatagoryItem);
      if (UpdateResponse) {
            res.status(200).send('catagory item updated')
      } else {
            res.status(404).send('catagory item not found')
      }
}

exports.DeleteCatagoryItem = async (req, res) => {
      const CatagoryItemID = req.query.catagoryItemID;
      const DeleteResponse = await CatagoryItemModel.findOneAndDelete({ _id: CatagoryItemID });
      if (DeleteResponse) {
            res.status(200).send('catagory item deleted')
      } else {
            res.status(404).send('catagory item not found')
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
                  res.status(200).send({
                        items, totalCount, totalPages
                  });
            } else {
                  res.status(404).send({ message: 'no items found' });
            }

      } catch (err) {
            res.status(500).send(err.message? err.message:err);
      }

}