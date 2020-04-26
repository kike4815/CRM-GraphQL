const mongoose = require('mongoose')

const Pedidoschema = mongoose.Schema({
    pedido : {
        type : Array,
        required : true,
    },
    total : {
        type : Number,
        required : true
        
    },
    cliente : {
        type: mongoose.SchemaTypes.ObjectId,
        required : true,
        ref : 'Cliente'
    },

    vendedor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Usuario',
        required:true
    },
    estado: {
        type: String,
        default: 'PENDIENTE'
    },
    creado: {
        type: Date,
        default:Date.now()
    }


})

module.exports = mongoose.model('Pedido', Pedidoschema)