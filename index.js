const express = require('express')
const exphbs = require('express-handlebars')
const expressFileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken')
const { saveUser, obtenerUsers, adminEdit, editUser, obtenerUser, eliminarSkater } = require('./query')
const app = express()
// const tokenKey = ''
app.listen(3000, () => {
    console.log("server up")
})

// aca van los middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: 'El tamaño excede el permitido'
    })
)
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/main`,
        partialsDir: __dirname + "/views"
    })
)
app.set('view engine', "handlebars")
// por lo menos trate de validar por token :(
// app.post("/verify", async (req, res) => {
//     const {email, password} = req.body;
//     const skaterBoi = await obtenerUser(email, password);
//     if (skaterBoi) {
//         if (skaterBoi.auth) {
//             const token = jwt.sign(
//                 {
//                     exp: Math.floor(Date.now() / 1000) + 100,
//                     data: skaterBoi
//                 },
//                 tokenKey
//             );
//             res.send(token);
//         } else {
//             res.status(401).send({
//                 error: "no",
//                 code: 401
//             })
//         }
//     } else {
//         res.status(404).send({
//             error: "Usuario no registrado",
//             code: 404
//         })
//     }
// })
app.get("/", async (req, res) => {
    try {
        const skaters = await obtenerUsers()
        res.render('intro', {skaters})
    } catch (e) {
        
    }
})
app.get("/Login", (req, res) => {
    res.render("Login", {layout: "Main"})
})
app.post("/Login", async (req, res) => {
    const {email, password} = req.body;
    try{
    const datos = await obtenerUser(email, password)
    if(datos){
        res.render("Datos", {datos})
    } else {
        res.render("Login")
    }
    }catch (e) {
        res.status(500).send({
            error: 'Ha ocurrido un error' + e,
            code: 500
        })
    } 
})
app.get("/Registro", (req, res) => {
    res.render("Registro", {layout: "Main"})
})
app.post("/Registro", async (req, res) => {
    const {email, nombre, password, experiencia, especialidad } = req.body;
    const {files} = req;
    const {foto} = files;
    const {name} = foto;
    try {
        await saveUser(email, nombre, password, experiencia, especialidad, name)
        foto.mv(`${__dirname}/public/uploads/${name}`, async (err) => {
            if(err) {return res.status(500).send({error: `Ha ocurrido un error ${err}`,
        code: 500})}
        })
        res.redirect('/Login');
    } catch (e) {
        res.status(500).send({
            error: 'Ha ocurrido un error' + e,
            code: 500
        })
    }
})
app.put("/cambioStatus", async (req, res) => {
    const {id} = req.body;
    const editado = await adminEdit(id)
    res.send(editado)
    // console.log(req.body)
})
app.get("/Admin", async (req, res) => {
    const skaters = await obtenerUsers()
    res.render("Admin", {skaters})
})
// app.get("/Datos", (req, res) => {
//     res.render("Datos", {layout: "Main"})
// })
app.post("/Datos", async (req, res) => {
    const {email, password} = req.body;
    // console.log(email)
    // console.log(password)
    // console.log(req.body) 
    const skater = await obtenerUser(email, password)
    res.render("Datos", {skater})
    // res.send("Datos", {skater})
})
app.post("/Actualizar", async (req, res) => {
    const {id, nombre, password, experiencia, especialidad} = req.body;
    const editado = await editUser(id, nombre, password, experiencia, especialidad)
    const skaters = await obtenerUsers()
    res.render('intro', {skaters})
})
app.post("/Eliminar", async(req, res) =>{
    const {id} = req.body;
    // console.log(req.body)
    await eliminarSkater(id);
    res.render('Login')
})

// onkeyup -> para validar los password real time