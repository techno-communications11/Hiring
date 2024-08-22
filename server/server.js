import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authrouter from './Routes/user.auth.js';
// import authenticateJWT from './components/authenticateJwt.js';



dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true,
  }));
  
app.use(cookieParser())

app.use('/api/auth', authrouter);

// app.get('/api/protected', authenticateJWT, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
//   });

app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
