const { response } = require("express");
const bcrypt = require('bcryptjs')
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");


const crearUsuario = async(req, res = response ) => {

    const { email, password} = req.body;

    try {
        
        let usuario = await Usuario.findOne({email})
        
        if (usuario) {
            return res.status(400).json({
                ok: false,
                message: 'Ya hay un usuario con este email'
            })
        }

        usuario = new Usuario(req.body)

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)

    
        await usuario.save()

        // Generar jWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            message: 'Porfavor hable con el administrador',
        })
    }
}

const loginUsuario = async(req, res = response) => {
    
    const {email, password} = req.body

    try {
            
        const usuario = await Usuario.findOne({email})
        
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'No existe ninguna cuenta con este email'
            })
        } 

        // Validar password

        const validarPassword = bcrypt.compareSync(password, usuario.password)

        if (!validarPassword) {
            return res.status(400).json({
                ok:false,
                message: 'Password incorrecto'
            }) 
        }

        // Generar nuestro Json Web Token
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok:true, 
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            message: 'Porfavor hable con el administrador'
        })
    }

}

const revalidarToken = async(req, res = response) => {
 
    const { uid, name } = req

    // Generar nuestro Json Web Token
    const token = await generarJWT(uid, name)

    res.json({
        ok:true,
        uid,
        name,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}


