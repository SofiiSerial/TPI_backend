var express = require('express');
var router = express.Router();
var con = require('../conexion');

const isAdmin = function(token){
    return new Promise((resolve, reject) => { /*Se define una cadena SQL que selecciona el campo tipo de la tabla usuarios donde
     el campo token coincide con el valor proporcionado (token = ?).*/
        const sql = 'SELECT rol FROM usuarios WHERE token = ?';
        con.query(sql, [token], function(error, result, cant){
       
            if(error){
                //Si ocurre algún error durante la consulta a la base de datos, la promesa se rechaza con el error.
                reject(error);  
        
            } else {
                /*Si la consulta se realiza con éxito pero no encuentra ningún usuario con el token proporcionado 
                (es decir, el resultado de la consulta está vacío), la promesa se rechaza con el mensaje "No existe".*/
                if (result.length === 0)return( reject("No existe"));
                /* Si la consulta encuentra al menos un usuario con el token proporcionado, la promesa se resuelve
                 con el tipo de usuario asociado al primer resultado encontrado.*/
                resolve(result[0].rol); 
            
            }

        })
    })
}


//para buscae un juego por tipo de juegos
router.get("/buscarTiposJuegos",function(req, res, next){
    const {id_tipo} = req.query//La función extrae el parámetro `id_tipo` de la consulta GET utilizando 
    const sql=`SELECT J.id_juegos, J.dia, J.hora, J.lugar, J.ganador, J.turno, T.deporte, T.descripcion
    FROM juegos AS J LEFT JOIN tipos_juegos AS T ON J.id_tipo = T.id WHERE T.id = ?`
    con.query(sql, [id_tipo], function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{

            res.json({
                status:"juegos",
                juegos: result
            })
        }
    })
})
//SE RELACIONA LA TABLA JUEGOS CON LA DE TIPO_JUEGOS POR EL CAMPO DE ID_JUEGO
router.get("/",function(req, res, next){
    const sql=`SELECT J.id_juegos, J.dia, J.hora, J.lugar, J.ganador, J.turno, T.deporte, T.descripcion
    FROM juegos AS J LEFT JOIN tipos_juegos AS T ON J.id_tipo = T.id`
    con.query(sql, function(error, result){ //La consulta SQL se ejecuta utilizando la función `con.query`.
        if(error){
            res.json({
                status:"error",
                error
                /*se envía una respuesta JSON al cliente indicando un estado de error y
                 proporcionando detalles sobre el error.*/
            })
        }else{
            res.json({
                status:"juegos",
                juegos: result
                /*se envía una respuesta JSON al cliente con un estado de "juegos" y los 
                datos de los juegos recuperados de la base de datos.*/ 
            })
        }
    })
})

// POST

router.post("/",function(req, res, next){
    const {id_tipo, dia, hora, lugar, ganador, turno } = req.body
    const {token} = req.headers
    isAdmin(token)
    .then((rol) => {
        console.log(rol);
        if (rol === "admin"){
            const sql = 'INSERT INTO juegos (id_tipo, dia, hora, lugar, ganador, turno) VALUES (?, ?, ?, ?, ?, ?)'

            console.log(sql);
            
            con.query(sql, [id_tipo, dia, hora, lugar, ganador, turno], function(error, result){
                if(error){
                    res.json({
                        status:"error",
                        error  
                    })  
           
                } else {
                    res.json({
                        status:"juegos",
                        msj:"ok"
                    })
                }
            })
        }
    })
    .catch((error)=> {
        res.json({
            status:"error",
            error  
        })  
    }) 
    
})

 
router.put("/",function(req, res, next){
   //const {id_juegos} = req.query; //es la tabla donde queremos cambiar los datos
    const { id_juegos, dia, hora, lugar, ganador, id_tipo, turno} = req.body; //recibe los datos que qiere cambiar
    const sql = 'UPDATE juegos SET  dia = ?, hora = ?, lugar = ?, ganador = ?, turno = ?, id_tipo = ? WHERE id_juegos = ?'

    con.query(sql, [ dia, hora, lugar, ganador, turno, id_tipo, id_juegos], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"ok",
                msj:{ dia, hora, lugar, ganador, turno, id_tipo, id_juegos }
            })
        }
    })
})

module.exports = router;