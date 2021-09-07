
const Client = require('../models/client');

//Display all clients
module.exports.client_index = async (req, res) => {
    const clients = await Client.find({});
    res.render('clients/index', {clients});
}

//Handle client create on POST
module.exports.client_create_post = async (req, res) => {
    let client = req.body.client;
    client.dob.fullDate = `${client.dob.birthDay}/${client.dob.birthMonth}/${client.dob.birthYear}`;
    client.clientId = Date.now();  
    const newClient = new Client(client);
    req.flash('success', 'A new client has been created' );
    await newClient.save()
    .then(client => res.redirect(`clients/${client._id}`));

}

//Display Client create form on Get
module.exports.client_create_get = (req, res) => {
    res.render('clients/new');
}

//Display single client
module.exports.client_show = async (req, res) => {
   
    const id = req.params.id;
    const c = await Client.findById(id);
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
    await Client.findByIdAndDelete(id);
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
    await Client.findByIdAndUpdate(id, {...updatedClient});
    req.flash('success', 'Details updated.' );
 
  //   const c = await Client.findByIdAndUpdate(id);
  res.redirect(`${id}`);
}





