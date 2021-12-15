const express = require("express")
const router = express.Router()
const Author = require('../models/authors')
 
//All authors route
router.get('/', (req,res) => {
    res.render('authors/index')
})

//new authors
router.get('/new', (req,res) =>{
    res.render('authors/new', {author: new Author()})
})

router.post('/', async (req,res) => {
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
        //res.redirect('authors/${newAuthor.id}')
        res.redirect('authors')
    }catch{
        res.render('authors/new',{
            author: author,
            errorMessage: 'Error adding author'
        })
    }
})

module.exports =  router