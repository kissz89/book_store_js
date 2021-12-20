const express = require("express")
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const uploadPath = path.join('public', Book.coverImageBasePath)
const Author = require('../models/authors')
const imageMimeType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req,file,callback) =>{
        callback(null, imageMimeType.includes(file.mimetype))
    }
})
 
//All books route
router.get('/', async (req, res) => {
    res.send('All books')
})

//New books route
router.get('/new', async (req,res) =>{
    renderNewpage(res, new Book())
})

//Create book route
router.post('/', upload.single('cover'), async (req,res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName : fileName,
        description: req.body.description
    })
    try {
        const newBook = await book.save()
        //res.redirect('books/${newBook.id}')   
        res.redirect('books')     
    } catch{
        renderNewpage(res, book, true)
    }
})

async function renderNewpage(res,book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = "Erro adding book"
        res.render('books/new', params)              
    } catch {
        res.redirect('/books')        
    }
}

module.exports =  router