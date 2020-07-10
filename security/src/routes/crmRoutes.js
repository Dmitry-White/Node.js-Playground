import {
  addNewContact,
  getContacts,
  getContactWithID,
  updateContact,
  deleteContact,
} from '../controllers/crmController';
import { login, register } from '../controllers/userController';
import handleErrors from '../core/decorators';
import loginRequired from '../core/middlewares';

const routes = (app) => {
  app
    .route('/contacts')
    .get(
      (req, res, next) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request type: ${req.method}`);
        next();
      },
      loginRequired,
      handleErrors(getContacts),
    )

    // POST endpoint
    .post(loginRequired, handleErrors(addNewContact));

  app
    .route('/contact/:contactId')
    // get specific contact
    .get(loginRequired, handleErrors(getContactWithID))

    // put request
    .put(loginRequired, handleErrors(updateContact))

    // delete request
    .delete(loginRequired, handleErrors(deleteContact));

  // registration route
  app.route('/auth/register').post(handleErrors(register));

  // login route
  app.route('/login').post(login);
};

export default routes;
