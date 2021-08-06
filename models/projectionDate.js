const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectionDateSchema = new Schema({
    date: {
        years: { type: Number },
        months: { type: Number },
        date: { type: Number },
    }
});

const ProjectionDate = mongoose.model("ProjectionDate", ProjectionDateSchema);

module.exports = ProjectionDate;