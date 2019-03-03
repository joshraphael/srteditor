$(function() {
    var SRTEditors = [];
    $.fn.srteditor = function() {
        this.each(function(i, e) {
            if( $(e).is("iframe") ) {
                var editor = new srteditor(e);
                SRTEditors.push(editor);
            }
        });
    };
});

function srteditor(area) {
    this.pluginIds = [
        bold,
        italic,
        underline
    ];
    this.plugins = {};
    this.area = $(area);
    this.id = this.area.attr("id");
    this.area.width("100%");
    this.area[0].contentDocument.designMode = "on";
    this.createToolbar();
}

srteditor.prototype.createToolbar = function() {
    this.toolbar = $("<div>");
    this.toolbar.attr("name", this.id.concat("-toolbar"));
    this.toolbar.attr("id", this.id.concat("-toolbar"));
    this.toolbar.css("display", "flex");
    this.toolbar.height(27);
    for(var i = 0; i < this.pluginIds.length; i++) {
        this.registerPlugin(this.pluginIds[i]);
    }
    this.toolbar.insertBefore(this.area);
};

srteditor.prototype.registerPlugin = function(p) {
    var self = this;
    var plugin = p();
    var btn = $("<div>");
    btn.html(plugin.id);
    btn.attr("id", plugin.cmd);
    btn.height(24);
    btn.width(24);
    btn.on("click", function() {
        self.area[0].contentDocument.execCommand(plugin.cmd, false, plugin.args);
    });
    this.plugins[plugin.id] = plugin;
    
    this.toolbar.append(btn);
};

function plugin(id, cmd, args, img) {
    this.id = id;
    this.cmd = cmd;
    this.args = args;
    this.img = img;
}

function bold() {
    var bold = new plugin("B", "bold", null, null);
    return bold;
}

function italic() {
    return new plugin("I", "italic", null, null);
}

function underline() {
    return new plugin("U", "underline", null, null);
}
