const { UserModel } = require("../../Schemas/User")

module.exports = async function validateEmail(email){
    const user = await UserModel.findOne({ email})
    return user
}
