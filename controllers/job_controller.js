const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');


//Handle user creation on POST
module.exports.job_create_post = async (req, res, next) => {

    try {
     
        const client = await Client.findById(req.params.clientId);
        const job = new Job(req.body.job);
        job.dates.created = new Date();
        job.client = client;
        job.creator = req.user;
        job.account = req.user.account;
        client.jobs.push(job);
        console.log(job);

        // await job.save(() => {
        //     console.log('new job: ', job);
        // });
        // await client.save(()=> {
        //     console.log('client saved: ', client);
        // });
        res.redirect(`/clients/${req.params.clientId}`);

    } catch(e) {
        req.flash('error', e.message);
        res.redirect('back');
    }
}

//Display all jobs associated with client
module.exports.job_index_get = async (req, res, next) => {

    try {
        const clientId = req.params.clientId;
        const account = req.user.account;
        const c = await Client.findOne({ _id:clientId, account}).populate({
            path: 'jobs', 
            populate: {
            path: 'owner'
            }
            }).populate('owner');

            const activeJobs = [];
            const completedJobs = [];

            c.jobs.forEach(job => {
                job.status === 'In Progress' ? activeJobs.push(job) : completedJobs.push(job);
            });

        res.render('jobs/job_index',{c, page: 'jobs',completedJobs,activeJobs});
       
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('back');
    }
}

module.exports.job_create_get = async (req, res) => {

    try {
        const clientId = req.params.clientId;
        const account = req.user.account;
        const c = await Client.findOne({ _id:clientId, account});

        res.render('jobs/job_new', {c});
       
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('back');
    }
}





