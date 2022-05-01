const Account = require('../models/account_model');
const User = require('../models/user_model');
const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');

//Display user login form on GET
module.exports.user_login_get = (req, res) => {
  //test client

  res.render('users/login');
};

//Handle user login on POST
module.exports.user_login_post = async (req, res) => {
  req.flash('success', 'Welcome back ' + req.user.firstName);
  res.redirect('/dashboard');
};

//Display user dashboard
module.exports.user_dashboard_get = async (req, res) => {
  await Client.deleteMany({});
  await Note.deleteMany({});
  await Job.deleteMany({});
  const acc = req.user.account;

  const clientOne = new Client({
    account: acc,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Bradley',
    lastName: 'Meyn',
    preferredName: 'Brad',
    dob: new Date(1993, 4, 20),
    jobTitle: 'Junior Developer',
    company: 'Google',
    email: 'bradjmeyn@gmail.com',
    address: {
      street: '205 Kings Road',
      suburb: 'New Lambton',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0413235647',
  });

  await clientOne.save();

  const clientTwo = new Client({
    account: acc,
    clientId: '123456789101112',
    title: 'Miss',
    firstName: 'Emily',
    lastName: 'Byram',
    preferredName: 'Emily',
    dob: new Date(1990, 5, 10),
    jobTitle: 'Science Teacher',
    company: 'Maitland High School',
    email: 'eebyram@gmail.com',
    address: {
      street: '205 Kings Road',
      suburb: 'New Lambton',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0431558814',
  });

  await clientOne.save();
  await clientTwo.save();

  const nOne = {
    account: acc,
    title: 'Test Note',
    category: 'Phone call',
    date: new Date(),
    detail: "Called Brad to catch up and see how he's going",
    author: req.user,
    client: clientOne,
  };

  const noteOne = new Note(nOne);
  noteOne.save();
  clientOne.notes.push(noteOne);

  const nTwo = {
    account: acc,
    title: 'Note 2',
    category: 'Email',
    date: new Date(),
    detail: 'Sent Brad an email with the updated contract',
    author: req.user,
    client: clientOne,
  };

  const noteTwo = new Note(nTwo);
  noteTwo.save();
  clientOne.notes.push(noteTwo);

  const jOne = {
    account: acc,
    title: 'New Website',
    type: 'New',
    revenue: 2000,
    description: 'New website for personal training business',
    created: new Date(2022, 2, 10),
    completed: new Date(2022, 5, 14),
    status: 'Completed',
    creator: req.user,
    owner: req.user,
    client: clientOne,
  };

  const jobOne = new Job(jOne);
  jobOne.notes.push(noteOne);
  jobOne.save();
  clientOne.jobs.push(jobOne);

  const jTwo = {
    account: acc,
    title: 'Update existing website',
    type: 'Update',
    revenue: 1500,
    description: 'Update to takeaway Thai restaurants current website',
    created: new Date(2022, 4, 25),
    due: new Date(2022, 7, 14),
    status: 'In Progress',
    creator: req.user,
    owner: req.user,
    client: clientOne,
  };

  const jobTwo = new Job(jTwo);

  jobTwo.save();
  clientOne.jobs.push(jobTwo);

  const jThree = {
    account: acc,
    title: 'New eCommerce site',
    type: 'New',
    revenue: 7500,
    description: 'New online store for the a cafe',
    created: new Date(),
    due: new Date(2022, 11, 25),
    status: 'Not Started',
    creator: req.user,
    owner: req.user,
    client: clientOne,
  };

  const jobThree = new Job(jThree);

  jobThree.save();
  clientOne.jobs.push(jobThree);

  const jFour = {
    account: acc,
    title: 'Rework site',
    type: 'Other',
    revenue: 0,
    description:
      'Client wasnt happy with the colour scheme for the existing website, so we are reworking with new palettes.',
    created: new Date(),
    due: new Date(2022, 9, 10),
    status: 'On Hold',
    creator: req.user,
    owner: req.user,
    client: clientOne,
  };

  const jobFour = new Job(jFour);

  jobFour.save();
  clientOne.jobs.push(jobFour);

  await clientOne.save();

  try {
    const user = req.user.firstName;
    const account = req.user.account;
    const jobs = await Job.find({ account }).populate('client');
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
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

module.exports.user_notes_get = async (req, res) => {
  try {
    const account = req.user.account;
    const notes = await Note.find({ account, author: req.user }).populate(
      'client'
    );

    res.render('users/user_notes', { notes, page: 'notes' });
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

    const jobs = await Job.find(query).populate('client');

    res.render('users/user_jobs', { jobs });
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

module.exports.user_logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};
