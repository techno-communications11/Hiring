import bcrypt from 'bcrypt';
import prisma from '../lib/Prisma.js';
import jwt from 'jsonwebtoken';

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
        name: true
      }
    });

    // If the user does not exist or the password is incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const tokenExpiration = '7d'; // Set the token expiration time
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name }, // Payload
      process.env.JWT_SECRET_KEY, // Secret key
      { expiresIn: tokenExpiration } // Options
    );

    // Send the token in the response
    res.status(200).json({
      message: "Login successful",
      token // Send the token directly to the client
    });

  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    res.status(500).json({ message: "Failed to login" });
  }
};

export default Login;
