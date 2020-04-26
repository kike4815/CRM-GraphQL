import React,{useState} from 'react'
import Layout from '../components/Layout'
import { useFormik} from 'formik'
import * as Yup from 'yup'
import { useMutation,gql} from '@apollo/client'
import { useRouter} from 'next/router'


const AUTENTICAR_USUARIO = gql `
    mutation autenticarUsuario($input: AutenticarInput){
        autenticarUsuario(input : $input){
            token
        }
    }
`

const Login = () => {

const [mensaje, guardarMensaje] = useState(null) //hook para guardar mensaje de error

const router = useRouter()

const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO)    

const formik = useFormik({

    initialValues:{
        email:'',
        password:''
    },
    validationSchema: Yup.object({
        email: Yup.string()
                .email('el email no es valido')
                .required('email es obligatorio'),
        password: Yup.string()
                // .password('el password no coincide')
                .required('el password es obligatorio')            
    }),
    onSubmit:async valores => { //valores del formulario
        // console.log(valores)  
        
        const {email, password} = valores

        try {
          const {data} =  await autenticarUsuario({ //destructuring de data es la respuesta
              variables:{
                  input:{ //el input lo que se envia
                      email,
                      password
                  }
              }
              
          })
          console.log(data) // qué recibimos de respuesta
          guardarMensaje(`Autenticando...`)
          
          const { token } = data.autenticarUsuario
          localStorage.setItem('token', token)
          
          setTimeout(() => {
              guardarMensaje(null)
              router.push('/')
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
               <h1 className='text-center text-2xl text-white font-light'>Login</h1> 
                {mensaje && mostrarMensaje()}
                <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-sm'>
                            <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={formik.handleSubmit}
                            >
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                        Email
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='email'
                                    type='email'
                                    placeholder='Email Usuario'
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
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                        password
                                    </label>

                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='password'
                                    type='password'
                                    placeholder='password Usuario'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value= {formik.values.password} 
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
                                value = 'Iniciar sesion'
                                />
                        </form>
                    </div>
                </div>
            </Layout>        
        
        
        </>
    )
}

export default Login