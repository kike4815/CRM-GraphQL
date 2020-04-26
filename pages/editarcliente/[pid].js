import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2' 


const OBTENER_CLIENTE = gql`
	query obtenerCliente($id: ID!) {
		obtenerCliente(id: $id) {
			nombre
			apellido
			email
			empresa
			telefono
		}
	}
`
const EDITAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!,$input: ClienteInput){
        actualizarCliente(id: $id, input: $input){
            nombre
            apellido
            email
            empresa
        }
} 
`

const EditClient = () => {


	const router = useRouter()
	const { query: { id } } = router

	const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
		variables: {
			id
		}
    });

    const [actualizarCliente] = useMutation(EDITAR_CLIENTE)
    
            
    
    const schemaValidation = Yup.object({
        nombre: Yup.string()
                .required('el nombre es obligatorio'),
        apellido: Yup.string()
                .required('el apellido es obligatorio'),        
        empresa: Yup.string()
                .required('la empresa es obligatoria'),            
        email: Yup.string()
                .email('el email no es valido')
                .required('email es obligatorio'),
    });

	if (loading) return 'Cargando...'
    // console.log(data.obtenerCliente)
    
    const { obtenerCliente } = data

    const actualizarInfoCliente = async valores => {
        const {nombre, apellido, email, empresa, telefono} = valores

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input:{
                        nombre,
                        apellido,
                        email,
                        empresa,
                        telefono
                    }

            }
        })
        
        Swal.fire(
            'Actualizado!',
            'El cliente se ha actualizado correctamente',
            'success'
          )

        router.push('/')

        } catch (error) {
          console.log(error)  
        }
    }

	return (
		<Layout>
			<h1 className="text-gray-800 text-2xl font-light mt-0">Editar Cliente</h1>
			<div className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<Formik 
                    validationSchema = {schemaValidation}
                    enableReinitialize
                    initialValues= {obtenerCliente}
                    onSubmit= {( valores ) =>{
                        actualizarInfoCliente(valores)
                    }}
                    >
						{(props) => {
							return (
								<form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
									onSubmit={props.handleSubmit}
                                    >
									<div className="mb-4">
										<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
											Nombre
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="nombre"
											type="nombre"
											placeholder="nombre Cliente"
											onChange={props.handleChange} //cuando cambiamos
											onBlur={props.handleBlur}   // cuando hemos clickado dentro y queremos salir
											value= {props.values.nombre}
										/>
									</div>
									{props.touched.nombre && props.errors.nombre ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{props.errors.nombre}</p>
                                </div>     
                                ): null }
									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="apellido"
										>
											Apellido
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="apellido"
											type="apellido"
											placeholder="apellido Cliente"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value= {props.values.apellido}
										/>
									</div>
									                                    
                                {props.touched.apellido && props.errors.apellido ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{props.errors.apellido}</p>
                                </div>     
                                ): null }    
									<div className="mb-4">
										<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
											Empresa
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="empresa"
											type="empresa"
											placeholder="empresa Cliente"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value= {props.values.empresa}
										/>
									</div>
									{props.touched.empresa && props.errors.empresa ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{props.errors.empresa}</p>
                                </div>     
                                ): null }        
									<div className="mb-4">
										<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
											Email
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="email"
											type="email"
											placeholder="Email Cliente"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value= {props.values.email}
										/>
									</div>
									
                                {props.touched.email && props.errors.email ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{props.errors.email}</p>
                                </div>     
                                ): null }        
									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="telefono"
										>
											Telefono
										</label>

										<input
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="telefono"
											type="tel"
											placeholder="telefono Cliente"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value= {props.values.telefono}
										/>
										
                                {props.touched.telefono && props.errors.telefono ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{props.errors.telefono}</p>
                                </div>     
                                ): null }    

										<input
											type="submit"
											className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
											value="Editar cliente"
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
export default EditClient
