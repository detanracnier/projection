const accountController = require("../controllers/accountController");
const router = require("express").Router();

router.route("/")
.post(accountController.create);
router.route("/:id")
.put(accountController.update);
router.route("/search")
.post(accountController.findAll);

module.exports = router;