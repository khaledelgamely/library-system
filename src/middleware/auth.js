import jwt from 'jsonwebtoken';
import ErrorClass from '../utils/ErrorClass.js';
import {
    StatusCodes
} from 'http-status-codes';
import userModel from '../../DB/models/userModel.js';

export const roles = {
    admin: "admin",
    user: "user"
}
Object.freeze(roles)


export const auth = (roles) => {
    try {
        return async (req, res, next) => {
            const startToken = req.headers.token;
            if (startToken) {
                if (startToken.startsWith(process.env.TokenStart)) {
                    const token = startToken.split(' ')[1]
                    const userData = jwt.verify(token, process.env.tokenSecret)
                    const user = await userModel.findById(userData._id).select('-password')
                    if (user) {
                        if (!user.confirm) {
                            return res.status(StatusCodes.FORBIDDEN).json({ message: "confirm first", status: ReasonPhrases.FORBIDDEN });
                        }
                        if (user.isDeleted) {
                            return res.status(StatusCodes.FORBIDDEN).json({ message: "this email is deleted", status: ReasonPhrases.FORBIDDEN })
                        }
                        if (user.isLoggedIn) {
                            if (roles.includes(user.role)) {
                                req.user = user
                                next()
                            } else {
                                return res.json({ message: "You are not authorized to enter this endpoint" })
                            }
                        } else {
                            return res.json({ message: "login first" });
                        }
                    } else {
                        return res.json({ message: "in-valid user" })
                    }
                } else {
                    return res.json({ message: "in-valid token" })
                }
            } else {
                return res.json({ message: "in-valid token" });
            }
        }
    } catch (error) {
        res.json({ error })
    }
}



