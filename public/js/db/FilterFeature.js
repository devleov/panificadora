import array from "./Database.js";

export default function FilterByFeature(category, feature) {
    if (feature == "todos") {
        return {
            data: array.filter((element) => element.categoria == category),
            status: 200,
        }
    }

    return {
        data: array.filter((element) => element.categoria == category && element.caracteristicas.includes(feature)),
        status: 200,
    };
};