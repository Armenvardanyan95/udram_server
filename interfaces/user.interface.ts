interface IUser {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    address: {
        city: string,
        zip: string,
        street: string,
        apt: string
    },
    email: string,
    mobilePhone: string,
    password: string
}