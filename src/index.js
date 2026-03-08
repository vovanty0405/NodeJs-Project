const express = require('express')
const path = require('path')
const morgan = require('morgan');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const SortMiddleware = require('./app/middlewares/SortMiddlewares')
const app = express()
const port = 3000

// 1. KẾT NỐI DB
const db = require('./config/db');
db.connect();

// 2. CÁC MIDDLEWARE & CẤU HÌNH (Phải đặt ở đây)
// --- ĐƯA HELPER SORTABLE VÀO EJS ---
app.use((req, res, next) => {
    // res.locals giúp biến/hàm này có thể được gọi ở bất kỳ file .ejs nào
    res.locals.sortable = (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default';

        const icons = {
            default: 'bi bi-filter',
            asc: 'bi bi-sort-alpha-down',
            desc: 'bi bi-sort-alpha-up-alt',
        };

        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        };

        const icon = icons[sortType];
        const type = types[sortType];

        return `<a href="?_sort&column=${field}&type=${type}">
                  <i class="${icon}"></i>
                </a>`;
    };
    next();
});
app.use(SortMiddleware)
app.use(morgan('combined'));
app.use(methodOverride('_method'))
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('layout', 'layouts/main'); // Chỉ định file layout mặc định
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 3. ĐỊNH NGHĨA ROUTE (Bắt buộc phải đặt dưới phần cấu hình)
const route = require('./routes');
route(app);

// 4. CHẠY SERVER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})