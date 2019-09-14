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
        this.rightJustify,
        this.fullJustify,
        this.link,
        this.unlink,
        this.image,
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
    var container = $("<span>");
    container.attr("id", "plugin-" + plugin.id)
    container.css("padding", "5px")
    var btn = $("<span>");
    var icon = $("<i>");
    icon.addClass("fa");
    icon.addClass(plugin.icon);
    btn.append(icon);
    btn.attr("id", plugin.id);
    btn.on("click", {
        src: self,
        args: plugin.args
    }, plugin.cmd);
    icon.on("mouseenter", function(e) {
        $(e.target).css("outline", "1px solid black")
        $(e.target).css("cursor", "pointer")

    });
    icon.on("mouseleave", function(e) {
        $(e.target).css("outline", "")
        $(e.target).css("cursor", "")
    });
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
                        id: plugin.id,
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
    return new plugin("bold", "fa-bold", exec, {
        cmd: "bold",
        arg1: null
    }, null, true);
};

srteditor.prototype.italic = function() {
    return new plugin("italic", "fa-italic", exec, {
        cmd: "italic",
        arg1: null
    }, null, true);
};

srteditor.prototype.underline = function() {
    return new plugin("underline", "fa-underline", exec, {
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
    return new plugin("superscript", "fa-superscript", exec, {
        cmd: "superscript",
        arg1: null
    }, null, true);
};

srteditor.prototype.subscript = function() {
    return new plugin("subscript", "fa-subscript", exec, {
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
    var pluginId = "color-text"
    return new plugin(pluginId, "fa-paint-brush", color, {
        id: pluginId,
        cmd: "foreColor",
    }, {
        color: {
            html: '<input type="color" style="display:none"/>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var id = e.data.id;
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
    var pluginId = "highlight-text"
    return new plugin(pluginId, "fa-highlighter", color, {
        id: pluginId,
        cmd: "hiliteColor",
    }, {
        color: {
            html: '<input type="color" style="display:none"/>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var id = e.data.id;
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
    var pluginId = "font"
    var list = fontList()
    return new plugin(pluginId, "fa-font", value, {
        id: pluginId,
        cmd: "fontName"
    }, {
        value: {
            html: '<select>' + list + '</select>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var id = e.data.id;
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
    var pluginId = "font-size"
    var list = fontSizeList()
    return new plugin(pluginId, "fa-text-height", value, {
        id: pluginId,
        cmd: "fontSize"
    }, {
        value: {
            html: '<select>' + list + '</select>',
            events: {
                "change": function(e) {
                    var self = e.data.src;
                    var args = e.data.args;
                    var id = e.data.id;
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

srteditor.prototype.rightJustify = function() {
    return new plugin("right-justify", "fa-align-right", exec, {
        cmd: "justifyRight",
        arg1: null
    }, null, true);
};

srteditor.prototype.fullJustify = function() {
    return new plugin("full-justify", "fa-align-justify", exec, {
        cmd: "justifyFull",
        arg1: null
    }, null, true);
};

srteditor.prototype.link = function() {
    var pluginId = "link";
    return new plugin(pluginId, "fa-link", input, {
        id: pluginId,
        cmd: "createLink"
    }, {
        input: {
            html: '<input placeholder="https://example.com" type="url"/>',
            events: {
                "change": function(e) {
                    var id = e.data.id;
                    $("#" + id + "-input").get(0).checkValidity();
                }
            }
        }
    }, true);
};

srteditor.prototype.unlink = function() {
    var pluginId = "unlink";
    return new plugin(pluginId, "fa-unlink", exec, {
        cmd: "unlink",
        arg1: null
    }, null, true);
}

srteditor.prototype.image = function() {
    var pluginId = "image";
    return new plugin(pluginId, "fa-image", input, {
        id: pluginId,
        cmd: "insertImage"
    }, {
        input: {
            html: '<input placeholder="https://example.com/image.jpg" pattern="http[s]?://.*[.](jpg|jgep|png|gif)" type="url">',
            events: {
                "change": function(e) {
                    var id = e.data.id;
                    $("#" + id + "-input").get(0).checkValidity();
                }
            }
        }
    }, true);
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

function input(e) {
    var self = e.data.src;
    var args = e.data.args;
    if( $("#" + args.id + "-input").get(0).checkValidity() ) {
        var val = $("#" + args.id + "-input").val()
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
    return list;
}