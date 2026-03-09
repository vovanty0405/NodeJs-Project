// src/app/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // 1. Log lỗi ra console để anh em Dev dễ debug
    console.error("🔥 BẮT ĐƯỢC LỖI TẠI MIDDLEWARE:", err.message);

    // 2. Lấy status code hiện tại, nếu đang là 200 (mặc định) thì đổi thành 500 (Lỗi Server)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // --- XỬ LÝ CÁC LỖI ĐẶC THÙ CỦA MONGOOSE ---
    
    // Lỗi 11000: Trùng lặp dữ liệu (Ví dụ: trùng Mã Sinh Viên)
    if (err.code === 11000) {
        statusCode = 400; // Đổi thành lỗi 400 Bad Request
        message = 'Dữ liệu đã tồn tại trong hệ thống (Trùng lặp khóa). Vui lòng kiểm tra lại!';
    }

    // Lỗi CastError: Tìm ID không hợp lệ (Ví dụ ID đồ án sai định dạng)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Không tìm thấy dữ liệu với ID: ${err.value}`;
    }

    // 3. Trả kết quả JSON chuẩn hóa về cho Frontend
    res.status(statusCode).json({
        success: false,
        message: message,
        // Dòng này giúp em biết lỗi xuất phát từ file nào dòng nào. 
        // Thực tế đi làm, người ta chỉ bật dòng này ở môi trường Dev, ẩn đi ở môi trường Production.
        stack: err.stack 
    });
};

module.exports = errorHandler;