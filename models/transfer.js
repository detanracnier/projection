const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransferSchema = new Schema({
    fromAccountId: { type: Number, required: true },
    toAccountId: { type: Number, required: true },
    date: {
        years: { type: Number},
        months: { type: Number },
        date: { type: Number },
     },
    occurrence: { type: String, required: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, default: Date.now }
});

const Transfer = mongoose.model("Transfer", TransferSchema);

module.exports = Transfer;