const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    id: { type: Number, required: true },
    label: { type: String, required: true },
    balance: { type: Number, required: true },
    creationDate: { type: Date, default: Date.now }
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;