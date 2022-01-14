const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const verifyEmail = require('./middlewares/verifyEmail');
const verifyPassword = require('./middlewares/verifyPassword');
const { verifyAge,
        verifyWatchedAt,
        verifyToken,
        verifyTalk,
        verifyRate,
        verifyName } = require('./middlewares/verifyFunc');

const talker = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_ERROR = 404;
const PORT = '3000';

const jsonParseFunc = async () => {
  const data = await fs.readFile(talker);
  return JSON.parse(data);
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const data = await jsonParseFunc();
  if (data.length === 0) return res.status(HTTP_OK_STATUS).json([]);
  return res.status(HTTP_OK_STATUS).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await jsonParseFunc();
  const talkerFind = data.find((tf) => tf.id === Number(id));
  if (!talkerFind) {
    return res.status(HTTP_ERROR).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talkerFind);
});

app.post('/login', verifyEmail, verifyPassword, (_req, res) => {
  res.status(HTTP_OK_STATUS).json({ token: '7mqaVRXJSp886CGr' });
});

app.post('/talker',
 verifyToken,
 verifyName,
 verifyAge,
 verifyTalk,
 verifyRate,
 verifyWatchedAt,
  async (req, res) => {
    const data = await jsonParseFunc();
    const newTalker = { id: data.length + 1, ...req.body };
    data.push(newTalker);
    await fs.writeFile(talker, JSON.stringify(data));
    return res.status(201).json(newTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});
