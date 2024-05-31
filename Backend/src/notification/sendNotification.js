import admin from 'firebase-admin'
import {createRequire} from 'module'
const require = createRequire(import.meta.url)
const serviceAccount = require('./gambaapp-firebase-adminsdk-d036g-471655eec9.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gambaapp.firebaseio.com'
})

const sendNotification = async (data) => {
    try {
        await admin
            .messaging()
            .send(data)
            .then((response) => {
                console.log('success', response)
            })
            .catch((error) => {
                console.log('Error in sending fcm token', error.message)
            })
    } catch (error) {
        console.log('Error in sending fcm token', error.message)
    }
}

export {sendNotification}
