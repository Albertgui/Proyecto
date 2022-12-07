const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path')
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const mysqlConection = require('./database');
const fs = require('fs').promises;

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

// Mostrar las imágenes

app.get('/upload', (req, res) =>{

    mysqlConection.query('SELECT * from files', (err, rows, fileds) => {

        if (!err) {

            res.json(rows);

        }

        else {

            console.log(err);

        }

    });

});

// Mostrar una sola imagen 

app.get('/imagen/:id', (req, res) =>{

    const id = req.params.id;

    mysqlConection.query('SELECT Imagen FROM files WHERE id = ?', id, (err, rows, fields) => {

        [{Imagen}] = rows;

        res.send({Imagen});

    });

});


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

// Eliminar imágenes

app.delete('/delete/:id', (req, res) => {

    const {id} = req.params;
    deleteFile(id);
    mysqlConection.query('DELETE FROM files WHERE id = ?', [id]);
    res.json({message: "Imagen eliminada correctamente"});

});

function deleteFile(id) {

    mysqlConection.query('SELECT * FROM files WHERE id = ?', [id], (err, rows, fields) =>{

        [{Imagen}] = rows;

        fs.unlink(path.resolve('./'+ Imagen)).then(() => {

            console.log('Imagen eliminada del servidor');

        });

    });

}

// Ingreso

app.post('/auth/:id', (req, res) =>{

    const id = req.params.id;

    mysqlConection.query('SELECT id FROM files WHERE id = ?', id, (err, rows, fields) => {

        res.send({message: 'Ingreso correcto'});

    });

});

// Puerto de conexión

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});