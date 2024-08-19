import prisma from '../lib/prisma.js';

const Application = async (req, res) => {
  const { name, email, phone, referBy, referedId, market } = req.body;

  try {
    const newApplication = await prisma.application.create({
      data: {
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
