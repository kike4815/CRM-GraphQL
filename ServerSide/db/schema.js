const {gql} = require('apollo-server')


const typeDefs  = gql `

    type Usuario {
        id: ID
        nombre:String
        apellido: String
        email : String
        creado : String
    }

    type Token {
        token : String
    }
    type Producto {
        id: ID
        nombre: String
        existencia : String
        precio : Float
        creado : String
    }
    type Cliente {
        id: ID
        nombre:String
        apellido: String
        empresa : String
        email : String
        telefono : String
        vendedor : ID
    }
    type Pedido {
        id: ID
        pedido : [pedidoGrupo]
        total : Float
        cliente: Cliente
        vendedor : ID
        fecha : String
        estado: estadoPedido
    }

    type pedidoGrupo {
        id: ID
        cantidad: Int
        nombre: String
        precio: Float
    }
    type TopCliente {
        total: Float
        cliente: [Cliente]
    }

    type TopVendedor {
        total : Float
        vendedor: [Usuario]
    }

    input UsuarioInput {
        nombre: String!
        apellido : String!
        email : String!
        password : String!

    }
    input ClienteInput {
        nombre:String!
        apellido:String!
        empresa:String!
        email:String!
        telefono:String
    }

    input AutenticarInput {
        email: String!
        password: String!
    }
    input ProductoInput {
        nombre : String
        existencia : Int!
        precio : Float!
    }

    input PedidoProductoInput {
        id:ID
        cantidad : Int
        nombre: String
        precio: Float
    }

    input PedidoInput {
        pedido : [PedidoProductoInput]
        total : Float
        cliente: ID
        estado : estadoPedido
    }
    enum estadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    type Query {
        #usuarios
        obtenerUsuario:Usuario
        
        #productos
        obtenerProductos: [Producto]
        obtenerProducto (id:ID! ): Producto
        
        #clientes
        obtenerClientes : [Cliente]
        obtenerClientesVendedor: [Cliente]
        obtenerCliente (id:ID!): Cliente

        #pedidos
        obtenerPedidos : [Pedido]
        obtenerPedidosVendedor: [Pedido]
        obtenerPedido (id:ID!) : Pedido
        obtenerPedidosEstado (estado:String!): [Pedido]

        #Busquedas Avanzadas
        mejoresClientes : [TopCliente]
        mejoresVendedores: [TopVendedor]
        buscarProducto(texto: String!): [Producto]
    }


    type Mutation {
        #usuarios
        nuevoUsuario (input: UsuarioInput): Usuario
        autenticarUsuario(input : AutenticarInput) : Token
        
        #productos
        nuevoProducto (input: ProductoInput): Producto
        actualizarProducto (id:ID!,input:ProductoInput): Producto
        eliminarProducto (id: ID!) : String

        #Cliente
        nuevoCliente(input: ClienteInput): Cliente
        actualizarCliente(id:ID!,input:ClienteInput):Cliente
        eliminarCliente(id:ID!): String

        #Pedido
        nuevoPedido (input: PedidoInput): Pedido
        actualizarPedido(id:ID!,input:PedidoInput):Pedido
        eliminarPedido (id:ID!):String
    }

`

module.exports = typeDefs