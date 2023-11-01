var express = require('express');
var router = express.Router();
var con = require('../conexion');

const rand = function(){
    return Math.random().toString(36).substr(2);
};

const getToken = function(){
    return rand() + rand ();

};

/*
    {id_juego, color1_id, color1_puntaje, color2_id, color2_puntaje, color3_id, color3_puntaje}

    funcion guardarPuntaje 

SELECT id_color , SUM(puntaje) FROM `puntaje` WHERE id_color = 3; 
*/

router.get("/",function(req, res, next){
    //const {id_color} = req.query
    const sql=`SELECT C.color, SUM(puntaje.puntaje) as "puntaje" FROM "puntaje"
    INNER JOIN colores AS C ON puntaje.id_color = C.id_color GROUP BY puntaje.id_color;`
    con.query(sql, [], function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{

            res.json({
                status:"puntaje",
                puntaje: result
            })
        }
    })
})


module.exports = router;