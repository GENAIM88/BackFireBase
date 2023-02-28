const express = require('express')
const bcrypt = require('bcrypt')
const{ initializeApp } = require('firebase/app')
const { getFirestore, collection, getDoc, doc, setDoc, getDocs, deleteDoc } = require('firebase/firestore') 
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

app.use(express.json())

app.get('/usuarios', (req, res) =>{
    const users = colecction(db, 'users')
    res.json({
        'alert': 'success',
        users
    })
})

app.post('/usuarios', async (req, res) => {

     const colRef = collection(db, 'users')
     const docsSnap = await getDocs(colRef)
     let data = []
     
     docsSnap.forEach(doc => {

            data.push(doc.data())
        }) 
            res.json({
                'alert': 'Success!!',data
            })
})

app.post('/login', (req, res) =>{
    let{ email, password } = req.body

    if (!email.length || !password.length){
        return res.json({
            'alert': 'no se ha recibido correctamente'
        })
    }

    const users = colecction(db, 'users')
    getDoc(doc(users, email))
    .then (user =>{
        if (!user.exists()){
            return res.json({
                'alert': 'Correo no registrado'
            })
        }else{
            bcrypt.compare(password, user.data().password, (error, result) => {
                if (result){
                    let data = user.data()
                    res.json({
                            'alert': 'Success',
                            name: data.name,
                            email: data.email
                    })
                }else{
                    return res.json({
                        'alert': 'Contraseña Incorrecta'
                    })
                }
            })
        }
    })
})

app.post('/registro', (req, res) =>{
    const {name, lastname, email, password, number} = req.body 
        
        if(name.length < 3){
            res.json({
                'alert': 'minimo 3 caracteres'
            })
        }else if(lastname.length < 3){
            res.json({
                'alert': 'minimo 3 caracteres'
            })
        }else if(!email.length){
            res.json({
                'alert': 'inttroduce un correo valido'
            })
        } else if (!Number(number) || number.length < 10) {
            res.json({
              'alert': 'Introduce un número telefónico correcto'
            })
        }else if(password.length < 8){
            res.json({
                'alert': 'Minimo 8 caracteres'
            })
        }else{
            const users = collection(db, 'users')

            

        getDoc(doc(users, email)).then( user =>{
            if(user.exists()){
                res.json({
                    'alert': 'El correo ya existe'
                })
            }else{
                bcrypt.genSalt(10, (error, salt) =>{
                    bcrypt.hash(password, salt, (error, hash) =>{
                        req.body.password = hash

                        //guardar en la bd

                        setDoc(doc(users, email), req.body).then (reg =>{
                            res.json({
                                'alert': 'success',
                                'data' : reg
                            })
                        })
                    })
                })
            }
        })
    
        }
    
})

app.post('/delete', (req, res) =>{
    let { id } = req.body
    deleteDoc(doc(collection(db, 'users'), id))
    .then ((response)=> {
        res.json({
            'alert': 'success'
        })
    })
    .catch((error)=> {
        res.json({
            'alert': error
        })
    })
})

app.post('/update', (req, res) => {
    const { id, name, lastname, number } = req.body
    
    if(name.length < 3){
        res.json({
        'alert': 'nombre requiere mínimo 3 caracteres'
    })
}else if (lastname.length < 3) {
        res.json({
            'alert': 'apellido requiere mínimo 3 caracteres'
    })
    
} else if (!Number(number) || number.length < 10) {
        res.json({
            'alert': 'Introduce un número telefónico correcto'
    }) 
} else {
        db.collection('users').doc(id)
         const updateData = {
            name, lastname, number }
            updateDoc(doc(db, 'users'), updateData, id)
        
            .then((response) => {
                res.json({'alert': 'Success!!'
        })
    })
    .catch((error) => {
        res.json({
            'alert': error
        })
    })
}})

    

const PORT = process.env.PORT || 5000

//Ejecutamos server

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`)
})