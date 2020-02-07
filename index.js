const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-cc548-firebase-adminsdk-kb9x5-e70dfa3ce6.json')
const databaseURL = 'https://fcm-cc548.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-cc548/messages:send'
const deviceToken =
  'e9OU3D9iwWPsJIkjwTgzGy:APA91bF-JkOMHz_fIMxzCB9sNfP9zUcF75zaJWyZAwbmi6naF_Jxrs6qLJGL8JkL47Un-RKCqt44CBsaLzCnsnWS7DbBJAt1wGfB8wKlEKs0XsCKh2buPj32_F-dju9VfBJum8k0ZzY1'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()
