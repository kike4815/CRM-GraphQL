import React, {useState} from 'react'
import Layout from '../components/Layout'
import { useRouter} from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation,gql} from '@apollo/client'

    const NUEVA_CUENTA = gql `
        mutation nuevoUsuario ($input: UsuarioInput){
          nuevoUsuario(input : $input){
            id
            nombre
            apellido
            email
    }
}
`;
const NuevaCuenta = () => {
    const [mensaje, guardarMensaje] = useState(null) //hook para guardar mensaje de error

    const [nuevoUsuario] = useMutation(NUEVA_CUENTA)    

    const router = useRouter()

    const formik = useFormik({
          initialValues:{
              nombre:'',
              apellido:'',
              email:'',
              password:''
          },
          
            validationSchema: Yup.object({
                nombre: Yup.string()
                        .required('nombre obligatorio'),
                apellido: Yup.string()
                        .required('el apellido es obligatorio'),
                email: Yup.string()
                        .email('el email no es valido')
                        .required('el email obligatorio'),
                password: Yup.string()
                        .required('el password no puede estar vacio')
                        .min(6,'minimo 6 caracteres para el password')

            }),

          onSubmit:async valores => { //valores del formulario
              console.log(valores)  
              
              const { nombre,apellido, email, password} = valores

              try {
                const {data} =  await nuevoUsuario({ //destructuring de data es la respuesta
                    variables:{
                        input:{ //el input lo que se envia
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                })
                console.log(data) // qué recibimos de respuesta
                guardarMensaje(`se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`)
                setTimeout(() => {
                    guardarMensaje(null)
                    router.push('/login')
                }, 2000)


              } catch (error) {
                  guardarMensaje(error.message.replace('GraphQL error: ','')), //eliminamos el titulo GraphQL para no revelar que trabajamos con GraphQL
                  setTimeout(() => {
                      guardarMensaje(null)
                  }, 3000)
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

        <>
            <Layout>
                {mensaje && mostrarMensaje()}
               <h1 className='text-center text-2xl text-white font-light'>Crear nueva Cuenta</h1> 
                <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-sm'>
                            <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={formik.handleSubmit}
                            >
                            <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                        nombre
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='nombre'
                                    type='text'
                                    placeholder='nombre Usuario'
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                                        apellido
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='apellido'
                                    type='text'
                                    placeholder='apellido Usuario'
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}

                                    />
                            </div>
                            {formik.touched.apellido && formik.errors.apellido ? (
                               <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.apellido}</p>
                               </div>     
                            ): null }

                            <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                        Email
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='email'
                                    type='email'
                                    placeholder='Email Usuario'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}

                                    />
                                </div>    
                                {formik.touched.email && formik.errors.email ? (
                               <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.email}</p>
                               </div>     
                            ): null }

                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                        password
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='password'
                                    type='password'
                                    placeholder='password Usuario'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}

                                    />
                                </div>    
                                {formik.touched.password && formik.errors.password ? (
                               <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                   <p className='font-bold'>Error</p>
                                   <p>{formik.errors.password}</p>
                               </div>     
                            ): null }
                                <input type='submit'  
                                className='bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:bg-gray-900'
                                value = 'Crear cuenta'
                                />
                        </form>
                    </div>
                </div>
            </Layout>        
        
        
        </>
    )
}

export default NuevaCuenta