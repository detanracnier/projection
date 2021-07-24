const transactionController = require("../controllers/transactionController");
const router = require("express").Router();

router.route("/")
.post(transactionController.create);
router.route("/:id")
.put(transactionController.update);
router.route("/search")
.post(transactionController.findAll);
router.route("/delete/:id")
.post(transactionController.delete);

module.exports = router;