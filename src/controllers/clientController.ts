import { NextFunction, Request, Response } from 'express';
import Client from '../models/clientModel.js';
import Note from '../models/noteModel.js';

// @route     GET /clients
// @desc      Index page for clients
// @access    Private
export const getClients = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const account = req.user.account;
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
        const clients: any = [];
        res.render('clients/client_index', { clients });
      }
    }
  } catch (e: any) {
    req.flash('error', e.message);
    res.redirect('back');
  }
};

// @route     POST /clients
// @desc      Create new client
// @access    Private
export const createClient = async (req: Request, res: Response) => {
  try {
    const { client } = req.body;

    //convert form dob into date format
    client.dob = new Date(client.dob);

    if (req.user) {
      //attach client to current users associated account
      client.account = req.user.account;
    }

    //create a public facing client id
    client.clientId = Date.now();

    const newClient = new Client(client);

    await newClient.save();
    req.flash('success', 'A new client has been created');
    res.redirect(`/clients/${newClient._id}`);
  } catch (e: any) {
    req.flash('error', e.message);
    res.redirect('back');
  }
};

// @route     GET /clients/new
// @desc      Display create client form
// @access    Private
export const createClientView = (req: Request, res: Response) => {
  res.render('clients/client_new');
};

// @route     GET /clients/:id
// @desc      Display single client
// @access    Private
export const getClient = async (req: Request, res: Response) => {
  if (req.user) {
    const { account } = req.user;

    const { clientId } = req.params;

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
  }
};

// @route     DELETE /clients/:id
// @desc      Delete a single client
// @access    Private
export const deleteClient = async (req: Request, res: Response) => {
  const { clientId } = req.params;

  if (req.user) {
    const { account } = req.user;

    //delete client with id & account
    const client = await Client.findOneAndDelete({ _id: clientId, account });
    if (client) {
      req.flash('success', `${client.firstName} ${client.lastName} deleted`);
      res.redirect('/clients');
    } else {
      res.status(400);
    }
  }
};

// @route     GET /clients/:clientId/update
// @desc      Display edit client view
// @access    Private
export const updateClientView = async (req: Request, res: Response) => {
  const { clientId } = req.params;

  const c = await Client.findById(clientId);
  if (!c) {
    req.flash('error', 'Cannot find that client');
    res.redirect('/clients');
  } else {
    res.render('clients/client_update', { c, page: '' });
  }
};

// @route     PUT /clients/:clientId
// @desc      Update client information
// @access    Private
export const updateClient = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const { clientId } = req.params;
      const { account } = req.user;
      const { client } = req.body;
      client.dob = new Date(client.dob);
      await Client.findOneAndUpdate({ _id: clientId, account }, { ...client });
      req.flash('success', 'Details updated.');
      res.redirect(`/clients/${clientId}`);
    }
  } catch (e: any) {
    req.flash('error', e.message);
    res.redirect('back');
  }
};
// @route     POST /clients/:clientId/notes
// @desc      Create a new note for a client
// @access    Private
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //search client
    const client = await Client.findById(req.params.clientId);

    if (client) {
      //create note
      const note = new Note(req.body.note);

      //attach current date, user and account to the note
      note.date = new Date();

      if (req.user) {
        note.author = req.user;
        note.account = req.user.account;
      }
      //add the note to client
      client.notes.push(note);
      await note.save();
      await client.save();

      res.redirect(`/clients/${client._id}/notes`);
    } else {
      res.status(400);
    }
  } catch (e: any) {
    req.flash('error', e.message);
    res.redirect('/clients');
  }
};

// @route     GET /clients/:clientId
// @desc      Search client in navbar
// @access    Private
export const searchClient = async (req: Request, res: Response) => {
  if (req.user) {
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
  }
};
