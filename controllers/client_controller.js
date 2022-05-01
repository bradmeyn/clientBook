const Client = require('../models/client_model');
const Account = require('../models/account_model');
const Note = require('../models/note_model');

//Display all clients
module.exports.client_index = async (req, res) => {
  //show all clients associated with logged in users account
  const account = req.user.account;
  const resultCount = await Client.find({ account }).countDocuments();

  const resultsPerPage = 5;

  const pageCount = Math.ceil(resultCount / resultsPerPage);

  //current page
  let page = req.query.page ? Number(req.query.page) : 1;
  console.log(req.query.page);

  if (page > pageCount) {
    //redirect to last
    res.redirect('/?page=' + encodeURIComponent(pageCount));
  } else if (page < 1) {
    //redirect to first
    res.redirect('/?page=' + encodeURIComponent('1'));
  }
  //Limit starting number
  const startLimit = (page - 1) * resultsPerPage;

  //ge the relevant number of posts
  const clients = await Client.find({ account })
    .skip(startLimit)
    .limit(resultsPerPage);

  res.render('clients/client_index', { clients, pageCount, page });
};

//Handle client create on POST
module.exports.client_create_post = async (req, res) => {
  try {
    const client = req.body.client;
    client.dob = new Date(client.dob);
    client.account = req.user.account;
    client.clientId = Date.now();

    const newClient = new Client(client);

    req.flash('success', 'A new client has been created');
    await newClient.save();
    res.redirect(`clients`);
  } catch (e) {
    console.log(e);
    res.redirect('back');
  }
};

//Display new client form
module.exports.client_create_get = (req, res) => {
  res.render('clients/client_new');
};

//Display single client
module.exports.client_dashboard_get = async (req, res) => {
  const id = req.params.clientId;
  const account = req.user.account;
  const c = await Client.findOne({ _id: id, account })
    .populate({
      path: 'notes',
      options: { sort: { _id: -1 }, limit: 3 },
      populate: {
        path: 'author',
      },
    })
    .populate({
      path: 'jobs',
      sort: { _id: -1 },
      match: { status: { $ne: 'Completed' } },
      populate: {
        path: 'owners',
      },
    })
    .populate({
      path: 'relationship.partner',
    });

  if (!c) {
    console.log('nothing found');
    req.flash('error', 'Cannot find that client');
    return res.redirect('/clients');
  }

  res.render('clients/client_dashboard', { c, page: 'notes' });
};

//Display single client
module.exports.client_details_get = async (req, res) => {
  const id = req.params.clientId;
  const account = req.user.account;
  const c = await Client.findOne({ _id: id, account });

  if (!c) {
    console.log('nothing found');
    req.flash('error', 'Cannot find that client');
    return res.redirect('/clients');
  }
  //calculate age

  res.render('clients/client_show', { c, page: 'notes' });
};

//Handle client deletion
module.exports.client_delete = async (req, res) => {
  const id = req.params.clientId;
  const account = req.user.account;
  const client = await Client.findOneAndDelete({ _id: id, account });
  req.flash('success', `${client.firstName} ${client.lastName} deleted`);
  res.redirect('/clients');
};

//Display client update form on GET
module.exports.client_update_get = async (req, res) => {
  const id = req.params.clientId;
  const c = await Client.findById(id);
  if (!c) {
    console.log('nothing found');
    req.flash('error', 'Cannot find that client');
    return res.redirect('/clients');
  }
  res.render('clients/client_update', { c });
};

//Handle client update on PUT
module.exports.client_update_put = async (req, res) => {
  try {
    const id = req.params.clientId;
    const client = req.body.client;
    client.dob = new Date(client.dob);

    console.log(client);
    const account = req.user.account;
    await Client.findOneAndUpdate({ _id: id, account }, { ...client });
    req.flash('success', 'Details updated.');
    res.redirect(`${id}`);
  } catch (error) {
    console.log(error);
    res.redirect('back');
  }
};

//Display all notes associated with client
module.exports.client_notes_get = async (req, res, next) => {
  try {
    const id = req.params.clientId;
    const account = req.user.account;

    const c = await Client.findOne({ _id: id, account })
      .populate({
        path: 'notes',
        populate: {
          path: 'author',
        },
      })
      .populate('author');

    res.render('clients/notes/client_note_index', { c, page: 'notes' });
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/');
  }
};

//Create new note associated with client
module.exports.client_notes_post = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId);
    const note = new Note(req.body.note);

    note.date = new Date();
    note.author = req.user;
    note.account = req.user.account;
    client.notes.push(note);
    await note.save();
    await client.save();

    res.redirect(`/clients/${client._id}/notes`);
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect(`/clients/${client._id}/notes`);
  }
};

//Handle search
module.exports.client_search = async (req, res) => {
  const query = req.body.query;
  const account = req.user.account;
  console.log(query);

  let clients = await Client.aggregate([
    {
      $project: {
        fullName: { $concat: ['$firstName', ' ', '$lastName'] },
        clientId: 1,
        account: 1,
      },
    },
    {
      $match: {
        $and: [
          {
            $or: [
              { fullName: { $regex: query, $options: 'i' } },
              { clientId: { $regex: query, $options: 'i' } },
            ],
          },
          {
            account: account,
          },
        ],
      },
    },
  ])
    .limit(10)
    .exec();

  res.send(clients);
};
