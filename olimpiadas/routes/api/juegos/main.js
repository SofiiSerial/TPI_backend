var express = require('express');
var router = express.Router();
var con = require('../conexion');

router.get("/",function(req, res, next){

    const sql = 'SELECt * FROM juegos';
    con.query(sql,function(error, result){

        res.json({
            status:"juegos",
            pasientes:result
            
        })
        
    })
    //SQL listado de Paciente
})

router.post("/",function(req, res, next){
    const { id_juegos, deporte, dia, hora, lugar, ganador } = req.body
    console.log({  id_juegos, deporte, dia, hora, lugar, ganador});

    const sql = 'INSERT INTO juegos ( id_juegos, deporte, dia, hora, lugar, ganador) VALUES (?, ?, ?)'

    con.query(sql, [ id_juegos, deporte, dia, hora, lugar, ganador], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"juegos",
                msj:{id_juegos, deporte, dia, hora, lugar, ganador}
            })
        }
    })
})

router.put("/",function(req, res, next){
    const {juegos_id} = req.query;
    const { id_juegos, deporte, dia, hora, lugar, ganador } = req.body;
    const sql = 'UPDATE juegos SE= ?, Tipo = ? WHERE ID_juegos = ?'

    con.query(sql, [ apellidos, nombres, DNI, juegos_id], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"juegos",
                msj:{ id_juegos, deporte, dia, hora, lugar, ganador  }
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

    

router.delete("/",function(req, res, next){
    const {token} = req.headers
    const {juegos_id} = req.query
    isAdmin(token)
    .then((tipo) => {
        if (tipo === "Admin"){
                res.json({
              status:"ok",
                 msj:"Eliminar"
                })  
           
            } else {
                res.json({
                    status:"error",
                    error:"sin autorizacion"
                })
         } 
    })

    .catch((error) => {

        res.json({
            status:"error",
            error
            
        })
    })
    
})

module.exports = router;