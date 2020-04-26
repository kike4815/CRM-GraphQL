import Layout from '../components/Layout'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import Pedido from '../components/Pedido'

const OBTENER_PEDIDOS = gql`
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
			pedido {
				id
				cantidad
				nombre
			}
			cliente{
				id
				nombre
				apellido
				email
				telefono
			}
			vendedor
			estado
			total
		}
	}
`

const Pedidos = () => {

	const { data, loading, error } = useQuery(OBTENER_PEDIDOS)

	if(loading) return 'Cargando...'
	
	const { obtenerPedidosVendedor } = data
	console.log(data)

	return (

		<div>
			<Layout>
				<h1 className="text-gray-800 text-2xl font-light">Pedidos</h1>
				<Link href="/nuevopedido">
					<a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
						Nuevo Pedido
					</a>
				</Link>
				{obtenerPedidosVendedor.length === 0 ? (
					<p className='mt-5 text-center text-2xl'>No hay pedidos aún</p>
				):(
					obtenerPedidosVendedor.map(pedido => (
						<Pedido 
						key = {pedido.id}
						pedido = {pedido}
						/>
					))
				)}
			</Layout>
		</div>
	)
}
export default Pedidos
