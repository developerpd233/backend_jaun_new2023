const QRCode = require("../models/qrCode");


exports.qrcode = async (req, res, next) => {
  const qr_Code = req.body.qr_Code;
  const qrID = req.params.qrID;
  try {
    if (!qr_Code) {
      return res.json({ msg: "No QR Code found" });
    } else {
      const finding = QRCode.findOne({ id: qrID });
      // const newUser = await QRCode.create({ qr_Code });
      res.status(200).json({ msg: "Fetched", finding });
    }
  } catch (error) {
    console.log(error);
  }
};


exports.addQRcode = async (req, res, next) => {
  const qr_Code = req.body.qr_Code;
  try {
    if (!qr_Code) {
      return res.status(404).json({ msg: "QR Code cannot be empty" });
    }
    const newUser = await QRCode.create({ qr_Code });
    res.json({ msg: "Qr Code Scanned", newUser });
  } catch (error) {
    console.log(error);
  }
};
