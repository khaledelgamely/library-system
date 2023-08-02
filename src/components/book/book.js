import ErrorClass from "../../utils/ErrorClass.js";
import {
    StatusCodes
} from 'http-status-codes';
import bookModel from "../../../DB/models/bookModel.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";


export const addBook = async (req, res, next) => {
    const { title, author } = req.body;
    const book = await bookModel.findOne({ title });
    if (book) {
        return next(new ErrorClass("This book already existed", StatusCodes.BAD_REQUEST))
    }
    if (!req.file) {
        return next(new ErrorClass("please provide a file", StatusCodes.BAD_REQUEST))
    }
    const image = await cloudinary.uploader.upload(req.file.path, {
        folder: `bookImages/${req.file.originalname + nanoid()}`,
        public_id: req.file.originalname + nanoid(),
        use_filename: true,
        unique_filename: false
    })
    let newBook = new bookModel({ title, author, image: image.secure_url, public_id: image.public_id })
    newBook = await newBook.save()
    res.status(StatusCodes.ACCEPTED).json({ message: "done", result: newBook });
}

export const deleteBook = async (req, res, next) => {
    const bookId = req.params.bookId
    const book = await bookModel.findById(bookId)
    if (!book) {
        return next(new ErrorClass("book not found", 404))
    }
    await cloudinary.uploader.destroy(book.public_id)
    const delBook = await bookModel.deleteOne({ _id: bookId })
    res.status(StatusCodes.ACCEPTED).json({ message: "Done", result: delBook });
}
