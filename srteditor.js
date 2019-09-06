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
        this.strikeThrough,
        this.superscript,
        this.subscript,
        this.orderedList,
        this.unorderedList,
        this.colorText,
        this.highlightText,
        this.font,
        this.fontSize,
        this.leftJustify,
        this.centerJustify,
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
    var container = $("<span style='padding-right:10px;'>");
    container.attr("id", "plugin-" + plugin.id)
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
    container.append(btn);
    if(plugin.html != null) {
        for(var component in plugin.html) {
            var comp = plugin.html[component]
            var block = $("<span>")
            var html = $(comp.html)
            html.attr("id", plugin.id + "-" + component)
            block.append(html)
            block.attr("id", self.id + "-" + plugin.id + "-html")
            if(comp.events != null) {
                for(var event in comp.events) {
                    html.on(event, {
                        src: self,
                        args: plugin.args
                    }, comp.events[event])
                }
            }
            container.append(block)
        }
    }
    this.toolbar.append(container);
};

srteditor.prototype.bold = function() {
    return new plugin("B", "fa-bold", exec, {
        cmd: "bold",
        arg1: null
    }, null, true);
};

srteditor.prototype.italic = function() {
    return new plugin("I", "fa-italic", exec, {
        cmd: "italic",
        arg1: null
    }, null, true);
};

srteditor.prototype.underline = function() {
    return new plugin("U", "fa-underline", exec, {
        cmd: "underline",
        arg1: null
    }, null, true);
};

srteditor.prototype.strikeThrough = function() {
    return new plugin("strike-through", "fa-strikethrough", exec, {
        cmd: "strikeThrough",
        arg1: null
    }, null, true);
};

srteditor.prototype.superscript = function() {
    var id = "superscript"
    return new plugin(id, "fa-superscript", exec, {
        cmd: "superscript",
        arg1: null
    }, null, true);
};

srteditor.prototype.subscript = function() {
    var id = "subscript"
    return new plugin(id, "fa-subscript", exec, {
        cmd: "subscript",
        arg1: null
    }, null, true);
};

srteditor.prototype.unorderedList = function() {
    return new plugin("unordered-list", "fa-list-ul", exec, {
        cmd: "insertUnorderedList",
        arg1: "newUL"
    }, null, true);
};

srteditor.prototype.orderedList = function() {
    return new plugin("ordered-list", "fa-list-ol", exec, {
        cmd: "insertOrderedList",
        arg1: "newOL"
    }, null, true);
};

srteditor.prototype.colorText = function() {
    var id = "color"
    return new plugin(id, "fa-paint-brush", color, {
        id: id,
        cmd: "foreColor",
    }, {
        color: {
            html: '<input type="color" style="display:none"/>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var color = $(e.target).val()
                    $("#" + id).first("i").css("color", color)
                    exec({
                        data: {
                            src: self,
                            args: {
                                cmd: args.cmd,
                                arg1: color
                            }
                        }
                    });
                }
            }
        }
    }, true);
};

srteditor.prototype.highlightText = function() {
    var id = "highlight"
    return new plugin(id, "fa-highlighter", color, {
        id: id,
        cmd: "hiliteColor",
    }, {
        color: {
            html: '<input type="color" style="display:none"/>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var color = $(e.target).val()
                    $("#" + id).first("i").css("color", color)
                    exec({
                        data: {
                            src: self,
                            args: {
                                cmd: args.cmd,
                                arg1: color
                            }
                        }
                    });
                }
            }
        }
    }, true);
};

srteditor.prototype.font = function() {
    var id = "font"
    var list = fontList()
    return new plugin(id, "fa-font", value, {
        id: id,
        cmd: "fontName"
    }, {
        value: {
            html: '<select>' + list + '</select>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var font = $("#" + id + "-value").val();
                    exec({
                        data: {
                            src: self,
                            args: {
                                cmd: args.cmd,
                                arg1: font
                            }
                        }
                    });
                }
            }
        }
    }, true);
};

srteditor.prototype.fontSize = function() {
    var id = "font-size"
    var list = fontSizeList()
    return new plugin(id, "fa-text-height", value, {
        id: id,
        cmd: "fontSize"
    }, {
        value: {
            html: '<select>' + list + '</select>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var font = $("#" + id + "-value").val();
                    exec({
                        data: {
                            src: self,
                            args: {
                                cmd: args.cmd,
                                arg1: font
                            }
                        }
                    });
                }
            }
        }
    }, true);
};

srteditor.prototype.leftJustify = function() {
    return new plugin("left-justify", "fa-align-left", exec, {
        cmd: "justifyLeft",
        arg1: null
    }, null, true);
};

srteditor.prototype.centerJustify = function() {
    return new plugin("center-justify", "fa-align-center", exec, {
        cmd: "justifyCenter",
        arg1: null
    }, null, true);
};

srteditor.prototype.source = function() {
    return new plugin("source", "fa-code", toggleSourceCode, null, null, false);
};

function plugin(id, icon, cmd, args, html, disable) {
    this.id = id;
    this.icon = icon;
    this.cmd = cmd;
    this.args = args;
    this.html = html;
    this.disable = disable;
}

function exec(e) {
    var self = e.data.src;
    var args = e.data.args;
    self.area[0].contentDocument.execCommand(args.cmd, false, args.arg1);
}

function color(e) {
    var self = e.data.src;
    var args = e.data.args;
    var color = $("#" + args.id + "-color").val()
    $("#" + args.id + "-color").trigger("click")
    exec({
        data: {
            src: self,
            args: {
                cmd: args.cmd,
                arg1: color
            }
        }
    });
}

function value(e) {
    var self = e.data.src;
    var args = e.data.args;
    var val = $("#" + args.id + "-value").val();
    exec({
        data: {
            src: self,
            args: {
                cmd: args.cmd,
                arg1: val
            }
        }
    });
}

function toggleSourceCode(e) {
    var self = e.data.src;
    self.area.toggle();
    self.source.toggle();
    self.source.text(self.area[0].contentDocument.body.innerHTML);
    disablePlugins(self.plugins);
    if(self.submitBtn) {
        self.submitBtn.toggle();
    }
}

function disablePlugins(plugins) {
    for(var plugin in plugins) {
        if(plugins[plugin].disable == true) {
            $("#plugin-" + plugins[plugin].id).toggle();
        }
    }
}

function fontList() {
    var fonts = [
        "Times Roman",
        "Times New Roman",
        "Arial",
        "Monospace",
        "Sans-Serif"
    ];
    var list = "";
    for(var i in fonts) {
        var font = fonts[i];
        list = list + '<option value="' + font + '">' + font + '</option>';
    }
    return list;
}

function fontSizeList() {
    var sizes = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7"
    ];
    var list = "";
    for(var i in sizes) {
        var size = sizes[i];
        list = list + '<option value="' + size + '">' + size + '</option>';
    }
    return list
}