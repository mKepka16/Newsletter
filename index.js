const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

let users = [
  { nick: '111', email: '111@w.pl' },
  { nick: '222', email: '222@w.pl' },
  { nick: '333', email: '333@w.pl' },
];

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + `/static/pages/addUser.html`));
});

app.get('/addUser', (req, res, next) => {
  const { email, nick } = req.query;
  const doesUserExist = users.find((user) => user.email == email) !== undefined;

  if (doesUserExist) {
    return res.send('User with this email already exists.');
  }

  users.push({ nick, email });

  res.send('User added to newsletter');
});

app.get('/removeUserBySelect', (req, res, next) => {
  const options = users.reduce((options, user) => {
    return options + `<option value="${user.email}">${user.email}</option>`;
  }, '');
  res.send(`
    <form action="/removeUser" method="GET">
      <select name="email">
      ${options}
      </select> 
      <button type="submit">Delete</button>
    </form> 
  `);
});

app.get('/removeUserByRadio', (req, res, next) => {
  const radioButtons = users.reduce((options, user) => {
    return (
      options +
      `<input type="radio" name="email" value="${user.email}">${user.email}</input>`
    );
  }, '');
  res.send(`
    <form action="/removeUser" method="GET">
      ${radioButtons}
      <button type="submit">Delete</button>
    </form> 
  `);
});

app.get('/removeUserByCheckbox', (req, res, next) => {
  const checkboxes = users.reduce((options, user) => {
    return (
      options +
      `<input type="checkbox" value="${user.email}" name="emails"/>${user.email}</input>`
    );
  }, '');
  res.send(`
    <form action="/removeUsers" method="GET">
      ${checkboxes}
      <button type="submit">Delete</button>
    </form> 
  `);
});

app.get('/removeUser', (req, res, next) => {
  const { email } = req.query;
  users = users.filter((user) => user.email !== email);
  res.send('User deleted');
});

app.get('/removeUsers', (req, res, next) => {
  const { emails } = req.query;
  users = users.filter((user) => !emails.includes(user.email));
  res.send('Users deleted');
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
