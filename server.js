const express =  require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const jwt = require('jwt-express');
const cookieParser = require('cookie-parser');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({ storage: storage });

const UserController = require('./controllers/user.controller');

mongoose.connect('mongodb://localhost/vark', { useMongoClient: true });

const app = express();
const users = new UserController();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(jwt.init('vark'));

app.use(express.static('uploads'));

app.post('/passport', upload.single('scan'), (req, res) => users.changePassportScan(req, res));

app.get('/', (req, res) => {
    res.send('API is stable')
});

app.get('/users', (req, res) => users.getUsers(req, res));

app.post('/users', (req, res) => users.createUser(req, res));

app.post('/token', (req, res) => users.getToken(req, res));

app.listen(3000);
