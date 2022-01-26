
const Client = require('../models/client_model');
const Account = require('../models/account_model');


//Display all clients
module.exports.client_index = async (req, res) => {

  //show all clients associated with logged in users account
    const account = req.user.account;
    const resultCount = await Client.find({account}).countDocuments();
    
    const resultsPerPage = 5;
 
    const pageCount = Math.ceil(resultCount/resultsPerPage);

    //current page
    let page = req.query.page ? Number(req.query.page) : 1;

    if(page > pageCount){
      //redirect to last
      res.redirect('/?page='+encodeURIComponent(pageCount));
    } else if (page < 1){
      //redirect to first
      res.redirect('/?page='+encodeURIComponent('1'));
    }
    //Limit starting number
    const startLimit = (page - 1) * resultsPerPage;

    //ge the relevant number of posts
    const clients = await Client.find({account}).skip(startLimit).limit(resultsPerPage);

    res.render('clients/client_index', {clients, pageCount, page});
    
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
    res.render('clients/client_new');
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
    //calculate age
    let today = new Date();
    let birthDate = new Date(c.dob.fullDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    c.age = age;
    res.render("clients/client_show", {c, page: 'notes'});
}

//Handle client deletion
module.exports.client_delete = async (req, res) => {
    const id = req.params.id;
    const account = req.user.account;
    const client = await Client.findOneAndDelete({_id:id, account});
    req.flash('success', `${client.firstName} ${client.lastName} deleted`);
    res.redirect('/clients')
  }

//Display client update form on GET
module.exports.client_update_get = async (req, res) => {
    const id = req.params.id;
    const client = await Client.findById(id);
    if(!client){
      console.log('nothing found')
      req.flash('error', 'Cannot find that client');
      return res.redirect('/clients')
    }
    res.render("clients/client_update", {client});
}

//Handle client update on PUT
module.exports.client_update_put = async (req, res) => {
    const id = req.params.id;
    const client = req.body.client;
    client.dob.fullDate = `${client.dob.birthDay}/${client.dob.birthMonth}/${client.dob.birthYear}`;
    const account = req.user.account;
    await Client.findOneAndUpdate({_id:id, account}, {...client});
    req.flash('success', 'Details updated.' );
    res.redirect(`${id}`);
}












//Handle search
module.exports.client_search = async (req, res) => {
  const query = req.body.query;
  const account = req.user.account;
  console.log(query);

  let clients = await Client.aggregate([
    {
      $project: {
         "fullName": { $concat : [ "$firstName", " ", "$lastName" ]},
         "clientId": 1,
         "account": 1
        }
    },
    {
      $match: {
        $and: [
          {
            $or: [
            {"fullName": { $regex: query, $options:'i'}},
            {"clientId": { $regex: query, $options:'i'}}
          ]
        },
        {
          "account": account
        }
        ]
        
    }
  }
  ]).limit(10).exec();
  console.log(account);
  console.log(clients)
  res.send(clients);

}




