const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const{validateReview , isLoggedIn ,isReviewAuthor} = require("../middleware.js");


//reviews
//post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
  
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${req.params.id}`);
  })
);

//delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted !");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
