const {ApolloServer} = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const jwt = require('jsonwebtoken')
const conectarDB = require('./config/db')
require('dotenv').config({path: 'variables.env'})

//conectar DB

conectarDB()


// servidor

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {


        const token = req.headers['authorization'] || '';
        if (token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''),process.env.SECRET)
                // console.log(usuario)
                return {
                    usuario
                }
            } catch (error) {
                console.log('hubo un error')
                console.log(error)
            }
        }
    }
})

//arrancamos servidor 

server.listen({port: process.env.PORT || 4000}).then(({url})=>{
    console.log (`Server running in URL ${url}`)
} )