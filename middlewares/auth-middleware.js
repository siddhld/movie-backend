
const jwt =  require("jsonwebtoken")
const UserModel = require("../models/Users")


var checkUserAuth = async(req,res,next)=>{
    let token = req.cookies.token

    if(!token){
       return( res.status(401).send({"status":"failed", "message" : "Unauthorized User 2"})
       )
    }

        try {
            //verify token
            const {userID} = jwt.verify(token,process.env.JWT_SECRET_KEY)
            //Get user from Token
            req.user = await UserModel.findById(userID).select("-password")
            next()
        } catch (error) {
            res.status(401).send({"status":"Unauthorized User"})
        }
    
    //for postman check

    // let token
    // const {authorization} = req.headers
    // if(authorization && authorization.startsWith("Bearer")){
    //     try {
    //         token = authorization.split(" ")[1]
    //         //  verify token
    //         const {userID} = jwt.verify(token,process.env.JWT_SECRET_KEY)
    //         //Get user from Token
    //         req.user = await UserModel.findById(userID).select("-password")
    //         console.log("verified auth")
    //         next()
    //     } catch (error) {
    //         res.status(401).send({"status":"Unauthorized User"})
    //     }
    // }
}

module.exports = checkUserAuth
