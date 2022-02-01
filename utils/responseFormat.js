
successResponse = (req,res,data,message="default",code=200) =>{
    if(message === "default") {
        message = 'success';
    }
    const err = 0;
    return res.status(code).send({err,data,message});
}

errorResponse = (req,res,data,message="default",code=500) => {
    if(message === "default"){
        message = 'error';
    }
    const err = 1
    return res.status(code).send({err,data,message});
}

module.exports = { successResponse , errorResponse };