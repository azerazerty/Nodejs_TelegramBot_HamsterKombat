const botListeningEvents = (botInstant) => {
  let bot = botInstant;
  bot.onText(/\/start/, (msg) => {
    handleStartCommand(msg.chat.id);
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

function handleStartCommand(chatId) {
  bot.sendMessage(chatId, "Welcome! Please provide your API key:");
}

function sendAvailableCommands(chatId) {
  const helpMessage = commands
    .map((cmd) => `${cmd.command} - ${cmd.description}`)
    .join("\n");
  bot.sendMessage(chatId, `Available commands:\n${helpMessage}`);
}

module.exports = botListeningEvents;
