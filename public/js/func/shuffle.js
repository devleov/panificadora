export default function shuffleArray(array) {
    let arrayCopy = array.slice();
    const arrayLength = arrayCopy.length;

    let n; // Índice do número sorteado.
    let elementDeleted; // Elemento deletado sorteado para ir para o array embaralhado.
    let shuffleArray = []; // Array embaralhado.

    for (let i = 0; i < arrayLength; i++) {
        n = Math.floor(Math.random() * arrayCopy.length);
        elementDeleted = arrayCopy.splice(n, 1);
        shuffleArray.push(elementDeleted[0]);
    };

    return shuffleArray;
}