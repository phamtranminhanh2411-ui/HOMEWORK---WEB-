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
const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017", { serverSelectionTimeoutMS: 5000 });
const database = client.db(process.env.MONGODB_DB || "FashionData");
const fashionCollection = database.collection("Fashion");

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
    await fashionCollection.insertOne(req.body)
    res.send(req.body)
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

    return app.listen(port, () => console.log(`My Server listening on port ${port}`));
}
if (require.main === module) start().catch(async error => {
    console.error('Khởi động thất bại:', error.message);
    await client.close();
    process.exitCode = 1;
});
module.exports = { app, start, client };



