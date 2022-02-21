
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
        for (let note of c.notes){
            console.log(note);
        }
        res.render('../clients/notes/note_index',{c, page: 'notes'});
       
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
        const note = new Note(req.body.note)
        note.date = Date.now();
        note.author = req.user;
        client.notes.push(note);
        await note.save();
        await client.save();
        console.log(req.body.note);
        res.redirect(`/clients/${client._id}/notes`);

       
    } catch(e) {
        req.flash('error', e.message);
        // res.redirect('/');
    }
}



