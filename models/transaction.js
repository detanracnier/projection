const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    type: { type: String, required: true },
    label: { type: String, required: true },
    accountId: { type: Number, required: true },
    date: {
        years: { type: Number },
        months: { type: Number },
        date: { type: Number },
    },
    exceptions: [{
        date: {
            years: { type: Number },
            months: { type: Number },
            date: { type: Number },
        },
        offset: { type: Number }
    }],
    occurrence: { type: String, required: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;