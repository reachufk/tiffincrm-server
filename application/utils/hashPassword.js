const bcrypt = require('bcrypt')
const HashPassword = async (password)=>{
    try {
        const saltMech = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,saltMech);
        return hash
    } catch (error) {
        return "fail"
    }
}

module.exports = {
    HashPassword
}