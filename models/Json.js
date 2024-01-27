const mongoose = require("mongoose");

const jsonSchema = new mongoose.Schema(
  {
    amount: {
      type: Number, // Assuming amount is a numerical value, you can adjust the type accordingly
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String, // Assuming category is a string, you can adjust the type accordingly
      required: true,
    },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

const JsonModel = mongoose.model("Json", jsonSchema);

module.exports = JsonModel;
