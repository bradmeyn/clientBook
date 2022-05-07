const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');

//Handle user creation on POST
module.exports.job_create_post = async (req, res, next) => {
  try {
    const job = req.body.job;
    const client = await Client.findById(req.params.clientId);

    !job.revenue ? (job.revenue = 0) : job.revenue;
    job.created = new Date();
    job.due = new Date(job.due);
    job.client = client;
    job.creator, (job.owner = req.user);
    job.account = req.user.account;
    job.client = req.params.clientId;
    const newJob = new Job(job);
    client.jobs.push(newJob);

    await newJob.save();
    await client.save();
    res.redirect(`/clients/${req.params.clientId}`);
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//Display all jobs associated with client
module.exports.job_index_get = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const account = req.user.account;

    let { status, type, min, max } = req.query;
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

    const query = {
      revenue: { $lte: max, $gte: min },
    };

    if (status) query.status = status;
    if (type) query.type = type;

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

module.exports.job_create_get = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const account = req.user.account;
    const c = await Client.findOne({ _id: clientId, account });

    res.render('jobs/job_new', { c, page: '' });
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

module.exports.job_show = async (req, res, next) => {
  try {
    const { clientId, jobId } = req.params;
    const account = req.user.account;
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

module.exports.job_update_get = async (req, res, next) => {
  try {
    const { clientId, jobId } = req.params;
    const account = req.user.account;
    const c = await Client.findOne({ _id: clientId, account });
    const job = await Job.findOne({ _id: jobId, account });
    res.render('jobs/job_update', { c, job, page: '' });
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

module.exports.job_update_put = async (req, res) => {
  try {
    const { clientId, jobId } = req.params;
    const account = req.user.account;
    if (req.body.job.update) {
      const job = await Job.findOne({ _id: jobId, account });
      const c = await Client.findOne({ _id: clientId, account });
      const note = new Note({
        account: account,
        title: `Job Update: ${job.title}`,
        category: 'Job Update',
        date: new Date(),
        detail: req.body.job.update,
        author: req.user,
        job: jobId,
      });

      c.notes.push(note);
      job.notes.push(note);
      await note.save();
      await job.save();
      await c.save();

      res.redirect('back');
    } else {
      const job = req.body.job;

      job.due = new Date(job.due);

      await Job.findOneAndUpdate({ _id: jobId, account }, { ...job });

      res.redirect(`/clients/${clientId}/jobs/${jobId}`);
    }
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};
