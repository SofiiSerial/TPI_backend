var express = require('express');
var router = express.Router();
var con = require('../conexion');

const rand = function(){
    return Math.random().toString(36).substr(2);
};

const getToken = function(){
    return rand() + rand ();

};

//aca extraemos la informacion con el id_tipos_juegos de la persona
router.get("/buscar",function(req, res, next){
    const {id} = req.query
    const sql=`SELECT T.id, T.id, T.descripcion, T.juegos FROM tipos_juegos AS T
    INNER JOIN juegos AS J ON J.id T.id_tipo = J.id WHERE T.juegos = ? `
    con.query(sql, [id], function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{

            res.json({
                status:"tipos_juegos",
                tipos_juegos: result
            })
        }
    })
})


//relacionamos la tabla colores con usuario
router.get("/",function(req, res, next){
    const sql=`SELECT T.id, T.id, T.descripcion, T.juegos FROM tipos_juegos AS T
    INNER JOIN juegos AS J ON J.id T.id_tipo = J.id`
    con.query(sql, function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{
            res.json({
                status:"tipos_juegos",
                tipos_juegos: result
            })
        }
    })
})

router.post("/",function(req, res, next){
    const {deporte, descripcion} = req.body
    const sql = `INSERT INTO tipos_juegos (deporte, descripcion) VALUES (?, ?)`

    con.query(sql, [deporte, descripcion ], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"ok"
            })
        }
    })
})


router.put("/",function(req, res, next){
    //const {id} = req.query; //es la tabla donde queremos cambiar los datos
    const {id, deporte, descripcion} = req.body; //recibe los datos que qiere cambiar
    const sql = 'UPDATE tipos_juegos SET deporte = ?, descripcion = ? WHERE id = ?'

    con.query(sql, [deporte, descripcion, id], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"ok",
                msj:{ }
            })
        }
    })
}) 

module.exports = router;