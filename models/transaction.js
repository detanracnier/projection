const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    type: { type: String, required: true },
    label: { type: Number, required: true },
    accountId: { type: Number, required: true },
    date: { type: Date },
    occurrence: { type: String, required: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;