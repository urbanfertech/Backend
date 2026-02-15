import prisma from "../lib/prisma.js";



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

  const updateData = {};

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
