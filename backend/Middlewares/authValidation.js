const Joi = require('joi');
const UserModel = require("../Models/user");

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        tokens: Joi.array().min(0)
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const addTValidation = async (req, res, next) => {
    const schema = Joi.object({
        tokName: Joi.string().required(),
        tok: Joi.string().required(),
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error });
    }

    // Check if the token name already exists
    const { tokName, email } = req.body;
    try {
        const tokenExists = await UserModel.findOne(
            { "email": email, "tokens.name": tokName },
            { "tokens.$": 1 }
        );

        if (tokenExists) {
            return res.status(400).json({ message: "Token already exists" });
        }

        next(); // Proceed to the next middleware or controller
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};


const removeTValidation = (req, res, next) => {
    const schema = Joi.object({
        tokName: Joi.string().required(),
        tok: Joi.string().required(),
        email: Joi.string().email().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
module.exports = {
    signupValidation,
    loginValidation,
    addTValidation,
    removeTValidation
}