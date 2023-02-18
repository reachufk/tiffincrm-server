// async function SearchAndPaginateCollection(collection, keyword, pageNo, pageSize,catagory) {
//   try {
//     if(catagory){
//       const results = await collection.find({ $text: { $search: keyword },catagory:catagory })
//       .skip((pageNo - 1) * pageSize)
//       .limit(pageSize)
//       .exec();
//     return results;
//     }else{
//       const results = await collection.find({ $text: { $search: keyword } })
//       .skip((pageNo - 1) * pageSize)
//       .limit(pageSize)
//       .exec();
//     return results;
//     }
//   } catch (err) {
//     return err
//   }
// }

// module.exports = SearchAndPaginateCollection;