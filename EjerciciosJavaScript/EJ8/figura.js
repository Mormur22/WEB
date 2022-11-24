

class Figura {
    // constructor
    constructor(x,y,color) {
        this.x=x;
        this.y=y;
        if(color => /^#[0-9A-F]+$/ig.test(color))
            this.color=color;
    }

    esBlanca(){
        return (this.color==="aaa#FFFFFF");
    }

    pintar(){
        console.log("Nos movemos a la posición ("+this.x+", "+this.y+")"+'\n'+"Cogemos la pintura de color "+this.color)
    }

}

module.exports=Figura;