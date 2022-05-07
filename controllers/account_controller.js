const Account = require('../models/account_model');
const User = require('../models/user_model');
const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');

//Display account registor form on GET
module.exports.account_register_get = async (req, res) => {
  res.render('accounts/register');
};

//Handle user creation on POST
module.exports.account_register_post = async (req, res, next) => {
  try {
    const user = req.body.user;
    const { password } = user;
    const account = new Account(req.body.account);
    const newUser = new User(user);
    account.users.push(newUser);
    newUser.account = account;
    await account.save();

    const registeredUser = await User.register(newUser, password);

    await req.login(registeredUser, (err) => {
      if (err) return next(err);
    });

    if (account.name === 'Demo') populateDb();
    res.redirect('/dashboard');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

let populateDb = async () => {
  console.log('Demo account login, populating database');

  await Client.deleteMany();
  await Note.deleteMany();
  await Job.deleteMany();

  const homer = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Homer',
    lastName: 'Simpson',
    preferredName: 'Homer',
    dob: new Date(1982, 0, 20),
    jobTitle: 'Nuclear Technician',
    company: 'Springfield Power Plant',
    email: 'homer@gmail.com',
    phone: '5558707',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
  });

  await homer.save();

  const homerNote = new Note({
    account,
    author: req.user,
    client: homer,
    title: 'Mr Plow Website',
    date: new Date(2021, 1, 1),
    detail:
      'Received an email from Mr Simpson requesting a website for his new snow plow business. The email trailed off finishing with "screw flanders" repeatedly',
    category: 'Email',
  });

  homerNote.save();
  homer.notes.push(homerNote);

  const plow = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: homer,
    type: 'New',
    revenue: 5000,
    created: new Date(2020, 0, 10),
    due: new Date(2021, 0, 30),
    completed: new Date(2021, 6, 1),
    title: 'Mr Plow website',
    description: 'New website for Mr Simpsons plow business "Mr Plow"',
    status: 'In Progress',
  });

  plow.save();
  homer.jobs.push(plow);

  const mrX = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: homer,
    type: 'Update',
    revenue: 3000,
    created: new Date(),
    due: new Date(2023, 7, 30),
    title: 'Website for Mr X',
    description:
      'Mr Simpson wants a new website for local gossip coming from the person he called "Mr X" that he insisted was not him.',
    status: 'In Progress',
  });

  mrX.save();
  homer.jobs.push(mrX);

  homer.save();

  const marge = new Client({
    account,
    clientId: Date.now(),
    title: 'Mrs',
    firstName: 'Marge',
    lastName: 'Simpson',
    dob: new Date(1985, 1, 10),
    email: 'marge@gmail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412456687',
  });

  await marge.save();

  const skinner = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Seymour',
    lastName: 'Skinner',
    preferredName: 'Seymour',
    jobTitle: 'Principal',
    company: 'Springfield Elementary School',
    dob: new Date(1975, 2, 10),
    email: 'armin@gmail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412448687',
  });

  await skinner.save();

  const hams = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: skinner,
    type: 'New',
    revenue: 8000,
    created: new Date(2021, 10, 5),
    due: new Date(2022, 7, 30),
    completed: new Date(),
    title: 'Website for Steamed Hams',
    description:
      'Principal Skinner would like a site that will allow him to start selling his steamed clams and/or hams.',
    status: 'Completed',
  });

  hams.save();
  skinner.jobs.push(hams);

  const apu = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Apu',
    lastName: 'Nahasapeemapetilon',
    preferredName: 'Apu',
    jobTitle: 'Owner',
    company: 'Kwik-E-Mart',
    dob: new Date(1980, 3, 20),
    email: 'apu@gmail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412445687',
  });

  await apu.save();

  const apuNote = new Note({
    account,
    author: req.user,
    client: apu,
    title: 'Kwik-E-Mart Website',
    date: new Date(2021, 10, 23),
    detail:
      'Email Apu to get his throughts on the new design for the Kwik-e-mart website',
    category: 'Email',
  });

  apuNote.save();
  apu.notes.push(apuNote);

  const kwik = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: apu,
    type: 'New',
    revenue: 2000,
    created: new Date(2022, 2, 4),
    due: new Date(2022, 9, 30),
    title: 'Kwik-E-Mart Online store',
    description:
      'New online store for Kwik-E-Mart. Slogan: "Who loves the Kwik-E-Mart..I Doooooooo',
    status: 'Not Started',
  });

  kwik.save();
  apu.jobs.push(kwik);

  apu.save();

  const wiggum = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Clancy',
    lastName: 'Wiggum',
    preferredName: 'Chief',
    jobTitle: 'Police Chief',
    company: 'Springfield Police Dep',
    dob: new Date(1978, 4, 12),
    email: 'chief@gmail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412445687',
  });

  await wiggum.save();

  const flanders = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Nedward',
    preferredName: 'Ned',
    lastName: 'Flanders',
    jobTitle: 'Owner',
    company: 'Leftorium',
    dob: new Date(1979, 5, 25),
    email: 'purpledrapes@mail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412445687',
  });

  await flanders.save();

  for (let i = 0; i < 12; i++) {
    let job = new Job({
      account,
      creator: req.user,
      owner: req.user,
      client: flanders,
      type: 'Other',
      revenue: Math.floor(Math.random() * 11 * 1000),
      created: new Date(2021, i, 1),
      due: new Date(2021, i, 1),
      completed: new Date(2021, i, 1),
      title: 'Leftorium Update',
      description: 'Leftorium site maintenance',
      status: 'Completed',
    });

    await job.save();
    flanders.jobs.push(job);
    await flanders.save();
  }

  for (let i = 0; i < 5; i++) {
    let job = new Job({
      account,
      creator: req.user,
      owner: req.user,
      client: flanders,
      type: 'Other',
      revenue: Math.floor(Math.random() * 11 * 1000),
      created: new Date(2022, i, 1),
      due: new Date(2022, i, 1),
      completed: new Date(2022, i, 1),
      title: 'Leftorium Update',
      description: 'Leftorium site maintenance',
      status: 'Completed',
    });

    await job.save();
    flanders.jobs.push(job);
    await flanders.save();
  }

  const flandersNote = new Note({
    account,
    author: req.user,
    client: flanders,
    title: 'Leftorium Online Store',
    date: new Date(2021, 11, 20),
    detail:
      'Spoke to Ned Flanders over the phone about building an online store for his business',
    category: 'Phone Call',
  });

  flandersNote.save();
  flanders.notes.push(flandersNote);

  flanders.save();

  const burns = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Charles',
    preferredName: 'Monty',
    lastName: 'Burns',
    jobTitle: 'Owner',
    company: 'Springfield Nuclear Power Plant',
    dob: new Date(1925, 6, 1),
    email: 'smithers@mail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0000000000',
  });

  await burns.save();

  const vest = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: burns,
    type: 'New',
    revenue: 5000,
    created: new Date(2022, 3, 10),
    due: new Date(2022, 7, 30),
    title: 'Puppy Donation Site',
    description:
      'Mr Burns wants to create a new website to adopt unwanted puppies. Broke out into a song about vests, not sure how it relates...',
    status: 'On Hold',
  });

  vest.save();
  burns.jobs.push(vest);

  const burnsNote1 = new Note({
    account,
    author: req.user,
    client: burns,
    title: 'Request for Payment',
    date: new Date(2022, 3, 1),
    detail:
      'Spoke to Mr Burns assistant to follow up on payment of an overdue invoice. Smithers said they arent going to pay because they dont want to.',
    category: 'Phone Call',
  });

  vest.notes.push(burnsNote1);

  burnsNote1.save();
  burns.notes.push(burnsNote1);

  const burnsNote2 = new Note({
    account,
    author: req.user,
    client: burns,
    title: '2nd payment follow up',
    date: new Date(2022, 3, 20),
    detail: 'Emailed Mr burns again about payment follow up.',
    category: 'Email',
  });

  burnsNote2.save();
  burns.notes.push(burnsNote2);

  vest.notes.push(burnsNote2);

  const burnsNote3 = new Note({
    account,
    author: req.user,
    client: burns,
    title: 'Hounds Released, Bill Cancelled',
    date: new Date(),
    detail:
      'Met with Mr Burns regarding overdue invoice. He released the hounds on me. Will stop chasing funds.',
    category: 'Meeting',
  });

  burnsNote3.save();
  burns.notes.push(burnsNote3);
  vest.notes.push(burnsNote3);
  burns.save();

  const krusty = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Herschel',
    preferredName: 'Krusty',
    lastName: 'Krustofsky',
    jobTitle: 'Clown',
    company: 'Channel 6',
    dob: new Date(1979, 7, 27),
    email: 'krusty@mail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412445687',
  });

  const krustyNote = new Note({
    account,
    author: req.user,
    client: krusty,
    title: 'Stingy and Battery Game',
    date: new Date(2021, 11, 20),
    detail:
      'Krusty would like help building a iPhone game for his Stingy and Battery show. Did not really have any plans, just said "they bite and light and bite and light and bite! Bite bite bite, light light light...yadda yadda yadda"',
    category: 'Meeting',
  });

  krustyNote.save();
  krusty.notes.push(krustyNote);

  await krusty.save();

  const moe = new Client({
    account,
    clientId: Date.now(),
    title: 'Mr',
    firstName: 'Moammar',
    preferredName: 'Moe',
    lastName: 'Szyslak',
    jobTitle: 'Bartender',
    company: 'Moes Tavern',
    dob: new Date(1981, 8, 10),
    email: 'kidugly@mail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412445687',
  });

  await moe.save();

  const flaming = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: moe,
    type: 'New',
    revenue: 1000,
    created: new Date(2021, 1, 10),
    completed: new Date(2021, 1, 30),
    due: new Date(2021, 7, 30),
    title: 'Flaming Moes Site',
    description: 'New website for Moes Tavern',
    status: 'Completed',
  });

  await flaming.save();

  moe.jobs.push(flaming);

  const uncle = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: moe,
    type: 'Update',
    revenue: 4200,
    created: new Date(2022, 3, 11),
    due: new Date(2023, 0, 24),
    title: 'Uncle Moes Family Feedbag',
    description: 'Update website for Moes Tavern to a new family restaurant',
    status: 'Finalising',
  });

  await uncle.save();

  moe.jobs.push(uncle);

  await moe.save();

  const moeNote = new Note({
    account,
    author: req.user,
    client: moe,
    title: 'Flamin Moes Website',
    date: new Date(2021, 11, 20),
    detail:
      'Moe would like a new website for his bar re-brand to "flaming Moes',
    category: 'Meeting',
  });

  moeNote.save();
  moe.notes.push(moeNote);

  await moe.save();

  const edna = new Client({
    account,
    clientId: Date.now(),
    title: 'Mrs',
    firstName: 'Edna',
    lastName: 'Krabappel',
    jobTitle: 'Teacher',
    company: 'Springfield Elementary',
    dob: new Date(1980, 9, 4),
    email: 'krabappel@mail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412445687',
  });

  await edna.save();

  const patty = new Client({
    account,
    clientId: Date.now(),
    title: 'Miss',
    firstName: 'Patricia',
    preferredName: 'Patty',
    lastName: 'Bouvier',
    jobTitle: 'Service assistant',
    company: 'Department of Motor Vehicles',
    dob: new Date(1951, 10, 4),
    email: 'pattyb@mail.com',
    address: {
      street: '742 Evergreen Terrace',
      suburb: 'Springfield',
      state: 'NSW',
      postcode: '2305',
    },
    phone: '0412445687',
  });

  await patty.save();

  const fan = new Job({
    account,
    creator: req.user,
    owner: req.user,
    client: patty,
    type: 'New',
    revenue: 3500,
    created: new Date(2021, 11, 11),
    due: new Date(2022, 1, 24),
    completed: new Date(2022, 1, 24),
    title: 'Macgyver fan site',
    description:
      'Patty and her sister Selma would like to create a fansite dedicated to Macgyver',
    status: 'Completed',
  });

  await fan.save();

  patty.jobs.push(fan);

  await patty.save();
};
