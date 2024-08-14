const express = require('express');
const session = require('express-session');
const ejs = require("ejs");
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); 

const app = express(); 
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
const usersFile = path.join(__dirname, 'users.txt');

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

function checkLogin(req, res, next) {
    if (req.session.accountCreated && req.session.loggedIn) {
        next(); 
    } else if (req.session.accountCreated) {
        req.session.redirectTo = req.originalUrl; 
        res.redirect('/login'); 
    } else {
        res.redirect('/createAccount'); 
    }
}
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.get('/', (req, res) => { 

    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    } 

    res.render('Question8', { footerClass: 'footer', isLoggedIn });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const filePath = path.join(__dirname, 'users.txt');
    
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            console.error('Error reading file', err);
            return res.render('login', { error: 'Server error. Please try again later.' });
        }

        const users = fileData.split('\n').filter(Boolean);
        let validUser = false;
        
        for (let user of users) {
            const [storedUsername, storedPassword] = user.split(':');
            if (storedUsername === username && storedPassword === password) {
                validUser = true;
                break;
            }
        }

        if (validUser) {
            req.session.user = username;
            req.session.loggedIn = true;
            const redirectTo = req.session.redirectTo || '/PetGiveAway'; 
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    });
});

let currentId = 1;
app.post('/petGiveAway', (req, res) => {
    let isLoggedIn = req.session.user ? true : false;

    const { type, gender, brag, "owners-name": ownersName, "owners-email": ownersEmail } = req.body;
    const selectedBreed = req.body['cat-breed'] || req.body['dog-breed'];

    const petData = {
        id: currentId,
        ownerName: ownersName,
        ownerEmail: ownersEmail,
        type,
        breed: Array.isArray(selectedBreed) ? selectedBreed.join(',') : selectedBreed,
        gender,
        brag,
        suitableForChildren: req.body['suitable-for-children'] || 'No'
    };

    savePetData(petData);

    currentId++;

    res.render('BrowseAvailablePets', { footerClass: 'footer', isLoggedIn, pets: [petData] });
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/Question8');
    });
});


app.get('/AccountCreation', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
        }

        const users = data.split('\n').filter(Boolean); 
        const usernameExists = users.some(user => user.split(':')[0] === username);

        let isLoggedIn = false;

        if (req.session.user) {
            isLoggedIn = true;
        }
        if (usernameExists) {
            return res.render('CreateAccount', { footerClass: 'footer7', message: 'Username already exists. Please choose a different one.', isLoggedIn });
        }

        const newUser = `${username}:${password}\n`;

        fs.appendFile(usersFile, newUser, err => {

            let isLoggedIn = false;
            if (req.session.user) {
             isLoggedIn = true;
            }
            if (err) {
                console.error('Error writing to file', err);
            }
            req.session.accountCreated = true;

            res.render('CreateAccount', { footerClass: 'footer7', message: 'Account created successfully. You can now log in.', isLoggedIn });
        });
    });
});


app.get('/someRoute', (req, res) => {
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }

    res.render('Question8', { footerClass: 'footer',isLoggedIn });
});

app.get('/PetGiveAway', checkLogin, (req, res) => {
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }
    res.render('PetGiveAway', { footerClass: 'footer', isLoggedIn });
});

app.get('/CreateAccount', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }
    res.render('CreateAccount', { footerClass: 'footer7', message: '' ,isLoggedIn});
});

app.get('/Question8', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    } 
    res.render('Question8', { footerClass: 'footer', isLoggedIn });
});

app.get('/petCare', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }
    res.render('PetCare', { footerClass: 'footer3' , isLoggedIn});
});

app.get('/home', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }
    res.render('Home', { footerClass: 'footer5', isLoggedIn });
}); 
  
app.get('/findDogCat', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }
    res.render('FindDogCat', { footerClass: 'footer2', isLoggedIn });
}); 

app.get('/disclaimerPage', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }
    res.render('DisclaimerPage', { footerClass: 'footer4', isLoggedIn });
}); 

app.get('/contactUs', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }
    res.render('ContactUs', { footerClass: 'footer', isLoggedIn });
});

app.get('/browseAvailablePets', (req, res) => { 
    let isLoggedIn = false;

    if (req.session.user) {
        isLoggedIn = true;
    }

    const pets = readPetData();
    res.render('BrowseAvailablePets', { footerClass: 'footer', isLoggedIn, pets });
}); 

function readPetData() {
    const petsFilePath = path.join(__dirname, 'pets.txt');
    const petData = fs.readFileSync(petsFilePath, 'utf-8');
    return petData.trim().split('\n').map(line => {
        const [id, ownerName, ownerEmail, type, gender, brag, breed, suitableForChildren] = line.split(':');
        return { id, ownerName, ownerEmail, type, gender, brag, breed, suitableForChildren };
    });
}

function savePetData(petData) {
    const petsFilePath = path.join(__dirname, 'pets.txt');
    const petInfo = `${petData.id}:${petData.ownerName}:${petData.ownerEmail}:${petData.type}:${petData.gender}:${petData.brag}:${petData.breed}:${petData.suitableForChildren}\n`;
    fs.appendFileSync(petsFilePath, petInfo);
}

const server = app.listen(4000, function () { 
    console.log('listening to port http://localhost:4000'); 
});
