const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Student = new Schema({
    fullName: {type: String, require: true},
    studentCode: {type: String, require: true, unique: true},
    email: {type: String, require: true},
    major: {type: String, default: 'Công nghệ thông tin'}
})

Student.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: 'all' 
});

module.exports = mongoose.model('Student', Student);