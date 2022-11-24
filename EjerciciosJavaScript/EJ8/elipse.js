
const figura= require("./Figura");

class Elipse extends figura {
    // constructor
    constructor(x,y,rh,rv) {
        super(x,y,"aa#000000");
        this.rh=rh;
        this.rv=rv;
    }

    pintar() {
        super.pintar();
        console.log("Pintamos elipse de radios "+this.rh+" y "+this.rv);
    }

}

module.exports = Elipse;