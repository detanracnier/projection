const path = require("path");
const router = require("express").Router();
const transactionRoutes = require("./transaction_routes");
const transferRoutes = require("./transfer_routes");
const accountRoutes = require("./account_routes");


// Use routes
router.use("/api/transaction", transactionRoutes);
router.use("/api/transfer", transferRoutes);
router.use("/api/account", accountRoutes);

router.use("*", (req, res) => {
    console.log(req.originalUrl);
    console.log("fallback hit");
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;