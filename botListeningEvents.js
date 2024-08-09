const CubePromoCode = require("./Models/CubePromoCodeModel");

function sendAvailableCommands(bot, chatId) {
  const helpMessage = commands
    .map((cmd) => `${cmd.command} - ${cmd.description}`)
    .join("\n");
  bot.sendMessage(chatId, `Available commands:\n${helpMessage}`);
}

// function handleStartCommand(chatId) {
//   const welcomeMessage =
//     "Welcome! Hamster Kombat DZ Bot v1 \n Developped By AZER AZERT DZ \n Contact Developper @azerazertdz ";
//   bot.sendMessage(chatId, welcomeMessage);
//   return;
//    sendAvailableCommands(chatId);
// }

// Handle Events
const botListeningEvents = (botInstant) => {
  let bot = botInstant;
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage =
      "Welcome! Hamster Kombat DZ Bot v1 \n Developped By AZER AZERT DZ \n Contact Developper @azerazertdz ";
    bot.sendMessage(chatId, welcomeMessage);
    sendAvailableCommands(bot, chatId);
    return;
  });

  bot.onText(/\/bike/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Not Implemented Yet");
    return;
  });
  bot.onText(/\/clone/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Not Implemented Yet");
    return;
  });
  bot.onText(/\/cube/, async (msg) => {
    const chatId = msg.chat.id;
    const cubePromoCodes = await getCubePromoCode();
    bot.sendMessage(chatId, cubePromoCodes, {
      parse_mode: "MARKDOWN",
    });
    return;
  });
  bot.onText(/\/train/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Not Implemented Yet");
    return;
  });
};

//CONSTANTS
const commands = [
  { command: "/start", description: "Start the bot and set API key" },
  { command: "/availableKeys", description: "return total of available Keys" },
  { command: "/bike", description: "Get 4 Bike game Promo Codes" },
  { command: "/train", description: "Get 4 Train game Promo Codes" },
  { command: "/clone", description: "Get 4 Clone game Promo Codes" },
  { command: "/cube", description: "Get 4 Cube game Promo Codes" },
];

async function getCubePromoCode() {
  try {
    const promoCodes = await CubePromoCode.find({ isUsed: false }).limit(4);
    // const promoCodesToReturn = promoCodes.map((promoCode) => promoCode.code);
    if (promoCodes && promoCodes.length >= 4) {
      await CubePromoCode.updateMany(
        { _id: { $in: promoCodes.map((promoCode) => promoCode._id) } },
        { $set: { isUsed: true } }
      );
      let to_return = "";
      promoCodes.map((promoCode) => {
        to_return += `\`${promoCode.code}\`\n`;
      });
      return to_return;
    } else return "Insufficient Amount of codes please try again. ";

    // res.json({ promoCodes: promoCodesToReturn });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = botListeningEvents;
