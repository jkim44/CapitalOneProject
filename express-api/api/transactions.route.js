const express = require("./../node_modules/express");
//const transactionCtrl = require("./transactionsCtrl.controller.js");
const tran_model = require("./../models/transaction_schema.js");
const router = express.Router();
const category_ctrl = require("./../controllers/transactions_ctrl.js");

router.get("/transactions", category_ctrl.tran_category);
router.get("/", (req, res) => {
  res.send("hey");
});
/*
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    await tran_model.create(data);

    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data: ", error);
    res.status(500).json({ error: "Failed to store data" });
  }
});
*/
//router.route("/").get((req, res)=> res.send("hello"));

//export default router
module.exports = router;
