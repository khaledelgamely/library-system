import Router from 'express';
import validation from '../../middleware/validation.js';
import { asyncErrorHandler } from '../../utils/errorHandeling.js';
import * as book from './book.js';
import * as Val from './book.validation.js';
import { auth, roles } from '../../middleware/auth.js';
import { filesValidation, myMulter } from '../../utils/multer.js';

const router = Router();



router.post('/add-book',
    asyncErrorHandler(auth([roles.admin])),
    myMulter(filesValidation.image).single('image'),
    validation(Val.addBook),
    asyncErrorHandler(book.addBook)
)

router.delete('/delete-book/:bookId',
    asyncErrorHandler(auth([roles.admin])),
    validation(Val),
    asyncErrorHandler(book.deleteBook)

)

export default router