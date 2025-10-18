let delayClick = "pending";

setTimeout(() => {
    /* Delay para evitar cliques abusivos na edição dos valores de endereço */
    delayClick = "completed";
}, 5000)

let interval;

let originalValues = {};

$(".btn-edit-delivery-address").attr("data-status", "edit");

/* Botão de edição de endereço de entrega */
$(".btn-edit-delivery-address").on("click", async () => {
    /* Elemento de aviso do endereço de entrega */
    const warnDeliveryAddress = $(".warn-delivery-address");

    /* Obtenção dos inputs relacionados a seção de endereço de entrega */
    const accordionBody = $(".btn-edit-delivery-address").closest(".accordion-body");
    const inputs = accordionBody[0].querySelectorAll("input");

    if ($(".btn-edit-delivery-address").attr("data-status") === "edit") {

        if (delayClick === "pending") {
            warnDeliveryAddress.html("<i class='fa-solid fa-clock me-2'></i> Espere um pouco para editar..");

            setTimeout(() => {
                warnDeliveryAddress.text("");
            }, 5000)

            return;
        }

        warnDeliveryAddress.text("");


        $(inputs).each(async (_, el) => {
            if ($(el).attr("disabled") && !$(el).hasClass("cep-delivery-address") && !$(el).hasClass("road-delivery-address")) {

                $(el).removeAttr("disabled");
                $(".text-edit-delivery-address").text("Clique para parar a edição e salvar:");

                return;
            }
        });

        $(".inputs-delivery-address input:not([readonly='true'])").each((_, input) => {
            originalValues[input.name] = input.value;
        });
    }

    /* Se for salvar as informações */
    if ($(".btn-edit-delivery-address").attr("data-status") === "save") {
        delayClick = "pending";

        const delivery_address = $(".delivery-address").val();
        const number_address = $(".number-delivery-address").val();
        const building_address = $(".building-delivery-address").val();
        const reference_address = $(".reference-delivery-address").val();

        compare = (old, current) => old === current ? true : false;

        /* Se todos os inputs forem iguais após salvamento */
        if (compare(originalValues["delivery-address"], delivery_address) && compare(originalValues["number-delivery-address"], number_address) && compare(originalValues["building-delivery-address"], building_address) && compare(originalValues["reference-delivery-address"], reference_address)) {
            warnDeliveryAddress.html("<i class='fa-solid fa-exclamation me-2'></i> Nenhuma alteração detectada..");

            inverval = setTimeout(() => {
                warnDeliveryAddress.text("");
                delayClick = "completed";
            }, 5000)

            return;
        }

        if (!delivery_address || !number_address) {
            if (interval) clearTimeout(interval);

            warnDeliveryAddress.html("<i class='fa-solid fa-exclamation me-2'></i> Há campos obrigatórios vazios..")

            inverval = setTimeout(() => {
                warnDeliveryAddress.text("");
                delayClick = "completed";
            }, 5000)

            return;
        }

        $(inputs).each(async (_, el) => {
            $(el).attr("disabled", "true");
            $(".text-edit-delivery-address").text("Clique para editar:");
        });

        resp = await fetch("/updateInfoCep", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ delivery_address, number_address, building_address, reference_address }),
        });

        data = await resp.json();

        if (data.status === 200) {
            if (interval) clearTimeout(interval);

            warnDeliveryAddress.html(`<i class="fa-solid fa-check me-2"></i> ${data.message}`);

            inverval = setTimeout(() => {
                warnDeliveryAddress.text("");
                delayClick = "completed";
            }, 5000)
        }

        return $(".btn-edit-delivery-address").attr("data-status", "edit");
    }

    $(".btn-edit-delivery-address").attr("data-status", "save");
});

