import prisma from "../lib/prisma.js";
export const AddPet = async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: "No data provided" });

    const { name, species, breed, age, weight, medicalNotes, photo } = req.body;

    if (!name || !species) {
      return res.status(400).json({
        success: false,
        message: "Name and species are required"
      });
    }

    const pet = await prisma.pet.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        species: species.trim(),
        breed,
        age,
        weight,
        medicalNotes,
        photo,
        isDeleted: false
      }
    });

    return res.status(201).json({
      success: true,
      message: "Pet created successfully",
      data: pet
    });

  } catch (error) {

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "You already added a pet with this name and species."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};




export const getPets = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        userId: req.user.id,
        isDeleted: false   
      }
    });

    return res.status(200).json({
      success: true,
      message: "Pets fetched successfully",
      data: pets
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};



export const getPet = async (req, res) => {
  try {
    const { petId } = req.params;

    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        userId: req.user.id,
        isDeleted: false   // 🔥 important
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: pet
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export const updatePet = async (req, res) => {
  try {
    if (!req.params)
      return res.status(400).json({ message: "No data provided" });
    const { petId } = req.params;

    const allowedFields = [
      "name",
      "species",
      "breed",
      "age",
      "weight",
      "medicalNotes",
      "photo"
    ];

    const updateData = {};
    if (!req.body)
      return res.status(400).json({ message: "No data provided" });
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
  
    const updated = await prisma.pet.updateMany({
      where: {
        id: petId,
        userId: req.user.id,
        isDeleted: false   
      },
      data: updateData
    });
 
    if (updated.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Pet not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pet updated successfully"
    });

  } catch (error) {

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Duplicate pet detected"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};


export const deletePet = async (req, res) => {
  try {
    if(!req.params)
      return res.status(400).json({ message: "pet id missing in params" });
    const { petId } = req.params;

    
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        userId: req.user.id
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found"
      });
    }


    const activeBookings = await prisma.booking.findFirst({
      where: {
        petId: petId,
        status: {
          in: ["pending", "confirmed"]
        }
      }
    });

    if (activeBookings) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete pet with active bookings"
      });
    }

    await prisma.pet.update({
        where: { id: petId },
        data: { isDeleted: true }
   });

    return res.status(200).json({
      success: true,
      message: "Pet deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

