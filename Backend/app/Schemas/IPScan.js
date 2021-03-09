const mongoose = require('mongoose');
const { SystemSchema, SystemModel } = require('./System');



const IPScanSchema = new mongoose.Schema({
    // Asset is the queried ip
    asset: {
        type: String
    },
    // All the results of the queried asset
    systems: {
        type: [SystemSchema],
        default: []
    }
})


const IPScanModel = mongoose.model('IPScan', IPScanSchema);

module.exports = { IPScanSchema, IPScanModel };