import React from 'react'
import {useQuery,gql} from '@apollo/client'
import {useRouter } from 'next/router'


const OBTENER_USUARIO = gql`
query obtenerUsuario{
  obtenerUsuario {
    id
    nombre 
    apellido
  }
}
`;

const Header = () => {
  
  const router = useRouter()
  
  const {data, loading, error} = useQuery(OBTENER_USUARIO)

  if(loading) {
    return null
  }
  
  
  console.log(data)
  // const {nombre} = data.obtenerUsuario
  

  const cerrarSesion = () => {
    // localStorage.removeItem('token')
    localStorage.clear()
    router.push('/login')
  };

  
	return (
		<div className="flex justify-between">
			<p className='mr-2'> Hola:</p>

            <button type='button'
            onClick={()=> cerrarSesion()}
            className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
            >Cerrar Sesion </button>
		</div>
	)
}
export default Header
