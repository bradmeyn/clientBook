
const Client = require('../models/client_model');
const Account = require('../models/account_model');


//Display all clients
module.exports.client_index = async (req, res) => {
  //show all clients associated with logged in users account
    const account = req.user.account;
    const clients = await Client.find({account});
    res.render('clients/index', {clients});
}

//Handle client create on POST
module.exports.client_create_post = async (req, res) => {
    const client = req.body.client;
    client.dob.fullDate = `${client.dob.birthDay}/${client.dob.birthMonth}/${client.dob.birthYear}`;
    client.account = req.user.account;
    client.clientId = Date.now();
    const newClient = new Client(client);
    req.flash('success', 'A new client has been created' );
    await newClient.save()
    .then(client => res.redirect(`clients/${client._id}`));

}

//Display new client form
module.exports.client_create_get = (req, res) => {
    res.render('clients/new');
}

//Display single client
module.exports.client_show = async (req, res) => {
   
    const id = req.params.id;
    const account = req.user.account;
    const c = await Client.findOne({_id:id, account});
    if(!c){
      console.log('nothing found')
      req.flash('error', 'Cannot find that client');
      return res.redirect('/clients')
    }
    res.render("clients/show", {c});
}

//Handle client deletion
module.exports.client_delete = async (req, res) => {
    const id = req.params.id;
    await Client.findOneAndDelete({_id:id, account});
    res.redirect('/clients')
  }

//Display client update form on GET
module.exports.client_update_get = async (req, res) => {
    const id = req.params.id;
    const c = await Client.findById(id);
    if(!c){
      console.log('nothing found')
      req.flash('error', 'Cannot find that client');
      return res.redirect('/clients')
    }
    res.render("clients/update", {c});
}

//Handle client update on PUT
module.exports.client_update_put = async (req, res) => {
    const id = req.params.id;
    const updatedClient = req.body.client;
    const account = req.user.account;
    await Client.findOneAndUpdate({_id, account}, {...updatedClient});
    req.flash('success', 'Details updated.' );
    res.redirect(`${id}`);
}

//Handle search
module.exports.client_search = async (req, res) => {
  const query = req.body.query;

  console.log(query);

  let clients = await Client.aggregate([
    {
      $project: {
         "fullName": { $concat : [ "$firstName", " ", "$lastName" ]},
         "clientId": 1
        }
    },
    {
      $match: {
        $or: [
          {"fullName": { $regex: query, $options:'i'}},
          {"clientId": { $regex: query, $options:'i'}}
        ]
      
    }
  }
  ]).limit(10).exec();
  console.log(clients)
  res.send(clients);

}




