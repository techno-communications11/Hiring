import prisma from "../lib/Prisma.js";

export const UpdateStatus = async (req, res) => {
  const { profileId, action,comment } = req.body;
  
  if (!profileId || !action) {
    return res.status(400).json({ message: 'Profile ID and action are required' });
  }

  try {
    // Update the publicStatus of the profile with the given profileId
    const updatedProfile = await prisma.application.update({
      where: { id: profileId },
      data: { profileStatus: action,comments:comment }, 
    });

    res.status(200).json({ message: 'Profile status updated successfully', updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile status' });
  }
};
