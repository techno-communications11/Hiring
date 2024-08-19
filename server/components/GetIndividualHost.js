import prisma from "../lib/prisma.js";

export const GetIndividualHost = async (req, res) => {
  const { id } = req.query; 


  if (!id) {
    return res.status(400).json({ error: "Host ID is required" });
  }

  try {
    const hostData = await prisma.hosts.findUnique({
      where: { id: id }, // Use hostId here
      select: { name: true, email: true },
    });

    if (!hostData) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.status(200).json(hostData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
