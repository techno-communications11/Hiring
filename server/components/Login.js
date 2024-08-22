import bcrypt from 'bcrypt';
import prisma from '../lib/Prisma.js';
import jwt from 'jsonwebtoken';

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {email},
      select: {
        id: true,
        password: true,
        role:true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const tokenExpiration = '7d'; 

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: tokenExpiration }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7 
    });
    

    res.status(200).json({ message: "Login successful", user: { id: user.id,role:user.role},token });

  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
};

export default Login;
