const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const Review = require("./review")

const listingSchema = new Schema({
    title:{
        type: String,
        required:true
        },
    description: {
        type: String,
        
        },
        image: {
            type: String,
            default:"https://unsplash.com/photos/brown-wooden-table-and-chairs-JTUmzXLoqHQ",
        // //case:img link not exists undefuned or image not given
        set:(v)=> v ==="" ? "https://unsplash.com/photos/brown-wooden-table-and-chairs-JTUmzXLoqHQ" : v
        //when image link is empty
        },
        
    price: {
        type: Number,
      
        },
    location: {
        type: String,
        },
    country: {
        type: String,
       
        },

    reviews: [
            {
                type:Schema.Types.ObjectId,
                ref:"Review",
            },
        ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User", 
    }
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing; //exporting model