"use strict"
/*function fibAux(n) {
    if (n === 0) {
        return 0;
    } else if (n === 1) {
                return 1;
            } else {
                return fibAux(n-1) + fibAux(n-2);
            }
}

function fib(n) {
    console.assert(typeof(n) === "number", `${n} is not a number`);
    return fibAux(n);
}

module.exports = fib;*/

const PHI = (1 + Math.sqrt(5)) / 2;
// Cambio la función fibAux por esta:
function fibMasEficiente(n) {
    const p1 = Math.pow(PHI, n);
    const p2 = Math.pow(1 - PHI, n);
    return Math.round((p1 - p2) / Math.sqrt(5));
}
function fib(n) {
    console.assert(typeof(n) === "number",
    `fib: ${n} is not a number`);
    return fibMasEficiente(n);
}
module.exports = fib;