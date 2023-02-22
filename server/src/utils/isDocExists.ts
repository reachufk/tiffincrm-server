export const isExists = async (collection: any, id: string) => {
      try {
            const exists = await collection.findById(id);
            if (exists) {
                  return true
            } else {
                  return false
            }
      } catch (err) {
            throw err;
      }
}
