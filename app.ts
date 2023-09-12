import express from 'express';
// import path from 'path';

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
// res.send('The sedulous hyena ate the antelope!');
// res.sendFile(`index.html`);
// });
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
