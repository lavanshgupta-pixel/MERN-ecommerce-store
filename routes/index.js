const express = require("express");
const router = express.Router();
const {isLoggedIn}  = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const isOwnerLogin = require("../middlewares/isOwnerLogin");

//user route 
router.get("/", (req,res)=>{
    let error = req.flash("error");
    res.render("index",{error, islogin: null });
})

//admin route 
router.get("/owners/login",(req,res)=>{
    res.render("owner-login",{islogin:null});
})


//shop route
router.get("/shop",isLoggedIn,async (req, res) => {
    let  products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products,islogin:true,success});
});


//add to cart 
router.get("/addtocart/:productid",isLoggedIn , async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","Added to Cart");
    res.redirect("/shop");
})


//card route
router.get("/cart", isLoggedIn, async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate("cart");
    res.render("cart",{user , islogin:true});
    
})


//remove item 
router.get("/removefromcart/:productid",isLoggedIn , async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    user.cart.pull(req.params.productid);
    await user.save();
    res.redirect("/cart");
});

module.exports = router;