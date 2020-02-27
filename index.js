const express = require('express')
const app = express()
const port = 3000
const bodParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Perguntas')
const Resposta = require('./database/Resposta')


//conecta com o DB
connection
    .authenticate()
    .then(
        () => { console.log('Conectado!') }
    )
    .catch(
        (erro) => { console.log(erro) }
    )

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodParser.urlencoded({extended: false}))
app.use(bodParser.json())

// ROTAS

app.get("/", (req, res) =>{
    
    Pergunta.findAll({raw: true, order: [['id', 'DESC']]}).then(perguntas =>{

        res.render('index', {
            perguntas: perguntas
        })
    })
    
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

//sanvar perguntas no DB
app.post('/salvapergunta', (req,res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    })
    .then(
        () => {
            res.redirect('/')
        }
    )
})

app.get('/pergunta/:id', (req, res) => {

    var idPergunta = req.params.id

    Pergunta.findOne({
        where: {id: idPergunta}
    }).then(
        (pergunta) => {

            if(pergunta != undefined){

                Resposta.findAll({

                    where: {perguntaId: idPergunta},
                    order: [['id', 'DESC']]

                }).then((respostas)=>{

                    res.render('pergunta', {

                        pergunta: pergunta,
                        respostas: respostas
                    })
                })

            }else{
                res.redirect('/')
            }

    })
})

app.post('/responder', (req, res) => {

    var corpo = req.body.corpo
    var perguntaId = req.body.perguntaId

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect('/pergunta/' + perguntaId)
    })
})

app.listen(port, () => { console.log('App is running on port ' + port)})