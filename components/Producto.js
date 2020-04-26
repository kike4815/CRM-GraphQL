import React from 'react'
import Swal from 'sweetalert2' 
import  {gql,useMutation } from '@apollo/client'
import Router from 'next/router'

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id:ID!){
        eliminarProducto(id: $id)
    }
`
const OBTENER_PRODUCTOS = gql`
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


const Producto = ({producto}) => {
    const { nombre,precio, existencia, id } = producto

    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache){
            const { obtenerProductos } = cache.readQuery({
               query: OBTENER_PRODUCTOS 
            })
        cache.writeQuery({
            query : OBTENER_PRODUCTOS,
            data: {
                obtenerProductos: obtenerProductos.filter( productoactual => productoactual.id !== id)                
            }
        })    
        }
    })

    const confirmDeleteProduct = () => {
        Swal.fire({
            title: 'Está seguro de eliminar el producto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar'
          }).then(async (result) => {
              if (result.value) {

                try {
                //eliminamos datos
                const {data} = await eliminarProducto({
                    variables:{
                        id
                    }   
                })    
                 console.log(data)
                    Swal.fire(
                      'Eliminado!',
                      data.eliminarProducto,
                      'success'
                    )
                    
                } catch (error) {
                    console.log(error)
                }
            }
          })
    }

    const editarProducto = () => {
        Router.push({
            pathname:'/editarproducto/[id]',
            query: {id}
        })
    }

    return (
        <tr>
            <td className="border px-4 py-2">{nombre}</td>
			<td className="border px-4 py-2 text-center">{existencia} Piezas</td>
			<td className="border px-4 py-2 text-center">{precio} €</td>
            <td className="border px-4 py-2">
            <button type='button'
                className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                onClick={()=> confirmDeleteProduct()}
                >
                    Eliminar
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>                
            </td>
			<td className="border px-4 py-2">
            <button type='button'
                className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold text-center'
                 onClick={()=> editarProducto()}
                >
                    Editar Producto
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>

            </td>

        </tr>
    )
}
export default Producto