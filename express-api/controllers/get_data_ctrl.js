const db = require("./../index.js");
const fs = require("fs");

const data_path = "./amount_data.json";

//the order here must be req, res can't change the order
const get_tran_data = async (req, res) => {
  try {
    //console.log(req.body);
    const tran_id = req.body.id;
    //console.log(tran_id);
    const data = await db.db("BankingDB").collection("transaction").findOne({
      user_id: tran_id,
    });
    //console.log(data);
    res.json(data);
    /**
    for await (const doc of data) {
      console.log(doc);
      res.json(doc);
    }
	**/
  } catch (error) {
    console.error("Error in get_data_ctrl.js file:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const add_amount = async (req, res) => {
  try {
    let total_amount = [];
    if (!fs.existsSync(data_path)) {
      fs.writeFileSync(data_path, "[]");
      total_amount.push(5000);
      fs.writeFileSync(data_path, JSON.stringify(total_amount, null));
    }
    total_amount = JSON.parse(fs.readFileSync(data_path));

    const amount_added = req.body.amount;
    total_amount[0] = total_amount[0] + amount_added;
    fs.writeFileSync(data_path, JSON.stringify(total_amount, null));
    res.json(total_amount[0]);
  } catch (error) {
    console.error("Error in getting the correct amount.", error);
    res.status(500).json({ error: "Failed to get the amount" });
  }
};

const sub_amount = async (req, res) => {
  try {
    let total_amount = [];
    if (!fs.existsSync(data_path)) {
      fs.writeFileSync(data_path, "[]");
      total_amount.push(5000);
      fs.writeFileSync(data_path, JSON.stringify(total_amount, null));
    }
    total_amount = JSON.parse(fs.readFileSync(data_path));

    const amount_added = req.body.amount;
    total_amount[0] = total_amount[0] - amount_added;
    fs.writeFileSync(data_path, JSON.stringify(total_amount, null));
    res.json(total_amount[0]);
  } catch (error) {
    console.error("Error in getting the correct amount.", error);
    res.status(500).json({ error: "Failed to get the amount" });
  }
};

const get_amount = async (req, res) => {
  try {
    let total_amount = [];
    let value;
    if (!fs.existsSync(data_path)) {
      fs.writeFileSync(data_path, "[]");
      total_amount.push(5000);
      fs.writeFileSync(data_path, JSON.stringify(total_amount, null));
    }
    value = JSON.parse(fs.readFileSync(data_path));
    res.json(value);
  } catch (error) {
    console.error("Error in getting total value.", error);
    res.status(500).json({ error: "Failed to get the total value." });
  }
};

module.exports = {
  get_tran_data,
  add_amount,
  get_amount,
  sub_amount,
};
