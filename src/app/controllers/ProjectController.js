const Project = require('../models/Project');

class ProjectController {

    // [GET] /projects/create  (Nhiệm vụ: Hiển thị giao diện Form)
    create(req, res) {
        res.render('projects/create');
    }

    // [POST] /projects/store  (Nhiệm vụ: Nhận data từ Form và lưu vào DB)
    async store(req, res, next) {
        try {
            // Lấy dữ liệu người dùng nhập từ req.body
            const formData = req.body;
            
            // Tạo một đối tượng đồ án mới
            const project = new Project(formData);
            
            // Lưu xuống Database
            await project.save();
            
            // Lưu thành công thì điều hướng về trang chủ
            res.redirect('/');
        } catch (error) {
            // Nếu có lỗi (như nhập thiếu trường bắt buộc), đẩy lỗi ra
            next(error);
        }
    }
    // [GET] /projects/:id/edit (Hiển thị form sửa)
    async edit(req, res, next) {
        try {
            // 1. Tìm đồ án trong Database theo ID trên URL
            const project = await Project.findById(req.params.id);
            
            // 2. Render ra giao diện và TRUYỀN dữ liệu project sang EJS
            res.render('projects/edit', { 
                project: project 
            });
        } catch (error) {
            next(error);
        }
    }
    async Show(req, res, next) {
        try {
            // 1. Tìm đồ án trong Database theo ID trên URL
            const project = await Project.findOne({ slug: req.params.slug })
            
            // 2. Render ra giao diện và TRUYỀN dữ liệu project sang EJS
            res.render('projects/show', { 
                project: project 
            });
        } catch (error) {
            next(error);
        }
            
    }

    // [PUT] /projects/:id (Hứng dữ liệu từ form gửi lên và lưu vào DB)
    async update(req, res, next) {
        try {
            // Cập nhật bản ghi có _id khớp với ID trên URL, dữ liệu mới lấy từ req.body
            await Project.updateOne({ _id: req.params.id }, req.body);
            
            // Lưu thành công thì chuyển hướng về trang Danh sách đồ án của tôi
            res.redirect('/me/stored/projects');
        } catch (error) {
            next(error);
        }
    }
    //[DELETE] /courses/:id
    async delete(req, res, next) {
        try{
            // Xóa khóa học có _id trùng với req.params.id
            await Project.delete({ _id: req.params.id});
            // Xoá xong thì chuyển hướng về trang danh sách của tôi
            res.redirect('/me/stored/projects');
        }catch(error){
            next(error);
        }
    }
    async restore(req, res, next){
        try{
            await Project.restore({_id: req.params.id})
            res.redirect('/me/stored/projects')
        }catch(error){
            next(error)
        }
    }
    //[POST] /courses/handle-form
    handleForm(req, res, next) {
       switch(req.body.action){
            case 'delete':
                Project.delete({ _id: { $in: req.body.projectIds } })
                    .then(() => res.redirect('/me/stored/projects'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Hành động không hợp lệ!' });
       }
    }
    //[POST] /courses/handleRestore-form
    handleRestoreForm(req, res, next) {
       switch(req.body.action){
            case 'restore':
                Project.restore({ _id: { $in: req.body.projectIds } })
                    .then(() => res.redirect('/me/trash/projects'))
                    .catch(next);
                break;
            case 'force-delete':
                // Xóa vĩnh viễn nhiều đồ án (Dùng deleteMany của Mongoose)
                Project.deleteMany({ _id: { $in: req.body.projectIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Hành động không hợp lệ!' });
       }
    }
    //[DELETE] /courses/:id/force
    async forceDelete(req, res, next) {
        try {
            await Project.deleteOne({ _id: req.params.id });
            res.redirect('/me/trash/projects');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProjectController();