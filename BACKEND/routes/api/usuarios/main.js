var express = require('express');
var router = express.Router();
var con = require('../conexion');

router.get("/buscar",function(req, res, next){
    const {documento} = req.query 
    const {token} = req.headers

    isAdmin(token)
    .then((rol) => {
        const sql=`SELECT U.nombre, U.apellido, U.usuario, U.dni, U.rol, C.color FROM usuarios AS U 
        INNER JOIN colores AS C ON U.id_color = C.id_color
        WHERE U.dni = ?`
        con.query(sql, [documento], function(error, result){
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

     .catch((error)=> {
        res.json({
            status:"error",
            error  
        })  
    }) 
})

//aca extraemos el color con el dni de la persona
router.get("/buscarcolor",function(req, res, next){
    const {documento} = req.query;

        const sql=`SELECT U.nombre, U.apellido, U.usuario, U.dni, U.rol, C.color FROM usuarios AS U 
        INNER JOIN colores AS C ON U.id_color = C.id_color
        WHERE U.dni = ?`; 
        //
        //const {usuario, contrasenia} = req.query;

        // WHERE U.usuario = ? and U.contrasenia =?`; 
        con.query(sql, [documento], function(error, result){
            if(error){
                res.json({
                    status:"error",
                    error
                })
            }else{

                console.log(result);

                res.json({
                    status:"ok",
                    resultado: result
                })
            }
        })

})

//relacionamos la tabla colores con usuario
router.get("/",function(req, res, next){
    const sql=`SELECT U.nombre, U.apellido, U.usuario, U.dni, U.rol, U.contrasenia, U.token, C.color FROM usuarios AS U 
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
    const {  nombre, apellido, usuario, dni, contraseña, rol,id_color} = req.body
    console.log({  nombre, apellido, usuario, dni, contraseña, rol, token, id_color});
    const {token} = req.headers
    isAdmin(token)
    .then((rol) => {
        if (rol === "Admin"){

            const sql = 'INSERT INTO usuarios ( nombre, apellido, usuario, dni, contraseña, rol, token, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            
            con.query(sql, [ nombre, apellido, usuario, dni, contraseña, rol, token, id_color], function(error, result){
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
        const sql = 'SELECT * FROM usuarios WHERE usuario= ? AND contrasenia = ?';
        console.log("Consulta: "+sql+" usuario: "+user+" contrasenia: "+pass);
        con.query(sql, [user, pass], function(error, result){
            if (error) return(reject(error));
            if (result.length === 0) return(reject("no existe"));
            console.log(result[0]);
            resolve(result[0]);
        })
    })
}

const isAdmin = function(token){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT rol FROM usuarios WHERE token = ?';
        con.query(sql, [token], function(error, result, cant){

            if(error){
                reject(error);  
        
            } else {

            if (result.length === 0)return( reject("No existe el token"));
             resolve(result[0].rol); 
            
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

router.post("/login",function(req, res, next){
    //const{user, pass} = req.body.params;
    const  user = req.body.usuario;
    const pass = req.body.contrasenia;

    //console.log(req.body.params,user,pass);
    getUsuario(user, pass)
    
    .then(async (user)=> {
        const newToken = getToken();
        console.log("usuario "+user);
        await setToken(user.id, newToken);
        user.token = newToken;
        delete user.contrasenia;
        //delete user.token;
        res.json({
            status:"Usuarios",
            user
        })
    })
    .catch((error) =>{
        console.log(error);
        res.json({
            status:"error de algo",
            error
        })
    })
})

module.exports = router;