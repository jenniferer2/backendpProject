const express = require('express');
const app = express();
app.use(express.json());

//Initialization 
const musicGenres = [
    { id: 1, name: 'R&B', month: 'September', year: '2017', songs: [{ id: 1, name: 'Die For You', artist: "The Weeknd" }] },
    { id: 2, name: "Rap", month: 'October', year: '2008', songs: [{ id: 1, name: 'Heartless', artist: 'Kanye West' }] },
    { id: 3, name: 'Pop', month: 'May', year: '2020', songs: [{ id: 1, name: 'Shinunoga E-Wa', artist: 'Fujii Kaze' }] }
];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//Home Page
app.get('/', (req, res) => {
    res.send("This is Music app!");
});
app.put('/', (req, res) => {
    res.send('PUT REQUEST');
});
app.post('/', (req, res) => {
    res.send('POST REQUEST');
});
app.delete('/', (req, res) => {
    res.send('DELETE REQUEST');
});

//GET REQUEST
app.get('/api/genres', (req, res) => {
    res.send(musicGenres.map((g) => ({ id: g.id, name: g.name })));
});

//Genre information
app.get('/api/genres/:genreid', (req, res) => {
    const genre = musicGenres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('A genre with this ID was not found');
        return
    }
    res.send(genre);
});

//Song Information
app.get('/api/genres/:genreid/:songid', (req, res) => {
    const genre = musicGenres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('A genre with this ID was not found');
        return
    }
    else {
        const song = musicGenres.songs.find(s => s.id === parseInt(req.params.songid));
        if (!song) {
            res.status(404).send('A song with this ID was not found');
            return
        }
        res.send(song);
    }
});

//Filtering years
app.get('/api/filter/:year', (req, res) => {
    const year = musicGenres.filter(y => parseInt(y.year) === parseInt(req.params.year));
    const display = [
        { name: "filter", year: parseInt(req.params.year) },
        year.map((g) => ({ id: g.id, name: g.name, month: g.month, year: g.year }))
    ];
    res.send(display);
});

//Filter Months
app.get('/api/filter/month/:month', (req, res) => {
    const month = musicGenres.filter(y => String(y.month).toLowerCase() === String(req.params.month).toLowerCase());
    const display = [
        { name: "filter", month: req.params.month },
        month.map((g) => ({ id: g.id, name: g.name, month: g.month, year: g.year }))
    ];
    res.send(display);
});

//Filter year and month
app.get('/api/filter/:year/:month', (req, res) => {
    const year = musicGenres.filter(y => parseInt(y.year) === parseInt(req.params.year));
    const month = year.filter(y => String(y.month).toLowerCase() === String(req.params.month).toLowerCase());
    const display = [
        { name: "filter", year: parseInt(req.params.year), month: req.params.month },
        month.map((g) => ({ id: g.id, name: g.name, month: g.month, year: g.year }))
    ];
    res.send(display);
});

//POST REQUEST
app.post('/api/genres', (req, res) => {
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const date = new Date();
        const g = {
            id: musicGenres.length + 1,
            name: req.body.name,
            month: months[date.getMonth()],
            year: date.getFullYear(),
            songs: []
        }

        musicGenres.push(g);
        res.send(g);
        return
    }
    res.status(404).send("Name is missing and in improper format.");
});

//Adding a song
app.post('/api/genres/:genreid', (req, res) => {
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const genre = musicGenres.find(g => g.id === parseInt(req.params.genreid));
        if (!genre) {
            res.status(404).send('A genre with the given ID was not found');
            return
        }
        const genreP = musicGenres.findIndex(g => g.id === parseInt(req.params.genreid));
        var singer = "N/A";
        if (req.body.artist != null) {
            singer = req.body.artist;
        }
        const s = {
            id: musicGenres[genreP].songs.length + 1,
            name: req.body.name,
            artist: singer
        }
        musicGenres[genreP].songs.push(s);
        res.send(s);
        return
    }
    res.status(404).send("Name is missing and in improper format.");
});


//PUT REQUEST
app.put('/api/genres/:id', (req, res) => {
    const genre = musicGenres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        res.status(404).send('A genre with this ID was not found');
        return
    }
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const genreP = musicGenres.findIndex(g => g.id === parseInt(req.params.id));
        const date = new Date();
        const news = {
            id: parseInt(req.params.id),
            name: req.body.name,
            month: months[date.getMonth()],
            year: date.getFullYear(),
            songs: musicGenres[genreP].songs
        };
        musicGenres[genreP] = news;
        res.send(news);
        return
    };
    res.status(404).send("Name is missing and in improper format.");
});

//Change song title + artist
app.put('/api/genres/:genreid/:songid', (req, res) => {
    const genre = musicGenres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('A genre with this ID was not found');
        return
    }
    const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
    if (!song) {
        res.status(404).send('The song with this ID was not found');
        return
    }
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const genreP = genres.findIndex(g => g.id === parseInt(req.params.genreid));
        var singer = "NA";
        if (req.body.artist != null) {
            singer = req.body.artist;
        }
        const news = {
            id: parseInt(req.params.songid),
            name: req.body.name,
            artist: singer
        };
        const songP = musicGenres[genreP].songs.findIndex(s => s.id === parseInt(req.params.songid));
        musicGenres[genreP].songs[songP] = news;
        res.send(news);
        return
    };
    res.status(404).send(" Name is missing and in improper format.");
});


//Delete genre
app.delete('/api/genres/:id', (req, res) => {
    const genre = musicGenres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        res.status(404).send('A genre with the given ID was not found');
        return
    }
    const genreP = musicGenres.findIndex(g => g.id === parseInt(req.params.id));
    const ddelete = musicGenres[genreP];
    genres.splice(genreP, 1);
    res.send(ddelete);
});

//Deleting song
app.delete('/api/genres/:genreid/:songid', (req, res) => {
    const genre = musicGenres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('A genre with this ID was not found');
        return
    }
    else {
        const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
        if (!song) {
            res.status(404).send('The song with this ID was not found');
            return
        }
        const genreP = musicGenres.findIndex(g => g.id === parseInt(req.params.genreid));
        const songP = musicGenres[genreP].songs.findIndex(g => g.id === parseInt(req.params.songid));
        const ddelete = musicGenres[genreP].songs[songP];
        musicGenres[genreP].songs.splice(songP, 1);
        res.send(ddelete);
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});

//The programs work together by having different 
//function like listing the music genres, 
//filtering by month and year, providing the information of the genre and song. 
//There are HTTP methods like GET, POST, PUT and DELETE so this is a user friendly application 
//and would return accurate data. This project taught me how APIs work and
// how to build a basic API using Express.js. I have more insight on 
//how the backend works now. The proect can be further extended by adding extra functions 
//like having user authentication or adding/deleting other information. 





