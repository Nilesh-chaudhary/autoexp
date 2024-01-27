const mongoose = require("mongoose");

const jsonSchema = new mongoose.Schema(
  {
    amount: {
      type: String, // Assuming amount is a numerical value, you can adjust the type accordingly
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    transaction_type: {
      type: String, // Assuming category is a string, you can adjust the type accordingly
      required: false,
    },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    account_number: {
      type: String,
      required: false,
    },
    person_name: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const JsonModel = mongoose.model("Json", jsonSchema);

module.exports = JsonModel;
