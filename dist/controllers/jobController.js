import Client from '../models/clientModel.js';
import Note from '../models/noteModel.js';
import Job from '../models/jobModel.js';
// @route     POST clients/:clientId/jobs
// @desc      Create a new job
// @access    Private
export const createJob = async (req, res) => {
    try {
        const { clientId } = req.params;
        const job = req.body.job;
        console.log(req.user);
        const account = req.user?.account;
        const client = await Client.findById(clientId);
        if (client) {
            //if job value is null assign as 0
            !job.revenue ? (job.revenue = 0) : job.revenue;
            //attach created data and covert due value to date format
            job.created = new Date();
            job.due = new Date(job.due);
            job.client = client;
            //attach creator, owner, client and account to a job
            job.creator = job.owner = req.user;
            job.account = account;
            job.client = clientId;
            //create job and push it to the clients jobs
            const newJob = new Job(job);
            client.jobs.push(newJob);
            await newJob.save();
            await client.save();
            res.redirect(`/clients/${clientId}`);
        }
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};
// @route     GET /clients/:clientId/jobs
// @desc      Display all jobs for client
// @access    Private
export const getJobs = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const account = req.user?.account;
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
        // //add status and type filters to query if they exist
        // if (status) query.status = status;
        // if (type) query.type = type;
        // find client and any matching jobs
        const c = await Client.findOne({ _id: clientId, account })
            .populate({
            path: 'jobs',
            match: query,
            populate: {
                path: 'owner',
            },
        })
            .populate('owner');
        res.render('jobs/job_index', {
            c,
            page: 'jobs',
        });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};
// @route     GET /clients/:clientId/jobs/new
// @desc      Display new job form
// @access    Private
export const createJobView = async (req, res) => {
    try {
        const { clientId } = req.params;
        const account = req.user?.account;
        //find client for subnav bar
        const c = await Client.findOne({ _id: clientId, account });
        res.render('jobs/job_new', { c, page: '' });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};
// @route     GET /clients/:clientId/jobs/:jobId
// @desc      Display single job
// @access    Private
export const getJob = async (req, res) => {
    try {
        const { clientId, jobId } = req.params;
        const account = req.user?.account;
        const c = await Client.findOne({ _id: clientId, account });
        const job = await Job.findOne({ _id: jobId, account })
            .populate({
            path: 'notes',
            populate: {
                path: 'author',
            },
        })
            .populate('owner');
        res.render('jobs/job_show', { c, job, page: '' });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/');
    }
};
// @route     GET /clients/:clientId/jobs/:jobId/update
// @desc      Display view for update job form
// @access    Private
export const updateJobView = async (req, res) => {
    try {
        const { clientId, jobId } = req.params;
        const account = req.user?.account;
        const c = await Client.findOne({ _id: clientId, account });
        const job = await Job.findOne({ _id: jobId, account });
        res.render('jobs/job_update', { c, job, page: '' });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/');
    }
};
// @route     PUT /clients/:clientId/jobs/:jobId
// @desc      Update job details
// @access    Private
export const updateJob = async (req, res) => {
    try {
        const { clientId, jobId } = req.params;
        const account = req.user?.account;
        const { job } = req.body;
        job.due = new Date(job.due);
        await Job.findOneAndUpdate({ _id: jobId, account }, { ...job });
        res.redirect(`/clients/${clientId}/jobs/${jobId}`);
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/');
    }
};
// @route     PUT /clients/:clientId/jobs/:jobId
// @desc      Update job related note
// @access    Private
export const createJobNote = async (req, res) => {
    try {
        const { clientId, jobId } = req.params;
        const account = req.user?.account;
        //find the client and job
        const job = await Job.findOne({ _id: jobId, account });
        const c = await Client.findOne({ _id: clientId, account });
        if (job && c) {
            //create the new note
            const note = new Note({
                account: account,
                title: `Job Update: ${job.title}`,
                category: 'Update',
                date: new Date(),
                detail: req.body.job.note,
                author: req.user,
                client: c,
                job: jobId,
            });
            //add the note to the client and the job
            c.notes.push(note);
            job.notes.push(note);
            await note.save();
            await job.save();
            await c.save();
            res.redirect(`/clients/${clientId}/jobs/${jobId}`);
        }
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/');
    }
};
