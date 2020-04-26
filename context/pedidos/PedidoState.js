import React,{ useReducer } from 'react'
import PedidoContext from './PedidoContext'
import PedidoReducer from './PedidoReducer'
import { SELECCIONAR_PRODUCTO, SELECCIONAR_CLIENTE, CANTIDAD_PRODUCTOS, ACTUALIZAR_TOTAL } from '../../types'


const PedidoState = ({children}) => {
    
const initialState = {
    cliente:{},
    productos:[],
    total:0
}
const [state, dispatch ] = useReducer(PedidoReducer, initialState)

const agregarCliente = cliente => {

    dispatch({
        type: SELECCIONAR_CLIENTE,
        payload:cliente
    })
}

const agregarProducto = productosSelect => {
    let nuevoState
    if (state.productos.length > 0) {
        //hacemos del segundo array, una copia del primero
        nuevoState = productosSelect.map (producto => {
            const nuevoProducto = state.productos.find(productoState => productoState.id === producto.id)
            return {...producto, ...nuevoProducto}
        })
    } else {
        nuevoState = productosSelect
    }
    dispatch({
        type: SELECCIONAR_PRODUCTO,
        payload:nuevoState
    })
}

const cantidadProductos = (nuevoProductos) => {
    dispatch({
        type: CANTIDAD_PRODUCTOS,
        payload:nuevoProductos
    })
}
const actualizarTotal = () => {
    dispatch({
        type: ACTUALIZAR_TOTAL
    })

}
    return (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos:state.productos,
                total:state.total,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}
export default PedidoState


