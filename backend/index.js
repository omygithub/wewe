const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const next = require('next');
const Group = require('../db/Group');
const Msg = require('../db/Msg');
const { pageMsgCount } = require('../config');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({
  dev,
});
const handle = nextApp.getRequestHandler();

const app = express();

nextApp.prepare().then(() => {
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', async (req, res) => {
    const groups = await Group.getAll();
    nextApp.render(req, res, '/index', { groups });
  });

  // cat history of today
  app.get('/chat/:name', async (req, res) => {
    const { name } = req.params;
    const group = await Group.get({ name });
    if (!group) {
      res.status(404);
      return;
    }

    const totalPageCount = Math.ceil(group.msgCount / pageMsgCount);
    console.log(totalPageCount);
    const msgs = await Msg.getRange({
      groupName: name,
      idOffset: (totalPageCount - 1) * pageMsgCount,
      idLimit: pageMsgCount,
    });
    nextApp.render(req, res, '/chat', {
      group, msgs, totalPageCount, currentPage: totalPageCount,
    });
  });

  app.get('/chat/:name/page/:page', async (req, res) => {
    const { name, page } = req.params;
    const group = await Group.get({ name });
    if (!group) {
      res.status(404);
      return;
    }

    const totalPageCount = Math.ceil(group.msgCount / pageMsgCount);

    const msgs = await Msg.getRange({
      groupName: name,
      idOffset: (page - 1) * pageMsgCount,
      idLimit: pageMsgCount,
    });

    nextApp.render(req, res, '/chat', {
      group, msgs, totalPageCount, currentPage: page,
    });
  });

  app.get('*', (req, res) => handle(req, res));

  const { PORT = 8080 } = process.env;
  app.listen(PORT);
  console.log(`server running on http://localhost:${PORT}`);
});