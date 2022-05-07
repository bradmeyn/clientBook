const Account = require('../models/account_model');
const User = require('../models/user_model');
const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');
const { collection } = require('../models/user_model');

//Display user login form on GET
module.exports.user_login_get = (req, res) => {
  res.render('users/login');
};

//Handle user login on POST
module.exports.user_login_post = (req, res) => {
  try {
    //login after succussfully being authenticated
    res.redirect('/dashboard');
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//Display user dashboard
module.exports.user_dashboard_get = async (req, res) => {
  try {
    const user = req.user.firstName;
    const account = req.user.account;
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
          return Math.round(
            ((this.revenue.year - this.revenue.lastYear) /
              this.revenue.lastYear) *
              100
          );
        },
        monthGain() {
          return Math.round(
            ((this.revenue.month - this.revenue.lastMonth) /
              this.revenue.lastMonth) *
              100
          );
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

            if (
              job.completed.getFullYear() === currentYear &&
              job.completed.getMonth() === currentMonth
            ) {
              completed.revenue.month += job.revenue;
              completed.count.month++;
            }

            if (job.completed.getFullYear() === currentYear - 1) {
              revLastYear[job.completed.getMonth()] += job.revenue;
              completed.revenue.lastYear += job.revenue;
            }

            if (
              job.completed.getFullYear() === currentYear &&
              job.completed.getMonth() === currentMonth - 1
            ) {
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
    } else {
      res.render('clients/client_first', {
        user,
      });
    }
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

module.exports.user_notes_get = async (req, res) => {
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
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

module.exports.user_jobs_get = async (req, res) => {
  try {
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
      account: account,
      revenue: { $lte: max, $gte: min },
    };

    if (status) query.status = status;
    if (type) query.type = type;

    const jobs = await Job.find(query).sort({ _id: -1 }).populate('client');

    res.render('users/user_jobs', { jobs });
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

module.exports.user_logout = async (req, res) => {
  // if (req.user.firstName === 'Brad') {
  //   req.logout();
  //   console.log('Deleting');
  //   await Client.collection.drop();
  //   await Job, collection.drop();
  //   await Note.collection.drop();
  //   await User.collection.drop();
  //   await Account.collection.drop();
  // }
  req.logout();

  res.redirect('/login');
};
