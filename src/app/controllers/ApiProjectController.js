const Project = require('../models/Project')

class ApiProjectController {

    // [GET] /api/projects (Lấy toàn bộ danh sách)
    async getAll(req, res) {
        try {
            const projects = await Project.find({});
            
            // Trả về JSON với Status 200
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách đồ án thành công',
                count: projects.length, // Đếm số lượng trả về
                data: projects
            });
        } catch (error) {
            // Nếu có lỗi, trả về Status 500
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy dữ liệu',
                error: error.message
            });
        }
    }

    // [GET] /api/projects/:id (Lấy chi tiết 1 đồ án)
    async getOne(req, res) {
        try {
            const project = await Project.findById(req.params.id);
            
            // Nếu không tìm thấy đồ án
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đồ án với ID này'
                });
            }

            res.status(200).json({
                success: true,
                data: project
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // [POST] /api/projects (Thêm mới đồ án)
    async create(req, res) {
        try {
            // 1. Nhận dữ liệu JSON từ Postman gửi lên (Nằm trong req.body)
            const { title, studentName, studentId, techStack, description, githubLink } = req.body;

            // 2. Validate (Kiểm tra dữ liệu)
            // Nếu người dùng không gửi lên các trường bắt buộc, chặn lại ngay và báo lỗi 400
            if (!title || !studentName || !studentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin! Vui lòng cung cấp đầy đủ Tên đồ án, Tên SV và MSSV.'
                });
            }

            // 3. Khởi tạo đối tượng mới và lưu vào MongoDB
            const newProject = new Project({
                title: title,
                studentName: studentName,
                studentId: studentId,
                techStack: techStack,
                description: description,
                githubLink: githubLink
            });

            await newProject.save();

            // 4. Thành công thì trả về HTTP Status 201 (Created - Đã tạo mới)
            res.status(201).json({
                success: true,
                message: 'Tuyệt vời! Đã thêm đồ án mới thành công.',
                data: newProject
            });

        } catch (error) {
            // Nếu có lỗi do hệ thống hoặc do Mongoose báo trùng lặp
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi thêm đồ án',
                error: error.message
            });
        }
    }
    // [PUT] /api/projects/:id (Cập nhật thông tin đồ án)
    async update(req, res) {
        try {
            // Dùng findByIdAndUpdate để tìm và sửa cùng lúc
            // { new: true } giúp Mongoose trả về dữ liệu MỚI sau khi sửa (nếu không có, nó sẽ trả về dữ liệu cũ)
            const updatedProject = await Project.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                { new: true, runValidators: true } 
            );

            // Kiểm tra xem ID có tồn tại trong Database không
            if (!updatedProject) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đồ án với ID này để cập nhật!'
                });
            }

            // Trả về kết quả thành công
            res.status(200).json({
                success: true,
                message: 'Đã cập nhật đồ án thành công!',
                data: updatedProject
            });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }

    // [DELETE] /api/projects/:id (Xóa mềm đồ án)
    async delete(req, res) {
        try {
            // Bước 1: Tìm xem đồ án có tồn tại không
            const project = await Project.findById(req.params.id);
            
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đồ án để xóa!'
                });
            }

            // Bước 2: Gọi hàm delete() của plugin mongoose-delete để xóa mềm
            await project.delete();

            res.status(200).json({
                success: true,
                message: 'Đã đưa đồ án vào thùng rác an toàn.'
            });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }
}

module.exports = new ApiProjectController();