const getFechaActualMysql = ()=>{
    return new Promise((res, error) => {
        var f=new Date()
        var fecha=f.getFullYear()+"-"+f.getMonth()+"-"+f.getDate()
        res(fecha)
    })
}

const getHoraActual = ()=>{
    return new Promise((res, error) => {
        var f=new Date()
        var hora=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()
        res(hora)
    })
}

function getFechaHoraActualMysql(){
    var f=new Date()
    var fecha=f.getFullYear()+"-"+(f.getMonth() + 1)+"-"+f.getDate()
    var hora=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()
    const datos = {
        fecha: fecha,
        hora : hora
    };
    return datos
}



module.exports = {
    getFechaActualMysql,
    getHoraActual,
    getFechaHoraActualMysql
}