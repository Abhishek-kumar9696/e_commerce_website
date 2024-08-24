import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { mongodburl, PORT } from "./config.js";
import userRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';

console.log()


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users',userRoutes);
app.use('/api/users/products',productRoutes);
app.use('/api/users/orders',orderRoutes);
app.get('/',(req,res)=>{
    console.log("hello hi");
})




mongoose
.connect(mongodburl)
.then(()=>{
    console.log("connected to database");
    app.listen(PORT,()=>{
        console.log(`App is listening on port ${PORT}`);
    })

})
.catch((err)=>{
    console.log("error connecting to data base");
})


