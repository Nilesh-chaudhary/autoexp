const JsonModel = require("../models/Json");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

class jsonController {
  static createJson = async (req, res) => {
    try {
      const { transaction_messages } = req.body;
      console.log("working");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await transaction_messages.map(
        async (transaction_message) => {
          const prompt = `Extract the following information from the transaction message and format it as a JSON object:

        **Fields:**
        - Amount (e.g., "192.00")
        - Date (in DD-MM-YY format, e.g., "27-01-24")
        - Account Number (e.g., "7968")
        - Transaction Type (either "debit" or "credit")
        - Person Name (if available, e.g., "GUJARAT STATE ROAD TRANSPORT CORPORATION")
        
        **Sample Response:**
        {
          "transaction_id": "402763905551",
          "amount": "192.00",
          "date": "27-01-24",
          "account_number": "7968",
          "transaction_type": "debit",
          "person_name": "GUJARAT STATE ROAD TRANSPORT CORPORATION"
        }
        
        **Transaction Message:**
        ${transaction_message}
        
        **Important:**
        - Ensure the output is a valid JSON object with no extra text.
        - Adhere strictly to the specified date format.
        - Handle cases where the person name might be missing.
        - Prioritize accuracy and completeness in extracting the required information.
        - Txn id can also be extracted from the transaction message on basis of UPI reference number.
        -Even if the extraction not possible as the required information is not available in the provided transaction message, return empty values for the fields.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          console.log("response", response);
          const text = response.text();
          console.log("text", text);
          const jsontxt = text.slice(
            text.indexOf("{"),
            text.lastIndexOf("}") + 1
          );
          // if (!transaction_message) {
          //   return res
          //     .status(400)
          //     .json({ error: "Transaction message not provided" });
          // }

          // const chatGPTResponse = await openAi.chat.completions.create({
          //   model: "gpt-3.5-turbo",
          //   messages: [
          //     {
          //       role: "user",
          //       content: `Extract {amount, date, category,description, transaction_id }fields from the transaction message: "${transaction_message} and just output json format`,
          //     },
          //   ],
          // });
          const txnObj = JSON.parse(jsontxt);
          console.log(txnObj);

          // // Extracted fields from the ChatGPT response (dummy values, replace with actual logic)
          const amount = txnObj.amount;
          const date = txnObj.date;
          const account_number = txnObj.account_number;
          let transaction_type = txnObj.transaction_type;
          const person_name = txnObj.person_name;
          const transaction_id = txnObj.transaction_id;
          // const description = chatGPTResponse.description;
          // const transaction_id = chatGPTResponse.transaction_id;

          if (transaction_type == "" || transaction_type == null) {
            transaction_type = "credit";
          }
          let parsedDate;
          if (date) {
            const parts = date.split("-"); // Split the string into day, month, and year parts
            console.log("parts", parts);
            const mongoDateFormat = `20${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange the parts into "YYYY/MM/DD" format

            parsedDate = new Date(mongoDateFormat);

            // Now you can use the parsedDate in your MongoDB field
            console.log(parsedDate);
          } else {
            parsedDate = new Date();
            console.log(parsedDate);
          }

          const Json = new JsonModel({
            amount,
            date: parsedDate,
            account_number,
            transaction_type,
            person_name,
            transaction_id,
          });
          await Json.save();

          return {
            amount,
            date: parsedDate,
            account_number,
            transaction_type,
            person_name,
            transaction_id,
          };
        }
      );
      const results = await Promise.all(result);
      res.send({
        status: "expense created successfully",
        data: {
          results,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Fck" });
    }
  };

  // get total of amounts of all transactions
  static getTotal = async (req, res) => {
    try {
      const total = await JsonModel.aggregate([
        {
          $group: {
            _id: "$transaction_type",
            total: {
              $sum: {
                $toDouble: "$amount",
              },
            },
          },
        },
      ]);
      const creditTotal = total.find((item) => item._id === "credit") || {
        total: 0,
      };
      const debitTotal = total.find((item) => item._id === "debit") || {
        total: 0,
      };

      res.json({ credit: creditTotal.total, debit: debitTotal.total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  };

  static fetchAllTransactions = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate && !endDate) {
        const data = await JsonModel.find();
        return res.json({ data });
      } else if (!startDate) {
        const data = await JsonModel.find({
          date: {
            $lte: endDate,
          },
        });
        return res.json({ data });
      } else if (!endDate) {
        const data = await JsonModel.find({
          date: {
            $gte: startDate,
          },
        });
        return res.json({ data });
      }
      const data = await JsonModel.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      console.log("Data:", data);
      res.json({ data });
    } catch (err) {}
  };

  static getDateWiseTotal = async (req, res) => {
    try {
      // Fetch all transactions from the database
      const allTransactions = await JsonModel.find();

      // Separate transactions into debit and credit based on transaction_type
      const debitTransactions = allTransactions.filter(
        (transaction) => transaction.transaction_type === "debit"
      );
      const creditTransactions = allTransactions.filter(
        (transaction) => transaction.transaction_type === "credit"
      );

      // Extract relevant fields for the output
      const mapTransactionFields = (transactions) =>
        transactions.map(({ date, amount }) => ({ date, amount }));

      // Create the desired output
      const output = {
        debit: mapTransactionFields(debitTransactions),
        credit: mapTransactionFields(creditTransactions),
      };

      res.json(output);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

module.exports = jsonController;
