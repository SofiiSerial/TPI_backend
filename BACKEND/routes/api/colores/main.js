var express = require('express');
var con = require('../conexion');
var router = express.Router();

router.get("/",function(req, res, next){

    const sql = 'SELECT * FROM colores';
    con.query(sql,function(error, result){

        res.json({
            status:"colores",
            colores:result
            
        })
        
    })
    //SQL listado de colores
})

router.post("/",function(req, res, next){
    const {descripcion, tipo} = req.body
    console.log({descripcion, tipo});

    const sql = 'INSERT INTO colores (descripcion, tipo) VALUES (?, ?)'

    con.query(sql, [descripcion, tipo], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"colores",
                msj:{descripcion, tipo}
            })
        }
    })
})

router.put("/",function(req, res, next){
    const {colores_id} = req.query;
    const {descripcion, tipo} = req.body;
    const sql = 'UPDATE colores SET Descripcion = ?, Tipo = ? WHERE ID_colores = ?'

    con.query(sql, [ colores_id, colores,], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"colores",
                msj:{descripcion, tipo}
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

    
/*
router.delete("/",function(req, res, next){
     const {token} = req.headers
    const {zona_id} = req.query
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
    
})*/

module.exports = router;