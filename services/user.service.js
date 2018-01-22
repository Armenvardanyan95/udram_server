const User = require('../models/user.model.js');
const Worker = require('../models/worker.model.js');
const Rx = require('rxjs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class UserService {

    constructor() {
        this.EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        this.PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    }

    getWorkerByEmail(email) {
        return Rx.Observable.create(observer => {
            Worker.findOne({email}, (err, user) => {
                if (err) {
                    observer.error(err);
                }
                observer.next(user)
            });
        });
    }

    getByEmail(email) {
        return Rx.Observable.create(observer => {
            User.findOne({'auth.email': email}, (err, user) => {
                if (err) {
                    observer.error(err);
                    console.log('errrrrrr', err);
                }
                observer.next(user)
            });
        });
    }

    authenticate(email, password) {
        return this.getByEmail(email).map(user => {
            if (!user) throw new Error('Այդ հասցեով օգտատեր չկա');
            if (bcrypt.compareSync(password, user.auth.password)) {
                return user;
            } else {
                throw new Error('Մուտքագրված գաղտնաբառը սխալ է');
            }
        });
    }

    authenticateWorker(email, password) {
        return this.getWorkerByEmail(email).map(user => {
            if (!user) throw new Error('Այդ հասցեով օգտատեր չկա');
            if (bcrypt.compareSync(password, user.password)) {
                return user;
            } else {
                throw new Error('Մուտքագրված գաղտնաբառը սխալ է');
            }
        });
    }

    getUser(_id) {
        return Rx.Observable.create(observer => {
            User.findOne({_id: _id}, {'auth.password': 0}, (err, user) => {
                if (err) observer.error(err);
                else observer.next(user);
            });
        });
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

    validateWorkerEmail(email) {
        return this.getWorkerByEmail(email)
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
                observer.error({message: 'Passwords don\'t match!'});
            }
            if (!this.PASSWORD_REGEX.test(password)) {
                observer.error({message: 'Password must contain at least one number, one character and contain at least 8 characters'});
            }
            observer.next(void 0);
        })
    }

    createUser(userInfo) {
        userInfo.auth.password = bcrypt.hashSync(userInfo.auth.password, 10);
        return Rx.Observable.create((observer) => {
            const user = new User(userInfo);
            user.save((err, u) => {
                if (err) {
                    observer.error('User Creation failed');
                } else {
                    observer.next(u._id);
                }
            })
        });
    }

    createWorker(userInfo) {
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        return Rx.Observable.create((observer) => {
            const worker = new Worker(userInfo);
            worker.save((err, w) => {
                if (err) {
                    observer.error('User Creation failed');
                } else {
                    observer.next(w._id);
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

    getUsers(page, fullName) {
        return Rx.Observable.create(observer => {
            const or = [];
            if (fullName) {
                or.push({'personal.firstName': new RegExp(`${fullName}`)});
            }
            let query = or.length ? User.find().or(or) : User.find();

            query = query.select('-auth.password')
                .limit(20)
                .skip(20 * (page - 1));

            query.exec((err, users) => {
                if (err) {
                    observer.error('Cannot get users');
                }
                User.count({}, (err2, count) => {
                    if (err2) {
                        observer.error('Cannot get count');
                    }
                    observer.next({users, page, count});
                });
            })
        })
    }

    changeRequestStatus(status, requestID) {
        return this.getUser(requestID)
            .switchMap(user => {
                return Rx.Observable.create(observer => {
                    user.request.status = status;
                    user.save((err) => {
                        if (err) {
                            observer.error(err);
                        } else {
                            observer.next({email: user.auth.email, fullName: user.personal.firstName + ' ' + user.personal.lastName});
                        }
                    });
                });

            });
    }

    changePassword(credentials) {
        return this.validatePassword(credentials.password, credentials.confirmPassword)
            .switchMap(() => {
                return Rx.Observable.create(observer => {
                    User.findOne({_id: credentials._id}, (err, user) => {
                        if (err) observer.error({message: err});
                        else {
                            const password = bcrypt.hashSync(credentials.password, 10);
                            user.auth.password = password;
                            user.save();
                            observer.next(void 0);
                        }
                    });
                });
            })
    }
}

module.exports = UserService;