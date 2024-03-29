const express = require("express");
const multer = require("multer");

const isAuth = require("../middleware/isAuth");

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  dest: "images/",
  // fileFilter: fileFilter
});

const router = express.Router();

const userDetailsController = require("../controllers/userDetails");

//router.put("/profileUpdate", userDetailsController.profileUpdate);

router.post("/verifyOtp", userDetailsController.verifyOtp);

router.post("/addUser/:qrId", userDetailsController.newUser);

router.get("/findUser/:userId", isAuth, userDetailsController.getUser);

router.put("/updateUser/:userId", isAuth, userDetailsController.updateUser);

router.get("/allUsers/:qrId", isAuth, userDetailsController.getAllUsers);

router.get("/userDetailsByEmail/:email",userDetailsController.getUserByFCM);

router.post(
  "/uploadImage",
  isAuth,
  upload.single("file"),
  userDetailsController.uploadSelfie
);

router.patch(
  "/updateImage",
  isAuth,
  upload.single("file"),
  userDetailsController.updateSelfie
);

router.post("/addToLocation", isAuth, userDetailsController.addUserToLocation); //done -----> WORKING

router.put(
  "/update-user-location/:locationId",
  isAuth,
  userDetailsController.updateUserLocation
); //done -----> WORKING

router.get(
  "/location/:locationId",
  isAuth,
  userDetailsController.getLocationUser
);

module.exports = router;
