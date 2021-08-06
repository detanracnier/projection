const db = require("../models");

// Defining methods for the projectionDate
module.exports = {
  create: function (req, res) {
    db.ProjectionDate
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findAll: function (req, res) {
    db.ProjectionDate
      .find(req.body)
      .sort({ creationDate: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    console.log(req.body);
    db.ProjectionDate
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  delete: function (req, res) {
    db.ProjectionDate
      .findByIdAndRemove({_id:req.params.id})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};