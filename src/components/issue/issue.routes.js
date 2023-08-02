import Router from 'express';
import validation from '../../middleware/validation.js';
import { asyncErrorHandler } from '../../utils/errorHandeling.js';
import * as issue from './issue.js';
import * as Val from './issue.validation.js';
import { auth, roles } from '../../middleware/auth.js';

const router = Router();



router.post('/issue-book',
    asyncErrorHandler(auth([roles.user])),
    validation(Val.issue),
    asyncErrorHandler(issue.issue)
)



router.get('/getNotReturned',
asyncErrorHandler(auth([roles.user])),
    validation(Val.NoDataSchema),
    asyncErrorHandler(issue.getNotReturned),
)
export default router