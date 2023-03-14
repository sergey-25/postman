require('dotenv').config()
const crypto = require('crypto');
const { createSign, createVerify } = require('crypto');

const buffer = require('buffer');
const mongoose = require('mongoose');
const Post = require('./models/posts');
const TextFile = require('./models/textFile');
const express = require('express'),

    app = express(),
    fs = require('fs'),
    shell = require('shelljs'),

    // Modify the folder path in which responses need to be stored
    folderPath = process.env.FILES_PATH,
    defaultFileExtension = 'json', // Change the default file extension
    bodyParser = require('body-parser'),
    DEFAULT_MODE = 'writeFile',
    path = require('path');


// Create the folder path in case it doesn't exist
shell.mkdir('-p', folderPath);

// Change the limits according to your response size
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

let arr = [{
    id: '91e01f46-6c69-4699-81c5-ab23e9b65fa4',
    inserted_at: '2023-03-03T13:11:51.830633Z',
    person_id: '172aa0a5-1dc4-4ca9-b0a5-c5b6ee251c49',
    status: 'SIGNED',
    updated_at: '2023-03-03T13:13:07.406794Z',
    birth_date: '1987-11-25',
    first_name: 'Гаррі',
    last_name: 'Поттер'
}
];


const setNewData = (newArr) => {
    arr = [...newArr]
    console.log(arr, 'this is updated array')
    console.log(arr.length)
    return arr
}

const key = crypto.randomBytes(32);

const message = 'This is the message that we want to encrypt.';
const doc = fs.readFileSync('C:\\Users\\Service\\Downloads\\Person_Нолан_Крістофер.txt', 'utf-8');
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encrypted = cipher.update(doc, 'utf8', 'hex');

encrypted += cipher.final('hex');
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
// const private_key = fs.readFileSync('keys/privateKey.pem', 'utf-8');
// const public_key = fs.readFileSync('keys/publicKey.pem', 'utf-8');
// const data = 'this data must be signed';
//
// /// SIGN
//
// const signer = createSign('rsa-sha256');
//
// signer.update(data);
//
// const siguature = signer.sign(private_key, 'hex');
//
// console.log(siguature);
//
// /// VERIFY
//
// const verifier = createVerify('rsa-sha256');
//
// verifier.update(data);
//
// const isVerified = verifier.verify(public_key, siguature, 'hex');
//
// console.log(isVerified);

// // File/Document to be signed
// const doc = fs.readFileSync('C:\\Users\\Service\\Downloads\\Person_Нолан_Крістофер.txt');
//
// // Signing
// const signer = crypto.createSign('RSA-SHA256');
// signer.write(doc);
// signer.end();
//
// // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
// const signature = signer.sign(private_key, 'base64')
// fs.writeFileSync('C:\\Users\\Service\\Desktop\\Person-list_res\\Persons.txt', signature);

app.get('/', (req, res) => {
    // res.send('Hello, I write data to file. Send them requests!');
    res.download('C:\\Users\\Service\\Desktop\\Person-list_res\\Persons.txt');
});

app.post('/parson-list', (req, res) => {

    try {

        const {first_name, last_name, person_id, birth_date, status} = req.body.responseData;
        const post = new Post({first_name, last_name, person_id, birth_date, status})
        post.save().then(r => res.send(r)).catch((err) => {
            console.log(err)
        });

        const normalizeJson = req.body.responseData;
        console.log(req.body)
        let personInfo = {
            id_req: normalizeJson.id,
            birth_date: normalizeJson.birth_date,
            first_name: normalizeJson.first_name,
            last_name: normalizeJson.last_name,
            inserted_at: normalizeJson.inserted_at,
            person_id: normalizeJson.person_id,
            status: normalizeJson.status
        }
        arr.push(personInfo);
        fs.readFile('C:\\Users\\Service\\Desktop\\Person-list_res\\Persons.txt', 'utf8',
            function (error, data) {
                someFn(data)
            })

        function someFn(data) {
            const parseData = JSON.parse(data);
            console.log(parseData)
            let parseArr = []
            parseArr.push(personInfo)
            const newArr = [...parseData, ...parseArr]
            console.log(newArr, 'this spread array')
            console.log(newArr.length)
            setNewData(newArr);
        }

        res.send(arr)
        console.log(arr)
        const toStrResult = JSON.stringify(arr)
        const extension = req.body.fileExtension || defaultFileExtension
        const fsMode = req.body.mode || DEFAULT_MODE
        const uniqueIdentifier = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false
        const fileName = `Persons`
        const filePath = `${path.join('C:\\Users\\Service\\Desktop\\Person-list_res', fileName)}.${extension}`
        const options = req.body.options || undefined;

        fs[fsMode](filePath, toStrResult, options, (err) => {
            console.log(err)
        });
    } catch (err) {
        console.log(err)
    }
});


app.post('/write', (req, res) => {
    try {

        const normalizeJson = JSON.parse(req.body.responseData);
        const updateObj = {...normalizeJson.data, patient_signed: true}
        const toStrResult = JSON.stringify(updateObj)

        const postData = new TextFile({
            data: toStrResult
        })
        postData.save();
        // console.log(req.body)

        let extension = req.body.fileExtension || defaultFileExtension,
            fsMode = req.body.mode || DEFAULT_MODE,
            uniqueIdentifier = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false,
            filename = `Person_${normalizeJson.data.person.first_name}_${normalizeJson.data.person.last_name}`
        filePath = `${path.join(folderPath, filename)}.${extension}`,
            options = req.body.options || undefined;


        fs[fsMode](filePath, toStrResult, options, (err) => {
            if (err) {

                res.send('Error');
            } else {
                res.send('Success');
            }
        });
    } catch (err) {
        console.log(err)
    }

});
const uri = 'mongodb+srv://sergey25111988:cHfELuTQhrTVclDE@datapersons.pxcehcb.mongodb.net/dataPersons?retryWrites=true&w=majority'

async function connectToDb() {
    try {
        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Success connect to DB')
    } catch (error) {
        console.error(error);
    }
}

connectToDb();

app.listen(process.env.PORT, () => {
    console.log('ResponsesToFile App is listening now! Send them requests my way!');
    console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
    console.log(folderPath)
    // console.log(`Signature:\n\n ${siguature}`);
    // console.log(isVerified);
console.log(encrypted)
    // console.log(decrypted)
});



