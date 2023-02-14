const express from ('express')
const bcrypt from ('bcrypt')
const{ initializeApp } = require('firebase/app')
const{ getFirestore} = require(firebase/getFirestore)
require('dotenv/config')

// Configurecion de firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2okBoVxMezidjuou0eHUWXGi6Ld2lw5c",
    authDomain: "changuitos-genaim.firebaseapp.com",
    projectId: "changuitos-genaim",
    storageBucket: "changuitos-genaim.appspot.com",
    messagingSenderId: "957377669283",
    appId: "1:957377669283:web:3bf09086805319dc2f3716"
};

//Inicializar BD

const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

//Inicializar el servidor
const app = express()

const PORT = process.env.PORT || 5000

//Ejecutamos server

app.listem(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`)
})