/*imports */
require ('dotenv').config()
const express = require('express')
const mongoose = require ('mongoose')
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')

const app = express()

//config JSON response
app.use(express.json())

//Models
const User = require('./Models/User')
const { urlencoded } = require('express')


//OPEN ROUTE - PUBLIC ROUTE
app.get('/', (req, req) => {
    res.status(200).json({ msg: "Bem vindo à API!" }) 
    
})
//Rota privada
app.get('./user/:id', async (re1, res) => {
    const id = req.params.id

    //check if user exists
    const user = await User.findById(id, '-password')

    if (!user){
        return res.status(404).json({msg:'Usuário não encontrado.'})
    }
})

//Register User
app.post('/auth/register', async(req,res) => {

    const {name, email, password, confirmpassword} = req.body

    //validação

    if (!name) {
        return res.status(422).json({msg: 'Preenchimento Obrigatório.'})
}
    if(!password){
        return res.status(422).json({msg: 'Poucos caracteres apresentados.'})
    }
    if(!email){
        return res.status(422).json({msg: 'Email incorreto.'})
    }
    if(password!== confirmpassword) {
        return res.status(422).json({msg: 'Senha incorreta.'})
    }

    //Checar existência do Usuário
    const userExiste = await User.findOne({email: email})

    if (!userExiste){
        return res.status(422).json({msg:'Usuário inexistente.'})
    }

    //Criando senha 
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Criando usuário
    const user = new User ({
        name,
        email,
        password: passwordHash,
    })

    try {
       await user.save()
       res.status(201).json({msg: 'Usuário criado com sucesso.'})

    } catch (error){
        res.status(500).json({msg: 'Erro no servidor. Tente novamente mais tarde!'})
    }
})
//Login user
app.post('./auth/login', async (req, res) => {
    const {email, password} = req.body

    //validação
    if(!password){
        return res.status(422).json({msg: 'Senha incorreta.'})
    }
    if(!email){
        return res.status(422).json({msg: 'Email incorreto.'})
    } 
    //check if user exists
    const user = await User.findOne({email: email})

    if (!user){
        return res.status(422).json({msg:'Usuário não encontrado.'})
    }

    //Checar se a senha está correta
    const ckeckPassword = await bcrypt.compare(password, user.password)  

    if(!checkPassoword) {
        return res.status(422).json({msg: 'Senha inválida.'})
    }
})


//credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.txway.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
    app.listen(3000)
    console.log('Acesso ao banco com sucesso.')
})
.catch((err) => console.log(err))

app.listen(3000)
