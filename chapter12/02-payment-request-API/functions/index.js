const admin = require('firebase-admin');
const functions = require('firebase-functions');
const webpush = require('web-push');
const cors = require('cors')({
  origin: true
});

const serviceAccount = require('./awesome-apress-pwa-firebase-adminsdk-l9fnh-6b35c787b9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://awesome-apress-pwa.firebaseio.com'
});

const sendNotification = (noteId, subscriptions) => {
  webpush.setVapidDetails(
    'mailto:me@majidhajian.com',
    'BAwM3HXmImMMHoGE8Ketx_eqAPPbFZffgtt3_wfV035AsE9IfTcmLySQRCHNbl3sA7Eev289I8ekAJK0eW3bp58',
    'OzS9eP9akgw-cYAMWApTKOtt3UiFfn6ZwkVVa5tMtTo'
  );

  const pushPayload = {
    notification: {
      title: 'WebPush: New Note',
      body: `Note ${noteId} has been synced!`,
      icon: 'https://placekitten.com/200/139',
      badge: 'https://placekitten.com/96/96',
      image: 'https://placekitten.com/500/339',
      dir: 'ltr',
      lang: 'en',
      timestamp: new Date().getTime(),
      renotify: false,
      requireInteraction: false,
      silent: false,
      tag: 'save-note',
      vibrate: [100, 50, 100],
      data: {
        noteID: noteId,
        primaryKey: 1
      },
      actions: [
        {
          action: 'open',
          title: 'Open Note',
          icon: 'https://placekitten.com/24/24'
        },
        {
          action: 'cancel',
          title: 'Close',
          icon: 'https://placekitten.com/24/24'
        }
      ]
    }
  };

  if (subscriptions) {
    setTimeout(() => {
      subscriptions.forEach(pushConfig => {
        webpush
          .sendNotification(pushConfig.data(), JSON.stringify(pushPayload))
          .then(_ => console.log('message has been sent'))
          .catch(err => {
            console.log(`PushError ${err}`);
            // Check for "410 - Gone" status and delete it
            if (err.statusCode === 410) {
              pushConfig.ref.delete();
            }
          });
      });
    }, 3000);
  }
};

exports.saveNote = functions.https.onRequest((request, response) => {
  const { user, data } = request.body;
  cors(request, response, async () => {
    return admin
      .firestore()
      .collection(`users/${user}/notes`)
      .add(data)
      .then(async noteDoc => {
        const note = await noteDoc.get();
        const data = note.data();
        data.id = note.id;

        const subscriptions = await admin
          .firestore()
          .collection(`users/${user}/subscriptions`)
          .get();

        sendNotification(note.id, subscriptions);

        return response.status(201).json({
          succcess: true,
          data
        });
      })
      .catch(err => {
        console.log(err);
        response.status(500).json({
          error: err,
          succcess: false
        });
      });
  });
});
