const Client = require('../models/client_model');
const Note = require('../models/note_model');

//Display all clients (5 per page)
module.exports.client_index = async (req, res) => {
  try {
    const { account } = req.user;
    const resultCount = await Client.find({ account }).countDocuments();

    if (resultCount > 0) {
      const resultsPerPage = 5;
      const pageCount = Math.ceil(resultCount / resultsPerPage);
      //current page
      let page = req.query.page ? Number(req.query.page) : 1;

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
    } else {
      const clients = [];
      res.render('clients/client_index', { clients });
    }
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//Handle client create on POST
module.exports.client_create_post = async (req, res) => {
  try {
    const { client } = req.body;

    //convert form dob into date format
    client.dob = new Date(client.dob);

    //attach client to current users associated account
    client.account = req.user.account;

    //create a public facing client id
    client.clientId = Date.now();

    const newClient = new Client(client);

    await newClient.save();
    req.flash('success', 'A new client has been created');
    res.redirect(`/clients/${newClient._id}`);
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//Display new client form
module.exports.client_create_get = (req, res) => {
  res.render('clients/client_new');
};

//Display single client
module.exports.client_dashboard_get = async (req, res) => {
  const { clientId } = req.params;
  const { account } = req.user;

  //return client with id & account including notes & active jobs
  const c = await Client.findOne({ _id: clientId, account })
    .populate({
      path: 'notes',
      options: { sort: { _id: -1 }, limit: 5 },
      populate: {
        path: 'author',
      },
    })
    .populate({
      path: 'jobs',
      sort: { _id: -1 },
      match: { status: { $ne: 'Completed' } },
      populate: {
        path: 'owner',
      },
    });

  if (!c) {
    req.flash('error', 'Cannot find that client');
    res.redirect('/clients');
  } else {
    res.render('clients/client_dashboard', { c, page: 'client' });
  }
};

//Handle client deletion
module.exports.client_delete = async (req, res) => {
  const { clientId } = req.params;
  const { account } = req.user;

  //delete client with id & account
  const client = await Client.findOneAndDelete({ _id: clientId, account });
  req.flash('success', `${client.firstName} ${client.lastName} deleted`);
  res.redirect('/clients');
};

//Display client update form on GET
module.exports.client_update_get = async (req, res) => {
  const { clientId } = req.params;

  const c = await Client.findById(clientId);
  if (!c) {
    req.flash('error', 'Cannot find that client');
    res.redirect('/clients');
  } else {
    res.render('clients/client_update', { c, page: '' });
  }
};

//Handle client update on PUT
module.exports.client_update_put = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { account } = req.user;
    const { client } = req.body;
    client.dob = new Date(client.dob);
    await Client.findOneAndUpdate({ _id: clientId, account }, { ...client });
    req.flash('success', 'Details updated.');
    res.redirect(`/clients/${newClient._id}`);
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('back');
  }
};

//Create new note associated with client
module.exports.client_notes_post = async (req, res, next) => {
  try {
    //search client
    const client = await Client.findById(req.params.clientId);

    //create note
    const note = new Note(req.body.note);

    //attach current date, user and account to the note
    note.date = new Date();
    note.author = req.user;
    note.account = req.user.account;

    //add the note to client
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

//dedicated route for client search bar
module.exports.client_search = async (req, res) => {
  const { query } = req.body;
  const { account } = req.user;

  const clients = await Client.aggregate([
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
