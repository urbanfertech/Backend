import prisma from "../lib/prisma.js";


export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    if(!req.body) return res.status(400).json({ message: "No data provided" });
    const { groomerId, petId, bookingDate, serviceIds } = req.body;

    if (!groomerId || !petId || !bookingDate || !serviceIds?.length) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const selectedDate = new Date(bookingDate);

    if (selectedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book past date/time"
      });
    }

    const pet = await prisma.pet.findFirst({
      where: { id: petId, userId }
    });

    if (!pet) {
      return res.status(403).json({
        success: false,
        message: "Invalid pet selection"
      });
    }

   
    const groomer = await prisma.groomer.findFirst({
      where: { id: groomerId, isVerified: true }
    });

    if (!groomer) {
      return res.status(400).json({
        success: false,
        message: "Groomer not available"
      });
    }


    const bookingDay = selectedDate.getDay();

    const availability = await prisma.availability.findFirst({
      where: {
        groomerId,
        dayOfWeek: bookingDay,
        isAvailable: true
      }
    });

    if (!availability) {
      return res.status(400).json({
        success: false,
        message: "Groomer not available on selected day"
      });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        groomerId,
        bookingDate: selectedDate,
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Time slot already booked"
      });
    }

    
    const groomerServices = await prisma.groomerService.findMany({
      where: {
        groomerId,
        serviceId: { in: serviceIds },
        isActive: true
      }
    });

    if (groomerServices.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some services not available for this groomer"
      });
    }


    let totalAmount = 0;
    let totalDuration = 0;

    groomerServices.forEach(gs => {
      totalAmount += Number(gs.customPrice || 0);
      totalDuration += gs.customDuration || 0;
    });

   
    const result = await prisma.$transaction(async (tx) => {

      const booking = await tx.booking.create({
        data: {
          userId,
          groomerId,
          petId,
          bookingDate: selectedDate,
          totalAmount
        }
      });

      await tx.bookingService.createMany({
        data: groomerServices.map(gs => ({
          bookingId: booking.id,
          serviceId: gs.serviceId,
          priceAtBooking: gs.customPrice
        }))
      });

   
      const tax = totalAmount * 0.18;
      const platformFee = 50;
      const finalAmount = totalAmount + tax + platformFee;

      const invoice = await tx.invoice.create({
        data: {
          bookingId: booking.id,
          subtotal: totalAmount,
          platformFee,
          tax,
          totalAmount: finalAmount,
          status: "pending"
        }
      });

  
      await tx.invoiceItem.createMany({
        data: groomerServices.map(gs => ({
          invoiceId: invoice.id,
          serviceId: gs.serviceId,
          price: gs.customPrice
        }))
      });

      return { booking, invoice };
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { bookingDate } = req.body;

    const booking = await prisma.booking.findFirst({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be updated"
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { bookingDate: new Date(bookingDate) }
    });

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Completed booking cannot be cancelled"
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    res.json({ success: true, message: "Booking cancelled", data: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getBookingsByPet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { petId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        petId
      },
      include: {
        groomer: true,
        bookingServices: {
          include: { service: true }
        },
        invoice: true
      },
      orderBy: { bookingDate: "desc" }
    });

    res.json({ success: true, data: bookings });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        pet: true,
        groomer: true,
        bookingServices: {
          include: { service: true }
        },
        invoice: true
      },
      orderBy: { bookingDate: "desc" }
    });

    res.json({ success: true, data: bookings });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};