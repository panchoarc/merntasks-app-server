const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

const proyectoController = {};

proyectoController.crearProyecto = async (req, res) => {
  try {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array(),
      });
    }

    const { nombre } = req.body;
    const { id } = req.usuario;
    //Crear un nuevo Proyecto
    const nuevoProyecto = new Proyecto({
      nombre: nombre,
    });
    nuevoProyecto.creador = id;

    await nuevoProyecto.save();

    return res.status(201).json({
      message: "Se ha creado satisfactoriamente su Proyecto",
      proyecto: nuevoProyecto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ha ocurrido un error en el servidor",
    });
  }
};

proyectoController.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({
      creador: req.usuario.id,
    });

    res.status(200).json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error en el servidor",
    });
  }
};
proyectoController.actualizarProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }
  //extraer la info del proyecto

  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    const { id } = req.params;

    console.log(id);
    let proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    proyecto = await Proyecto.findOneAndUpdate(
      { _id: id },
      {
        $set: nuevoProyecto,
      },
      { new: true }
    );

    res.json({
      message: "Se ha modificado correctamente su proyecto",
      data: proyecto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error en el servidor",
    });
  }
};

proyectoController.eliminarProyecto = async (req, res) => {
  try {
    const { id } = req.params;

    let proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }
    // Eliminar el Proyecto

    await Proyecto.findOneAndRemove({ _id: id });

    res.json({
      message: "Se ha eliminado correctamente el Proyecto",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ha habido un error en el servidor",
    });
  }
};

proyectoController.obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  try {
    const proyecto = await Proyecto.find({
      creador: req.usuario.id,
      _id: id,
    });

    res.status(200).json({
      data: proyecto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error en el servidor",
    });
  }
};

module.exports = proyectoController;
