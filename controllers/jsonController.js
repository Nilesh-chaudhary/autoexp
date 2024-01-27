const QuestionModel = require("../models/Question");
const { OpenAIAPI } = require('openai');

class jsonController {
  // ... (other methods)

  static processTransaction = async (req, res) => {
    try {
      const { transaction_message } = req.body;

      if (!transaction_message) {
        return res.status(400).json({ error: 'Transaction message not provided' });
      }

      // Use ChatGPT to extract fields from the entered input
      const chatGPTResponse = await openai.complete({
        model: 'text-davinci-003',
        prompt: `Extract {amount, date, category, transaction_id}fields from the transaction message: "${transaction_message}"`,
        max_tokens: 150,
      });

      // Extracted fields from the ChatGPT response (dummy values, replace with actual logic)
      const amount = chatGPTResponse.amount;
      const date = chatGPTResponse.date;
      const category = chatGPTResponse.category;
      const transaction_id = chatGPTResponse.transaction_id;

      res.json({ amount, date, category, transaction_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

module.exports = jsonController;
