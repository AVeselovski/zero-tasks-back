const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    checklist: {
        type: Boolean,
        default: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        checked: {
            type: Boolean,
            default: false
        }
    }]
});

const NoteSchema = new Schema({
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    list: {
        type: ListSchema,
        default: null
    },
    tag: {
        type: String,
        lowercase: true,
        default: null
    },
    priority: {
        type: Number,
        required: true,
        default: 0 // 0: note, 1-[3]: task priority level
    },
    status: {
        type: String,
        required: true,
        default: 'active' // active / archived
    },
    duedate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
});

module.exports = NoteSchema;
