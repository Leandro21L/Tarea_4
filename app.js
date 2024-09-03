const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const busesFilePath = './buses.json';

// Cargar los buses desde el archivo JSON
function loadBuses() {
    if (fs.existsSync(busesFilePath)) {
        return JSON.parse(fs.readFileSync(busesFilePath, 'utf8'));
    }
    return {};
}

// Guardar los buses en el archivo JSON
function saveBuses(buses) {
    fs.writeFileSync(busesFilePath, JSON.stringify(buses, null, 4), 'utf8');
}

// Página principal para registrar y listar buses
app.get('/', (req, res) => {
    const buses = loadBuses();
    res.render('index', { buses, error: null });
});

app.post('/register', (req, res) => {
    const { placa, tiempoLlegada } = req.body;
    let buses = loadBuses();

    if (buses[placa]) {
        res.render('index', { buses, error: 'El bus ya esta registrado'})
        //buses[placa].tiempoLlegada = tiempoLlegada;
        //buses[placa].ediciones += 1;
    } else {
        buses[placa] = { tiempoLlegada, ediciones: 0 };
    }

    saveBuses(buses);
    res.redirect('/');
});

// Buscar un bus y mostrar cuántas veces ha sido editado
app.get('/search', (req, res) => {
    res.render('search', { bus: null });
});

app.post('/search', (req, res) => {
    const { placa } = req.body;
    const buses = loadBuses();
    const bus = buses[placa] || null;
    res.render('search', { bus });
});

// Formulario para borrar un bus
app.get('/delete', (req, res) => {
    res.render('delete');
});

app.post('/delete', (req, res) => {
    const { placa } = req.body;
    let buses = loadBuses();

    if (buses[placa]) {
        delete buses[placa];
        saveBuses(buses);
    }

    res.redirect('/');
});

// Formulario para editar el tiempo de llegada de un bus
app.get('/edit', (req, res) => {
    res.render('edit', { bus: null });
});

app.post('/edit', (req, res) => {
    const { placa, nuevoTiempoLlegada } = req.body;
    let buses = loadBuses();

    if (buses[placa]) {
        buses[placa].tiempoLlegada = nuevoTiempoLlegada;
        buses[placa].ediciones += 1;
        saveBuses(buses);
    }

    res.redirect('/');
});

app.set('view engine', 'ejs');

app.listen(12000, () => {
    console.log('EL servidor esta corriendo en http://localhost:12000');
});
