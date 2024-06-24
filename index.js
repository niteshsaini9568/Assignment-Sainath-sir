const express = require("express");
const multer = require('multer');
const fs = require('fs-extra');
const app = express();

let port = 8000;
let jsonfile = '';

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("upload", { data: null });
});

app.get("/download", (req, res) => {
    res.render("download");
});

var storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        jsonfile = file.originalname + '-' + Date.now() + ".json";
        cb(null, jsonfile);
    }
});

var upload = multer({ storage: storage });

app.post("/", upload.single('file'), (req, res) => {
    fs.readFile(`uploads/${jsonfile}`, 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading the file.");
            return;
        }
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error(parseError);
            res.status(400).send("Invalid JSON format.");
            return;
        }
        res.render('upload', { data: jsonData });
    });
});

app.post("/return" , (req,res)=>{
    let data = JSON.stringify(req.body)
    console.log(data)
    fs.writeFile("data/data.json", data, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
        }
    });
    res.send("Json data is send successfully")
})

app.listen(port, () => {
    console.log("Server is listening at the port", port);
});
