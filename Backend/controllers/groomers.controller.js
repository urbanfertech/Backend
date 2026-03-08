import prisma from "../config/prisma.js";
import { createNotification } from "../services/notification.service.js";
// Groomer Onboarding
export const createGroomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, yearsOfExperience } = req.body;

    // Check if user already has a groomer profile
    const existingGroomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (existingGroomer) {
      return res.status(400).json({ message: "Groomer profile already exists" });
    }

    const groomer = await prisma.groomer.create({
      data: {
        userId,
        bio,
        yearsOfExperience: yearsOfExperience || null,
      },
    });

    // Create wallet for groomer
    await prisma.groomerWallet.create({
      data: {
        groomerId: groomer.id,
      },
    });

    res.status(201).json({
      message: "Groomer profile created successfully",
      data: groomer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer Profile
export const getGroomerProfile = async (req, res) => {
  try {
    const { groomerId } = req.params;

    const groomer = await prisma.groomer.findUnique({
      where: { id: groomerId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, city: true, photo: true },
        },
        documents: true,
        services: {
          include: {
            service: true,
          },
        },
        availability: true,
        wallet: true,
      },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer not found" });
    }

    res.status(200).json({
      message: "Groomer profile retrieved successfully",
      data: groomer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Groomer Profile
export const updateGroomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, yearsOfExperience } = req.body;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const updatedGroomer = await prisma.groomer.update({
      where: { id: groomer.id },
      data: {
        bio,
        yearsOfExperience,
      },
    });

    res.status(200).json({
      message: "Groomer profile updated successfully",
      data: updatedGroomer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload Verification Document
export const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentType, documentUrl } = req.body;

    if (!req.body.documentType || !req.body.documentUrl) {
      return res.status(400).json({ message: "Document type and URL required" });
    }

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const document = await prisma.groomerDocument.create({
      data: {
        groomerId: groomer.id,
        documentType,
        documentUrl,
      },
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer Documents
export const getGroomerDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const documents = await prisma.groomerDocument.findMany({
      where: { groomerId: groomer.id },
    });

    res.status(200).json({
      message: "Documents retrieved successfully",
      data: documents,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Map Service to Groomer
export const addServiceToGroomer = async (req, res) => {
  try {
    const userId = req.user.id;
    if(!req.body)
        return res.status(400).json({ message: "Service ID , customPrice and customDuration required" });
    const { serviceId, customPrice, customDuration } = req.body;

    if (!serviceId) {
      return res.status(400).json({ message: "Service ID required" });
    }

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if service already assigned
    const existingService = await prisma.groomerService.findUnique({
      where: {
        groomerId_serviceId: {
          groomerId: groomer.id,
          serviceId,
        },
      },
    });

    if (existingService) {
      return res.status(400).json({ message: "Service already assigned to groomer" });
    }

    const groomerService = await prisma.groomerService.create({
      data: {
        groomerId: groomer.id,
        serviceId,
        customPrice: customPrice || null,
        customDuration: customDuration || null,
      },
      include: {
        service: true,
      },
    });

    res.status(201).json({
      message: "Service added to groomer successfully",
      data: groomerService,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Groomer Service Pricing
export const updateServicePrice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceId, customPrice, customDuration } = req.body;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const groomerService = await prisma.groomerService.findUnique({
      where: {
        groomerId_serviceId: {
          groomerId: groomer.id,
          serviceId,
        },
      },
    });

    if (!groomerService) {
      return res.status(404).json({ message: "Service not assigned to groomer" });
    }

    const updatedService = await prisma.groomerService.update({
      where: { id: groomerService.id },
      data: {
        customPrice: customPrice || undefined,
        customDuration: customDuration || undefined,
      },
      include: {
        service: true,
      },
    });

    res.status(200).json({
      message: "Service pricing updated successfully",
      data: updatedService,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer Services
export const getGroomerServices = async (req, res) => {
  try {
    const userId = req.user.id;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const services = await prisma.groomerService.findMany({
      where: { groomerId: groomer.id },
      include: {
        service: true,
      },
    });

    res.status(200).json({
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Set Availability
export const setAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    if(!req.body)
        return res.status(400).json({ message: "Day of week, start time, end time and isAvailable required" });
    const { dayOfWeek, startTime, endTime, isAvailable } = req.body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return res.status(400).json({ 
        message: "Day of week, start time, and end time required" 
      });
    }

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const availability = await prisma.availability.create({
      data: {
        groomerId: groomer.id,
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: isAvailable !== false,
      },
    });

    res.status(201).json({
      message: "Availability set successfully",
      data: availability,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer Availability
export const getAvailability = async (req, res) => {
  try {
    const userId = req.user.id;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const availability = await prisma.availability.findMany({
      where: { groomerId: groomer.id },
      orderBy: { dayOfWeek: "asc" },
    });

    res.status(200).json({
      message: "Availability retrieved successfully",
      data: availability,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Availability
export const updateAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { startTime, endTime, isAvailable } = req.body;

    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
      include: { groomer: true },
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    // Verify groomer ownership
    if (availability.groomer.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedAvailability = await prisma.availability.update({
      where: { id: availabilityId },
      data: {
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined,
      },
    });

    res.status(200).json({
      message: "Availability updated successfully",
      data: updatedAvailability,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer Bookings
export const getGroomerBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        groomerId: groomer.id,
        ...(status && { status }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        groomer: {
          select: { id: true, rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer Earnings/Wallet
export const getGroomerWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const wallet = await prisma.groomerWallet.findUnique({
      where: { groomerId: groomer.id },
    });

    res.status(200).json({
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer Payouts
export const getGroomerPayouts = async (req, res) => {
  try {
    const userId = req.user.id;

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    const payouts = await prisma.payout.findMany({
      where: { groomerId: groomer.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Payouts retrieved successfully",
      data: payouts,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Request Payout
export const requestPayout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, bankAccount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount required" });
    }

    const groomer = await prisma.groomer.findUnique({
      where: { userId },
      include: { wallet: true },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer profile not found" });
    }

    if (groomer.wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const payout = await prisma.payout.create({
      data: {
        groomerId: groomer.id,
        amount,
        bankAccount: bankAccount || null,
      },
    });

    res.status(201).json({
      message: "Payout requested successfully",
      data: payout,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Groomers (Public - for listing)
export const getAllGroomers = async (req, res) => {
  try {
    const { city, verified, page = 1, limit = 10 } = req.query;

    const where = {
      isVerified: verified === "true" ? true : undefined,
      user: city ? { city } : undefined,
    };

    // Remove undefined values
    Object.keys(where).forEach(key => where[key] === undefined && delete where[key]);

    const groomers = await prisma.groomer.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, city: true, photo: true },
        },
        services: {
          include: { service: true },
        },
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { rating: "desc" },
    });

    const totalCount = await prisma.groomer.count({ where });

    res.status(200).json({
      message: "Groomers retrieved successfully",
      data: groomers,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Groomer by ID (Public)
export const getGroomerById = async (req, res) => {
  try {
    const { groomerId } = req.params;

    const groomer = await prisma.groomer.findUnique({
      where: { id: groomerId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, city: true, photo: true },
        },
        services: {
          include: { service: true },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, photo: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!groomer) {
      return res.status(404).json({ message: "Groomer not found" });
    }

    res.status(200).json({
      message: "Groomer details retrieved successfully",
      data: groomer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Service from Groomer
export const removeServiceFromGroomer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groomerServiceId } = req.params;

    const groomerService = await prisma.groomerService.findUnique({
      where: { id: groomerServiceId },
      include: { groomer: true },
    });

    if (!groomerService) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (groomerService.groomer.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.groomerService.delete({
      where: { id: groomerServiceId },
    });

    res.status(200).json({
      message: "Service removed from groomer successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Availability
export const deleteAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
      include: { groomer: true },
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    if (availability.groomer.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.availability.delete({
      where: { id: availabilityId },
    });

    res.status(200).json({
      message: "Availability slot deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
