const mongoose = require('mongoose')

const Productoschema = mongoose.Schema({
    nombre : {
        type : String,
        required : true,
        trim : true
    },
    existencia : {
        type : Number,
        required : true
        
    },
    precio : {
        type: Number,
        required : true
    },

    creado: {
        type: Date,
        default: Date.now()
    }


})

Productoschema.index({nombre:'text'})

module.exports = mongoose.model('Producto', Productoschema)