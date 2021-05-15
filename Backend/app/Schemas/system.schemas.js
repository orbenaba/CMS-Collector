// One system of the domain/ip that contains data about the name of the system,
// the categories that titled the system and the system version; For ex. Windows 10
const mongoose = require('mongoose');
const SystemSchema = new mongoose.Schema({
    name: {
        type: String
    },
    categories: {
        type: [String]
    },
    version: {
        type: String,
        default: "0.0"
    }
})

const SystemModel = mongoose.model('System', SystemSchema);
module.exports = { SystemModel, SystemSchema };



