import breads from "./sections/breads.js";
import cakes from "./sections/cakes.js";
import freezes from "./sections/freezes.js";
import retail from "./sections/retail.js";
import snacks from "./sections/snacks.js";

const Database = [
    ...breads,
    ...cakes,
    ...freezes,
    ...retail,
    ...snacks,
];

export default Database;