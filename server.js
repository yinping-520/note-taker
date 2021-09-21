const { v4: uuidv4 } = require('uuid');
const express = require("express");
const app = express();
const fs = require('fs')
const path = require("path")
const PORT = process.env.PORT || 3001;

const data = require("./db/db.json")

const notes = data && data.length ? data : [];
console.log(data)

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})


app.get('/api/notes', (req, res) => {
    res.json(data)
})

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body
    const newNote = {
        title,
        text,
        id: uuidv4()
    }
   notes.push(newNote) 
   const notesString = JSON.stringify(notes, null, 2)

   fs.writeFile('./db/db.json', notesString, (err)=>{
    if(err) console.log(err)
    console.log('Success')
})

const response = {
    status: 'success',
    body: newNote,
  };
  console.log(response)
  res.json(response)
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    for(let i = 0; i<data.length; i++){
        if(data[i].id===id){
            data.splice(data[i], 1)
        }
    }
    res.json(data)
})


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})


app.listen(PORT, ()=>{
    console.log(`App listening at http://localhost:${PORT} 🚀`)
});