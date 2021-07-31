const transferController = require("../controllers/transferController");
const router = require("express").Router();

router.route("/")
.post(transferController.create);
router.route("/:id")
.put(transferController.update);
router.route("/search")
.post(transferController.findAll);
router.route("/delete/:id")
.post(transferController.delete);

module.exports = router;