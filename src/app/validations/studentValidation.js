const Joi = require('joi');

// Định nghĩa luật lệ cho việc Thêm mới Sinh viên
const createStudentSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Họ tên không được để trống.',
        'string.min': 'Họ tên phải có ít nhất 3 ký tự.',
        'any.required': 'Họ tên là trường bắt buộc.'
    }),
    studentCode: Joi.string().alphanum().length(9).required().messages({
        'string.empty': 'Mã số sinh viên không được để trống.',
        'string.length': 'Mã số sinh viên phải có đúng 9 ký tự (VD: DTH235811).',
        'any.required': 'Mã số SV là trường bắt buộc.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email không đúng định dạng.',
        'any.required': 'Email là trường bắt buộc.'
    }),
    major: Joi.string().optional() // optional là không bắt buộc
});

module.exports = {
    createStudentSchema
};