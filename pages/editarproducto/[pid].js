import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { gql, useQuery,useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'


const OBTENER_PRODUCTO = gql`
	query obtenerProducto($id: ID!) {
		obtenerProducto(id: $id) {
			nombre
			precio
			existencia
		}
	}
`
const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto ($id:ID!,$input:ProductoInput){
    actualizarProducto(id:$id, input: $input){
        id
        nombre
        existencia
        creado
    }
}
`

const EditarProducto = () => {
    const router = useRouter()
    
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO)

	const { query: { id } } = router
	// console.log(id)

	const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
		variables: {
			id
		}
    })
    
    const schemaValidation = Yup.object({
        nombre: Yup.string()
                      .required('El nombre des obligatorio'),
            existencia: Yup.number()          
                        .required('Agrega la cantidad disponible')
                        .positive('los numeros no pueden ser negativos')
                        .integer('las existencias deben ser numeros enteros'),
            precio: Yup.number()            
                        .required('El precio es obligatorio')
                        .positive('los numeros no pueden ser negativos')
    })
	// console.log(data)
	// console.log(loading)
	// console.log(error)

    if (loading) return 'Cargando...'
    
    if(!data) return 'Acción no permitida'

    const { obtenerProducto } = data
    
    const actualizarProductoActual = async valores => {
        
        const {nombre, existencia, precio} = valores
        try {
            const { data } = await actualizarProducto ({
                variables:{
                    id,
                    input:{
                        nombre,
                        existencia,
                        precio
                    }
                }
            })
            console.log(data)
            Swal.fire(
                'Correcto',
                'El producto se actualizó correctamente',  
                'success'

            )

            router.push('/productos')

        } catch (error) {
            console.log(error)
        }
    }

	return (
		<Layout>
			<h1 className="className=&quot;text-gray-800 text-2xl font-light">Editar Producto</h1>
			<div className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<Formik
                        enableReinitialize
                        initialValues={obtenerProducto}
                        validationSchema = {schemaValidation}
                        onSubmit = {valores => {
                            actualizarProductoActual(valores)
                        }}
                    >
						{(props) => {
							return (
								<form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
									onSubmit={props.handleSubmit}>
									<div className="mb-4">
										<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
											Nombre Producto
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="nombre"
											type="text"
											placeholder="nombre Producto"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value={props.values.nombre}
										/>
									</div>
									{props.touched.nombre && props.errors.nombre ? (
										<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
											<p className="font-bold">Error</p>
											<p>{props.errors.nombre}</p>
										</div>
									) : null}
									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="existencia"
										>
											Cantidad Disponible
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="existencia"
											type="number"
											placeholder="Cantidad Disponible"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value={props.values.existencia}
										/>
									</div>
									{props.touched.existencia && props.errors.existencia ? (
										<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
											<p className="font-bold">Error</p>
											<p>{props.errors.existencia}</p>
										</div>
									) : null}
									<div className="mb-4">
										<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
											Precio Producto
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="precio"
											type="number"
											placeholder="Precio Producto"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value={props.values.precio}
										/>

										{props.touched.precio && props.errors.precio ? (
											<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
												<p className="font-bold">Error</p>
												<p>{props.errors.precio}</p>
											</div>
										) : null}

										<input
											type="submit"
											className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold"
											value="Guardar Producto"
										/>
									</div>
								</form>
							)
						}}
					</Formik>
				</div>
			</div>
		</Layout>
	)
}
export default EditarProducto
