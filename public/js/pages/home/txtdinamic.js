const txt_dinamic = document.getElementById("txt-dinamic");

const array = [
    "com o frescor de cada manhã!",
    "direto do forno para você!",
    "trazendo momentos deliciosos!"
];

/* Variáveis de controle */
let indexLetters = 0; // Índice referente ao caracter no array.
let index = 0; // Índice referente ao elemento no array.
let sentence = ""; // String referente a frase no texto dinâmico.
let interval = false; // Bloqueio para execução do código.

let intervalCaracter;
let intervalEspera;

if (index < array.length) { // Se não percorremos o array por completo, execute.

    if (!interval) intervalCaracter = setInterval(escrevaCaracter, 150);

    function escrevaCaracter() {
        if (indexLetters < array[index].length) {
            sentence = array[index][indexLetters]
            txt_dinamic.textContent += sentence;

            indexLetters++;
        } else {
            interval = true;

            clearInterval(intervalCaracter);

            txt_dinamic.classList.add("espera");
            intervalEspera = setTimeout(tempoDeEspera, 10000);
        }
    }

    function tempoDeEspera() {
        setTimeout(() => {
            txt_dinamic.classList.remove("espera");
        }, 1700)

        setTimeout(() => {
            index++;
            indexLetters = 0;
            sentence = "";

            txt_dinamic.textContent = "";

            if (index >= array.length) {
                index = 0;
            }

            interval = false;

            intervalCaracter = setInterval(escrevaCaracter, 150);

        }, 2000)

        intervalEspera = clearTimeout(tempoDeEspera)
    }
}