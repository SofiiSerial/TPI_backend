var express = require('express');
var router = express.Router();
var con = require('../conexion');

router.get("/",function(req, res, next){

    const sql = 'SELECt * FROM tipos_juegos';
    con.query(sql,function(error, result){

        res.json({
            status:"tipos_juegos",
            tipos_juegos:result
            
        })
        
    })
    //SQL listado de profecionales
})

router.post("/",function(req, res, next){
    const {id, deporte, descripcion} = req.body
    console.log({ id, deporte, descripcion });

    const sql = 'INSERT INTO tipos_juegos (id, deporte, descripcion ) VALUES ( ?, ?, ?)'

    con.query(sql, [id, deporte, descripcion ], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"tipos_juegos",
                msj:{id, deporte, descripcion }
            })
        }
    })
})

router.put("/",function(req, res, next){
    const {tipos_juegos} = req.query;
    const {id, deporte, descripcion  } = req.body;
    const sql = 'UPDATE tipos_juegos SET Telefono = ?, Tipo = ? WHERE ID_tipos_juegos = ?'

    con.query(sql, [id, deporte, descripcion, tipos_juegos], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"tipos_juegos",
                msj:{id, deporte, descripcion }
            })
        }
    })
})

const isAdmin = function(token){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT tipo FROM Usuarios WHERE token = ?';
        con.query(sql, [token], function(error, result, cant){

            if(error){
                reject(error);  
        
            } else {

                if (result.length === 0)return( reject("No existe"));
                resolve(result[0].tipo); 
            
            }

        })
    })
}

module.exports = router;