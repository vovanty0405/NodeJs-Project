module.exports = function SortMiddleware(req,res,next){
    // Tạo một biến locals tên là _sort để view dùng
    res.locals._sort = {
        enabled: false,
        type: 'default'
    };

   if(Object.prototype.hasOwnProperty.call(req.query,'_sort')){
        Object.assign(res.locals._sort, {
            enabled: true,
            type: req.query.type,
            column: req.query.column,
        });
   }

    next(); // Cho phép đi tiếp sang Controller
}