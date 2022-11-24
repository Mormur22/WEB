
const elipse=require("./Elipse");

class Circulo extends elipse{
    constructor(x,y,r) {
        super(x,y,r,r);
    }

}

module.exports = Circulo;