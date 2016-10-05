function hideText() {
	$(".tr, .en, .ru, .es, .de").css("display", "none");
};

$("#lng").change(function() {
	hideText();
    if ($(this).val() == "tr") {
        //window.location.href = "?lang=tr";
        $(".tr").css("display", "inherit");
        $(".navigation .tr").css("display", "inline");
        $(".btn-blog").removeClass("hidden");
    } else if ($(this).val() == "en") {
        //window.location.href = "?lang=en";
        $(".en").css("display", "inherit");
        $(".navigation .en").css("display", "inline");
        $(".btn-blog").addClass("hidden");
    } else if ($(this).val() == "ru") {
        //window.location.href = "?lang=ru";
        $(".ru").css("display", "inherit");
        $(".navigation .ru").css("display", "inline");
        $(".btn-blog").addClass("hidden");
    } else if ($(this).val() == "es") {
        //window.location.href = "?lang=es";
        $(".es").css("display", "inherit");
        $(".navigation .es").css("display", "inline");
        $(".btn-blog").addClass("hidden");
    } else if ($(this).val() == "de") {
        //window.location.href = "?lang=de";
        $(".de").css("display", "inherit");
        $(".navigation .de").css("display", "inline");
        $(".btn-blog").addClass("hidden");
    }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
var langType = getParameterByName('lang');

if (langType == "tr") {
    hideText();
    $(".tr").css("display", "inherit");
    $(".navigation .tr").css("display", "inline");
    $("#lng option[value='tr']").prop('selected', true);
    $(".btn-blog").removeClass("hidden");
} else if (langType == "en") {
    hideText();
    $(".en").css("display", "inherit");
    $(".navigation .en").css("display", "inline");
    $("#lng option[value='en']").prop('selected', true);
    $(".btn-blog").addClass("hidden");
} else if (langType == "ru") {
    hideText();
    $(".ru").css("display", "inherit");
    $(".navigation .ru").css("display", "inline");
    $("#lng option[value='ru']").prop('selected', true);
    $(".btn-blog").addClass("hidden");
} else if (langType == "es") {
    hideText();
    $(".es").css("display", "inherit");
    $(".navigation .es").css("display", "inline");
    $("#lng option[value='es']").prop('selected', true);
    $(".btn-blog").addClass("hidden");
} else if (langType == "de") {
    hideText();
    $(".de").css("display", "inherit");
    $(".navigation .de").css("display", "inline");
    $("#lng option[value='de']").prop('selected', true);
    $(".btn-blog").addClass("hidden");
};
