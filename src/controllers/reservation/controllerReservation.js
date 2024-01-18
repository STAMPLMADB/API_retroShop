//import Joi from "joi";
import { createReservation } from "../../models/reservation/index.js";
import { v4 as uuidv4 } from "uuid";
import { reservationEmail } from "../../utils/index.js";

const controllerReservation = async (req, res, next) => {
  try {
    const productId = req.params.productId; // Obtener productId de los parámetros de la consulta

    const buyOrder = new Date();

    const buyerId = req.user.id;

    const reservationToken = uuidv4();
    const { reservationId, email } = await createReservation(
      {
        buyOrder,
      },
      buyerId,
      productId, // Pasar productId como parámetro
      reservationToken
    );

    await reservationEmail(email, reservationId);
    // console.log(email);
    res.status(201).json({
      id: reservationId,
      reservationToken,
      message: "Reserva creada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export default controllerReservation;
