const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/userController");
const checkUserAuth = require("../middlewares/auth-middleware")
const {MovieData,TvData,HomeData} = require("../ApiData/MovieApi")
const{getPopularData,getTvData,getMovieData} = require("../Controllers/userController")


//Route Level Middleware    
router.use("/changepassword",checkUserAuth );
router.use("/userinfo",checkUserAuth);
router.use("/bookmarks",checkUserAuth);
router.use("/home",checkUserAuth);
router.use("/deletebookmark/:id",checkUserAuth);


//Public Routes
router.post("/signup",UserController.userRegistration);
router.post("/login",UserController.userLogin);
router.post("/send-reset-password-email",UserController.sendUserPasswordResetEmail);
router.post("/reset-password/:id/:token",UserController.userPasswordReset);


//protected Routes
router.post("/home",UserController.addBookmarks);
router.get("/userinfo",UserController.UserInfo);               
router.get("/bookmarks",UserController.getBookmarks);
router.delete("/deletebookmark/:id",UserController.deleteBookmarks);


//fetching data
router.get("/api/g1/moviedata",UserController.getMovieData);
router.get("/api/g1/tvdata",UserController.getTvData)
router.get("/api/g1/populardata",UserController.getPopularData)

module.exports = router;