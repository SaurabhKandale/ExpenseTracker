import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import recurringExpenseRoutes from './routes/recurringExpenseRoutes'; 
import transactionRoutes from './routes/transactionRoutes';

const app=express();

const port=8088;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

app.use("/auth",authRoutes);
app.use("/transaction",transactionRoutes);
app.use("/user",userRoutes);
app.use("/account",accountRoutes);
app.use("/recurringExpense",recurringExpenseRoutes);

