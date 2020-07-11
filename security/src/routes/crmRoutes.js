import {
  addNewContact,
  getContacts,
  getContactWithID,
  updateContact,
  deleteContact,
} from '../controllers/crmController';
import { login, register } from '../controllers/userController';
import withErrors from '../core/decorators';
import { loginRequired, validate } from '../core/middlewares';

const routes = (app) => {
  app
    .route('/contacts')
    .get(loginRequired, withErrors(getContacts))

    // POST endpoint
    .post(loginRequired, validate('contact'), withErrors(addNewContact));

  app
    .route('/contact/:contactId')
    // get specific contact
    .get(loginRequired, withErrors(getContactWithID))

    // put request
    .put(loginRequired, withErrors(updateContact))

    // delete request
    .delete(loginRequired, withErrors(deleteContact));

  // registration route
  app.route('/auth/register').post(validate('auth'), withErrors(register));

  // login route
  app.route('/login').post(validate('auth'), login);
};

export default routes;
