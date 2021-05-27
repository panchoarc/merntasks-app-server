const User = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const authController = {};

authController.autenticarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  const { email, password } = req.body;

  try {
    //Revisar si es un usuario registrado
    let usuario = await User.findOne({ email: email });
    if (!usuario) {
      return res.status(400).json({ message: "El usuario no existe" });
    }
    //Revisar password

    const passCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ message: "Password Incorrecto" });
    }

    //Si todo es correcto

    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRETA, {
      expiresIn: 3600,
    });

    res.status(201).json({
      token: token,
    });
  } catch (error) {
    /* console.log(error); */
  }
};

//Obtener qué usuario está autenticado
authController.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ha ocurrido un error",
    });
  }
};

module.exports = authController;
