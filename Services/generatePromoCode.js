const { delay } = require("../Helpers/TimeHelper");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const GAME_PROMO_API_BASE_URL = process.env.GAME_PROMO_API_BASE_URL;

const login = async () => {
  const loginPayload = {
    appToken: "d1690a07-3780-4068-810f-9b5bbf2931b2",
    clientOrigin: "android",
    clientId: uuidv4(),
    clientVersion: "1.78.30",
  };

  try {
    const response = await axios.post(
      `${GAME_PROMO_API_BASE_URL}/login-client`,
      loginPayload,
      {
        headers: {
          "User-Agent":
            "UnityPlayer/2022.3.20f1 (UnityWebRequest/1.0, libcurl/8.5.0-DEV)",
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-Unity-Version": "2022.3.20f1",
        },
      }
    );
    return response.data.clientToken;
  } catch (error) {
    console.error(
      "Login Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getCode = async (clientToken, promoId) => {
  try {
    const response = await axios.post(
      `${GAME_PROMO_API_BASE_URL}/create-code`,
      { promoId },
      {
        headers: {
          "User-Agent":
            "UnityPlayer/2022.3.20f1 (UnityWebRequest/1.0, libcurl/8.5.0-DEV)",
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-Unity-Version": "2022.3.20f1",
          Authorization: `Bearer ${clientToken}`,
        },
      }
    );
    return response.data.promoCode;
  } catch (error) {
    console.error(
      "Get Code Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const registerEvent = async (clientToken, promoId) => {
  const eventPayload = {
    promoId,
    eventId: uuidv4(),
    eventOrigin: "undefined",
    eventType: "cube_sent",
  };

  try {
    await delay(20000); // Wait for 20 seconds before next iteration

    const response = await axios.post(
      `${GAME_PROMO_API_BASE_URL}/register-event`,
      eventPayload,
      {
        headers: {
          "User-Agent":
            "UnityPlayer/2022.3.20f1 (UnityWebRequest/1.0, libcurl/8.5.0-DEV)",
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "X-Unity-Version": "2022.3.20f1",
          Authorization: `Bearer ${clientToken}`,
        },
      }
    );
    return response.data.hasCode;
  } catch (error) {
    console.error(
      "Register Event Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generatePromoCode = async (promoId) => {
  try {
    const clientToken = await login();
    await getCode(clientToken, promoId);

    let falseCount = 0;

    // Loop until we get two `false` responses
    while (falseCount < 2) {
      const hasCode = await registerEvent(clientToken, promoId);
      if (!hasCode) {
        falseCount++;
      }
    }

    // Loop until we get one `true` response
    while (true) {
      const hasCode = await registerEvent(clientToken, promoId);
      if (hasCode) {
        break;
      }
    }

    const promoCode = await getCode(clientToken, promoId);
    return promoCode;
  } catch (error) {
    console.error("GeneratePromoCode Error:", error.message);
    throw error;
  }
};

module.exports = generatePromoCode;
