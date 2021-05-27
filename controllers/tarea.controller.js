const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

const tareaController = {};
//Crea una nueva tarea

tareaController.crearTarea = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  try {
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    //Creamos la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ message: "Se ha creado correctamente la tarea", data: tarea });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error en el servidor",
    });
  }
};
//Obtener todas las tareas de un proyecto en específico
tareaController.obtenerTareas = async (req, res) => {
  try {
    const { proyecto } = req.query;
    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    const tareas = await Tarea.find({
      proyecto,
    });

    res.status(200).json({
      tareas,
    });

    //Obtener las tareas por proyecto
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error",
    });
  }
};

tareaController.actualizarTarea = async (req, res) => {

  try {
    const { proyecto, nombre, estado ,_id } = req.body.tarea;

    //
    let tarea = await Tarea.findById(_id);
    if (!tarea) {
      return res.status(404).json({
        message: "La tarea no existe",
      });
    }
    //Extraer Proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }
    const nuevaTarea = {};

    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.json({
      message: "Se ha actualizado correctamente la tarea",
      tarea,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error",
    });
  }
};

tareaController.eliminarTarea = async (req, res) => {
  try {
    const { proyecto, nombre, estado } = req.query;

    //
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({
        message: "La tarea no existe",
      });
    }
    //Extraer Proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    //Eliminar tarea

    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({
      message: "Se ha eliminado correctamente la tarea",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error",
    });
  }
};
module.exports = tareaController;
