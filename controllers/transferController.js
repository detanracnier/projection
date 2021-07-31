const db = require("../models");

// Defining methods for the transferController
module.exports = {
  create: function (req, res) {
    db.Transfer
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findAll: function (req, res) {
    db.Transfer
      .find(req.body)
      .sort({ creationDate: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    console.log(req.body);
    db.Transfer
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  delete: function (req, res) {
    db.Transfer
      .findByIdAndRemove({_id:req.params.id})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};