const express = require('express');
const app = express();
const port = 3002;

const morgan=require("morgan")
app.use(morgan("combined"))

const path=require("path")
app.use(express.static(path.join(__dirname,"public")))

const cors=require("cors")
app.use(cors())
const bodyParser=require("body-parser")
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get("/",(req,res)=>{
    res.send("This Web server is processed for MongoDB")
})

const { MongoClient, ObjectId } = require('mongodb');
// Slug: tiêu đề không dấu + IdF, ví dụ dam-da-hoi-12.
function createSlug(subject, IdF) {
    const title = String(subject ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${title || 'fashion'}-${IdF}`;
}

function parseSlugId(slug) {
    if (typeof slug !== 'string' || slug.length > 2000 || !/^[a-z0-9]+(?:-[a-z0-9]+)*-[1-9]\d*$/.test(slug)) return null;
    const id = Number(slug.slice(slug.lastIndexOf('-') + 1));
    return Number.isSafeInteger(id) ? id : null;
}

function planFashionIds(items) {
    let max = items.reduce((value, item) => Number.isSafeInteger(item.IdF) && item.IdF > 0 ? Math.max(value, item.IdF) : value, 0);
    const used = new Set();
    return items.map(item => {
        let id = item.IdF;
        if (!Number.isSafeInteger(id) || id <= 0 || used.has(id)) id = ++max;
        if (!Number.isSafeInteger(id)) throw new Error('IdF vượt giới hạn số nguyên an toàn');
        used.add(id);
        return id;
    });
}

// Bổ sung mã cho dữ liệu cũ trước khi server nhận yêu cầu.
async function migrateFashionSlug(database) {
    const collection = database.collection('Fashion');
    const items = await collection.find({}).sort({ _id: 1 }).toArray();
    const ids = planFashionIds(items);
    for (let i = 0; i < items.length; i++) {
        await collection.updateOne({ _id: items[i]._id }, { $set: {
            IdF: ids[i], slug: createSlug(items[i].fashion_subject, ids[i]),
        } });
    }
    await collection.createIndex({ IdF: 1 }, { unique: true });
    const max = ids.reduce((value, id) => Math.max(value, id), 0);
    await database.collection('Counters').updateOne({ _id: 'fashion' }, { $max: { seq: max } }, { upsert: true });
}
const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017", { serverSelectionTimeoutMS: 5000 });
const database = client.db(process.env.MONGODB_DB || "FashionData");
const fashionCollection = database.collection("Fashion");

app.get('/fashions/slug/:slug', async (req, res) => {
    const IdF = parseSlugId(req.params.slug);
    if (IdF === null) return res.status(400).json({ message: 'Slug Fashion không hợp lệ.' });
    const fashion = await fashionCollection.findOne({ IdF });
    if (!fashion) return res.status(404).json({ message: 'Không tìm thấy Fashion.' });
    res.json(fashion);
});
app.get(["/fashions"], cors(), async (req,res)=>{   
    const result = await fashionCollection.find({}).toArray();
    res.send(result)
    }
)

app.get("/fashions/:id",cors(),async (req,res)=>{
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Fashion Id không hợp lệ.' });
    var o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({_id:o_id}).toArray();    
    if (!result[0]) return res.status(404).json({ message: 'Không tìm thấy Fashion.' });
    res.send(result[0])
    }
)

app.post("/fashions",cors(),async(req,res)=>{
    const body = req.body;
    if (!body || typeof body.fashion_subject !== 'string' || !body.fashion_subject.trim()
        || body.fashion_subject.length > 500
        || ['style', 'fashion_detail', 'fashion_image'].some(key => body[key] != null && typeof body[key] !== 'string')) {
        return res.status(400).json({ message: 'Nhập tiêu đề Fashion (tối đa 500 ký tự) và các trường dạng chuỗi.' });
    }
    const counter = await database.collection('Counters').findOneAndUpdate(
        { _id: 'fashion' }, { $inc: { seq: 1 } }, { returnDocument: 'after' });
    if (!Number.isSafeInteger(counter?.seq)) throw new Error('Không thể cấp IdF');
    const fashion = {
        style: body.style || '', fashion_subject: body.fashion_subject.trim(),
        fashion_detail: body.fashion_detail || '', fashion_image: body.fashion_image || '',
        IdF: counter.seq, slug: createSlug(body.fashion_subject, counter.seq),
    };
    await fashionCollection.insertOne(fashion);
    res.status(201).json(fashion);
})


const { searchFashions } = require('./search-fashion');
app.get('/fashions/search/query', async (req, res) => {
    const { q, field = 'fashion_subject', limit = '10' } = req.query;
    const count = Number(limit);
    if (typeof q !== 'string' || !/[\p{L}\p{N}]/u.test(q) || q.length > 1000
        || !['fashion_subject', 'fashion_detail'].includes(field)
        || !Number.isInteger(count) || count < 1 || count > 100) {
        return res.status(400).json({ message: 'Nhập từ khóa hợp lệ, chọn trường tìm kiếm và số kết quả từ 1 đến 100' });
    }
    try {
        const fashions = await fashionCollection.find({}).toArray();
        res.json({ items: searchFashions(fashions, q, field, count), total: fashions.length });
    } catch (error) {
        console.error('SearchFashion:', error.message);
        res.status(500).json({ message: 'Không thể tìm kiếm Fashion. Vui lòng kiểm tra kết nối MongoDB' });
    }
});

app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(error.status || 500).json({ message: 'Không thể xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và kết nối MongoDB.' });
});

async function start() {
    await client.connect();
    await migrateFashionSlug(database);
    return app.listen(port, () => console.log(`My Server listening on port ${port}`));
}
if (require.main === module) start().catch(async error => {
    console.error('Khởi động thất bại:', error.message);
    await client.close();
    process.exitCode = 1;
});
module.exports = { app, start, client, createSlug, parseSlugId, planFashionIds, migrateFashionSlug };



