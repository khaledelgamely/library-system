import mongoose from 'mongoose';



const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true

    },
    author: {
        type: String,
        required: true
    },
    borrowed: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        required: true
    },
    public_id:{
        type:String,
        required: true
    }
}, {
    timestamps: true
})

const bookModel = new mongoose.model('Book', bookSchema)
export default bookModel