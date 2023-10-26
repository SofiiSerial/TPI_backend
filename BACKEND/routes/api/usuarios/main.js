var express = require('express');
var router = express.Router();
var con = require('../conexion');

const rand = function(){
    return Math.random().toString(36).substr(2);
};

const getToken = function(){
    return rand() + rand ();

};

router.get("/",function(req, res, next){
    res.json({
        status:"usuarios"
        
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