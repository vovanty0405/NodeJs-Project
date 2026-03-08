const Project = require('../models/Project');

class SiteController {
    // [GET] / (Trang chủ)
    async home(req, res, next) {
        try {
            // Lấy tất cả đồ án từ Database
            const projects = await Project.find({});
            
            // Render ra file home.ejs và truyền mảng projects sang
            res.render('home', { 
                projects: projects 
            });
        } catch (error) {
            next(error); // Báo lỗi nếu có
        }
    }
}

module.exports = new SiteController();