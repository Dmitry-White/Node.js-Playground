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

  if (!contact) {
    throw new Error('No contact found!');
  }

  return res.json(contact);
};

const updateContact = async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.contactId },
    req.body,
    { new: true },
  );

  if (!contact) {
    throw new Error('No contact found!');
  }

  return res.json(contact);
};

const deleteContact = async (req, res) => {
  const contact = await Contact.deleteOne({ _id: req.params.contactId });

  if (!contact.deletedCount) {
    throw new Error('No contact found!');
  }

  return res.json({ message: 'Successfully deleted contact' });
};

export {
  addNewContact,
  getContacts,
  getContactWithID,
  updateContact,
  deleteContact,
};
