import Account from '../models/accountModel.js';
import User from '../models/userModel.js';
import Client from '../models/clientModel.js';
import Job from '../models/jobModel.js';
import Note from '../models/noteModel.js';
// import populateDb from '../utils/populateDb';
import { hash } from 'bcrypt';
// @route     GET /login
// @desc      User login form
// @access    Public
export const loginView = (req, res) => {
    res.render('users/login');
};
// @route     POST /login
// @desc      User login
// @access    Public
export const userLogin = (req, res) => {
    try {
        res.redirect('/dashboard');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('back');
    }
};
// @route     GET /dashboard
// @desc      User dashboard
// @access    Private
export const userDashboardView = async (req, res) => {
    try {
        const user = req.user.firstName;
        const { account } = req.user;
        const clientCount = await Client.find({ account }).countDocuments();
        if (clientCount > 0) {
            const jobs = await Job.find({
                account,
            })
                .sort({ due: 1 })
                .populate('client');
            const clients = await Client.find({ account }).populate('jobs');
            const notes = await Note.find({
                account,
                options: { sort: { _id: -1 }, limit: 3 },
            }).populate('client');
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDay();
            const currentYear = currentDate.getFullYear();
            let notStarted = {
                revenue: 0,
                count: 0,
            };
            let inProgress = {
                revenue: 0,
                count: 0,
            };
            let finalising = {
                revenue: 0,
                count: 0,
            };
            let onHold = {
                revenue: 0,
                count: 0,
            };
            let completed = {
                revenue: {
                    month: 0,
                    lastMonth: 0,
                    year: 0,
                    lastYear: 0,
                },
                count: {
                    month: 0,
                    year: 0,
                },
                yearGain() {
                    return Math.round(((this.revenue.year - this.revenue.lastYear) /
                        this.revenue.lastYear) *
                        100);
                },
                monthGain() {
                    return Math.round(((this.revenue.month - this.revenue.lastMonth) /
                        this.revenue.lastMonth) *
                        100);
                },
            };
            const activeJobs = [];
            const revLastYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const revThisYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            jobs.forEach((job) => {
                switch (true) {
                    case job.status === 'Not Started':
                        notStarted.revenue += job.revenue;
                        notStarted.count++;
                        activeJobs.push(job);
                        break;
                    case job.status === 'In Progress':
                        inProgress.revenue += job.revenue;
                        inProgress.count++;
                        activeJobs.push(job);
                        break;
                    case job.status === 'Finalising':
                        finalising.revenue += job.revenue;
                        finalising.count++;
                        activeJobs.push(job);
                        break;
                    case job.status === 'On Hold':
                        onHold.revenue += job.revenue;
                        onHold.count++;
                        activeJobs.push(job);
                        break;
                    case job.status === 'Completed':
                        if (job.completed.getFullYear() === currentYear) {
                            completed.revenue.year += job.revenue;
                            completed.count.year++;
                            revThisYear[job.completed.getMonth()] += job.revenue;
                        }
                        if (job.completed.getFullYear() === currentYear &&
                            job.completed.getMonth() === currentMonth) {
                            completed.revenue.month += job.revenue;
                            completed.count.month++;
                        }
                        if (job.completed.getFullYear() === currentYear - 1) {
                            revLastYear[job.completed.getMonth()] += job.revenue;
                            completed.revenue.lastYear += job.revenue;
                        }
                        if (job.completed.getFullYear() === currentYear &&
                            job.completed.getMonth() === currentMonth - 1) {
                            completed.revenue.lastMonth += job.revenue;
                        }
                        break;
                }
            });
            const birthdays = clients.filter((client) => {
                const birthMonth = client.dob.getMonth();
                const birthDay = client.dob.getDay();
                if (birthMonth < currentMonth || birthMonth > currentMonth + 1)
                    return false;
                if (birthMonth === currentMonth && birthDay < currentDay - 1)
                    return false;
                return true;
            });
            let revPipeline = [
                notStarted.revenue,
                onHold.revenue,
                inProgress.revenue,
                finalising.revenue,
            ];
            let jobStatusData = [
                notStarted.count,
                onHold.count,
                inProgress.count,
                finalising.count,
            ];
            const newClients = await Client.find({ account })
                .sort({ _id: -1 })
                .limit(5);
            const recentNotes = await Note.find({ account })
                .sort({ _id: -1 })
                .limit(5)
                .populate('client');
            res.render('users/user_dashboard', {
                revPipeline,
                jobStatusData,
                birthdays,
                user,
                activeJobs,
                completed,
                notes,
                revLastYear,
                revThisYear,
                newClients,
                recentNotes,
            });
        }
        else {
            res.render('clients/client_first', {
                user,
            });
        }
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('back');
    }
};
// @route     GET /notes
// @desc      All notes created by user
// @access    Private
export const getUserNotes = async (req, res) => {
    try {
        const account = req.user.account;
        let { category } = req.query;
        !category
            ? (category = [
                'Phone Call',
                'Email',
                'Meeting',
                'Job Update',
                'General',
                '',
            ])
            : '';
        const query = {
            account: account,
            category,
        };
        const notes = await Note.find(query)
            .sort({ _id: -1 })
            .populate('client')
            .populate('author');
        res.render('users/user_notes', { notes });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
};
// @route     GET /jobs
// @desc      All jobs created by user
// @access    Private
export const getUserJobs = async (req, res) => {
    try {
        const { account } = req.user;
        //destructure filter values
        let { status, type, min, max } = req.query;
        //assign min and max as int
        let maxRev, minRev;
        if (max === typeof 'string') {
            maxRev = parseInt(max);
        }
        else {
            maxRev = 1000000;
        }
        if (min === typeof 'string') {
            minRev = parseInt(min);
        }
        else {
            minRev = 0;
        }
        //build query with revenue range
        const query = {
            revenue: { $lte: maxRev, $gte: minRev },
            status,
            type,
        };
        const jobs = await Job.find(query).sort({ _id: -1 }).populate('client');
        res.render('users/user_jobs', { jobs });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
};
export async function userLogout(req, res, next) {
    req.logout((e) => {
        if (e)
            return next(e);
    });
    req.flash('success', 'logged out');
    res.redirect('/login');
}
// @route     GET /register
// @desc      Display Register page
// @access    Public
export const getRegisterView = (req, res) => {
    res.render('accounts/register');
};
// @route     POST /register
// @desc      Create a new User/Account
// @access    Public
export const registerUser = async (req, res, next) => {
    try {
        let errors = [];
        const { account, user } = req.body;
        //check for empty fields missed on client side
        if (emptyField(account) || emptyField(user)) {
            errors.push({ msg: 'Please enter all fields' });
        }
        //check if username exists
        const existingUser = await User.exists({ username: user.username });
        if (existingUser) {
            errors.push({ msg: 'Username already exists' });
        }
        if (errors.length > 0) {
            res.render('accounts/register', { errors, account, user });
        }
        else {
            //initial registration checks
            const hashedPassword = await hash(user.password, 10);
            user.password = hashedPassword;
            //create new account
            const newAccount = new Account(account);
            const newUser = new User(user);
            //create new user and add user to account
            newAccount.users.push(newUser);
            await newAccount.save();
            newUser.account = newAccount;
            newUser.save();
            //populate demo account with clients
            // if (newAccount.name === 'Demo') {
            //   await populateDb(newAccount, newUser);
            // }
            req.login(newUser, () => {
                res.redirect('/dashboard');
            });
        }
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};
const emptyField = (obj) => {
    return Object.values(obj).some((property) => property === null || property === '');
};
