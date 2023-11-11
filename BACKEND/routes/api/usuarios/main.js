var express = require('express');
var router = express.Router();
var con = require('../conexion');

const isAdmin = function(token){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT tipo FROM usuarios WHERE token = ?';
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
        const sql=`SELECT U.nombre, U.apellido, U.usuario, U.dni, U.rol, U.contraseña, U.token C.color FROM usuarios AS U 
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
    const sql=`SELECT U.nombre, U.apellido, U.usuario, U.dni, U.rol, U.contraseña, U.token C.color FROM usuarios AS U 
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


const setToken = function(usuario, newToken){
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE usuarios SET token = ? WHERE id = ?';
        con.query(sql, [newToken, usuario], function(error, result){
            if (error) return(reject(error));
            resolve();
        })
    })
}


router.post("/",function(req, res, next){
    const {  nombre, apellido, usuario, dni, contraseñ, rol,id_color} = req.body
    console.log({  nombre, apellido, usuario, dni, contraseñ, rol, token, id_color});
    const {token} = req.headers
    isAdmin(token)
    .then((tipo) => {
        if (tipo === "Admin"){

            const sql = 'INSERT INTO usuarios ( nombre, apellido, usuario, dni, contraseñ, rol, token, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            
            con.query(sql, [ nombre, apellido, usuario, dni, contraseñ, rol, token, id_color], function(error, result){
                if(error){
                    res.json({
                        status:"error",
                        error  
                    })  
           
                } else {
                    res.json({
                        status:"usuarios",
                        msj:{ok}
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

const getUsuario = function(user, pass){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM usuarios WHERE usuario= ? AND contraseña = ?';
        con.query(sql, [user, pass], function(error, result){
            if (error) return(reject(error));
            if (result.llength === 0) return(reject("no existe"));
            resolve(result[0]);
        })
    })
}

router.post("/login",function(req, res, next){
    const{user, pass} = req.body;
    console.log(req.query);
    getUsuario(user, pass)
    .then(async (user)=> {
        const newToken = getToken();
        console.log(user);
        await setToken(user.id, newToken);
        user.token = newToken;
        delete user.contraseña;
        //delete user.token;
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