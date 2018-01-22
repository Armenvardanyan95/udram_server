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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(jwt.init('vark', {cookies: false}));

app.use(express.static('uploads'));

app.post('/passport', upload.single('scan'), (req, res) => users.changePassportScan(req, res));

app.post('/acra', upload.single('scan'), (req, res) => users.changeAcraScan(req, res));

app.get('/', (req, res) => {
    res.send('API is stable')
});

app.get('/users', jwt.valid(), (req, res) => users.getUsers(req, res));

app.post('/users', (req, res) => users.createUser(req, res));

app.post('/token', (req, res) => users.getToken(req, res));

app.post('/forgot-password', (req, res) => users.forgotPassword(req, res));

app.post('/change-password', (req, res) => users.changePassword(req, res));

app.get('/current', jwt.valid(), (req, res) => users.currentUser(req, res));

app.patch('/updateUser', jwt.valid(), (req, res) => users.updateUser(req, res));

app.post('/check-email', (req, res) => users.checkEmailUniqueness(req, res));

app.post('/admin/workers/', (req, res) => users.createWorker(req, res));

app.post('/admin-token', (req, res) => users.getWorkerToken(req, res));

app.post('/admin/change-status', (req, res) => users.changeRequestStatus(req, res));

app.listen(3000);
