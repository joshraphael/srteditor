$(function() {
    var footer = $("#srteditor-footer");
    $.get(footer.attr("data-root-location") + "api/meta.json", function (data) {
        footer.html("Website last updated on " + data.deployTimestamp + "<br>" + "Version: " + data.branch + "@" + data.commit);
    });
});