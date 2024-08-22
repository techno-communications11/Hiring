import bcrypt from 'bcrypt';
import prisma from '../lib/Prisma.js';
import { generateUniqueId } from '../GenerateId/UniqueId.js';

const register = async (req, res) => {
  const { name, email, market, password, role, calendlyUsername } = req.body;
  console.log(req.body);

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = generateUniqueId();

    const newUser = await prisma.user.create({
      data: {
        id,
        name,
        email,
        market: market || null, 
        role,
        calendlyUsername: calendlyUsername || null, 
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    console.error("Registration error:", error); // Log error details
    res.status(500).json({ message: "Failed to register" });
  }
};

export default register;
