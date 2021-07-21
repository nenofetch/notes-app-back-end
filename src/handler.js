const { nanoid } = require('nanoid')
const notes = require('./notes')

// function for add notes
const addNoteHandler = (request, h) => {
    const { title, tags, body} = request.payload;

    const id = nanoid(16);
    const createAt = new Date().toISOString();
    const updatedAt = createAt;

    const newNote = {
        title, tags, body , id, createAt, updatedAt,
    };

    notes.push(newNote)

    const isSuccess = notes.filter((note) => note.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            }
        })
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    })
    response.code(500)
    return response
};

// fetching all notes
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
})

// Get notes using id
const getNotesByIdHandler = (request, h) => {
    const { id } = request.params

    const note = notes.filter((n) => n.id === id)[0]

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            }
        }
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    })
    response.code(404)
    return response
}


// function for edit notes by id also checking
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params

    const { title, tags, body } = request.payload
    const updatedAt = new Date().toISOString()

    const index = notes.findIndex((note) => note.id === id)

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        }
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
        })
        response.code(200)
        return response
    }

    const response = h.reponse({
        status: 'fail',
        message: 'Gagal memperbaharui catatan. Id tidak ditemukan',
    })
    response.code(404)
    return response
}


// function for delete notes
const deleteNotesByIdHandler = (request, h) => {
    const { id } = request.params

    const index = notes.filter((note) => note.id === id)
    if (index !== -1) {
        notes.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    })
    response.code(404)
    return response
}

module.exports = { 
    addNoteHandler,
    getAllNotesHandler, 
    getNotesByIdHandler, 
    editNoteByIdHandler, 
    deleteNotesByIdHandler }