const db = require("./../index.js");

const save_new_category = async (req, res) => {
  try {
    const id = req.body.id;
    //console.log(id);
    const result_find = await db
      .db("BankingDB")
      .collection("transaction")
      .findOne({ user_id: id });
    //console.log(result_find);
    const transactions = [
      /**
      {
        tran_id: id,
        amount: result_find.amount,
      },
	  **/
    ];
    //console.log("45");
    //find the max category id
    let cat_id;
    const result_sort = await db
      .db("BankingDB")
      .collection("category")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    console.log(result_sort);
    if (result_sort[0] == null) cat_id = 1;
    else {
      cat_id = result_sort[0].id + 1;
    }
    const category = {
      id: cat_id,
      name: req.body.category,
      transactions: transactions,
    };
    const result = await db
      .db("BankingDB")
      .collection("category")
      .insertOne(category);
    console.log(result);
  } catch (error) {
    console.error("Error storing category data: ", error);
    res.status(500).json({ error: "Failed to store category data" });
  }
};

const get_category_list = async (req, res) => {
  try {
    const result_get_list = await db
      .db("BankingDB")
      .collection("category")
      .find()
      .sort({ id: -1 })
      .toArray();
    res.json(result_get_list);
  } catch (error) {
    console.log("Error gettingn category_list:", error);
    res.status(500).json({ error: "Failed to get category list." });
  }
};

module.exports = {
  save_new_category,
  get_category_list,
};
