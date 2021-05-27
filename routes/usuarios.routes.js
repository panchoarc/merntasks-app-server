// Rutas para crear usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const proyectoController = require("../controllers/proyecto.controller");

const usuarioController = require("../controllers/usuarios.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//crear un usuario

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty().trim().escape(),
    check("email", "Agrega un email válido").isEmail().normalizeEmail(),
    check("password", "El password debe ser mínimo de 6 caracteres").isLength({
      min: 6,
    }),
  ],
  usuarioController.crearUsuario
);

module.exports = router;
