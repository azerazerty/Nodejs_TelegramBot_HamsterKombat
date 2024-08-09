const mongoose = require("mongoose");

const CubePromoCodeSchema = new mongoose.Schema(
  {
    code: String,
    isUsed: { type: Boolean, default: false },
    //   createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const CubePromoCode = mongoose.model("CubePromoCode", CubePromoCodeSchema);

module.exports = CubePromoCode;
