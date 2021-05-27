const User = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const usuarioCtrl = {};

usuarioCtrl.crearUsuario = async (req, res) => {
  try {
    // Revisar si hay errores

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array(),
      });
    }

    const { nombre, email, password } = req.body;

    const verificarUsuario = await User.findOne({ email: email });
    if (verificarUsuario) {
      return res.status(400).json({
        message: "Ya existe este correo registrado",
      });
    }

    const nuevoUsuario = new User({
      nombre: nombre,
      email: email,
    });

    //Hash de password
    const salt = await bcrypt.genSalt(10);
    nuevoUsuario.password = await bcrypt.hash(password, salt);

    //Guardar al usuario creado
    await nuevoUsuario.save();

    //Crear y firmar el JWT
    const payload = {
      usuario: {
        id: nuevoUsuario.id,
      },
    };

    //Firmar token

    const token = jwt.sign(payload, process.env.SECRETA, {
      expiresIn: 3600,
    });

    return res.status(201).json({
      token: token,
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Hubo un error",
    });
  }
};

module.exports = usuarioCtrl;
