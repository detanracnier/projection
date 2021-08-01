const moment = require('moment');

const newTransaction = {
    type: "bill",
    label: "",
    value: 0,
    occurrence: "One-time",
    accountId: 1,
    date: moment().toObject(),
    exceptions: [] }
export default newTransaction;