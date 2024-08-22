import prisma from "../lib/Prisma.js";

const NewprofileCounts = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { market: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const market = user.market;

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

    const count = counts.reduce((acc, item) => {
      acc[item.market] = item._count.id;
      return acc;
    }, {});

    count.totalProfiles = counts.reduce((total, item) => total + item._count.id, 0);

    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile counts. Please try again later." });
  }
};

export default NewprofileCounts;
