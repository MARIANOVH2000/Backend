const { response } = require("express");
const Evento = require("../models/Evento");
const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");

  res.json({
    ok: true,
    eventos,
  });
};

const crearEventos = async (req, res = response) => {
  const evento = new Evento(req.body);
  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();
    res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const actualizarEventos = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);
    //si se encuentra un evento con ese id
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento con ese id no existe",
      });
    }
    //si el usuario que esta editando es el mismo que lo hizo el post
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios de editar en este evento",
      });
    }
    //actualizar el evento
    const nuevoEvento = {
      ...req.body,
      user: uid,
    };
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true } //para que nos muestre el elemento actualizado
    );
    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const eliminarEventos = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);
    //si se encuentra un evento con ese id
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento con ese id no existe",
      });
    }
    //si el usuario que esta editando es el mismo que lo hizo el post
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para eliminar en este evento",
      });
    }

    await Evento.findByIdAndDelete(eventoId);
    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
module.exports = {
  getEventos,
  crearEventos,
  actualizarEventos,
  eliminarEventos,
};
