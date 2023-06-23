// const { Configuration, OpenAIApi } = require("openai");
// const readlineSync = require("readline-sync");
// require("dotenv").config();

// (async () => {
//   const configuration = new Configuration({
//     apiKey: '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',
//   });

//   const openai = new OpenAIApi(configuration);

//   const history = [];

//   while (true) {
//     const user_input = readlineSync.question("Your input: ");

//     const messages = [];
//     for (const [input_text, completion_text] of history) {
//       messages.push({ role: "user", content: input_text });
//       messages.push({ role: "assistant", content: completion_text });
//     }

//     messages.push({ role: "user", content: user_input });

//     try {
//       const completion = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: messages,
//       });

//       const completion_text = completion.data.choices[0].message.content;
//       console.log(completion_text);

//       history.push([user_input, completion_text]);

//       const user_input_again = readlineSync.question(
//         "\nWould you like to continue the conversation? (Y/N)"
//       );
//       if (user_input_again.toUpperCase() === "N") {
//         return;
//       } else if (user_input_again.toUpperCase() !== "Y") {
//         console.log("Invalid input. Please enter 'Y' or 'N'.");
//         return;
//       }
//     } catch (error) {
//       if (error.response) {
//         console.log(error.response.status);
//         console.log(error.response.data);
//       } else {
//         console.log(error.message);
//       }
//     }
//   }
// })();



const path = require('path');
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const { render } = require('ejs');

const app = express();
app.use(express.json());


const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const history = [];

app.set("view engine", "ejs"); // Set the view engine to EJS
app.set('views', path.join(__dirname, 'view')); // Set the views directory
app.get("/", (req, res) => {
  res.render("index");

});


app.post("/chat", async (req, res) => {
  const { userInput } = req.body;

  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: "user", content: input_text });
    messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: userInput });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const completion_text = completion.data.choices[0].message.content;
    console.log(completion_text);

    history.push([userInput, completion_text]);

    res.send(completion_text);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during chat.");
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

