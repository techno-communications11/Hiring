import prisma from "../lib/prisma.js";
export const GetMarkets=async(req,res)=>{
    try {
        const markets = await prisma.market.findMany();
        res.status(200).json(markets);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch markets' });
      }
}