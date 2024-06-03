const fs = require("./node_modules/fs");
const tran_list = [];

fs.readFile("transaction_record.json", "utf8", (err, records) => {
  if (err) {
    console.error("Error reading file transaction_record.json: ", err);
    return;
  }
  const record = JSON.parse(records);

  record.forEach((each_record) => {
    tran_list.push(each_record);
  });
});
