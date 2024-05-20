import validate from 'validate.js'

export const constraints = {
    fullName: {
        presence: {
            allowEmpty: false,
            message: '^Name is required'
        }
    },
    firstName: {
        presence: {
            allowEmpty: false,
            message: '^First name is required'
        }
    },
    lastName: {
        presence: {
            allowEmpty: false,
            message: '^Last name is required'
        }
    },
    username: {
        presence: {
            allowEmpty: false,
            message: "^Username is required don't enter(@)"
        }
    },
    email: {
        presence: {
            allowEmpty: false,
            message: '^Valid email is required'
        },
        email: {
            message: '^Valid email is required'
        }
    },
    loginname: {
        presence: {
            allowEmpty: false,
            message: '^Valid email or username is required'
        }
    },
    phone: {
        length: {
            minimum: 4,
            tooShort: '^Valid phone number is required'
        },
        presence: {
            allowEmpty: false,
            message: '^Valid phone number is required'
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: '^Password must contains 8 letters or more!'
        },
        length: {
            minimum: 8,
            tooShort: 'must contains %{count} letters or more!'
        }
    },
    city: {
        presence: {
            allowEmpty: false,
            message: '^Address is required'
        }
    },
    expiry: {
        presence: {
            allowEmpty: false,
            message: '^Expiry is invalid'
        },
        length: {
            minimum: 8,
            tooShort: 'Expiry is invalid'
        }
    },
    category: {
        presence: {
            allowEmpty: false,
            message: '^Category is required'
        }
    },

    productName: {
        presence: {
            allowEmpty: false,
            message: '^Product name is required'
        }
    },
    eventName: {
        presence: {
            allowEmpty: false,
            message: '^Event name is required'
        }
    },
    price: {
        presence: {
            allowEmpty: false,
            message: '^Price is required'
        }
    },
    quantity: {
        presence: {
            allowEmpty: false,
            message: '^Quantity is required'
        }
    },
    description: {
        presence: {
            allowEmpty: false,
            message: '^Description is required'
        }
    },
    post: {
        presence: {
            allowEmpty: false,
            message: '^Post detail is required'
        }
    },
    postTitle: {
        presence: {
            allowEmpty: false,
            message: '^Post title is required'
        }
    },
    location: {
        presence: {
            allowEmpty: false,
            message: '^Address is required'
        }
    },
    about: {
        presence: {
            allowEmpty: false,
            message: '^About is required'
        }
    },
    allowPerson: {
        presence: {
            allowEmpty: false,
            message: '^AllowPerson is required'
        }
    },
    memberLimit: {
        presence: {
            allowEmpty: false,
            message: '^Limit to number is required'
        }
    },
    numbers: {
        presence: {
            allowEmpty: false,
            message: '^Required'
        }
    },
    distance: {
        presence: {
            allowEmpty: false,
            message: '^Required'
        }
    },
    topic: {
        presence: {
            allowEmpty: false,
            message: '^Required'
        }
    }
}

export default function ValidateInput(fieldName, value) {
    const formValues = {}
    formValues[fieldName] = value

    const formConstrains = {}
    formConstrains[fieldName] = constraints[fieldName]

    const result = validate(formValues, formConstrains)
    if (result) {
        return result[fieldName][0]
    }
    return false
}

export function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return false
    } else {
        return true
    }
}

export function ValidateUserName(userName) {
    if (userName.length > 0) {
        const _userName = userName.match(/@/g)
        if (_userName) {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}
