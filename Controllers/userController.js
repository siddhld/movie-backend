require("dotenv").config();
const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  HomePageData,
  MoviePageData,
  TvPageData,
} = require("../models/ApiData");
// const transporter = require("../Config/email.Config")

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      if (name && email && password && confirm_password) {
        if (password === confirm_password) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
            });
            await doc.save();
            // const saved_user =await UserModel.findOne({email:email})
            // Generate JWT Token
            // const token = jwt.sign({userID : saved_user._id},
            //     process.env.JWT_SECRET_KEY,{expiresIn:"5d"})

            res
              .status(200)
              .send({ status: "Success", message: "Successfully Register" });
          } catch (error) {
            res.send({
              status: "failed",
              message: "Unable to Register",
              error: error,
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "Password and confirm Password doesn't match",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fielsds are required" });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            //Generate Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1d" }
            );
            res
              .cookie("token", token, {
                sameSite: "None",
                secure: true,
                //   }).redirect("https://frontend-movie-app.vercel.app/home")
              })
              .redirect("http://localhost:3000/home");
            // res.send({"status":"success", "message":"Login Success","token":token})
          } else {
            res.send({
              status: "failed",
              message: "Email or password is wrong",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not a Registered user",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fielsds are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "unable to login" });
    }
  };
  static changeUserPassword = async (req, res) => {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
      if (password === confirm_password) {
        const salt = await bcrypt.genSalt(10);
        const newhashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newhashPassword },
        });
        res.send({
          status: "success",
          message: "password change successfully",
        });
      } else {
        res.send({
          status: "failed",
          message: "new password and confirm password doesn't match",
        });
      }
    } else {
      res.send({ status: "failed", message: "All field are Required" });
    }
  };
  static UserInfo = async (req, res) => {
    res.send(req.user);
  };

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });
      const secret = user._id + process.env.JWT_SECRET_KEY;
      if (user) {
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: "5d",
        });
        const link = `http://127.0.0.1:8000/reset/${user._id}/${token}`;
        //Send Email
        // let info = await transporter.sendMail({
        //     from : process.env.Email_FROM,
        //     to : user.email,
        //     subject : "MobileApp - Password Reset Link",
        //     html : `<a href=${link}>Click Here</a> to reset Your Password`
        // })
        res.send({
          status: "success",
          message: "Password Reset Email Send... Please Check Your Email",
          // "info":info
        });
      } else {
        res.send({ status: "failed", message: "Email doesn't exist" });
      }
    } else {
      res.send({ status: "failed", message: "Email field is Required" });
    }
  };

  static userPasswordReset = async (req, res) => {
    const { password, confirm_password } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_token = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_token);
      if (password && confirm_password) {
        if (password === confirm_password) {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: newHashPassword },
          });
          res.send({ status: "success", message: "Password Set Successfully" });
        } else {
          res.send({
            status: "failed",
            message: "New Password and Confirm New Password doesn't match",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Invalid Token" });
    }
  };

  static addBookmarks = async (req, res) => {
    const id = req.body;
    {
      try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
          const existingBookmark = user.bookmarksId.some(
            (item) => item.id == id.id
          );

          if (!existingBookmark) {
            user.bookmarksId.push(id);
            await user.save();
            res.json({
              message: "Movie bookmarked successfully",
              bookmarks: user.bookmarksId,
            });
          } else {
            return res.status(400).json({ error: "Movie already bookmarked" });
          }
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
  static getBookmarks = async (req, res) => {
    res.status(200).send(req.user.bookmarksId);
  };

  static getPopularData = async (req, res) => {
    try {
      let popularData = await HomePageData.find();
      res.send(popularData);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  };

  static getMovieData = async (req, res) => {
    try {
      let movieData = await MoviePageData.find();
      res.send(movieData);
    } catch (error) {
      res.status(500).send("Internal Server Error", error);
    }
  };

  static getTvData = async (req, res) => {
    try {
      let tvData = await TvPageData.find();
      res.send(tvData);
    } catch (error) {
      res.status(500).send("Internal Server Error", error);
      //    console.log(error)
    }
  };

  static deleteBookmarks = async (req, res) => {
    let tobedeleteid = req.params.id;
    if (
      !tobedeleteid ||
      typeof tobedeleteid !== "string" ||
      tobedeleteid.trim() === ""
    ) {
      // Basic input validation
      return res.status(400).json({ error: "Invalid bookmarkId" });
    } else {
      try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
          // Find the index of the bookmark with the specified ID in the bookmarkId array
          const existingBookmarkIndex = user.bookmarksId.findIndex(
            (bookmark) => bookmark.id == tobedeleteid
          );
          // const existingBookmarkIndex = await Bookmark.findByIdAndDelete(tobedeleteid);
          if (existingBookmarkIndex !== -1) {
            // Remove the bookmark from the array
            user.bookmarksId.splice(existingBookmarkIndex, 1);
            // Save the updated user object
            await user.save();
            return res.json({
              success: true,
              message: "Bookmark deleted successfully",
            });
          } else {
            return res.status(404).json({ error: "Bookmark not found" });
          }
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}

module.exports = UserController;
