const dotenv = require('dotenv');
dotenv.config(`${process.env.SECRET_KEY}`);

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;

    const [authType, authToken] = (authorization || '').split(' ');

    if (!authToken || authType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인이 필요한 기능입니다.',
        });
        return;
    }

    try {
        const { userId } = jwt.verify(authToken, `${process.env.SECRET_KEY}`);

        Users.findOne({ where: { userId } }).then((user) => {
            if(user){
                res.locals.user = user;
            next();
            } else {
                throw new Error ()
            }
            
        });
    } catch (err) {
        res.status(400).json({ errorMessage: '로그인이 필요합니다.' });
    }
};
