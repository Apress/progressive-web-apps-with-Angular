const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const app = express();

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/saveNote', async (req, res) => {
  try {
    const result = await axios.post('https://us-central1-awesome-apress-pwa.cloudfunctions.net/saveNote', req.body);
    return res.status(201).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: 'something went wrong with the endpoint' } });
  }
});

app.delete(`/api/deleteNote/users/:user_id/notes/:note_id`, async (req, res) => {
  try {
    const { user_id, note_id } = req.params;
    const { authorization } = req.headers;
    const result = await axios.delete(
      `https://firestore.googleapis.com/v1beta1/projects/awesome-apress-pwa/databases/(default)/documents/users/${user_id}/notes/${note_id}`,
      {
        headers: {
          Authorization: authorization
        }
      }
    );
    return res.json(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: { message: 'something went wrong with the endpoint' } });
  }
});

app.get('*', (req, res) => {
  res.sendfile('./dist/index.html');
});

app.listen(4200);
console.log('SEVER IS READY -> PORT 4200');
