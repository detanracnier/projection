const projectionDateController = require("../controllers/projectionDateController");
const router = require("express").Router();

router.route("/")
.post(projectionDateController.create);
router.route("/:id")
.put(projectionDateController.update);
router.route("/search")
.post(projectionDateController.findAll);

module.exports = router;