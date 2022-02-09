
const Client = require('../models/client_model');
const Note = require('../models/note_model');


//Display all notes associated with client

module.exports.note_index_get = async (req, res, next) => {
    console.log("hey");
    try {

        const id = req.params.id;
        const account = req.user.account;
        console.log(id);

        const c = await Client.findOne({ _id:id, account}).populate({
            path: 'notes', 
            populate: {
            path: 'author'
        }}).populate('author');

        res.render('../clients/notes/note_index',{c, page: 'notes'});
       
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
}

//Handle user creation on POST
module.exports.note_create_post = async (req, res, next) => {

    try {
        console.log(req.body);
        // const note = new Note(req.body.note)
        // note.date = Date.now();
        // note.author = req.user._id;
        // await note.save();
        // await client.save();

        // res.redirect(`/clients/${client._id}`);

       
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
}



