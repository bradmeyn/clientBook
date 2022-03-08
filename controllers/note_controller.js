const Client = require('../models/client_model');
const Note = require('../models/note_model');


//Handle user creation on POST
module.exports.note_create_post = async (req, res, next) => {

    try {
        const client = await Client.findById(req.params.clientId);
        const note = new Note(req.body.note);
        note.date = new Date();
        note.author = req.user;
        note.account = req.user.account;
        client.notes.push(note);
        await note.save(() => {
            console.log('note saved: ', note);
        });
        await client.save(()=> {
            console.log('client saved: ', client);
        });
        res.redirect('back');

    } catch(e) {
        req.flash('error', e.message);
        res.redirect('back');
    }
}

//Display all notes associated with client

module.exports.note_index_get = async (req, res, next) => {

    try {

        const clientId = req.params.clientId;
        const account = req.user.account;
        
        const c = await Client.findOne({ _id:clientId, account}).populate({
            path: 'notes', 
            populate: {
            path: 'author'
            }
    }).populate('author');

        res.render('notes/note_index',{c, page: 'notes'});
       
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }
}

module.exports.note_show = async (req, res, next) => {

    try {
        const {clientId, noteId} = req.params;
        const account = req.user.account;
        const c = await Client.findOne({ _id:clientId, account});
        const note = await Note.findOne({ _id:noteId, account}).populate({path: 'author'});
        console.log(note);
        res.render('notes/note_show',{c,note,  page: 'notes'});
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }
}


module.exports.note_update_get = async (req, res, next) => {

    try {
        const {clientId, noteId} = req.params;
        const account = req.user.account;
        const c = await Client.findOne({ _id:clientId, account});
        const note = await Note.findOne({ _id:noteId, account});
        console.log(note);
        res.render('notes/note_update',{c,note,  page: 'notes'});
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }
}

module.exports.note_update_put = async (req, res) => {
    try {
        const {clientId, noteId} = req.params;
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







