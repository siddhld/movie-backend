require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./Connection/connection");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 8000;

//use cors
// app.use(cors())
const corsOptions = {
  // origin: 'https://frontend-movie-app.vercel.app',
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

//Json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//use cookie parser
app.use(cookieParser());

//connect DATABASE
dbConnect();

///Load Routes
app.use("/", userRoutes);

//Start server
app.listen(port, () => console.log(`App listening on port ${port}!`));
