// Rutas para crear proyectos
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const proyectoController = require("../controllers/proyecto.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//crear un usuario
//api/proyectos
router.post(
  "/",
  authMiddleware,
  [
    check("nombre", "El nombre del Proyecto es obligatorio")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  proyectoController.crearProyecto
);
router.get("/", authMiddleware, proyectoController.obtenerProyectos);
router.get("/:id", authMiddleware, proyectoController.obtenerProyecto);

router.put(
  "/:id",
  authMiddleware,
  [
    check("nombre", "El nombre del Proyecto es obligatorio")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  proyectoController.actualizarProyecto
);
router.delete("/:id", authMiddleware, proyectoController.eliminarProyecto);

module.exports = router;
