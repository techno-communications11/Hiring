import prisma from "../lib/Prisma.js";
export const HostGet=async(req,res)=>{
    try {
        const hosts = await prisma.user.findMany();
        res.status(200).json(hosts);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}