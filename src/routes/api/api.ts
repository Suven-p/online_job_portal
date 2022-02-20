import express, { Request } from 'express';
import { isLoggedIn } from '@middleware/authentication';
import authRoute from './auth/auth';
import userRoute from './user/user';
import jobs from './jobs/jobs';
import academicsRoute from './academics';

const router = express.Router();

router.use('/academics', academicsRoute);

router.use('/jobs', jobs);

router.use('/auth', authRoute);

router.use('/user', userRoute);

router.get('/userinfo', isLoggedIn, (req: Request, res) => {
  res.json({ user: req.user?.user, session: req.session, success: true });
});

router.get('/', (req, res) => {
  res.json({ message: 'This is the api page!', success: true });
});

router.get('*', (req, res) => {
  res.status(404).json({ message: 'Could not find page!', success: false });
});

export default router;
