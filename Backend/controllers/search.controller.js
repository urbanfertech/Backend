import prisma  from "../lib/prisma.js";
export const searchGroomers = async (req, res) => {
  try {
    const {
      q,
      city,
      minRating,
      serviceId,
      page = 1,
      limit = 10
    } = req.query;
    
    const groomers = await prisma.groomer.findMany({
      where: {
        isVerified: true,

       
        user: q
          ? {
              OR: [
                {
                  name: {
                    contains: q,
                    mode: "insensitive"
                  }
                },
                {
                  city: {
                    contains: q,
                    mode: "insensitive"
                  }
                }
              ]
            }
          : city
          ? {
              city: {
                contains: city,
                mode: "insensitive"
              }
            }
          : undefined,

      
        rating: minRating
          ? { gte: Number(minRating) }
          : undefined,

        
        services: serviceId
          ? {
              some: {
                serviceId: serviceId
              }
            }
          : undefined
      },

      include: {
        user: {
          select: {
            name: true,
            city: true,
            photo: true
          }
        }
      },

      skip: (page - 1) * Number(limit),
      take: Number(limit),

      orderBy: {
        rating: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      data: groomers
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};




export const searchServices = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const services = await prisma.service.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive"
        },
        isActive: true
      },
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      orderBy: {
        created_at: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      data: services
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
