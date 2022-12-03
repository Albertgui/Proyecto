const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path')
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const mysqlConection = require('./database');

const app = express();

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(morgan('dev'));

// Subida de imágenes con MULTER

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        // cb = Callback
        cb(null, 'uploads')

    },

    filename : (req, file, cb) => {

        cb(null, file.originalname)

    }

});

const upload = multer({storage});

// Subir imágenes 

app.post('/file', upload.single('file'), async(req, res, next) =>{

    const file = req.file;

    const filesImg = {

        ID: null,
        Nombre: file.filename,
        Imagen: file.path

    }

    // En caso que no encontremos datos

    if (!file) {

        const error = new Error('Sin data');
        error.httpStatusCode = 400;
        return next(error);

    }

    res.send(file);
    console.log(filesImg);

    mysqlConection.query('INSERT INTO files set ?', [filesImg]);

});

// Puerto de conexión

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});