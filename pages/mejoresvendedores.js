import React, {useEffect} from 'react'
import Layout from '../components/Layout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { gql, useQuery } from '@apollo/client'

const MEJORES_VENDEDORES = gql`
    query mejoresVendedores {
        mejoresVendedores{
            vendedor {
                email
                nombre
            }
            total
        }
    }
`



const MejoresVendedores = () => {
    const { data, loading, error, startPolling,stopPolling } = useQuery(MEJORES_VENDEDORES)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling,stopPolling])    


    if (loading) return 'Cargando...'
    console.log(data.mejoresVendedores)

    const { mejoresVendedores } = data

    const vendedorGrafica = []

    mejoresVendedores.map((vendedor, index)=> {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    })
	return (
		<Layout>
			<h1 className="text-gray-800 text-2xl font-light">Mejores Vendedores</h1>
            <ResponsiveContainer
            width={'99%'}
            height={650}
            >
			<BarChart
                className='mt-10'
				width={800}
				height={600}
				data={vendedorGrafica}
				margin={{
					top: 5,
					right: 30,
					left: 60,
					bottom: 5
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="nombre" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="total" fill="#3182CE" />
			</BarChart>
            </ResponsiveContainer>
		</Layout>
	)
}
export default MejoresVendedores
