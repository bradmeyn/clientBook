const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');

//POST route for creating a new job
module.exports.job_create_post = async (req, res, next) => {
  try {
    const { job } = req.body;
    const { clientId } = req.params;
    const { account } = req.user;

    const client = await Client.findById(clientId);

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
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//Display all jobs associated with client
module.exports.job_index_get = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { account } = req.user;

    //destructure filter values
    let { status, type, min, max } = req.query;

    //assign min and max as int
    if (max) {
      max = parseInt(max);
    } else {
      max = 1000000;
    }

    if (min) {
      min = parseInt(min);
    } else {
      min = 0;
    }

    //build query with revenue range
    const query = {
      revenue: { $lte: max, $gte: min },
    };

    //add status and type filters to query if they exist
    if (status) query.status = status;
    if (type) query.type = type;

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
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//GET request to display the create job form
module.exports.job_create_get = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { account } = req.user;

    //find client for subnav bar
    const c = await Client.findOne({ _id: clientId, account });
    res.render('jobs/job_new', { c, page: '' });
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//GET request for single job page
module.exports.job_show = async (req, res, next) => {
  try {
    const { clientId, jobId } = req.params;
    const { account } = req.user;
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
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

//GET request for job update form
module.exports.job_update_get = async (req, res, next) => {
  try {
    const { clientId, jobId } = req.params;
    const { account } = req.user;
    const c = await Client.findOne({ _id: clientId, account });
    const job = await Job.findOne({ _id: jobId, account });
    res.render('jobs/job_update', { c, job, page: '' });
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

//PUT request to update a client
module.exports.job_update_put = async (req, res) => {
  try {
    const { clientId, jobId } = req.params;
    const { account } = req.user;
    const { job } = req.body;
    job.due = new Date(job.due);
    await Job.findOneAndUpdate({ _id: jobId, account }, { ...job });
    res.redirect(`/clients/${clientId}/jobs/${jobId}`);
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

//POST for job-related notes
module.exports.job_note_post = async (req, res) => {
  try {
    const { clientId, jobId } = req.params;
    const { account } = req.user;

    //find the client and job
    const job = await Job.findOne({ _id: jobId, account });
    const c = await Client.findOne({ _id: clientId, account });

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
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};
