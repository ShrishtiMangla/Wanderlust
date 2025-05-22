const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn , isOwner , validateListing } = require("../init/middleware.js");
const multer  = require('multer')//form ke ander ki files ko nikalkr uploads m save krne k liye
const{storage} = require("../cloudConfig.js")//cloudinary m upload k liye
const upload = multer({ storage })

const listingController = require("../controllers/listings.js");


//index route
//create route
router.route("/")
.get( wrapAsync (listingController.index))
.post(
  isLoggedIn,
  
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);


//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);


// show route
//update
//destroy
router.route("/:id")
  .get(
  wrapAsync(listingController.showListing)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing )
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);


//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditform)
);




module.exports = router;
