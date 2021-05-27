const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  //Leer el token del header
  const token = req.header("x-auth-token");

  //Revisar si no hay token
  if (!token) {
    return res.status(401).json({ message: "No hay token, permiso no válido" });
  }

  //Validar token

  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.usuario = cifrado.usuario;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token no válido" });
  }
};
