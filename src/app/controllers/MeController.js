const Project = require('../models/Project'); // Đã sửa tên biến cho chuẩn

class MeController {

    // [GET] /me/stored/projects
    async storedProjects(req, res, next) {
        
        // 1. Khởi tạo query cơ bản lấy tất cả đồ án
        let projectQuery = Project.find({});

        // 2. Kích hoạt logic TÌM KIẾM (Search)
        // Nếu trên URL có biến ?q=... (người dùng nhập vào ô tìm kiếm)
        if (req.query.q) {
            projectQuery = projectQuery.find({
                title: {
                    $regex: req.query.q,
                    $options: 'i' // Không phân biệt hoa thường
                }
            });
        }

        // 3. Kích hoạt logic SẮP XẾP (Sort)
        // Nếu trên URL có biến ?_sort... (người dùng bấm vào icon ở tiêu đề cột)
         if (Object.prototype.hasOwnProperty.call(req.query,'_sort')) {
            const isValidType = ['asc', 'desc'].includes(req.query.type);
            if (isValidType) {
                projectQuery = projectQuery.sort({
                    [req.query.column]: req.query.type
                });
            }
        }

        // 4. Thực thi lấy dữ liệu
        try {
            // Chạy song song 2 việc: Lấy danh sách đồ án + Đếm số đồ án đã xóa
            const [projects, deletedCount] = await Promise.all([
                projectQuery,
                Project.countDocumentsDeleted()
            ]);

            // Render ra view EJS và truyền dữ liệu sang
            res.render('me/store-projects', {
                projects: projects,
                deletedCount: deletedCount
            });

        } catch (error) {
            next(error);
        }
    }

    // [GET] /me/trash/projects
    async trashProjects(req, res, next) {
        try {
            // Chỉ lấy những đồ án đã bị xóa mềm (nằm trong thùng rác)
            const projects = await Project.findDeleted({});
            
            res.render('me/trash-projects', {
                projects: projects
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MeController();