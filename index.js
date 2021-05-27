const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

//crear el servidor

const app = express();

//conectar a Base de datos
conectarDB();

app.use(express.json({ extended: true }));
app.use(cors());

const port = process.env.port || 4000;
const HOST = process.env.HOST || "localhost";

//Importar rutas
const usuariosRoutes = require("./routes/usuarios.routes");
const authRoutes = require("./routes/auth.routes");
const proyectoRoutes = require("./routes/proyecto.routes");
const tareaRoutes = require("./routes/tarea.routes");

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/proyectos/", proyectoRoutes);
app.use("/api/tareas/", tareaRoutes);

//arrancar APP

app.listen(port, "0.0.0.0", () =>
  console.log(`Servidor funcionando en ${HOST} el puerto ${PORT}`)
);
