console.log("Escribe tu nombre");
var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    console.log("Tu nombre es: " + 
        d.toString().trim());
  });