//para que me salga la ayuda al programar
const { response } = require("express");
const bcript = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  //   if(name.length<5){
  //       return res.status(400).json({
  //           ok:false,
  //           msg:'El nombre debe de ser  mayor a 5 letras '
  //       })
  //   }

  //manejo de errores
  try {
    let usuario = await Usuario.findOne({ email });
    console.log(usuario);
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con el correo ingresado",
      });
    }
    usuario = new Usuario(req.body);
    //enciptar contraseña
    const salt = bcript.genSaltSync();
    usuario.password = bcript.hashSync(password, salt);

    await usuario.save();
    //generar el jwt
    const token = await generarJWT(usuario.id, usuario.name);

    return res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con el email ingresado",
      });
    }
    //confirmar los passwords
    const validPassword = bcript.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }
    //generar el jwt
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const revalidarToken = async(req, res) => {
  const uid = req.uid;
  const name = req.name;
  //generar el jwt
  const token = await generarJWT(uid,name);
  res.json({
    ok: true,
    token
  });
};
module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
