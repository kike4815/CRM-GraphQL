import React from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useRouter } from 'next/router'


const Layout = ({ children }) => {

const router = useRouter()

    return(

        <>
        
        <Head> 
        <title>CRM NextJs</title>
        <link rel="stylesheet" href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css" integrity="sha256-/O+WvT2Eeb1RIU6iMItEhi5xlHTCLHg2HgLmVGFWyW8=" crossOrigin="anonymous" />
        </Head>

        {router.pathname === '/login' || router.pathname === '/nuevacuenta'?(

            <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
                <div className=''>

                {children}

                </div>

            </div>
        ): (

            <div className='bg-gray-200 min-h-screen'>
                <div className='flex min-h-screen'>
                <Sidebar />
    
                    <main className='sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5'>
                        <Header />           
                        {children}
    
                    </main>
    
                </div>
            
            </div>
            
        )
    
    
    }
        </>
    
    )
}

export default Layout