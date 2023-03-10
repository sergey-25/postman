require('dotenv').config()
const express = require('express'),

    app = express(),
    fs = require('fs'),
    shell = require('shelljs'),

    // Modify the folder path in which responses need to be stored
    folderPath = 'C:\\Users\\Service\\Downloads',
    defaultFileExtension = 'json', // Change the default file extension
    bodyParser = require('body-parser'),
    DEFAULT_MODE = 'writeFile',
    path = require('path');
// const router = express.Router();
// const serverless = require('serverless-http');


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


app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.post('/parson-list', (req, res) => {

    try {
        const normalizeJson = req.body.responseData;
        console.log(req.body)
        let personInfo = {
            id: normalizeJson.id,
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
        console.log(req.body)
        const normalizeJson = JSON.parse(req.body.responseData);
        const updateObj = {...normalizeJson.data, patient_signed: true}
        const toStrResult = JSON.stringify(updateObj)

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


app.listen(process.env.PORT, () => {
    console.log('ResponsesToFile App is listening now! Send them requests my way!');
    console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});


