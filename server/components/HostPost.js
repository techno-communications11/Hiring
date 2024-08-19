import prisma from "../lib/prisma.js";
export const HostPost=async(req,res)=>{
    const { name, email, calendlyUsername } = req.body;

  try {
    const newHost = await prisma.hosts.create({
      data: {
        name,
        email,
        calendlyUsername,
      },
    });
    res.status(200).json(newHost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}