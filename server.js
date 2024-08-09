const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const cron = require("node-cron");
const CubePromoCode = require("./Models/CubePromoCodeModel"); // Import the promo code model
const botListeningEvents = require("./botListeningEvents");
const generatePromoCode = require("./Services/generatePromoCode");

const Port = process.env.PORT || 3000;
const Telegram_Token = process.env.TELEGRAM_API_TOKEN;
// const GAME_PROMO_API_BASE_URL = process.env.GAME_PROMO_API_BASE_URL;
const DB = process.env.DB;

const app = express();
const bot = new TelegramBot(Telegram_Token, { polling: true });
botListeningEvents(bot);

app.use(express.json());
app.use(cors());

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

cron.schedule("* * * * *", async () => {
  try {
    const promoId = "b4170868-cef0-424f-8eb9-be0622e8e8e3"; //CubePromoCodeID
    const promoCode = await generatePromoCode(promoId);
    const newPromoCode = new CubePromoCode({ code: promoCode, isUsed: false });
    await newPromoCode.save();
    console.log("Promo code saved:", promoCode);
  } catch (error) {
    console.error("Cron Job Error:", error.message);
  }
});

app.get("/get-promo", async (req, res) => {
  try {
    const promoCodes = await CubePromoCode.find({ isUsed: false }).limit(4);
    const promoCodesToReturn = promoCodes.map((promoCode) => promoCode.code);

    await CubePromoCode.updateMany(
      { _id: { $in: promoCodes.map((promoCode) => promoCode._id) } },
      { $set: { isUsed: true } }
    );
    let to_toreturn = "";
    promoCodes.map((promoCode) => {
      to_toreturn += `${promoCode.code}</br>`;
    });

    // res.json({ promoCodes: promoCodesToReturn });
    res.send(to_toreturn);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred during execution.");
  }
});

app.listen(Port, () => {
  console.log(`Server is running at http://localhost:${Port}`);
});
