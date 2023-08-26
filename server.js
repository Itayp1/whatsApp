const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
dotenv.config();
const { sendMessages } = require("./openai");
const whatsApp = require("./whatsApp");

app.use(bodyParser.json()); // for parsing application/json
app.get("/health", async (req, res) => {
  res.status(200).send({ status: "UP" }).end();
});

app.get("/webhook", function (req, res) {
  console.log(req.body);
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];
  console.log(req.query);
  console.log(req.url);
  console.log(req.body);

  if (mode && token) {
    return res.send(challenge);
  }

  return res.status(200);
});

//webhook on new message
// app.post("/webhook", function (req, res) {
//   //   console.log(req.body);

//   if (req.body.entry[0]?.changes[0]?.value?.contacts) {
//     //message from the customer
//     const recipient = req.body.entry[0].changes[0].value.contacts[0].wa_id;

//     console.log("got messagr from the cliet recipient" + recipient);
//     console.log("res", req.body.entry[0].changes[0].value);
//     const reqBody = {
//       to: recipient,
//       messaging_product: "whatsapp",
//       text: {
//         body: "שלום הגעתם לבוט של איתי",
//       },
//     };
//     axios
//       .post(
//         "https://graph.facebook.com/v17.0/113481255179838/messages?access_token=EAAyW0AzZB8ZBsBO0ZBH4djZB7Kc74zfMJDfFqqfZB8ZCqsvqQLqMqGiXDg44ZC3V5vxO0ybrcvZA5SF7o6x1EZCVZC53M6aPZB555j85Wu71xDQFbCyeZBvDr39w8K296blqJlocRYeG2sLyEZCX5ZBJVRrWrm1e2wZAuTXqnxxcSLnGdeZAZByQPhZA4yEpZCu1ZC0aZBpLfzCtJq2JKEHBZBIzHFM74U&__cppo=1",
//         reqBody
//       )
//       .catch((err) => {
//         console.log(err.response.data);
//       });
//   } else {
//     //mesage from the bot
//     return res.status(200);
//   }

//   res.status(200);
// });

messageArr = [];
//webhook on new message
app.post("/webhook", async function (req, res) {
  try {
    if (req.body.entry[0]?.changes[0]?.value?.contacts) {
      const msg = req.body.entry[0].changes[0].value.messages[0].text.body;
      const currentIncomeMessage = { role: "user", content: msg };
      console.log(msg);
      if (msg.toLowerCase().includes("conn") || msg.includes("...")) {
        messageArr.push(currentIncomeMessage);
      } else {
        messageArr = [currentIncomeMessage];
      }

      console.log(messageArr);

      const completion = await sendMessages(messageArr);
      console.log(completion.choices[0].message);
      messageArr.push(completion.choices[0].message);

      res.send(completion.choices[0].message);
      const recipient = req.body.entry[0].changes[0].value.contacts[0].wa_id;

      whatsApp.sendMessage(recipient, completion.choices[0].message.content);
      return;
    } else {
      return res.send(req.body.entry[0]?.changes[0]);
    }
    // console.log("whatsapp message do nothing");
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("server started");
});

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection", error);
});
