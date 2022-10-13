const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.get('/articles', function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    })
})

app.post('/articles', function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.")
        } else {
            res.send(err)
        }
    })
})

app.delete('/articles', function(req, res) {
    Article.deleteMany(function(err) {
        if(!err) {
            res.send("Successfully deleted article.")
        } else {
            res.send(err)
        }
    })
})

////////////////////////////////////////////////

app.get('/articles:articleTitle', function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle)
        } else {
            res.send("No articles matching that title was found.")
        }
    })
})

app.put('/articles:articleTitle', function(req, res) {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.")
            }
        }
    )
})

app.patch('/articles:articleTitle', function(req, res) {
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.")
            } else {
                res.send(err)
            }
        }
    )
})

app.delete('/articles:articleTitle', function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if (!err) {
                res.send("Successfully deleted the corresponding article.")
            } else {
                res.send(err)
            }
        }
    )
})

app.listen(3000, function(req, res) {
    console.log("Server is running on port 3000")
})