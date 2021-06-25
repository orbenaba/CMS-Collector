const { UserModel } = require("../../Schemas/user.schemas")

module.exports = async function validateEmail(email) {
    const user = await UserModel.findOne({ email })
    return user
}
