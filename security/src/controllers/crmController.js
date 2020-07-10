import mongoose from 'mongoose';

import ContactSchema from '../models/crmModel';

const Contact = mongoose.model('Contact', ContactSchema);

const addNewContact = async (req, res) => {
  const newContact = new Contact(req.body);

  const contact = await newContact.save();

  return res.json(contact);
};

const getContacts = async (req, res) => {
  const contact = await Contact.find({});

  return res.json(contact);
};

const getContactWithID = async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);

  return res.json(contact);
};

const updateContact = async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.contactId },
    req.body,
    { new: true },
  );

  return res.json(contact);
};

const deleteContact = async (req, res) => {
  const contact = await Contact.remove({ _id: req.params.contactId });

  console.log(contact);
  return res.json({ message: 'Successfully deleted contact' });
};

export {
  addNewContact,
  getContacts,
  getContactWithID,
  updateContact,
  deleteContact,
};
