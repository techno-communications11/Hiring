import prisma from "../lib/Prisma.js";
export const GetProfiles=async(req,res)=>{
    try {
        const { status } = req.query; // e.g., 'Total', 'Moved', 'No Response', 'Rejected', 'Not Interested'
        const userId = req.user.id; // Assuming user ID is provided by auth middleware
    
        // Find the user's market
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { market: true },
        });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const { market } = user;
    
        // Fetch profiles based on the status
        const profiles = await prisma.application.findMany({
          where: {
            market,
            ...(status === 'Total' ? {} : { profileStatus: status }), 
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            referBy: true,
            referedId: true,
            market: true,
            profileStatus: true,
            createdAt:true,
            comments:true,
          },
        });
    
        res.status(200).json(profiles);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profiles' });
      }
}