const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
    try {
        // Genrate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newuser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user and respond
        const user = await newuser.save();
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("fuck password is incorrect")

        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;
