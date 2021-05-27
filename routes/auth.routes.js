// Rutas para autenticar usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//crear un usuario
//api/auth

router.post("/", authController.autenticarUsuario);

router.get("/", authMiddleware, authController.usuarioAutenticado);

module.exports = router;
