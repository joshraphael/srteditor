$(function() {
    var SRTEditors = [];
    $.fn.srteditor = function(submitFn) {
        this.each(function(i, e) {
            if( $(e).is("iframe") ) {
                var editor = new srteditor(e, submitFn);
                SRTEditors.push(editor);
            }
        });
    };
});

function srteditor(area, submitFn) {
    this.pluginIds = [
        this.bold,
        this.italic,
        this.underline,
        this.orderedList,
        this.unorderedList,
        this.colorText,
        this.source
    ];
    this.plugins = {};
    this.area = $(area);
    this.submitFn = submitFn
    this.id = this.area.attr("id");
    this.area.width("100%");
    this.area[0].contentDocument.designMode = "on";
    this.createToolbar();
    this.createSourceBox();
    this.createSubmitButton();
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

srteditor.prototype.createSourceBox = function() {
    this.source = $("<code>");
    this.source.insertAfter(this.area);
    this.source.toggle();
};

srteditor.prototype.createSubmitButton = function() {
    if(this.submitFn && this.submitFn instanceof Function) {
        var self = this;
        this.submitBtn = $("<button>")
        this.submitBtn.html("Submit")
        this.submitBtn.insertAfter(this.area)
        this.submitBtn.on("click", {
            doc: self.area[0].contentDocument
        }, this.submitFn)
    }
}

srteditor.prototype.registerPlugin = function(p) {
    var self = this;
    var plugin = p();
    var btn = $("<span>");
    var icon = $("<i>");
    icon.addClass("fa");
    icon.addClass(plugin.icon);
    btn.append(icon);
    btn.attr("id", plugin.id);
    btn.height(24);
    btn.width(24);
    btn.on("click", {
        src: self,
        args: plugin.args
    }, plugin.cmd);
    this.plugins[plugin.id] = plugin;
    this.toolbar.append(btn);
    if(plugin.html != null) {
        for(var component in plugin.html) {
            var comp = plugin.html[component]
            var html = $(comp.html)
            html.attr("id", self.id + "-" + plugin.id + "-html")
            if(comp.events != null) {
                for(var event in comp.events) {
                    html.on(event, {
                        src: self,
                        args: plugin.args
                    }, comp.events[event])
                }
            }
            this.toolbar.append(html)
        }
    } 
};

srteditor.prototype.bold = function() {
    return new plugin("B", "fa-bold", style, {
        cmd: "bold",
        arg1: null
    }, null, true);
};

srteditor.prototype.italic = function() {
    return new plugin("I", "fa-italic", style, {
        cmd: "italic",
        arg1: null
    }, null, true);
};

srteditor.prototype.underline = function() {
    return new plugin("U", "fa-underline", style, {
        cmd: "underline",
        arg1: null
    }, null, true);
};

srteditor.prototype.unorderedList = function() {
    return new plugin("UL", "fa-list-ul", style, {
        cmd: "insertUnorderedList",
        arg1: "newUL"
    }, null, true);
};

srteditor.prototype.orderedList = function() {
    return new plugin("OL", "fa-list-ol", style, {
        cmd: "insertOrderedList",
        arg1: "newOL"
    }, null, true);
};

srteditor.prototype.colorText = function() {
    var id = "C"
    return new plugin(id, "fa-paint-brush", color, {
        id: id,
        cmd: "foreColor",
    }, {
        colorPallette: {
            html: '<input type="color" style="display:none"/>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var color = $(e.target).val()
                    $("#" + id).first("i").css("color", color)
                    $("#" + id).attr("data-color", color)
                    self.area[0].contentDocument.execCommand(args.cmd, false, color);
                }
            }
        }
    }, true);
};

srteditor.prototype.source = function() {
    return new plugin("S", "fa-code", toggleSourceCode, null, null, false);
};

function plugin(id, icon, cmd, args, html, disable) {
    this.id = id;
    this.icon = icon;
    this.cmd = cmd;
    this.args = args;
    this.html = html;
    this.disable = disable;
}

function style(e) {
    var self = e.data.src;
    var args = e.data.args;
    self.area[0].contentDocument.execCommand(args.cmd, false, args.arg1);
}

function color(e) {
    var self = e.data.src;
    var args = e.data.args;
    $("#" + self.id + "-" + args.id + "-html").trigger("click")
    self.area[0].contentDocument.execCommand(args.cmd, false, $("#" + self.id + "-" + args.id + "-html").val())
}

function toggleSourceCode(e) {
    var self = e.data.src;
    self.area.toggle();
    self.source.toggle();
    self.source.text(self.area[0].contentDocument.body.innerHTML);
    disablePlugins(self.plugins);
    if(self.submitBtn) {
        self.submitBtn.toggle()
    }
}

function disablePlugins(plugins) {
    for(var plugin in plugins) {
        if(plugins[plugin].disable == true) {
            $("#" + plugins[plugin].id).toggle();
        }
    }
}