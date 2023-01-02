import Client from '../models/clientModel.js';
import Note from '../models/noteModel.js';
// @route     POST clients/:clientId/notes
// @desc      Create a new note
// @access    Private
export async function createNote(req, res, next) {
    try {
        const client = await Client.findById(req.params.clientId);
        if (client) {
            const note = new Note(req.body.note);
            note.date = new Date();
            note.author = req.user;
            note.client = client;
            note.account = req.user.account;
            client.notes.push(note);
            await note.save();
            await client.save();
            res.redirect(`/clients/${req.params.clientId}/notes/${note._id}`);
        }
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('back');
    }
}
// @route     GET clients/:clientId/notes
// @desc      Get all notes for client
// @access    Private
export async function getNotes(req, res, next) {
    try {
        const clientId = req.params.clientId;
        const account = req.user.account;
        let { category } = req.query;
        !category
            ? (category = [
                'Phone Call',
                'Email',
                'Meeting',
                'Job Update',
                'General',
                '',
            ])
            : '';
        const c = await Client.findOne({ _id: clientId, account })
            .populate({
            path: 'notes',
            sort: { _id: -1 },
            match: { category },
            populate: {
                path: 'author',
            },
        })
            .populate('author');
        res.render('notes/note_index', {
            c,
            page: 'notes',
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('back');
    }
}
// @route     GET clients/:clientId/notes/:noteId
// @desc      Get all notes for client
// @access    Private
export async function getNote(req, res, next) {
    try {
        const { clientId, noteId } = req.params;
        const account = req.user.account;
        console.log(clientId);
        const c = await Client.findOne({ _id: clientId, account });
        const note = await Note.findOne({ _id: noteId, account }).populate({
            path: 'author',
        });
        res.render('notes/note_show', { c, note, page: '' });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
}
export async function updateNoteView(req, res, next) {
    try {
        const { clientId, noteId } = req.params;
        const account = req.user.account;
        const c = await Client.findOne({ _id: clientId, account });
        const note = await Note.findOne({ _id: noteId, account });
        res.render('notes/note_update', { c, note, page: '' });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
}
export async function updateNote(req, res) {
    try {
        const { noteId } = req.params;
        const account = req.user.account;
        const note = req.body.note;
        await Note.findOneAndUpdate({ _id: noteId, account }, { ...note });
        req.flash('success', 'Details updated.');
        res.redirect(`${noteId}`);
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
}
