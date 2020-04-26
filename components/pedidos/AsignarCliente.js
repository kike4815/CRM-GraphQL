import React, {useState,useEffect, useContext} from 'react'
import Select from 'react-select'
import {gql, useQuery} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext'

const OBTENER_CLIENTES = gql`
	query obtenerClienteVendedor {
		obtenerClientesVendedor {
			id
			nombre
			email
			empresa
			apellido
		}
	}
`; 
const AsignarCliente = () =>{

const [cliente, setCliente] = useState([])

const pedidoContext = useContext(PedidoContext)
const {agregarCliente } = pedidoContext

const { data, loading, error} = useQuery(OBTENER_CLIENTES)


    useEffect(()=>{
        agregarCliente(cliente)
    },[cliente])

const selecccionarcliente = cliente => {
    setCliente(cliente)
}

if(loading) return 'cargando..'

const { obtenerClientesVendedor } = data
    return(

        <>
        <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>1.- Asigna un Cliente al pedido</p>
        <Select
        className="mt-3" 
        options={obtenerClientesVendedor}
        isMulti={false}  
        onChange={cliente => selecccionarcliente(cliente)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => opciones.nombre}
        placeholder='seleccione el cliente'
        noOptionsMessage={()=>'No hay resultados'}
        />
        </>
    )

}
export default AsignarCliente