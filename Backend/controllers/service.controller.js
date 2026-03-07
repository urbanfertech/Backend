import prisma from "../config/prisma.js";

//admin
export const createService = async (req, res) => {
  try {
    const { name, description, duration } = req.body;

    if (!name || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name and duration are required"
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration
      }
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { created_at: "desc" }
    });

    return res.json({
      success: true,
      data: services
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.json({
      success: true,
      data: service
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration } = req.body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        duration
      }
    });

    return res.json({
      success: true,
      message: "Service updated successfully",
      data: updatedService
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: { isActive }
    });

    return res.json({
      success: true,
      message: `Service ${isActive ? "activated" : "deactivated"} successfully`,
      data: updatedService
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

  
    const activeBooking = await prisma.bookingService.findFirst({
      where: {
        serviceId: id,
        booking: {
          OR: [
            { status: { in: ["PENDING", "CONFIRMED"] } },
            { bookingDate: { gt: new Date() } }
          ]
        }
      },
      include: {
        booking: true
      }
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete service. It is linked to active or future bookings."
      });
    }

  
    await prisma.service.update({
      where: { id },
      data: { isActive: false }
    });

    
    await prisma.groomerService.updateMany({
      where: { serviceId: id },
      data: { isActive: false }
    });

    return res.json({
      success: true,
      message: "Service  deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
