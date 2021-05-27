// Rutas para crear proyectos
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const tareaController = require("../controllers/tarea.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//Crear una tarea

router.post(
  "/",
  authMiddleware,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("proyecto", "El Proyecto es obligatorio").not().isEmpty(),
  ],
  tareaController.crearTarea
);

//Obtener las tareas por proyecto

router.get("/", authMiddleware, tareaController.obtenerTareas);

router.put("/:id", authMiddleware, tareaController.actualizarTarea);

router.delete("/:id", authMiddleware, tareaController.eliminarTarea);

module.exports = router;
