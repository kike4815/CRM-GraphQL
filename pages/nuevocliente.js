import React,{useState} from 'react'
import Layout from '../components/Layout'
import { useFormik} from 'formik'
import * as Yup from 'yup'
import { useMutation,gql} from '@apollo/client'
import { useRouter} from 'next/router'


const NUEVO_CLIENTE = gql`

mutation nuevoCliente($input: ClienteInput) {
  nuevoCliente(input: $input){
    id  
    nombre
    apellido
    empresa
    email
    telefono    	
  }
}

`
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



const NuevoCliente = () => {
    
    const [mensaje, guardarMensaje] = useState(null) //hook para guardar mensajes
    
    const router = useRouter()

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, {data : {nuevoCliente}}) {
            const {obtenerClientesVendedor} = cache.readQuery({ query: OBTENER_CLIENTES}) //obtenemos la cache para actualizar
            cache.writeQuery({
                query: OBTENER_CLIENTES,
                data: {
                    obtenerClientesVendedor : [...obtenerClientesVendedor,nuevoCliente] //Reescribimos cache, pendiente probar con refetch
                }
            })

        }
    })


    const formik = useFormik({

        initialValues:{
            nombre:'',
            apellido:'',
            empresa:'',
            email:'',
            telefono:''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                    .required('el nombre es obligatorio'),
            apellido: Yup.string()
                    .required('el apellido es obligatorio'),        
            empresa: Yup.string()
                    .required('la empresa es obligatoria'),            
            email: Yup.string()
                    .email('el email no es valido')
                    .required('email es obligatorio'),
        }),
        onSubmit:async valores => { //valores del formulario
             console.log(valores)  
            
            const {nombre, apellido,empresa, email, telefono} = valores
            try {
                const { data } = await nuevoCliente({
                    variables:{
                        input:{
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                })
                console.log(data.nuevoCliente)
                router.push('/')
            } catch (error) {
                guardarMensaje(error.message(error.message.replace('GraphQL error: ','')))
                setTimeout(() => {
                    guardarMensaje(null)
                }, 2000)
                console.log(error)
            }
        }    

    });
    const mostrarMensaje = () =>{
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    };

    return (
        <Layout>
            <h1 className='text-gray-800 text-2xl font-light mt-0'>Nuevo Cliente</h1>
            {mensaje && mostrarMensaje()}
            <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-lg'>
                            <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                             onSubmit={formik.handleSubmit}
                            >
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                        Nombre
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='nombre'
                                    type='nombre'
                                    placeholder='nombre Cliente'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value= {formik.values.nombre} 
                                    />
                                </div>

                                {formik.touched.nombre && formik.errors.nombre ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.nombre}</p>
                                </div>     
                                ): null }

                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                                        Apellido
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='apellido'
                                    type='apellido'
                                    placeholder='apellido Cliente'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value= {formik.values.apellido} 
                                    />
                                </div>
                                    
                                {formik.touched.apellido && formik.errors.apellido ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.apellido}</p>
                                </div>     
                                ): null }    
                   
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
                                        Empresa
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='empresa'
                                    type='empresa'
                                    placeholder='empresa Cliente'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value= {formik.values.empresa} 
                                    />
                                </div>

                                {formik.touched.empresa && formik.errors.empresa ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.empresa}</p>
                                </div>     
                                ): null }        

                   
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                        Email
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='email'
                                    type='email'
                                    placeholder='Email Cliente'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value= {formik.values.email} 
                                    />
                                </div>

                                {formik.touched.email && formik.errors.email ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.email}</p>
                                </div>     
                                ): null }        

                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>
                                        Telefono
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='telefono'
                                    type='tel'
                                    placeholder='telefono Cliente'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value= {formik.values.telefono} 
                                    />

                                {formik.touched.telefono && formik.errors.telefono ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.telefono}</p>
                                </div>     
                                ): null }    

                                <input type='submit'  
                                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                                    value = 'Registrar cliente'
                                />
                                </div>
                            </form>        
                    </div>

                   
                                

            </div>        

        </Layout>

    )

}

export default NuevoCliente
