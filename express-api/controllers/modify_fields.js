const db = require("./../index.js");

const modify_note = async (req, res) => {
  try {
    const tran_id = req.body.id;
    const filter = { user_id: tran_id };
    console.log(req.body.note);
    const note_to_save = {
      $set: {
        note: req.body.note,
      },
    };
    const result = await db
      .db("BankingDB")
      .collection("transaction")
      .updateOne(filter, note_to_save);
    res.status(200).json({ message: "Data(notes) stored successfully" });
  } catch (error) {
    console.error("Error in modify_fileds.js:", error);
    res.status(500).json({ error: "Failed to change notes." });
  }
};

const modify_category = async (req, res) => {
  try {
    const tran_id = req.body.id;
    const filter = { user_id: tran_id };
    console.log(req.body.category);
    const category_to_set = {
      $set: {
        category: req.body.category,
      },
    };

    //from transaction collection find the tran with tran_id
    const result_find = await db
      .db("BankingDB")
      .collection("transaction")
      .findOne({
        user_id: tran_id,
      });
    //console.log(result_find);
    const old_category = result_find.category;

    //update the category field inside transaction with user_id:tran_id
    const result = await db
      .db("BankingDB")
      .collection("transaction")
      .updateOne(filter, category_to_set);
    console.log(result);

    //update category collection
    //add transaction under the new category
    const filter_old = { name: old_category };
    const filter_new = { name: req.body.category };

    if (!(old_category === req.body.category)) {
      const add_tran_to_category = {
        $push: {
          transactions: {
            tran_id: tran_id,
            amount: result_find.amount,
          },
        },
      };
      const result_add = await db
        .db("BankingDB")
        .collection("category")
        .updateOne(filter_new, add_tran_to_category);

      //delete transaction under old category
      const remove_tran = {
        $pull: {
          transactions: {
            tran_id: tran_id,
            amount: result_find.amount,
          },
        },
      };
      const result_remove = await db
        .db("BankingDB")
        .collection("category")
        .updateOne(filter_old, remove_tran);
    }
    res.status(200).json({ message: "category modified!" });
  } catch (error) {
    console.error("Error in modify_fields.js modify category:", error);
    res.status(500).json({ error: "Failed to change category." });
  }
};

module.exports = {
  modify_note,
  modify_category,
};
