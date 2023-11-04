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

const guardarPuntaje = function (id_juego, color_id, puntaje){
    return new Promise((resolve, reject) => {
        // sql insert 
       const sql = "INSERT INTO puntaje (id_juegos, id_color, puntaje) VALUES (?, ?, ?)"
       con.query(sql, [id_juego, color_id, puntaje], function(error, result){
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
}


router.post("/",function(req, res, next){
    const {id_juego, color1_id, color1_puntaje, color2_id, color2_puntaje, color3_id, color3_puntaje} = req.body
    //llamar guardar puntaje para cada color


})

router.get("/buscar",function(req, res, next){
    const {} = req.query
    const sql=`SELECT C.color, SUM(P.puntaje) as puntaje1" FROM puntaje
    INNER JOIN colores AS C ON P.id_color = C.id_color GROUP BY P.id_color;
    WHERE P.id_color = ?`
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

router.get("/",function(req, res, next){
    //const {} = req.query
    const sql=`SELECT C.color, SUM(P.puntaje) as puntaje FROM puntaje AS P
    INNER JOIN colores AS C ON P.id_color = C.id_color GROUP BY P.id_color;`
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