const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContacts, findContact, addContact, checkDuplicate, deleteContact, updateContact } = require('./utils/contact');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
// const port = 3000;

// Menggunakan EJS
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('secret'));
app.use(session({
  cookie: {maxAge : 6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})
);

app.use(flash());

app.get('/', (req, res) => {
  const contacts = loadContacts();
  
  res.render('index', {
    title: 'Home',
    layout: 'layouts/main-layout',
    contacts,
    msg: req.flash('msg')
  });
});

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Tambah Kontak',
    layout: 'layouts/main-layout'
  });
});

// Create
app.post('/contact', [
  check('nohp', 'No handphone tidak valid.').isMobilePhone('id-ID'),
  body('nama').custom((value) => {
    const duplicate = checkDuplicate(value);
    if (duplicate) {
      throw new Error('Nama sudah ada dalam data kontak');
    }
    return true;
  })
  ], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    res.render('add-contact', {
      title: 'Tambah Kontak',
      layout: 'layouts/main-layout',
      errors: errors.array()
    });
  } else {
    addContact(req.body);
    req.flash('msg', 'Data kontak berhasil di tambahkan.');
    res.redirect('/');
  }
});

// Delete
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  if(!contact) {
    res.status(404);
    res.send('Kontak tidak tersedia!');
  } else  {
    deleteContact(req.params.nama);
    req.flash('msg', 'Data kontak berhasil di hapus.');
    res.redirect('/');
  }
});

// Read
app.get('/detail/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  res.render('detail', {
    title: 'Detail',
    layout: 'layouts/main-layout',
    contact
  });
});

// Update
app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('edit-contact', {
    title: 'Ubah Kontak',
    layout: 'layouts/main-layout',
    contact
  });
});

app.post('/contact/update', [
  check('nohp', 'No handphone tidak valid.').isMobilePhone('id-ID'),
  body('nama').custom((nowNama, { req }) => {
    const duplicate = checkDuplicate(nowNama);
    if (nowNama !== req.body.oldNama && duplicate) {
      throw new Error('Nama sudah ada dalam data kontak');
    }
    return true;
  })
  ], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('edit-contact', {
      title: 'Ubah Kontak',
      layout: 'layouts/main-layout',
      errors: errors.array(),
      contact: req.body
    });
  } else {
    updateContact(req.body);
    req.flash('msg', 'Data kontak berhasil di ubah.');
    res.redirect('/');
  }
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('Halaman tidak di temukan!');
});

// app.listen(port, (error) => {
//   if (error) {
//     console.log('Tidak dapat menjalankan server');
//   } else {
//     console.log(`Server berjalan di port ${port}`);
//   }
// });

const http = require('http');
const server = http.createServer(app);

module.exports = server;