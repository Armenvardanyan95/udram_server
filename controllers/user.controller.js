const decode = require('jwt-decode');

const EmailService = require('../services/email.service');
const UserService = require('../services/user.service');

class UserController {

    constructor() {
        this.userService = new UserService();
        this.emailService = new EmailService();
    }

    changePassportScan(req, res) {
        const newData = {passportScan: req.file.path.replace('\\', '/')};
        this.userService.updateUser(req.body.id, newData)
            .subscribe(
                () => res.json({message: 'Successfully uploaded file!'}),
                err => res.json({message: err})
            );
    }

    changeAcraScan(req, res) {
        const newData = {acraScan: req.file.path.replace('\\', '/')};
        this.userService.updateUser(req.body.id, newData)
            .subscribe(
                () => res.json({message: 'Successfully uploaded file!'}),
                err => res.json({message: err})
            );
    }

    checkEmailUniqueness(req, res) {
        this.userService.getByEmail(req.body.email)
            .subscribe(
                u => {
                    console.log(u, 'uujan');
                    res.json({isUnique: !u})
                }
            );
    }

    createUser(req, res) {
        const userInfo = req.body;
        this.userService
            .validateEmail(userInfo.auth.email)
            .switchMap(() => this.userService.validatePassword(userInfo.auth.password, userInfo.auth.confirmPassword))
            .switchMap(() => this.userService.createUser(req.body))
            .subscribe(
                (userID) => {
                    res.json({message: 'User successfully created', id: userID});
                    this.emailService
                        .registrationEmail(userInfo.personal.firstName + ' ' + userInfo.personal.lastName, userInfo.auth.email)
                },
                err => res.status(422).send(err)
            );
    }

    getUsers(req, res) {
        this.userService.getUsers(req.query.page)
            .subscribe(
                users => res.json(users),
                err => res.status(400).send(err)
            );
    }

    getToken(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        this.userService.authenticate(email, password)
            .subscribe(
                user => {
                    const jwt = res.jwt({
                        fullName: user.firstName + user.lastName,
                        _id: user._id
                    });
                    res.json({token: jwt.token})
                },
                err => res.status(422).json({message: err.message})
            );
    }

    currentUser(req, res) {
        const userInfo = decode(req.headers['authorization'].split(' ')[1]);
        this.userService.getUser(userInfo._id)
            .subscribe(
                user => res.json(user),
                err => res.status(422).json({message: err.message})
            );
    }

    forgotPassword(req, res) {
        const email = req.body.email;
        this.userService.getByEmail(email)
            .map(user => {
                if (!user) throw new Error('Այդ հասցեով օգտատեր չկա');
                return user;
            })
            .subscribe(
                user => {
                    const hash = res.jwt({
                        _id: user._id,
                        date: new Date().toISOString()
                    }).token;
                    res.json({message: 'Ձեր էլեկտրոնային հասցեին կուղարկվի նամակ, որը պարունակում է ինֆորմացիա անհրաժեշտ նոր գաղտնաբառ ստեղծելու համար'});
                    this.emailService.forgotPasswordEmail(
                        email,
                        user.personal.firstName + ' ' + user.personal.lastName,
                        `http://localhost:4200/recover?hash=${hash}`
                    );
                },
                err => {
                    console.log(err);
                    res.status(422).json({message: err.message})
                }
            );
    }

    changePassword(req, res) {
        const hash = req.body.hash;
        const payload = decode(hash);
        console.log(payload);
        this.userService.changePassword({_id: payload._id, password: req.body.password, confirmPassword: req.body.confirmPassword})
            .subscribe(
                () => res.json({message: 'Գաղտնաբառը հաջողությամբ փոխվել է'}),
                err => res.status(422).json({message: err.message})
            );
    }

    updateUser(req, res) {
        const userData = req.body;
        this.userService.updateUser(userData._id, userData)
            .subscribe(
                () => res.json({message: 'Success'}),
                err => res.status(422).json({message: err.message})
            );
    }

}

module.exports = UserController;