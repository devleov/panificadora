const box_menu_items = document.getElementById("box-menu-items");
const img_menu = document.getElementById("img-menu");

document.getElementById("menu").addEventListener("click", () => {
    if (!box_menu_items.classList.contains("show")) {
        // Menu aberto

        img_menu.src = "/assets/imgs/components/navbar/menu-open.svg";
        img_menu.style.width = "36px"
        box_menu_items.classList.add("show");
        return;
    }

    // Menu fechado
    img_menu.src = "/assets/imgs/components/navbar/menu.svg";
    img_menu.style.width = "40px"
    box_menu_items.classList.remove("show");
});

/* Resolução de bug de menu redimensionamento */
window.addEventListener("resize", () => {
    if (window.innerWidth > 1020) {
        box_menu_items.classList.remove("show");
    }
})