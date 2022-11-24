// clase
class Figura {
    // constructor
    constructor(x,y,color) {
        this.x=x;
        this.y=y;
        if(color => /^#[0-9A-F]+$/i.test(color))
            this.color=color;
    }

    esBlanca(){
        return (this.color==="aaa#FFFFFF");
    }

    pintar(){
        console.log("Nos movemos a la posición ("+this.x+", "+this.y+")"+'\n'+"Cogemos la pintura de color "+this.color)
    }

}

// herencia
class Elipse extends Figura {
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


class Circulo extends Elipse{
    constructor(x,y,r) {
        super(x,y,r,r);
    }

}

let prueba = new Elipse(1, 1,20,20);
prueba.pintar();
console.log(prueba.esBlanca());

let prueba2 = new Circulo(1, 1,20);
prueba2.pintar();
console.log(prueba2.esBlanca());


