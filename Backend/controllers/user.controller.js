import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";


export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      city: true,
      pincode: true,
      latitude: true,
      longitude: true,
      photo: true,
      created_at: true,
      groomer: {
        select: {
          id: true,
          isVerified: true,
          verificationStatus: true,
          rating: true,
          totalReviews: true
        }
      }
    }
  });

  res.json(user);
};


export const updateProfile = async (req, res) => {
  const allowedFields = [
    "name",
    "phone",
    "city",
    "pincode",
    "latitude",
    "longitude",
    "photo"
  ];
  if(!req.body)
    return res.status(400).json({ message: "No data provided" });
  const updateData = req.body;

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      city: true,
      pincode: true,
      latitude: true,
      longitude: true,
      photo: true
    }
  });

  res.json(updatedUser);
};


export const deleteProfile = async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { isDeleted: true }
  });

  res.json({ message: "Account deactivated successfully" });
};


export const setPassword = async (req, res) => {
  try {
      if(!req.body)
    return res.status(400).json({ message: "No data provided" });
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password set successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
