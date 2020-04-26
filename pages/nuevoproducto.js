import React from 'react'
import Layout from '../components/Layout'
import { gql,useMutation } from '@apollo/client'
import { useFormik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useRouter} from 'next/router'


const NUEVO_PRODUCTO = gql`
mutation nuevoProducto ($input :ProductoInput ) {
  nuevoProducto(input : $input){	
    id
    nombre
    existencia
    precio
    creado
  }
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

const NuevoProducto = () => {

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO,{
        update(cache,{data:{ nuevoProducto }}) {
            const { obtenerProductos } = cache.readQuery({query: OBTENER_PRODUCTOS})

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos: [...obtenerProductos,nuevoProducto]
                } 
            })
        }
    })

    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema:Yup.object({
            nombre: Yup.string()
                      .required('El nombre des obligatorio'),
            existencia: Yup.number()          
                        .required('Agrega la cantidad disponible')
                        .positive('los numeros no pueden ser negativos')
                        .integer('las existencias deben ser numeros enteros'),
            precio: Yup.number()            
                        .required('El precio es obligatorio')
                        .positive('los numeros no pueden ser negativos')

        }),
        onSubmit : async valores => {

            const {nombre, existencia, precio} = valores

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input:{
                            nombre,
                            existencia,
                            precio
                        }
                    }
                })
                console.log(data)

                Swal.fire(
                    'Creado',
                    'Se creó el producto',  
                    'success'

                )
               router.push('/productos')     
                
            } catch (error) {
                console.log(error)
            }
        }
    })


	return (
		<Layout>
			<h1 className="text-gray-800 text-2xl font-light"> Crear Nuevo Producto</h1>
			<div className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
                    <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit={formik.handleSubmit}
                    >
						<div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
								Nombre Producto
							</label>

							<input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="nombre"
								type="text"
								placeholder="nombre Producto"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.nombre}
							/>
						</div>
                        
                        {formik.touched.nombre && formik.errors.nombre ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.nombre}</p>
                                </div>     
                                ): null }

                        <div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
								Cantidad Disponible
							</label>

							<input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="existencia"
								type="number"
								placeholder="Cantidad Disponible"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.existencia}
							/>
						</div>

                        
                        {formik.touched.existencia && formik.errors.existencia ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.existencia}</p>
                                </div>     
                                ): null }

                        <div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
								Precio Producto
							</label>

							<input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="precio"
								type="number"
								placeholder="Precio Producto"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.precio}
							/>


                                {formik.touched.precio && formik.errors.precio ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.precio}</p>
                                </div>     
                                ): null }

                            <input type='submit'  
                                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold'
                                    value = 'Agregar Producto'
                                />
						</div>
					</form>
				</div>
			</div>
		</Layout>
	)
}
export default NuevoProducto
