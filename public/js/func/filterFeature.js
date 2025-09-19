import Database from "../db/Database.js";

export default function FilterByFeature(category, feature) {
    
    if (feature == "todos") {
        return Database.filter((element) => element.categoria == category);
    }

    /* Procura se o nome do produto inclui se é lata ou garrafa */
    return Database.filter((element) => element.categoria == category && (element.produto.toLowerCase()).includes(feature.toLowerCase()));
};