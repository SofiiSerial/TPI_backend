var express = require('express');
var router = express.Router();
var con = require('../conexion');


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

const rand = function(){
    return Math.random().toString(36).substr(2);
};

const getToken = function(){
    return rand() + rand ();

};

//aca extraemos la informacion con el dni de la persona
router.get("/buscar",function(req, res, next){
    const {dni} = req.query 
    const {token} = req.headers
    isAdmin(token)
    .then((tipo) => {
        const sql=`SELECT U.nombre_apellido, U.dni, U.rol, C.color FROM usuarios AS U 
        INNER JOIN colores AS C ON U.id_color = C.id_color
        WHERE U.dni = ?`
        con.query(sql, [dni], function(error, result){
            if(error){
                res.json({
                    status:"error",
                    error
                })
            }else{

                res.json({
                    status:"usuarios",
                    usuarios: result
                })
            }
        })
     })
})


//relacionamos la tabla colores con usuario
router.get("/",function(req, res, next){
    const sql=`SELECT U.nombre_apellido, U.dni, U.rol, C.color FROM usuarios AS U 
    INNER JOIN colores AS C ON U.id_color = C.id_color`
    con.query(sql, function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{
            res.json({
                status:"usuarios",
                usuarios: result
            })
        }
    })
})
/*
const getUsuario = function(user, pass){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Usuarios WHERE Nombre_usuario = ? AND Contraseña = ?';
        con.query(sql, [user, pass], function(error, result){
            if (error) return(reject(error));
            if (result.llength === 0) return(reject("no existe"));
            resolve(result[0]);
        })
    })
}
*/
const setToken = function(ID_usuario, newToken){
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE Usuarios SET token = ? WHERE ID_usuarios = ?';
        con.query(sql, [newToken, ID_usuario], function(error, result){
            if (error) return(reject(error));
            resolve();
        })
    })
}


router.post("/",function(req, res, next){
    const { color} = req.body
    console.log({ color});
    const {token} = req.headers
    isAdmin(token)
    .then((tipo) => {
        if (tipo === "Admin"){

            const sql = 'INSERT INTO colores ( color) VALUES (?)'
            
            con.query(sql, [ color], function(error, result){
                if(error){
                    res.json({
                        status:"error",
                        error  
                    })  
           
                } else {
                    res.json({
                        status:"colores",
                        msj:{ color}
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
    const {id_color} = req.query;
    const {color} = req.body;
    const sql = 'UPDATE colores SET color = ? WHERE id_color = ?'

    con.query(sql, [ color, id_color], function(error, result){
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

/*
router.post("/login",function(req, res, next){
    const{user, pass} = req.body;
    getUsuario(user, pass)
    .then(async (user)=> {
        const newToken = getToken();
        await setToken(user.ID_usuario, newToken);
        user.newToken = newToken;
        delete user.contraseña;
        res.json({
            status:"usuarios",
            msj: (user)
        })
    })
    .catch((error) =>{
        res.json({
            status:"error",
            error
        })
    })
})
   

*/
module.exports = router;