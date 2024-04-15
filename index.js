var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
const {realizarQuery} = require('./modulos/mysql.js')

var app = express(); //Inicializo express
var port = process.env.PORT || 3000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */
app.get('/tablas', async function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    const cafes = await realizarQuery(`
        SELECT * FROM Cafes
    `)
    const empleados = await realizarQuery(`
    SELECT * FROM Empleados
    `)
    const productos = await realizarQuery(`
    SELECT * FROM Productos
    `)
    console.log({cafes, empleados, productos})
    res.send(cafes, empleados, productos)
    
})

app.get('/cafes', async function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    const cafes = await realizarQuery(`
        SELECT * FROM Cafes
    `)
    console.log({cafes, empleados, productos})
    res.send( cafes)
    
})
app.get('/productos', async function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    const Productos = await realizarQuery(`
        SELECT * FROM Productos
    `)
    console.log({cafes, empleados, productos})
    res.send( productos)
    
})

app.get('/empleados', async function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    var empleados = ""
    if (req.query.nombre) {   
        empleados = await realizarQuery(`
        SELECT * FROM Empleados WHERE nombre = "${req.query.nombre}"
        `)
    } else {
        empleados = await realizarQuery(`
        SELECT * FROM Empleados
        `)
    }
    console.log({empleados})
    res.send(empleados)
    
})

app.post('/postempleados', async function(req,res) {
    console.log(req.body);
    try {
        // Verificar si ya existe un empleado con el mismo dni
        const [existingEmpleados] = await realizarQuery(`
            SELECT * FROM Empleados WHERE dni = '${req.body.dni}'
        `);
        if (existingEmpleados && existingEmpleados.length > 0) {
            // Si ya existe un empleado con el mismo dni, enviar un mensaje de error
            return res.status(400).send("El empleado ya existe en la base de datos.");
        }

        // Si no existe un empleado con el mismo dni, proceder con la inserción
        await realizarQuery(`
            INSERT INTO Empleados(dni, nombre, apellido, edad, cafe_id)
            VALUES('${req.body.dni}', '${req.body.nombre}', '${req.body.apellido}',
            '${req.body.edad}',  ${req.body.cafe_id})`);
        res.send("ok");
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).send("Ocurrió un error al procesar la solicitud.");
    }
});

app.post('/postcafes', async function(req,res) {
    console.log(req.body);
    try {
        // Verificar si ya existe un café con el mismo café_id
        const [existingCafes] = await realizarQuery(`
            SELECT * FROM Cafes WHERE cafe_id = '${req.body.cafe_id}'
        `);
        if (existingCafes && existingCafes.length > 0) {
            // Si ya existe un café con el mismo café_id, enviar un mensaje de error
            return res.status(400).send("El café ya existe en la base de datos.");
        }

        // Si no existe un café con el mismo café_id, proceder con la inserción
        await realizarQuery(`
            INSERT INTO Cafes(cafe_id, nombre, direccion, cant_empleados, hora_apertura, hora_cierre)
            VALUES('${req.body.cafe_id}', '${req.body.nombre}', '${req.body.direccion}',
            '${req.body.cant_empleados}', '${req.body.hora_apertura}', '${req.body.hora_cierre}')`);
        res.send("ok");
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).send("Ocurrió un error al procesar la solicitud.");
    }
});

app.post('/postproductos', async function(req,res) {
    console.log(req.body);
    try {
        // Verificar si ya existe un producto con el mismo nombre
        const [existingProductos] = await realizarQuery(`
            SELECT * FROM Productos WHERE nombre = '${req.body.nombre}'
        `);
        if (existingProductos && existingProductos.length > 0) {
            // Si ya existe un producto con el mismo nombre, enviar un mensaje de error
            return res.status(400).send("El producto ya existe en la base de datos.");
        }

        // Si no existe un producto con el mismo nombre, proceder con la inserción
        await realizarQuery(`
            INSERT INTO Productos(nombre, precio, apto_celiaco, es_bebida, cafe_id)
            VALUES('${req.body.nombre}', '${req.body.precio}',
            '${req.body.apto_celiaco}', '${req.body.es_bebida}', '${req.body.cafe_id}')`);
        res.send("ok");
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).send("Ocurrió un error al procesar la solicitud.");
    }
});

app.put('/putempleados', async function(req,res){
    console.log(req.query) 
    const condition = req.body
    await realizarQuery(`
        UPDATE * FROM Empleados
        SET nombre = '${req.body.nombre}'
        WHERE dni = '${req.body.dni}'
    `)
    res.send("ok")
})
app.put('/putcafes', async function(req,res){
    console.log(req.query) 
    const condition = req.body
    await realizarQuery(`
        UPDATE * FROM Cafes
        SET direccion = '${req.body.direccion}'
        WHERE cafe_id = '${req.body.cafe_id}'
    `)
    res.send("ok")
})
app.put('/putproductos', async function(req,res){
    console.log(req.query) 
    const condition = req.body
    await realizarQuery(`
        UPDATE * FROM Productos
        SET precio = '${req.body.precio}'
        WHERE producto_id = '${req.body.dni}'
    `)
    res.send("ok")
})

app.delete('/deleteempleados', async function(req,res){
    console.log(req.query) 
    const condition = req.body
    await realizarQuery(`
        DELETE * FROM Empleados
        WHERE dni = '${req.body.dni}'
    `)
    res.send("ok")
})
app.delete('/deletecafes', async function(req,res){
    console.log(req.query) 
    const condition = req.body
    await realizarQuery(`
        DELETE * FROM Cafes
        WHERE cafe_id = '${req.body.cafe_id}'
    `)
    res.send("ok")
})
app.delete('/deleteproductos', async function(req,res){
    console.log(req.query) 
    const condition = req.body
    await realizarQuery(`
        DELETE * FROM Productos
        WHERE producto_id = '${req.body.producto_id}'
    `)
    res.send("ok")
})


//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log('   [GET] http://localhost:3000/tablas');
    console.log('   [GET] http://localhost:3000/empleados?nombre=Guillermo');
    console.log('   [POST] http://localhost:3000/postempleados');
    console.log('   [POST] http://localhost:3000/postcafes');
    console.log('   [POST] http://localhost:3000/postproductos');  
    console.log('   [PUT] http://localhost:3000/putempleados');
    console.log('   [PUT] http://localhost:3000/putcafes');
    console.log('   [PUT] http://localhost:3000/putproductos'); 

    console.log('   [DELETE] http://localhost:3000/deleteempleados');
    console.log('   [DELETE] http://localhost:3000/deletecafes');
    console.log('   [DELETE] http://localhost:3000/deleteproductos');     
});
