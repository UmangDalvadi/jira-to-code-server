import express from 'express';
import authRoutes from './routes/authRoutes.js';
import jiraRoutes from './routes/jiraRoute.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
  origin: process.env.FROENTEND_DOMAIN || 'http://localhost:5173', // Replace with your client URL
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jira', jiraRoutes);

app.get('/', (req, res) => {
  res.send("hello from yorkieessss")
})

app.listen(PORT, () => {
  console.log(`Server running on ${process.env.API_DOMAIN || 'http://localhost:3000'}`);
});
