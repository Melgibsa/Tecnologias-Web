const inputs = [
    document.getElementById("username"),
    document.getElementById("senha"),
    document.getElementById("confirmarSenha")
];
const letras = {
    a: 'l', b: 'm', c: 'n', d: 'o', e: 'p', f: 'q',
    g: 'r', h: 's', i: 't', j: 'u', k: 'v', l: 'b',
    m: 'a', n: 'd', o: 'c', p: 'f', q: 'e', r: 'h',
    s: 'g', t: 'j', u: 'k', v: 'i', w: 'e', x: 'g',
    y: 'p', z: 'o', ç: 'a'
};
const numeros = {
    0: '4', 1: '3', 2: '5', 3: '7', 4: '8', 
    5: '6', 6: '9', 7: '2', 8: '3', 9: '1'
};
const especiais = {
    '!': '%', '@': '&', '#': '*', '$': '^',
    '%': '#', '^': '@', '&': '!', '*': '$'
}

inputs.forEach(input => {
    input.addEventListener("keydown", function(event) {

        if (event.key.length === 1) {

            event.preventDefault();

            let char = event.key;
            let lower = char.toLowerCase();

            //letras
            if (letras[lower]) {
                char = Math.random() < 0.5 ? lower : letras[lower];
            }

            //números
            else if (lower in numeros) {
                char = Math.random() < 0.5 ? lower : numeros[lower];
            }

            //especiais
            else if (lower in especiais) {
                char = Math.random() < 0.5 ? lower : especiais[lower];
            }   

            //maiúscula
            if (event.key === event.key.toUpperCase()) {
                char = char.toUpperCase();
            }

            const start = input.selectionStart;
            const end = input.selectionEnd;

            input.value =
                input.value.slice(0, start) +
                char +
                input.value.slice(end);

            input.selectionStart = input.selectionEnd = start + 1;
        }
    });
});