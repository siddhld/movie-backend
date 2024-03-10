const mongoose = require("mongoose")

//Defining Schema
const userSchema = new mongoose.Schema({
    

    backdrop_path : {type:String, trim:true},
    id : {type:Number,  trim:true},
    original_language :{type:String , trim:true},
    original_title :{type:String , trim:true},
    overview :{type:String , trim:true},
    poster_path :{type:String , trim:true},
    release_date:{type:String , trim:true},
    title :{type:String , trim:true},
    name :{type:String , trim:true},
    vote_average: {type:Number, trim:true},
    first_air_date :{type:String , trim:true},

})


//Model
const HomePageData = mongoose.model("HomePageData",userSchema)
const MoviePageData = mongoose.model("MoviePageData",userSchema)
const TvPageData = mongoose.model("TvPageData",userSchema)

module.exports = {HomePageData,MoviePageData,TvPageData};