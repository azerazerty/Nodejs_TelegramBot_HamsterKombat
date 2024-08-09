const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(express.json());

const BASE_URL = "https://api.gamepromo.io/promo";

const login = async () => {
  const loginPayload = {
    appToken: "d1690a07-3780-4068-810f-9b5bbf2931b2",
    clientOrigin: "android",
    clientId: uuidv4(),
    clientVersion: "1.78.30",
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/login-client`,
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

const getCode = async (clientToken) => {
  const promoId = "b4170868-cef0-424f-8eb9-be0622e8e8e3";
  try {
    const response = await axios.post(
      `${BASE_URL}/create-code`,
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

const registerEvent = async (clientToken) => {
  const eventPayload = {
    promoId: "b4170868-cef0-424f-8eb9-be0622e8e8e3",
    eventId: uuidv4(),
    eventOrigin: "undefined",
    eventType: "cube_sent",
  };

  try {
    await delay(20000); // Wait for 5 seconds before next iteration

    const response = await axios.post(
      `${BASE_URL}/register-event`,
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  try {
    const clientToken = await login();
    await getCode(clientToken);

    let falseCount = 0;

    // Loop until we get two `false` responses
    while (falseCount < 2) {
      const hasCode = await registerEvent(clientToken);
      if (!hasCode) {
        falseCount++;
      }
    }

    // Loop until we get one `true` response
    while (true) {
      const hasCode = await registerEvent(clientToken);
      if (hasCode) {
        break;
      }
    }

    const promoCode = await getCode(clientToken);
    return promoCode;
  } catch (error) {
    console.error("Main Error:", error.message);
    throw error;
  }
};

app.get("/get-promo", async (req, res) => {
  try {
    const promoCodes = [];
    for (let i = 0; i < 4; i++) {
      const promoCode = await main();
      promoCodes.push(promoCode);
    }
    res.json({ promoCodes });
  } catch (error) {
    res.status(500).send("An error occurred during execution.");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
