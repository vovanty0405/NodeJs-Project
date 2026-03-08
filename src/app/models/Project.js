const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Project = new Schema({
    title: { type: String, required: true },
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    techStack: { type: String },
    description: { type: String },
    githubLink: { type: String },
    status: { type: String, default: 'Đang thực hiện' },
    
    // THÊM THUỘC TÍNH IMAGE Ở ĐÂY
    // Nếu không nhập link ảnh, nó sẽ lấy một ảnh placeholder mặc định
    image: { 
        type: String, 
        default: 'https://placehold.co/600x400/png?text=No+Image' 
    },
    
    slug: { type: String, slug: 'title', unique: true } 
}, {
    timestamps: true, 
});

Project.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: 'all' 
});

module.exports = mongoose.model('Project', Project);