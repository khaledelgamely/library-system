import express from 'express';
const app = express();
app.use(express.json());
import {config} from 'dotenv';
import connection from './DB/connection.js';
import {errorHandel} from './src/utils/errorHandeling.js';
import userRouter from './src/components/user/user.routes.js';
import bookRouter from './src/components/book/book.routes.js';
import issueRouter from './src/components/issue/issue.routes.js';
config()
connection()
// issue
app.use('/user',userRouter)
app.use('/book',bookRouter)
app.use('/issue',issueRouter)





app.use(errorHandel)
app.all('*', (req, res) => {
    res.json({message: 'in-valid URL'})
});
app.listen(process.env.port, () => {
    console.log(`running.......`);
});