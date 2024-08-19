import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

const register = async (req, res) => {
  const { email,market, password } = req.body;
  try {

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        market,
        password:hashedPassword, 
        
      },
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    res.status(500).json({ message: "Failed to register" });
  }
};

export default register;
