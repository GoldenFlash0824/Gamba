import validate from "validate.js"

export const constraints = {
	firstName: {
		presence: {
			allowEmpty: false,
			message: "^First Name is required",
		},
	},

	lastName: {
		presence: {
			allowEmpty: false,
			message: "^Last Name is required",
		},
	},

	username: {
		presence: {
			allowEmpty: false,
			message: "^Username is required",
		},
	},

	phone: {
		presence: {
			allowEmpty: false,
			message: "^Phone can not be empty",
		},
		length: {
			minimum: 11,
			tooShort: "number incomplete!",
		},
	},

	email: {
		presence: {
			allowEmpty: false,
			message: "^Email can not be empty",
		},
		email: {
			message: "^Please enter a valid email address",
		},
	},

	password: {
		presence: {
			allowEmpty: false,
			message: "^Password must contains 8 letters or more!",
		},
		length: {
			minimum: 8,
			tooShort: "must contains %{count} letters or more!",
		},
	},

	age: {
		presence: {
			allowEmpty: false,
			message: "^Age Group is required",
		},
	},

	location: {
		presence: {
			allowEmpty: false,
			message: "^Location is required",
		},
	},

	homeLocation: {
		presence: {
			allowEmpty: false,
			message: "^Home Location is required",
		},
	},

	altitude: {
		presence: {
			allowEmpty: false,
			message: "^Altitude is required",
		},
	},

	longitude: {
		presence: {
			allowEmpty: false,
			message: "^Longitude is required",
		},
	},

	fcmToken: {
		presence: {
			allowEmpty: false,
			message: "^FcmToken is required",
		},
	},

	title: {
		presence: {
			allowEmpty: false,
			message: "^Tile is required",
		},
	},

	taste: {
		presence: {
			allowEmpty: false,
			message: "^Taste is required",
		},
	},

	address: {
		presence: {
			allowEmpty: false,
			message: "^Address is required",
		},
	},

	awardedDate: {
		presence: {
			allowEmpty: false,
			message: "^AwardedDate is required",
		},
	},

	updateAt: {
		presence: {
			allowEmpty: false,
			message: "^UpdateAt is required",
		},
	},

	createAt: {
		presence: {
			allowEmpty: false,
			message: "^CreateAt is required",
		},
	},
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
	return null
}
