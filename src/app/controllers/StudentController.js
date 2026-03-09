// Đổi tên biến Project thành Student cho đúng với Model
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student'); 
const { createStudentSchema } = require('../validations/studentValidation');

class StudentController {
   // [GET] /api/students
    getAll = asyncHandler(async (req, res) => {
        // 1. Lấy các tham số từ URL (req.query)
        // Ví dụ URL: ?keyword=Võ&major=Công nghệ thông tin
        const { keyword, major } = req.query;

        // 2. Khởi tạo một Object rỗng để chứa các điều kiện
        let queryCondition = {};

        // 3. Xử lý TÌM KIẾM (Search)
        if (keyword) {
            // Dùng $or để tìm kiếm từ khóa khớp với Họ tên HOẶC Mã sinh viên
            // $regex giúp tìm gần đúng, $options: 'i' giúp không phân biệt hoa thường
            queryCondition.$or = [
                { fullName: { $regex: keyword, $options: 'i' } },
                { studentCode: { $regex: keyword, $options: 'i' } }
            ];
        }

        // 4. Xử lý LỌC (Filter) chính xác theo ngành học
        if (major) {
            queryCondition.major = major; // Lọc những bạn khớp đúng tên ngành
        }

        // 5. Quăng cái điều kiện vừa build xong vào Mongoose
        // Nếu không có keyword hay major gì cả, queryCondition vẫn là {}, nó sẽ lấy TẤT CẢ.
        const students = await Student.find(queryCondition);

        // 6. Trả về kết quả
        res.status(200).json({ 
            success: true, 
            message: 'Lấy danh sách thành công',
            count: students.length, 
            data: students 
        });
    });

    // [POST] /api/students
    create = asyncHandler(async (req, res) => {

        const { error } = createStudentSchema.validate(req.body);
        // Nếu vi phạm luật (error có tồn tại) -> Ném lỗi ngay lập tức
        if (error) {
            res.status(400);
            // Lấy cái câu thông báo tiếng Việt mình đã cấu hình ném ra ngoài
            throw new Error(error.details[0].message); 
        }

        const { fullName, studentCode, email, major } = req.body;

        // 1. Tự Validation
        if (!fullName || !studentCode) {
            res.status(400); // Set status 400
            throw new Error('Vui lòng nhập đầy đủ Họ tên và Mã số sinh viên!'); // Ném lỗi ra, Middleware sẽ chụp lại!
        }

        // 2. Tạo mới thẳng luôn, nếu trùng mã SV (lỗi 11000), nó tự ném xuống Middleware bắt!
        const newStudent = await Student.create({
            fullName, 
            studentCode, 
            email, 
            major: major || "Công nghệ thông tin"
        });

        // 3. Trả về thành công
        res.status(201).json({
            success: true,
            message: 'Tuyệt vời! Đã thêm sinh viên mới.',
            data: newStudent
        });
    });
    /*async update(req, res) {
            try {
                // Dùng findByIdAndUpdate để tìm và sửa cùng lúc
                // { new: true } giúp Mongoose trả về dữ liệu MỚI sau khi sửa (nếu không có, nó sẽ trả về dữ liệu cũ)
                const updatedStudent = await Student.findByIdAndUpdate(
                    req.params.id, 
                    req.body, 
                    { new: true, runValidators: true } 
                );
    
                // Kiểm tra xem ID có tồn tại trong Database không
                if (!updatedStudent) {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy sinh viên với ID này để cập nhật!'
                    });
                }
    
                // Trả về kết quả thành công
                res.status(200).json({
                    success: true,
                    message: 'Đã cập nhật thông tin sinh viên thành công!',
                    data: updatedStudent
                });
    
            } catch (error) {
                res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
            }
        }*/
       update = asyncHandler(async (req, res) =>{
            const updatedStudent = await Student.findByIdAndUpdate(
                        req.params.id, 
                        req.body, 
                        { new: true, runValidators: true } 
                    );
        
                    // Kiểm tra xem ID có tồn tại trong Database không
                    if (!updatedStudent) {
                        res.status(404);
                        throw new Error('Không tìm thấy sinh viên để cập nhật!')
                    }
        
                    // Trả về kết quả thành công
                    res.status(200).json({
                        success: true,
                        message: 'Đã cập nhật thông tin sinh viên thành công!',
                        data: updatedStudent
                    });
       })
        // [DELETE] /students/:id (Xóa mềm đồ án)
       // [DELETE] /api/students/:id
    delete = asyncHandler(async (req, res) => {
        const student = await Student.findById(req.params.id);
        
        if (!student) {
            res.status(404); // Lỗi 404 Not Found
            throw new Error('Không tìm thấy sinh viên để xóa!');
        }

        await student.delete();

        res.status(200).json({
            success: true,
            message: 'Đã đưa sinh viên vào thùng rác an toàn.'
        });
    });
}

module.exports = new StudentController();