import prisma from "../lib/prisma.js";

export const GetPublicProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user's market information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { market: true },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    const { market } = user;

      const profiles = await prisma.application.findMany({
      where: {
        market: market,
        profileStatus: '', 
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        referBy: true,
        referedId: true,
        market: true,
        createdAt:true,
      },
    });

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profiles' });
  }
};
