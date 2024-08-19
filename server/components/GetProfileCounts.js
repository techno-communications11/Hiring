import prisma from '../lib/prisma.js';

export const GetProfileCounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user=await prisma.user.findUnique({
      where:{id:userId},
      select:{market:true}
    })

    const totalProfiles = await prisma.application.count({
      where: { market:user.market },
    });

    const movedProfiles = await prisma.application.count({
      where: { market:user.market, profileStatus: 'Moved' },
    });

    const noResponseProfiles = await prisma.application.count({
      where: { market:user.market, profileStatus: 'No Response' },
    });

    const notInterestedProfiles = await prisma.application.count({
      where: { market:user.market, profileStatus: 'Not Interested' },
    });

    const rejectedProfiles = await prisma.application.count({
      where: { market:user.market, profileStatus: 'Reject' },
    });
    

    res.status(200).json({
      totalProfiles,
      movedProfiles,
      noResponseProfiles,
      notInterestedProfiles,
      rejectedProfiles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ticket counts' });
  }
};
