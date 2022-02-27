
const Client = require('../models/client_model');
const Note = require('../models/note_model');


//Display all notes associated with client

module.exports.note_index_get = async (req, res, next) => {

    try {

        const id = req.params.id;
        const account = req.user.account;
        
        const c = await Client.findOne({ _id:id, account}).populate({
            path: 'notes', 
            populate: {
            path: 'author'
            }
    }).populate('author');

        res.render('../clients/notes/note_index',{c, page: 'notes'});
       
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }
}

module.exports.note_show = async (req, res, next) => {

    try {
        const {id, noteId} = req.params;
        const account = req.user.account;
        const c = await Client.findOne({ _id:id, account});
        const note = await Note.findOne({ _id:noteId, account}).populate({path: 'author'});
        console.log(note);
        res.render('../clients/notes/note_show',{c,note,  page: 'notes'});
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }
}


module.exports.note_update_get = async (req, res, next) => {

    try {
        const {id, noteId} = req.params;
        const account = req.user.account;
        const c = await Client.findOne({ _id:id, account});
        const note = await Note.findOne({ _id:noteId, account});
        console.log(note);
        res.render('../clients/notes/note_update',{c,note,  page: 'notes'});
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }
}

module.exports.note_update_put = async (req, res) => {
    try {
        const {id, noteId} = req.params;
        const account = req.user.account;
        const note = req.body.note;
        console.log(note);
        await Note.findOneAndUpdate({_id:noteId, account}, {...note});
        req.flash('success', 'Details updated.' );
        res.redirect(`${noteId}`);
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }

    
    
}






//Handle user creation on POST
module.exports.note_create_post = async (req, res, next) => {

    try {
        
        const client = await Client.findById(req.params.id);
        const note = new Note(req.body.note);
        console.log(note);
        note.date = new Date();
        note.author = req.user;
        note.account = req.user.account;
        client.notes.push(note);
        await note.save();
        await client.save();
        res.redirect(`/clients/${client._id}/notes`);

       
    } catch(e) {
        req.flash('error', e.message);
        // res.redirect('/');
    }
}



