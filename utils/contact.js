const { check } = require("express-validator");
const fs = require("fs");
const path = "./data";
const file = "./data/contacts.json";

if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "[]", "utf-8");
}

let contacts = [];

const loadContacts = () => {
    const fileBuffer = fs.readFileSync(file, "utf-8");
    contacts = JSON.parse(fileBuffer);
    
    return contacts;
}

const findContact = (nama) => {
    const contacts = loadContacts();
    const contact = contacts.find((contact) => contact.nama === nama);

    return contact;
}

const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);

  saveContacts(contacts);
}

const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 2));
};

const checkDuplicate = (nama) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.nama === nama);
};

const deleteContact = (nama) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
};

const updateContact = (contactBaru) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
  
  delete contactBaru.oldNama;
  filteredContacts.push(contactBaru);
  saveContacts(filteredContacts);
};

module.exports = { loadContacts, findContact, addContact, checkDuplicate, deleteContact, updateContact };
