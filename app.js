const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require ("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User= require("./models/user.js")

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.use(methodOverride("_method")); // Enables PUT and DELETE requests from forms
app.use(express.urlencoded({ extended: true })); // Required to parse form data


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//to attach static files (css , ejs)to the app
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); //to parse data
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave : false ,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7 * 24 * 60 * 60 * 1000 ,// expires in 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7
    httpOnly: true,
  }
};

app.get("/", (req, res) => {
  res.send("root is working");
});

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


app.use("/listings",listingRouter);
app.use("/", userRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("server is listening to port");
});


