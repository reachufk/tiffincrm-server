import express, { json, urlencoded } from 'express';
import cors, { CorsOptions } from 'cors';
import { config as dotenvConfig } from 'dotenv';
const http = require('http');
import { connectDB } from "./config/db.config";
import { authRouter } from './routes/auth.routes';
import { adminRouter } from './routes/admin.routes';
import { categoryRouter } from './routes/category.routes';
import { itemRouter } from './routes/items.routes';
import { bannerRouter } from './routes/banner.routes';
import { orderRouter } from './routes/order.routes';
import compression from "compression";
dotenvConfig();

const app = express();

const corsOptions: CorsOptions = {
    origin: "http://localhost:4200"
};
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(compression());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Tiffin Aww" });
});
app.use('/api/auth', authRouter);
app.use('/api/admins', adminRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/items', itemRouter);
app.use('/api/banners', bannerRouter);
app.use('/api/orders', orderRouter);

const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket:any) => {
      console.log('A client has connected');
      socket.join("order");
});


server.listen(PORT, async () => {
    await connectDB()
    console.log(`Tiffin Aww server is running...`);
});

const socketIoObject = io;
module.exports.ioObject = socketIoObject;