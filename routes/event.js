/*
    Event routes
    /api/events
 */

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getEventos,
  crearEventos,
  actualizarEventos,
  eliminarEventos,
} = require("../controllers/events");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();
//todas las peticiones tiene que pasar por la validacion del JWT
router.use(validarJWT);
//obtener eventos
router.get("/", getEventos);

//crear un nuevo evento
router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de incio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos,
  ],
  crearEventos
);

//actualizar evento
router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de incio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos,
  ],
  actualizarEventos
);

//b
router.delete("/:id", eliminarEventos);

module.exports = router;
