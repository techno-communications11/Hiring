import prisma from "../lib/Prisma.js";
 import { generateUniqueId } from "../GenerateId/UniqueId.js";
const Application = async (req, res) => {
  const { name, email, phone, referBy, referedId, market } = req.body;
 const id=generateUniqueId();
  try {
    const newApplication = await prisma.application.create({
      data: {
        id,
        name,
        email,
        phone:parseInt(phone, 10), 
        referBy,
        referedId,
        market,
        
      },
    });

    res.status(201).json({ message: "Application registered successfully", application: newApplication });
  } catch (error) {
    res.status(500).json({ message: "Failed to register application", error: error.message });
  }
};

export default Application;
