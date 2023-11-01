var express = require('express');
var router = express.Router();
var con = require('../conexion');

const rand = function(){
    return Math.random().toString(36).substr(2);
};

const getToken = function(){
    return rand() + rand ();

};

//aca extraemos la informacion con el dni de la persona
router.get("/buscar",function(req, res, next){
    const {id_tipo} = req.query
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


//relacionamos la tabla colores con usuario
router.get("/",function(req, res, next){
    const sql=`SELECT J.id_juegos, J.dia, J.hora, J.lugar, J.ganador, J.turno, T.deporte, T.descripcion
    FROM juegos AS J LEFT JOIN tipos_juegos AS T ON J.id_tipo = T.id`
    con.query(sql, function(error, result){
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


module.exports = router;