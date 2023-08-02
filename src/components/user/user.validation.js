import joi from 'joi';

export const addUserSchema = {
    body: joi.object().required().keys({
        email: joi.string().required().email(),
        name: joi.string().required(),
        password: joi.string().required(),
        confirm: joi.string().valid(joi.ref('password')).required()
    })
}




export const signInSchema = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}

export const NoDataSchema = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}
