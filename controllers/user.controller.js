
const UserService = require('../services/user.service');

class UserController {

    constructor() {
        this.userService = new UserService();
    }

    changePassportScan(req, res) {
        this.userService.updateUser(req.body.id, {passport: {scan: req.file.path.replace('\\', '/')}})
            .subscribe(
                () => res.json({message: 'Successfully uploaded file!'}),
                err => res.json({message: err})
            );
    }

    createUser(req, res) {
        const userInfo = req.body;
        this.userService
            .validateEmail(userInfo.email)
            .switchMap(() => this.userService.validatePassword(userInfo.password, userInfo.confirmPassword))
            .switchMap(() => this.userService.createUser(req.body))
            .subscribe(
                () => res.send('User successfully created'),
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
                    console.log('dilimization')
                    const jwt = res.jwt(user);
                    res.json({token: jwt.token})
                },
                err => res.json({message: err})
            );
    }

}

module.exports = UserController;