const JsonModel = require("../models/Json");
const key = process.env.API_KEY;
console.log("KEY:", key);
const { OpenAI } = require("openai");

// const openAi = new OpenAIApi(
//   new Configuration({
//     apiKey: key,
//   })
// );
const openAi = new OpenAI({
  apiKey: key,
  organization: "org-Tq5GjBSWRM9uIPjVcfNUBhy1",
});
class jsonController {
  static createJson = async (req, res) => {
    try {
      console.log("working");
      //   const { transaction_message } = req.body;
      const transaction_message =
        "Money Transfer:Rs 192.00 from HDFC Bank A/c **7968 on 27-01-24 to GUJARAT STATE ROAD TRANSPORT CORPORATION UPI: 402763905551 Not you? Call 18002586161";

      if (!transaction_message) {
        return res
          .status(400)
          .json({ error: "Transaction message not provided" });
      }

      const chatGPTResponse = await openAi.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Extract {amount, date, category,description, transaction_id }fields from the transaction message: "${transaction_message} and just output json format`,
          },
        ],
      });

      // Extracted fields from the ChatGPT response (dummy values, replace with actual logic)
      const amount = chatGPTResponse.amount;
      const date = chatGPTResponse.date;
      const description = chatGPTResponse.description;
      const transaction_id = chatGPTResponse.transaction_id;

      const Json = new JsonModel({
        amount,
        date,
        description,
        category,
        transaction_id,
      });
      await Json.save();
      res.send({ status: "expense created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Fck" });
    }
  };
}

module.exports = jsonController;
