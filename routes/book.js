const express = require("express")
const router = express.Router() 
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/authors')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
//const upload = multer({
  //  dest: uploadPath,
  //  fileFilter: (req,file,callback) => {
    //    callback(null, imageMimeType.includes(file.mimetype))
    //}
//})
 
//All books route
router.get('/', async (req, res) => {
    let query =  Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index',{
            books: books,
            searchOptions: req.query
        })
        
    } catch {
        res.redirect('/')        
    }
})

//New books route
router.get('/new', async (req,res) =>{
    renderNewpage(res, new Book())
})

//Create book route
router.post('/', async (req,res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

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
        if(hasError) params.errorMessage = "Error adding book"
        res.render('books/new', params)              
    } catch {
        res.redirect('/books')        
    }
}


function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
  }
module.exports =  router