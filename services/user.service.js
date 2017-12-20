const User = require('../models/user.model.js');
const Rx = require('rxjs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class UserService {

    constructor() {
        this.EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        this.PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    }

    getByEmail(email) {
        return Rx.Observable.create(observer => {
            const isValidEmail = this.EMAIL_REGEX.test(email);
            if (!isValidEmail) {
                observer.error('Not a valid email!');
            }
            User.findOne({email}, (err, user) => {
                if (err) observer.error(err);
                observer.next(user)
            });
        });
    }

    authenticate(email, password) {
        return this.getByEmail(email).map(user => {
            if (bcrypt.compareSync(password, user.password)) {
                return user;
            } else {
                throw new Error('Incorrect password!');
            }
        })
    }


    validateEmail(email) {
        return this.getByEmail(email)
            .map(user => {
                if (user) {
                    throw new Error('User with that email already exists')
                } else {
                    return void 0;
                }
            });
    }

    validatePassword(password, confirmPassword) {
        return Rx.Observable.create(observer => {
            if (password !== confirmPassword) {
                observer.error('Passwords don\'t match!');
            }
            if (!this.PASSWORD_REGEX.test(password)) {
                observer.error('Password must contain at least one number, one character and contain at least 8 characters');
            }
            observer.next(void 0);
        })
    }

    createUser(userInfo) {
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        return Rx.Observable.create((observer) => {
            const user = new User(userInfo);
            user.save((err) => {
                if (err) {
                    observer.error('User Creation failed');
                } else {
                    observer.next(void 0);
                }
            })
        });
    }

    updateUser(id, data) {
        return Rx.Observable.create(observer => {
            User.update({_id: id}, data, (err) => {
                if (err) {
                    observer.error(err)
                } else {
                    observer.next('Successfully updated field');
                }
            });
        });
    }

    getUsers(page) {
        return Rx.Observable.create(observer => {
            const query = User.find()
                .select('-password')
                .limit(20)
                .skip(20 * (page - 1));
            query.exec((err, users) => {
                if (err) {
                    observer.error('Cannot get users');
                }
                observer.next({users, page});
            })
        })
    }
}

module.exports = UserService;