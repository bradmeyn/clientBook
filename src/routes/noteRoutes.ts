import express from 'express';
const noteRouter = express.Router({ mergeParams: true });
import {
  getNote,
  getNotes,
  createNote,
  //   deleteNote,
  updateNote,
  updateNoteView,
} from '../controllers/noteController.js';
// import AppError from '../utils/AppError';

import { isLoggedIn } from '../middleware/authentication.js';

noteRouter.route('/').get(isLoggedIn, getNotes).post(isLoggedIn, createNote);

noteRouter
  .route('/:noteId')
  .get(isLoggedIn, getNote)
  .put(isLoggedIn, updateNote);
//   .delete(isLoggedIn, catchAsync(deleteNote));

noteRouter.route('/:noteId/update').get(isLoggedIn, updateNoteView);

export default noteRouter;
