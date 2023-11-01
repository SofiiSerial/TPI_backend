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
//aca extraemos la informacion con el dni de la persona
router.get("/buscar",function(req, res, next){
    const {id_tipo} = req.query
    const sql=`SELECT J.id_juegos, J.id_tipo, J.dia, J.hora, J.lugar, J.ganador, J.turno J.tips_juegos FROM juegos AS J
    INNER JOIN tipos_juegos AS T ON J.deportes = T.id_tipo`
    con.query(sql, [id_tipo], function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{

            res.json({
                status:"juegos",
                juegos: result
            })
        }
    })
})
*/

//relacionamos la tabla colores con usuario
router.get("/",function(req, res, next){
    const sql=`SELECT J.id_juegos, J.id_tipo, J.dia, J.hora, J.lugar, J.ganador, J.turno J.tips_juegos FROM juegos AS J
    INNER JOIN tipos_juegos AS T ON J.deportes = T.id_tipo`
    con.query(sql, function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{
            res.json({
                status:"juegos",
                juegos: result
            })
        }
    })
})

/*-
const setToken = function(id_juegos, newToken){
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE Usuarios SET token = ? WHERE id_juegoss = ?';
        con.query(sql, [newToken, id_juegos], function(error, result){
            if (error) return(reject(error));
            resolve();
        })
    })
}
/*
router.post("/login",function(req, res, next){
    const{user, pass} = req.body;
    //validar contra la UB user y pass
    getUsuario(user, pass)
    .then(async (user)=> {
        const newToken = getToken();
        await setToken(user.id_juegos, newToken);
        user.newToken = newToken;
        delete user.contraseña;
        res.json({
            status:"juegos",
            msj: (user)
        })
    })
    .catch((error) =>{
        res.json({
            status:"error",
            error
        })
    })
})*/
   

module.exports = router;