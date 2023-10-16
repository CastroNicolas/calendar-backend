// Eventes Routes
// /api/events
const { crearEventos, actualizarEventos, eliminarEventos, getEventos } = require("../controllers/events")
const { Router } = require("express")
const { validarJWT } = require("../middlewares/validar-jwt")
const { check } = require("express-validator")
const { validarCampos } = require("../middlewares/validarCampos")
const { isDate } = require("../helpers/isDate")
const router = Router()
// Todas tienen que pasar por la validacion del JWT 

router.use(validarJWT)

// Obtener eventos 
router.get('/', getEventos)

// Crear eventos 
router.post('/', 
        [
            check('title', 'El titulo debe de ser obligatorio').not().isEmpty(),
            check('start', 'La fecha de inicio debe de ser obligatorio').custom(isDate),
            check('end', 'La fecha de finalizacion debe de ser obligatorio').custom(isDate),

            validarCampos
        ] 
        ,crearEventos)

// actualizar eventos 
router.put('/:id',  actualizarEventos)

// Eliminar eventos 
router.delete('/:id',  eliminarEventos)

module.exports = router