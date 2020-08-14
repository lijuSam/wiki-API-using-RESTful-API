const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDb', {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema = {
  article:String,
  content:String
};
const Article = mongoose.model("Article",articleSchema);
/////////////////////////////Request Targetting all artciles /////////////////
app.route("/article")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
          res.send(foundArticles);
      } else {
        res.send(err);
      }

  });

})
.post(function(req,res){

  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Sucessfully sent post request");
    }
    else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Sucessfully Deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});
///////////////////////////////////////Request Targetting Specific articles////////
app.route("/articles/:articleTitle")
.get(function(req,res){

  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else {
      res.send("No article matching the title is found");
    }

  });
})
.put(function(req,res){
  Article.update({title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err)
      {
        res.send("Succesfully updated the article");
      }
    }
  );

})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
     {$set:req.body},
   function(err){
     if(!err){
       res.send("Suceesfully updated Selected article");
     }else{
       res.send(err);
     }
   }
 );
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Sucessfully Deleted the corresponding article");
      }else {
        res.send(err);
      }
    }
  );
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
