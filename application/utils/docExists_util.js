async function CheckDocument(collection, id) {
      if(!id){
            return false
      }
      try {
            const exists = await collection.findById(id);
            if (exists) {
                  return true
            } else {
                  return false
            }
      } catch (err) {
            return err
      }
}

module.exports = CheckDocument;