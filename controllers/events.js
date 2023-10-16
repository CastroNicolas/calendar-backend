const { response } = require("express")
const Evento = require("../models/Evento")


const getEventos = async(req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name')

    res.json({
        ok: true,
        eventos
    })
}

const crearEventos = async(req, res = response) => {
    
    const evento = new Evento(req.body)

    try {
        evento.user = req.uid
        
        const eventoGuardado = await evento.save()

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Debe de comunicarse con un administrador'
        })
    }
    
}

const actualizarEventos = async(req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {
        
        const evento = await Evento.findById( eventoId )
        
        if (!evento) {
           return res.status(404).json({
                ok: false,
                message: 'No existe ningún evento con ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true })

    } catch (error) {
        res.status(500).json({
            ok:false,
            message: 'Debe de hablar con un administrador'
        })
    }

    res.json({
        ok: true,
        eventoId
    })
}

const eliminarEventos = async(req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {
        
        const evento = await Evento.findById( eventoId )
        
        if (!evento) {
            return res.status(404).json({
                ok: false,
                message: 'No existe ningún evento con ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio de eliminar este evento'
            })
        }

        const Eventoviejo = {
            ...req.body,
            user: uid
        }
    
        await Evento.findByIdAndDelete(eventoId, Eventoviejo, { new: true })

    } catch (error) {
        res.status(500).json({
            ok:false,
            message: 'Debe de hablar con un administrador'
        })
    }

    res.json({
        ok: true,
        message: 'eliminarEventos'
    })
}

module.exports = {
    getEventos,
    crearEventos,
    actualizarEventos,
    eliminarEventos
}