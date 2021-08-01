const moment = require('moment');

const newTransfer = {
    fromAccountId: 1,
    toAccountId: 2,
    value: 0,
    occurrence: "One-time",
    date:moment().toObject(),
    exceptions:[]}
export default newTransfer;