import express from 'express';
const jobRouter = express.Router({ mergeParams: true });
import {
  getJob,
  getJobs,
  createJobView,
  createJob,
  updateJob,
  updateJobView,
  createJobNote,
  // deleteJob,
} from '../controllers/jobController.js';
// import AppError from '../utils/AppError';

import { isLoggedIn } from '../middleware/authentication.js';

jobRouter.route('/').get(isLoggedIn, getJobs).post(isLoggedIn, createJob);

jobRouter.get('/new', isLoggedIn, createJobView);

jobRouter
  .route('/:jobId')
  .get(isLoggedIn, getJob)
  .post(isLoggedIn, createJobNote)
  .put(isLoggedIn, updateJob);
// .delete(isLoggedIn, catchAsync(deleteJob));

jobRouter.route('/:jobId/update').get(isLoggedIn, updateJobView);

export default jobRouter;
