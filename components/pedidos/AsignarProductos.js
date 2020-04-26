import React,{useEffect,useState,useContext} from 'react'
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext'


const ASIGNAR_PRODUCTOS = gql `
	query obtenerProductos {
		obtenerProductos {
			id
			nombre
			precio
			existencia
			creado
		}
	}
`

const AsignarProductos = () => {
    const [productos, setProductos] = useState([])

    const pedidoContext = useContext(PedidoContext)

    const {agregarProducto } = pedidoContext

    const { data, loading, error } = useQuery(ASIGNAR_PRODUCTOS)

    useEffect(()=> {
        agregarProducto(productos)
    },[productos])


    const seleccionarProducto = producto => {
        setProductos(producto)
    }

    if(loading) return 'Cargando...'

    const { obtenerProductos } = data
    
    return (
        <>
        <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.- Seleccionar o busca los productos</p>
        <Select
        className="mt-3" 
        options={obtenerProductos}
        isMulti={true}  
        onChange={cliente => seleccionarProducto(cliente)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => `${opciones.nombre} - ${opciones.existencia}  Disponibles`}
        placeholder='seleccione el producto'
        noOptionsMessage={()=>'No hay resultados'}
        />
        </>
    )
}
export default AsignarProductos