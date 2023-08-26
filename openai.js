const OpenAI = require("openai");

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendMessages(messages) {
  const completion = await openai.chat.completions.create({
    messages: messages, // [{ role: "user", content: "Say this is a test" }],
    model: "gpt-4",
  });
  return completion;
}

module.exports = {
  sendMessages,
};
