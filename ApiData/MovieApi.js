const {
  HomePageData,
  MoviePageData,
  TvPageData,
} = require("../models/ApiData");

// POSt data to database cpmong from TMDb Api

//save movies
const MovieData = async (req, res) => {
  const data = req.body;
  try {
    let dbData = await MoviePageData.create(data.results);
    res.status(200).send("Movie's Data added Successfully");
  } catch (error) {
    // console.log("error",error)
  }
};

//save tv series
const TvData = async (req, res) => {
  const data = req.body;
  try {
    let dbData = await TvPageData.create(data.results);
    res.status(200).send("Tv Data added Successfully");
  } catch (error) {
    // console.log("error",error)
  }
};

//save home page data i.e. popular data

const HomeData = async (req, res) => {
  const data = req.body;
  try {
    let dbData = await HomePageData.create(data);
    res.status(200).send("Trending Data added Successfully");
  } catch (error) {
    // console.log("error",error)
  }
};

module.exports = { MovieData, TvData, HomeData };
