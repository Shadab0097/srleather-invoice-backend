// const express = require("express")
// const connectDB = require("./config/database")
// const app = express()
// const cookieParser = require("cookie-parser");
// const cors = require('cors');

// require("dotenv").config();

// app.use(cors({
//     origin: ' http://localhost:5173',
//     // origin: 'https://stock-management-kappa-ten.vercel.app',

//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     // allowedHeaders: ['Content-Type ', 'Authorization'],
//     credentials: true,
// }));




// app.use(express.json());
// app.use(cookieParser());




// const InvoiceRouter = require('./router/invoice')
// const { userRouter } = require('./router/user')




// // Use routers

// app.use('/', InvoiceRouter);
// app.use('/', userRouter);





// connectDB()
//     .then(() => {
//         console.log('database connected!')
//         app.listen(1000, () => {
//             console.log('server is listening on port 1000!')
//         })
//     }).catch((err) => {
//         console.log('database cannot be connected')
//     })

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const serverless = require("serverless-http");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
    origin: 'https://stock-management-kappa-ten.vercel.app', // or your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const InvoiceRouter = require('./router/invoice');
const { userRouter } = require('./router/user');

app.use('/', InvoiceRouter);
app.use('/', userRouter);

// Connect to DB
connectDB()
    .then(() => {
        console.log("Database connected!");
    })
    .catch((err) => {
        console.log("Database connection failed.");
    });

// ✅ Export the handler for Vercel (no app.listen!)
module.exports = serverless(app);
