const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const talker = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_OK = 200;
const HTTP_ERROR = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  const data = JSON.parse(fs.readFileSync(talker, 'utf8'));
  if (data.length === 0) return res.status(HTTP_OK).json([]);
  return res.status(HTTP_OK).json(data);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(talker, 'utf8'));
  const talkerFind = data.find((tf) => tf.id === Number(id));
  if (!talkerFind) {
    return res.status(HTTP_ERROR).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK).json(talkerFind);
});

app.listen(PORT, () => {
  console.log('Online');
});
