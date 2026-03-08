const mongoose = require('mongoose');

async function connect() {
    try {
        // Hardcode đường dẫn IP 127.0.0.1 để tránh lỗi IPv6 trên các bản Node.js mới
        // 'project_management_dev' là tên Database (nó sẽ tự được tạo nếu chưa có)
        await mongoose.connect('mongodb://127.0.0.1:27017/project_management_dev');
        
        console.log('✅ KẾT NỐI DATABASE THÀNH CÔNG RỰC RỠ!');
    } catch (error) {
        console.log('❌ KẾT NỐI DATABASE THẤT BẠI!!!');
        console.log('Lỗi chi tiết:', error);
    }
}

module.exports = { connect };