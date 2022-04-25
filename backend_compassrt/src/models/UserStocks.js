const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//creating schema with specified fields
const UserStocksSchema = new Schema({
  user_id: String,
  watch_list: Array
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("UserStocks", UserStocksSchema);
