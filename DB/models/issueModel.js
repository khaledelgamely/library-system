import moment from 'moment/moment.js';
import mongoose from 'mongoose';


const issueSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    book: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    issueDate: {
        type: Date,
        default: moment().format(),
    },
    returnedDate: {
        type: Date,
        required: true
    },
}, {
    timestamps: true
})

const issueModel = new mongoose.model('Issue', issueSchema)
export default issueModel