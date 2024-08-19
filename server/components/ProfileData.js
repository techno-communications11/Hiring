import prisma from '../lib/prisma.js'; // Adjust the import path as necessary

// Function to get user profile
const ProfileData = async (req, res) => {
  try {
    // Extract userId from the authenticated request
    const userId = req.user.id; // Assume you're using authentication middleware to set req.user

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        market: true,
        // Add other fields you want to display
      },
    });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user data
    res.status(200).json(user);
  } catch (error) {
    // Log the error and respond with a failure message
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export default ProfileData;
