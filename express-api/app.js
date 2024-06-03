const express = require("./node_modules/express");
const cors = require("./node_modules/cors");
//const transactions = require("./api/transactions.route.js");
const bodyParser = require("./node_modules/body-parser");
const router = express.Router();
const transaction_ctrl = require("./controllers/transactions_ctrl.js");
const get_data = require("./controllers/get_data_ctrl.js");
const modify_fields = require("./controllers/modify_fields.js");
const save_category = require("./controllers/category_ctrl.js");

const app = express();

app.use(cors());
//be able to send and receive json
app.use(express.json());
app.use(bodyParser.json());

/*
app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});
*/

//app.use("/api/v1", transactions);
//app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use("/api/v1/list", transaction_ctrl.get_tran_list);
app.use("/api/v1/category", save_category.save_new_category);
app.use("/api/v1/transaction", transaction_ctrl.tran_save);
app.use("/api/v1/data", get_data.get_tran_data);
app.use("/api/v1/note", modify_fields.modify_note);
app.use("/api/v1/category_list", save_category.get_category_list);
app.use("/api/v1/save_category", modify_fields.modify_category);
app.use("/api/v1/amount", get_data.add_amount);
app.use("/api/v1/get_amount", get_data.get_amount);
app.use("/api/v1/sub_amount", get_data.sub_amount);
/**
app.use("/api/v1/transactions", (req, res) => {
console.log("body: " + JSON.stringify(req.body));
}

);
**/
module.exports = app;
