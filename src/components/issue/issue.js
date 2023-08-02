import ErrorClass from "../../utils/ErrorClass.js";
import {
    StatusCodes
} from 'http-status-codes';
import bookModel from "../../../DB/models/bookModel.js";
import issueModel from "../../../DB/models/issueModel.js";
import moment from "moment";


export const issue = async (req, res, next) => {
    const { bookId, days } = req.body;
    const user = req.user._id;
    const book = await bookModel.findById(bookId);
    if (!book) {
        return next(new ErrorClass("book not found", StatusCodes.NOT_FOUND))
    }
    if (book.borrowed) {
        return next(new ErrorClass("This book is borrowed", StatusCodes.BAD_REQUEST))
    }
    let issue = new issueModel({ book: bookId, user, returnedDate: moment().add(days, 'd') })
    book.borrowed = true
    await book.save()
    issue = await issue.save()
    res.status(StatusCodes.ACCEPTED).json({ message: "done", result: issue });
}



export const getNotReturned = async (req, res, next) => {
    const user = req.user._id
    let notReturned = await issueModel.find({
        returnedDate: {$lt: moment()},user})
        .populate([{
        path: 'user',
        select: 'email name -_id',
        }, {
            path: 'book',
            select: 'title image author -_id'
        }
    ])
    for (const issue of notReturned) {
        // console.log({issue});
        let late = moment().diff(issue.returnedDate, 'days')
        let fine = late * 50
        issue._doc.late = late
        issue._doc.fine = fine
    }
    res.json({ notReturned })
}
