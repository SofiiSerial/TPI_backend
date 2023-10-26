var express = require('express');
var router = express.Router();
var con = require('../conexion');

router.get("/",function(req, res, next){

    const sql = 'SELECt * FROM personas_juegos';
    con.query(sql,function(error, result){

        res.json({
            status:"personas_juegos",
            personas_juegos:result
            
        })
        
    })
    //SQL listado de profecionales
})

router.post("/",function(req, res, next){
    const {id_juegos, DNI_participante, participo} = req.body
    console.log({id_juegos, DNI_participante, participo });

    const sql = 'INSERT INTO personas_juegos (id_juegos, DNI_participante, participo ) VALUES ( ?, ?, ?)'

    con.query(sql, [id_juegos, DNI_participante, participo ], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"personas_juegos",
                msj:{id_juegos, DNI_participante, participo }
            })
        }
    })
})

router.put("/",function(req, res, next){
    const {personas_juegos} = req.query;
    const {id_juegos, DNI_participante, participo  } = req.body;
    const sql = 'UPDATE personas_juegos SET Telefono = ?, Tipo = ? WHERE ID_personas_juegos = ?'

    con.query(sql, [id_juegos, DNI_participante, participo, personas_juegos], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"personas_juegos",
                msj:{id_juegos, DNI_participante, participo }
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