import prisma from "../lib/prisma.js";  
export const HostGet=async(req,res)=>{
    try {
        const hosts = await prisma.hosts.findMany();
        res.status(200).json(hosts);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}