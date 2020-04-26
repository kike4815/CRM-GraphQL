const Usuario = require('../models/Usuario')
const Cliente = require('../models/Cliente')
const Producto = require('../models/Producto')
const Pedido = require('../models/Pedido')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

const crearToken = (usuario, secret, expiresIn) => {
	const { id, email, nombre, apellido } = usuario
	return jwt.sign({ id, email, nombre, apellido }, secret, { expiresIn })
}

const resolvers = {
	Query: {
		obtenerUsuario: async (_, { }, ctx) => {
			console.log(ctx.usuario + 'Usuario Resolver')
			return ctx.usuario
			
		},
		obtenerProductos: async () => {
			try {
				const productos = await Producto.find({})
				return productos
			} catch (error) {
				console.log(error)
			}
		},
		obtenerProducto: async (_, { id }) => {
			try {
				const producto = await Producto.findById(id)
				if (!producto) {
					throw new Error('no existe el producto')
				}
				return producto
			} catch (error) {
				console.log(error)
			}
		},
		obtenerClientes: async () => {
			try {
				const clientes = await Cliente.find({})
				return clientes
			} catch (error) {
				console.log(error)
			}
		},
		obtenerClientesVendedor: async (_, {}, ctx) => {
			try {
				const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() })
				return clientes
			} catch (error) {
				console.log(error)
			}
		},
		obtenerCliente: async (_, { id }, ctx) => {
			const cliente = await Cliente.findById(id)
			if (!cliente) {
				throw new Error('no existe el cliente')
			}
			if (cliente.vendedor.toString() !== ctx.usuario.id) {
				throw new Error('no tienes credenciales')
			}
			return cliente
		},
		obtenerPedidos: async () => {
			try {
				const pedidos = await Pedido.find({})
				return pedidos
			} catch (error) {
				console.log(error)
			}
		},
		obtenerPedidosVendedor: async (_, {}, ctx) => {
			try {
				const pedidos = await Pedido.find({ vendedor: ctx.usuario.id }).populate('cliente')
				console.log(pedidos)
				return pedidos
			} catch (error) {
				console.log(error)
			}
		},
		obtenerPedido: async (_, { id }, ctx) => {
			const pedido = await Pedido.findById(id)
			if (!pedido) {
				throw new Error('pedido no existe')
			}
			if (pedido.vendedor.toString() !== ctx.usuario.id) {
				throw new Error('no tienes las credenciales')
			}
			return pedido
		},
		obtenerPedidosEstado: async (_, { estado }, ctx) => {
			const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado })
			return pedidos
		},
		mejoresClientes: async () => {
			const clientes = await Pedido.aggregate([
				{ $match: { estado: 'COMPLETADO' } },
				{
					$group: {
						_id: '$cliente',
						total: { $sum: '$total' }
					}
				},
				{
					$lookup: {
						from: 'clientes',
						localField: '_id',
						foreignField: '_id',
						as: 'cliente'
					}
				},
				{ $sort: { total: -1 } }
			])
			return clientes
		},
		mejoresVendedores: async () => {
			const vendedores = await Pedido.aggregate([
				{ $match: { estado: 'COMPLETADO' } },
				{
					$group: {
						_id: '$vendedor',
						total: { $sum: '$total' }
					}
				},
				{
					$lookup: {
						from: 'usuarios',
						localField: '_id',
						foreignField: '_id',
						as: 'vendedor'
					}
				},
                { 
                    $limit: 3 
                },
				{
					$sort: {
						total: -1
					}
				},
            ])
            return vendedores
        },
        buscarProducto: async (_, {texto})=> {
            const productos = await Producto.find({ $text: {$search : texto} }).limit(10)
            return productos
        }
	},
	Mutation: {
		nuevoUsuario: async (_, { input }) => {
			const { email, password } = input

			//revisar primero si el usuario está registrado
			const existeUsuario = await Usuario.findOne({ email })

			if (existeUsuario) {
				throw new Error('el usuario ya existe')
			}

			const salt = await bcryptjs.genSaltSync(10)
			input.password = await bcryptjs.hash(password, salt)
			//Hashear el password

			try {
				const usuario = new Usuario(input)
				usuario.save()
				return usuario
			} catch (error) {
				console.log(error)
			}
			//guardar en Db
		},

		autenticarUsuario: async (_, { input }) => {
			const { email, password } = input
			//User exists?
			const existeUsuario = await Usuario.findOne({ email })
			if (!existeUsuario) {
				throw new Error('el usuario no existe')
			}

			//revisar el password si es correcto
			const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password)
			if (!passwordCorrecto) {
				throw new Error('password incorrecto')
			}

			return {
				token: crearToken(existeUsuario, process.env.SECRET, '24h')
			}
		},
		nuevoProducto: async (_, { input }) => {
			try {
				const nuevoProducto = new Producto(input)
				const resultado = await nuevoProducto.save()
				return resultado
			} catch (error) {
				console.log(error)
			}
		},
		actualizarProducto: async (_, { id, input }) => {
			let producto = await Producto.findById(id)

			if (!producto) {
				throw new Error('no existe el producto')
			}
			producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true })
			return producto
		},
		eliminarProducto: async (_, { id }) => {
			let producto = await Producto.findById(id)

			if (!producto) {
				throw new Error('no existe el producto')
			}
			await Producto.findOneAndDelete({ _id: id })
			return 'Producto Eliminado'
		},
		nuevoCliente: async (_, { input }, ctx) => {
			//verificar si existe cliente
			const { email } = input
			const cliente = await Cliente.findOne({ email })
			if (cliente) {
				throw new Error('el usuario ya existe')
			}

			const nuevoCliente = new Cliente(input)
			nuevoCliente.vendedor = ctx.usuario.id

			try {
				const resultado = await nuevoCliente.save()
				return resultado
			} catch (error) {
				console.log(error)
			}
			//asignar vendedor

			//guardar DB
		},
		actualizarCliente: async (_, { id, input }, ctx) => {
			//verificar si existe cliente

			let cliente = await Cliente.findById(id)
			if (!cliente) {
				throw new Error('el usuario no existe')
			}
			if (cliente.vendedor.toString() !== ctx.usuario.id) {
				throw new Error('no tienes credenciales')
			}
			cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true })
			return cliente
		},
		eliminarCliente: async (_, { id }, ctx) => {
			let cliente = await Cliente.findById(id)
			if (!cliente) {
				throw new Error('el usuario no existe')
			}
			if (cliente.vendedor.toString() !== ctx.usuario.id) {
				throw new Error('no tienes credenciales')
			}
			await Cliente.findOneAndDelete({ _id: id })
			return 'Cliente Eliminado'
		},

		nuevoPedido: async (_, { input }, ctx) => {
			const { cliente } = input

			//verificar si el cliente existe o no

			let clienteExiste = await Cliente.findById(cliente)
			if (!clienteExiste) {
				throw new Error('el usuario no existe')
			}

			//verificar si el cliente es vendedor
			if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
				throw new Error('no tienes credenciales')
			}

			//revisar el stock disponible
			for await (const articulo of input.pedido) {
				const { id } = articulo
				const producto = await Producto.findById(id)

				if (articulo.cantidad > producto.existencia) {
					throw new Error(`la cantidad que ha pedido del producto ${producto.nombre} excede el stock`)
				} else {
					producto.existencia = producto.existencia - articulo.cantidad
					await producto.save()
				}
			}
			//crear un nuevo pedido
			const nuevopedido = new Pedido(input)

			// asignar un vendedor
			nuevopedido.vendedor = ctx.usuario.id

			//guardar en la DB
			const resultado = await nuevopedido.save()
			return resultado
		},
		actualizarPedido: async (_, { id, input }, ctx) => {
			const { cliente } = input

			//pedido existe?

			const existepedido = await Pedido.findById(id)
			if (!existepedido) {
				throw new Error(`pedido no existe`)
			}
			//existe cliente?

			let clienteExiste = await Cliente.findById(cliente)
			if (!clienteExiste) {
				throw new Error('el cliente no existe')
			}
			//verificar si el cliente es vendedor
			if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
				throw new Error('no tienes credenciales')
			}
			//revisar el stock
			if (input.pedido) {
				for await (const articulo of input.pedido) {
					const { id } = articulo
					const producto = await Producto.findById(id)

					if (articulo.cantidad > producto.existencia) {
						throw new Error(`la cantidad que ha pedido del producto ${producto.nombre} excede el stock`)
					} else {
						producto.existencia = producto.existencia - articulo.cantidad
						await producto.save()
					}
				}
			}
			const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true })
			return resultado
		},
		eliminarPedido: async (_, { id }, ctx) => {
			const pedido = await Pedido.findById(id)
			if (!pedido) {
				throw new Error(`pedido no existe`)
			}
			if (pedido.vendedor.toString() !== ctx.usuario.id) {
				throw new Error('no tienes credenciales')
			}
			await Pedido.findOneAndDelete({ _id: id })
			return 'pedido eliminado'
		}
	}
}

module.exports = resolvers
