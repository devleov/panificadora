/* ================================
   ELEMENTO-ALVO
   ================================ */
const txt_dinamic = document.getElementById("txt-dinamic");


/* ================================
   FRASES PARA EXIBIÇÃO
   ================================ */
const array = [
    "com o frescor de cada manhã!",
    "direto do forno para você!",
    "trazendo momentos deliciosos!"
];


/* ================================
   VARIÁVEIS DE CONTROLE
   ================================ */
let indexLetters = 0;   // Posição da letra atual
let index = 0;          // Posição da frase atual
let sentence = "";      // Armazena caractere temporário
let interval = false;   // Controla execução

let intervalCaracter;
let intervalEspera;


/* ================================
   EXECUÇÃO
   ================================ */
if (index < array.length) {
    if (!interval) intervalCaracter = setInterval(escrevaCaracter, 150);

    // Escreve letra por letra da frase
    function escrevaCaracter() {
        if (indexLetters < array[index].length) {
            sentence = array[index][indexLetters];
            txt_dinamic.textContent += sentence;
            indexLetters++;
        } else {
            interval = true;
            clearInterval(intervalCaracter);

            txt_dinamic.classList.add("espera");
            intervalEspera = setTimeout(tempoDeEspera, 10000);
        }
    }

    // Gerencia pausa e transição para próxima frase
    function tempoDeEspera() {
        setTimeout(() => {
            txt_dinamic.classList.remove("espera");
        }, 1700);

        setTimeout(() => {
            index++;
            indexLetters = 0;
            sentence = "";
            txt_dinamic.textContent = "";

            if (index >= array.length) index = 0;

            interval = false;
            intervalCaracter = setInterval(escrevaCaracter, 150);
        }, 2000);

        intervalEspera = clearTimeout(tempoDeEspera);
    }
}