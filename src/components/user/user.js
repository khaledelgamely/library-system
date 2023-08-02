import userModel from "../../../DB/models/userModel.js";
import bcryptjs from "bcryptjs"
import ErrorClass from "../../utils/ErrorClass.js";
import jwt from 'jsonwebtoken';
import {
    StatusCodes
} from 'http-status-codes';
import { sendEmail } from "../../utils/sendEmail.js";


export const signUp = async (req, res,next) => {
    const { name, email, password, age } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        const hashedPass = bcryptjs.hashSync(password, 5);
        const addedUser = new userModel({ name, email, password: hashedPass, age })
        const savedUser = await addedUser.save()
        const subject = "Confirm your email"
        const text = `click this link to confirm your email`
        const token = jwt.sign({ _id: savedUser._id}, process.env.tokenSecret)
        const html = `<a href="${req.protocol}://${req.headers.host}/user/confirm-email/${token}">click here</a>`
        await sendEmail(savedUser.email, subject, text, html)
        return res.json({ message: "Done", addedUser });
    } else {
        return next(new ErrorClass("email already in use", StatusCodes.FORBIDDEN))
    }
}

export const confirmEmail = async (req, res) => {
    const token = req.params.token;
    const tokenDetails = jwt.verify(token, process.env.tokenSecret)
    const user = await userModel.findByIdAndUpdate(tokenDetails._id, { confirm: true }, { new: true })
    if (!user) {
        return res.status(405).json({ message: "user not found" });
    }
    res.status(202).json({ message: "Done" });
}

export const signIn = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (user) {
        console.log({ user });
        if (!user.confirm) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Confirm you email first" })
        }
        if (user.isDeleted) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "this email is deleted" })
        }

        const isCorrect = bcryptjs.compareSync(password, user.password)
        if (isCorrect) {
            const userData = {
                email: user.email,
                _id: user._id
            }
            const token = jwt.sign(userData, process.env.tokenSecret)
            await userModel.findByIdAndUpdate(user._id, { isLoggedIn: true })
            res.json({ message: "Done", token })
        } else {
            return res.json({ message: "in-valid user information" });
        }
    } else {
        return res.json({ message: "in-valid user information" });
    }
}

export const update = async (req, res) => {
    const { name, age } = req.body;
    await userModel.updateOne({ _id: req.user._id }, { name, age })
    res.json({ message: "Done" })
}


export const deleteUser = async (req, res) => {
    await userModel.deleteOne({ _id: req.user._id })
    res.json({ message: "Done" })
}

export const logOut = async (req, res) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { isLoggedIn: false })
    res.json({ message: "Log Out successfully" })
}

export const SendCode = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found"})
    }
    if (!user.confirm) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "not confirmed" })
    }
    const code = nanoid(6)
    await userModel.updateOne({ _id: user._id }, { code })
    const subject = "reset password"
    const text = `use this code to reset your password`
    const html = `<h3 style="">${code}</h3>`
    await sendEmail(user.email, subject, text, html)
    res.json({ message: "check your email" })
}

export const changePass = async (req, res) => {
    const { email, code, newPass } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
    }
    console.log(user);
    if (user.code != code) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "in-valid code"})
    }
    const hashedPass = bcryptjs.hashSync(newPass, 5);
    await userModel.findByIdAndUpdate(user._id, { password: hashedPass, code: nanoid(6) })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done" })
}


export const softDelete = async (req, res) => {
    const id = req.user._id;
    const user = await userModel.updateOne({ _id: id }, { isDeleted: true })
    res.json({ message: "Done" })
}