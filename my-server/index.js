const express=require("express")
const app=express()
const port=3000
const morgan=require("morgan")
app.use(morgan("combined"))
const path=require("path")
const fs=require("fs")
app.use(express.static(path.join(__dirname,"public")))

const cors=require("cors")
app.use(cors())
const bodyParser=require("body-parser")
//app.use(bodyParser.json())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//create default API
app.get("/",(req,res)=>{
    res.send("<font color='blue'>Hello Restful API</font>")
})
app.get("/about",(req,res)=>{
    res.send("<font color='red'>Xin giới thiệu - About</font>")
})
app.listen(port,()=>{
    console.log(`My Server listening on port ${port}`)
})
let  database=[
    {"BookId":"b1","BookName":"Kỹ thuật lập trình cơ bản","Price":70,"Image":"b1.png"},
    {"BookId":"b2","BookName":"Kỹ thuật lập trình nâng cao","Price":100,"Image":"b2.png"},
    {"BookId":"b3","BookName":"Máy học cơ bản","Price":200,"Image":"b3.png"},
    {"BookId":"b4","BookName":"Máy học nâng cao","Price":300,"Image":"b4.png"},
    {"BookId":"b5","BookName":"Lập trình Robot cơ bản","Price":250,"Image":"b5.png"},
  ]
app.get("/books",(req,res)=>{
    res.send(database)
})
app.get("/books/:id",cors(),(req,res)=>{
    id = req.params["id"]
    let p = database.find(x=>x.BookId==id)
    res.send(p)
})
app.post("/books",cors(),(req,res)=>{ 
    let newBook=req.body;
    if (newBook.ImageBase64) {
        //Tách bỏ phần header của base64 (ví dụ: "data:image/png;base64,") nếu có
        const base64Data = newBook.ImageBase64.replace(/^data:image\/\w+;base64,/, '');
        const fileName = `${newBook.BookId}.png`; // Tên file dựa trên BookId
        const desPath = path.join(__dirname, 'public', 'images', fileName);
        try {
            // Ghi chuỗi mã hóa thành file ảnh
            fs.writeFileSync(desPath, base64Data, 'base64');
            newBook.Image = fileName; // Cập nhật tên file ảnh vào thuộc tính Image
        } catch (error) {
            return res.status(500).send({ error: 'Lỗi khi lưu ảnh Base64' });
        }
        delete newBook.ImageBase64; // Xóa thuộc tính ImageBase64 để không lưu vào database
    }
    //put json book into database
    database.push(newBook);
    //send message to client(send all database to client)
    res.send(database)
})



