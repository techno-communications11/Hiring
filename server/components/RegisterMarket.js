import prisma from '../lib/prisma.js';

const registerMarket = async (req, res) => {
  const { market } = req.body;

  // Debug log

  if (typeof market !== 'string' || market.trim() === '') {
    return res.status(400).json({ message: "Invalid market value" });
  }

  try {
    // Check if the market already exists
    const existingMarket = await prisma.market.findUnique({
      where: { market: market },
      select: {
        id: true,
        market: true,
      },
    });

    if (existingMarket) {
      return res.status(400).json({ message: "Market already taken" });
    }

    const newMarket = await prisma.market.create({
      data: {
        market,
      },
    });

    res.status(201).json({ message: "Market registered successfully", market: newMarket });

  } catch (error) {
    res.status(500).json({ message: "Failed to register market" });
  }
};

export default registerMarket;
