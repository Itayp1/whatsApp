const axios = require("axios");

const sendMessage = async (recipient, message) => {
  const reqBody = {
    to: recipient,
    messaging_product: "whatsapp",
    text: {
      body: message,
    },
  };
  try {
    const { data } = await axios.post(`https://graph.facebook.com/v17.0/113481255179838/messages?access_token=${process.env.WHATSAPP_TOKEN}`, reqBody);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
};

module.exports = {
  sendMessage,
};
