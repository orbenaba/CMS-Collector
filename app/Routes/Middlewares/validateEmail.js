const { UserModel } = require("../../Schemas/user.schemas")

module.exports = async function validateEmail(email){
    console.log("in valid email")
    const user = await UserModel.findOne({ email})
    console.log("User found")
    console.log(user, email)
    return user
}
