const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isOwnerLoggedIn = require("../middlewares/isOwnerLogin");
const productModel = require("../models/product-model");
const upload = require("../config/multer-config");






//owner creation route 
router.get("/create", async (req, res) => {

    // Allow only in development mode
    if (process.env.NODE_ENV !== "development") {
        return res.status(403).send("This route is disabled in production");
    }

    try {

        const existingOwner = await ownerModel.findOne();

        if (existingOwner) {
            return res.send("Owner already exists");
        }

        const hashedPassword = await bcrypt.hash("kedarnath", 10);

        const owner = await ownerModel.create({
            fullname: "Lavansh Gupta",
            email: "lavanshgupta204@gmail.com",
            password: hashedPassword,
            gstin: "GST123456789"
        });

        const token = jwt.sign(
            {
                ownerid: owner._id,
                email: owner.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.send(owner);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
});

//owner login route 
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const owner = await ownerModel.findOne({ email });

        if (!owner) {
            req.flash("error", "Invalid Email or Password");
            return res.redirect("/owners/login");
        }

        const isMatch = await bcrypt.compare(
            password,
            owner.password
        );

        if (!isMatch) {
            req.flash("error", "Invalid Email or Password");
            return res.redirect("/");
        }

        const token = jwt.sign(
            {
                ownerid: owner._id,
                email: owner.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        res.redirect("/owners/Shop");

    } catch (err) {

        console.log(err.message);
        res.status(500).send("Internal Server Error");

    }

});



router.get("/Products",isOwnerLoggedIn,(req,res)=>{
    res.render("createproducts",{
        success:[" success"],
        islogin:true
    });
})



// ownershop 
router.get("/Shop", isOwnerLoggedIn , async (req,res)=>{
     let  products = await productModel.find();
     res.render("ownerShop",{products});
}
)

//edit product page 
router.get("/editProduct/:productid", isOwnerLoggedIn, async (req, res) => {

    let product = await productModel.findById(
        req.params.productid
    );

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("editProduct", {
        product,
        islogin: true,
        isOwner: true
    });
});

//edit product route 
router.post(
    "/updateproduct/:productid",
    isOwnerLoggedIn,
    upload.single("image"),
    async (req, res) => {

        
        let updateData = {
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            bgcolor: req.body.bgcolor,
            panelcolor: req.body.panelcolor,
            textcolor: req.body.textcolor,
        };

        if (req.file) {
            updateData.image = req.file.buffer;
        }

        await productModel.findByIdAndUpdate(
            req.params.productid,
            updateData,
            { new: true }
        );

        req.flash("success", "Product updated successfully");
        res.redirect("/owners/shop");
    }
);


//delete product 
router.get("/deleteProduct/:productid", isOwnerLoggedIn, async (req, res) => {
    
    await productModel.findByIdAndDelete(req.params.productid);

    res.redirect("/owners/Shop");
});

module.exports = router;