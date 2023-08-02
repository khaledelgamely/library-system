import Router from 'express';
import validation from '../../middleware/validation.js';
import { asyncErrorHandler } from '../../utils/errorHandeling.js';
import * as user from './user.js';
import *as Val  from './user.validation.js';
const router = Router();


router.post('/sign-up',validation(Val.addUserSchema),asyncErrorHandler(user.signUp))

router.post('/signin',validation(Val.signInSchema),user.signIn)

router.get('/confirm-email/:token',asyncErrorHandler(user.confirmEmail))


export default router