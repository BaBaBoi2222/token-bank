const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/user");


const signup = async (req, res) => {
    try {
        const { name, email, password, tokens } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User already exists, you can login', success: false });
        }
        const userModel = new UserModel({ name, email, password, tokens });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}
const tokenAdd = async (req, res) => {
    try {
        const { tokName, tok, email } = req.body
        const user = await UserModel.findOne({ email });
        user.tokens.push({ name: tokName, value: tok }); // Add new token
        await user.save();
        res.status(201)
            .json({
                message: "Token added successfully",
                success: true
            }) // Save to database
    } catch (err) {
        res.status(400)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}
const tokenRemove = async (req, res) => {
    try {
        const { tokName, tok, email } = req.body
        const user = await UserModel.findOne({ email });
        user.tokens = user.tokens.filter((t) => !(t.name === tokName && t.value === tok));
        await user.save();
        res.status(201)
            .json({
                message: "Token removed successfully",
                success: true
            }) // Save to database
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}
const getTokens = async (req, res) => {
    try {
        const email = req.headers['email']
        const user = await UserModel.findOne({ email });
        res.status(201)
            .json({
                message: user.tokens,
                success: true
            }) // Save to database
    } catch (err) {
        res.status(500)
            .json({
                message: err,
                success: false
            })
    }
}
const tokenDelete = async (req, res) => {
    const { email, tName } = req.params;
    try {

        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            { $pull: { tokens: { name: tName } } }, // Remove token by name
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User or token not found" });
        }

        res.status(200).json({ message: "Token deleted successfully", tokens: updatedUser.tokens });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    signup,
    login,
    tokenAdd,
    tokenRemove,
    getTokens,
    tokenDelete
}