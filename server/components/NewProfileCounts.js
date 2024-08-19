import prisma from "../lib/prisma.js";

const NewprofileCounts = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user market (adjust this based on your actual logic to get the user's market)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { market: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const market = user.market;

    // Query to count profiles with empty profileStatus by market
    const counts = await prisma.application.groupBy({
      by: ['market'],
      where: {
        market: market,
        profileStatus: '',
      },
      _count: {
        id: true, // Count the number of profiles
      },
    });

    // Prepare the response count object
    const count = counts.reduce((acc, item) => {
      acc[item.market] = item._count.id;
      return acc;
    }, {});

    // Include totalProfiles as the sum of all profiles with empty profileStatus
    count.totalProfiles = counts.reduce((total, item) => total + item._count.id, 0);

    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile counts. Please try again later." });
  }
};

export default NewprofileCounts;
