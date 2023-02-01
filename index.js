const express = require('express');
const app = express();
app.use(express.json());

const musicGenres = [
    {id: 1, name:'R&B', month: 'September', year: '2017', songs: [{id: 1, name: 'Die For You', artist:"The Weeknd"}]},
    {id: 2, name:"Rap", month: 'October', year: '2008', songs: [{id: 1, name: 'Heartless', artist: 'Kanye West'}]},
    {id: 3, name: 'Pop', month: 'May', year: '2020', songs: [{id: 1, name: 'Shinunoga E-Wa', artist: 'Fujii Kaze'}]}
];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

app.get('/', (req,res) => {
 res.send("This is Music app!");
});
app.put('/', (req,res) => {
res.send('PUT REQUEST');
});
app.post('/', (req,res) => {
    res.send('POST REQUEST');
});
app.delete('/', (req,res) => {
    res.send('DELETE REQUEST');
 });

 app.get('/api/genres', (req, res) => {
    res.send(genres.map((genre) => ({ id:genre.id, name:genre.name})));
});

//Get Information about a Genre (need genreid)
app.get('/api/genres/:genreid', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if(!genre){
        res.status(404).send('The genre with the given ID was not found');
        return
    }
        res.send(genre);
});

//Get Information about a Song (need genre and song id)
app.get('/api/genres/:genreid/:songid', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if(!genre){
        res.status(404).send('The genre with the given ID was not found');
        return
    }
    else{
        const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
        if(!song){
            res.status(404).send('The song with the given ID was not found');
            return
        }
        res.send(song);
    }
});

//Filter by Year (need year)
app.get('/api/filter/:year', (req, res) => {
    const year = genres.filter(y => parseInt(y.year) === parseInt(req.params.year));
    const show = [
        {name: "filter", year: parseInt(req.params.year)},
        year.map((genre) => ({ id:genre.id, name:genre.name, month: genre.month, year: genre.year}))
    ];
    res.send(show);
});

//Filter by Month (need month)
app.get('/api/filter/month/:month', (req, res) => {
    const month = genres.filter(y => String(y.month).toLowerCase() === String(req.params.month).toLowerCase());
    const show = [
        {name: "filter", month: req.params.month},
        month.map((genre) => ({ id:genre.id, name:genre.name, month: genre.month, year: genre.year}))
    ];
    res.send(show);
});

//Filter by Year and Month (need year and month)
app.get('/api/filter/:year/:month', (req, res) => {
    const year = genres.filter(y => parseInt(y.year) === parseInt(req.params.year));
    const month = year.filter(y => String(y.month).toLowerCase() === String(req.params.month).toLowerCase());
    const show = [
        {name: "filter", year: parseInt(req.params.year), month: req.params.month},
        month.map((genre) => ({ id:genre.id, name:genre.name, month: genre.month, year: genre.year}))
    ];
    res.send(show);
});


//HTTP POST Requests
//Add new genre (need json data: name)
app.post('/api/genres', (req, res) => {
    if(req.body.name.length > 3 && req.body.name.length < 16){
        const date = new Date();
        const genre = {
            id: genres.length + 1,
            name: req.body.name,
            month: months[date.getMonth()],
            year: date.getFullYear(),
            songs: []
        }
        //check if songs exist, check if songs are formatted right
        genres.push(genre);
        res.send(genre);
        return
    }
    res.status(404).send("Name is required and it should be a minimum of 3 characters and a maximum of 15 characters");
});

//Add new song (need genreid, json data: name + optional artist)
app.post('/api/genres/:genreid', (req, res) => {
    if(req.body.name.length > 3 && req.body.name.length < 16){
        const genre = genres.find(g => g.id === parseInt(req.params.genreid));
        if(!genre){
            res.status(404).send('The genre with the given ID was not found');
            return
        }
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.genreid));
        var singer = "Asynchronous";
        if(req.body.artist != null){
            singer = req.body.artist;
        }
        const song = {
            id: genres[genrePos].songs.length + 1,
            name: req.body.name,
            artist: singer
        }
        genres[genrePos].songs.push(song);
        res.send(song);
        return
    }
    res.status(404).send("Name is required and it should be a minimum of 3 characters");
});


//HTTP PUT Requests
//Changes genre name (need genreid, json data: name)
app.put('/api/genres/:id', (req,res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre){
        res.status(404).send('The genre with the given ID was not found');
        return
    }
    if(req.body.name.length > 3 && req.body.name.length < 16){
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.id));
        const date = new Date();
        const change = {
            id: parseInt(req.params.id),
            name: req.body.name,
            month: months[date.getMonth()],
            year: date.getFullYear(),
            songs: genres[genrePos].songs
        };
        genres[genrePos] = change;
        res.send(change);
        return
    };
    res.status(404).send("Name is required and it should be a minimum of 3 characters");
});

//Change song name and artist (need genreid, songid, and json data: name + optional artist)
app.put('/api/genres/:genreid/:songid', (req,res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if(!genre){
        res.status(404).send('The genre with the given ID was not found');
        return
    }
    const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
    if(!song){
            res.status(404).send('The song with the given ID was not found');
            return
    }
    if(req.body.name.length > 3 && req.body.name.length < 16){
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.genreid));
        var singer = "Asynchronous";
        if(req.body.artist != null){
            singer = req.body.artist;
        }
        const change = {
            id: parseInt(req.params.songid),
            name: req.body.name,
            artist: singer
        };
        const songPos = genres[genrePos].songs.findIndex(s => s.id === parseInt(req.params.songid));
        genres[genrePos].songs[songPos] = change;
        res.send(change);
        return
    };
    res.status(404).send("Name is required and it should be a minimum of 3 characters");
});


//HTTP DELETE REQUEST
//Delete genre based on genreid (need genreid)
app.delete('/api/genres/:id', (req,res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre){
        res.status(404).send('The genre with the given ID was not found');
        return
    }
    const genrePos = genres.findIndex(g => g.id === parseInt(req.params.id));
    const toDelete = genres[genrePos];
    genres.splice(genrePos, 1);
    res.send(toDelete);
});

//Delete song (need genreid and songid)
app.delete('/api/genres/:genreid/:songid', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if(!genre){
        res.status(404).send('The genre with the given ID was not found');
        return
    }
    else{
        const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
        if(!song){
            res.status(404).send('The song with the given ID was not found');
            return
        }
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.genreid));
        const songPos = genres[genrePos].songs.findIndex(g => g.id === parseInt(req.params.songid));
        const toDelete = genres[genrePos].songs[songPos];
        genres[genrePos].songs.splice(songPos, 1);
        res.send(toDelete);
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});
