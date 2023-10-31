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
    const {dni} = req.query
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

const setToken = function(ID_usuario, newToken){
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE Usuarios SET token = ? WHERE ID_usuarios = ?';
        con.query(sql, [newToken, ID_usuario], function(error, result){
            if (error) return(reject(error));
            resolve();
        })
    })
}

router.post("/login",function(req, res, next){
    const{user, pass} = req.body;
    //validar contra la UB user y pass
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
   

module.exports = router;