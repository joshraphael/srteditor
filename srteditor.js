$(function () {
    var SRTEditors = [];
    $.fn.srteditor = function (btnFns, initHTML) {
        this.each(function (i, e) {
            if ($(e).is("iframe")) {
                var editor = new srteditor(e, btnFns, initHTML);
                SRTEditors.push(editor);
            }
        });
    };
});

function srteditor(area, btnFns, initHTML) {
    this.pluginIds = [
        this.undo,
        this.redo,
        this.bold,
        this.italic,
        this.underline,
        this.strikeThrough,
        this.superscript,
        this.subscript,
        this.orderedList,
        this.unorderedList,
        this.code,
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
        this.emoji,
        this.email,
        this.source
    ];
    this.plugins = {};
    this.btns = {};
    this.area = $(area);
    this.btnFns = btnFns;
    this.id = this.area.attr("id");
    this.area.width("100%");
    this.area[0].contentDocument.designMode = "on";
    this.area[0].contentDocument.execCommand("styleWithCSS", false, "true");
    this.createToolbar();
    this.createSourceBox();
    this.createButtons();
    this.initializeHTML(initHTML);
    this.styleDocument();
}

srteditor.prototype.createToolbar = function () {
    this.toolbar = $("<div>");
    this.toolbar.attr("name", this.id.concat("-toolbar"));
    this.toolbar.attr("id", this.id.concat("-toolbar"));
    for (var i = 0; i < this.pluginIds.length; i++) {
        this.registerPlugin(this.pluginIds[i]);
    }
    this.toolbar.insertBefore(this.area);
};

srteditor.prototype.createSourceBox = function () {
    this.source = $("<code>");
    this.source.insertAfter(this.area);
    this.source.toggle();
};

srteditor.prototype.createButtons = function () {
    if (this.btnFns && this.btnFns instanceof Object) {
        for (var name in this.btnFns) {
            var self = this;
            this.btns[name] = $("<button>");
            this.btns[name].html(name);
            this.btns[name].insertAfter(this.area);
            this.btns[name].on("click", {
                doc: self.area[0].contentDocument
            }, this.btnFns[name]);
        }
    }
};

srteditor.prototype.registerPlugin = function (p) {
    var self = this;
    var plugin = p();
    var container = $("<span>");
    container.attr("id", "plugin-" + plugin.id);
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
    icon.on("mouseenter", function (e) {
        $(e.target).css("outline", "1px solid black");
        $(e.target).css("cursor", "pointer");

    });
    icon.on("mouseleave", function (e) {
        $(e.target).css("outline", "");
        $(e.target).css("cursor", "");
    });
    this.plugins[plugin.id] = plugin;
    container.append(btn);
    if (plugin.html != null) {
        for (var component in plugin.html) {
            var comp = plugin.html[component];
            var block = $("<span>");
            var html = $(comp.html);
            html.attr("id", plugin.id + "-" + component);
            block.append(html);
            block.attr("id", self.id + "-" + plugin.id + "-html");
            if (comp.events != null) {
                for (var event in comp.events) {
                    html.on(event, {
                        src: self,
                        id: plugin.id,
                        args: plugin.args
                    }, comp.events[event]);
                }
            }
            container.append(block);
        }
    }
    this.toolbar.append(container);
};

srteditor.prototype.initializeHTML = function (initHTML) {
    if (initHTML) {
        $(this.area[0].contentDocument.body).append(initHTML);
    }
};

srteditor.prototype.styleDocument = function () {
    var style = '\
    <style type="text/css" id="srteditor-style">\
      .srteditor-code {\
        overflow-wrap: break-word;\
        white-space: pre-wrap;\
        background-color: rgba(0, 0, 0, 0.04);\
        border-radius: 3px;\
        border: 1px solid rgba(0, 0, 0, 0.09);\
      }\
      .srteditor-code::before {\
        counter-reset: listing;\
      }\
      .srteditor-code div {\
        counter-increment: listing;\
      }\
      .srteditor-code div::before {\
        content: counter(listing) ". ";\
        display: inline-block;\
      }\
    </style>';
    $(this.area[0].contentDocument.body).append(style);
};

srteditor.prototype.undo = function () {
    return new plugin("undo", "fa-undo", exec, {
        cmd: "undo",
        arg1: null
    }, null, true);
};

srteditor.prototype.redo = function () {
    return new plugin("redo", "fa-redo", exec, {
        cmd: "redo",
        arg1: null
    }, null, true);
};

srteditor.prototype.bold = function () {
    return new plugin("bold", "fa-bold", exec, {
        cmd: "bold",
        arg1: null
    }, null, true);
};

srteditor.prototype.italic = function () {
    return new plugin("italic", "fa-italic", exec, {
        cmd: "italic",
        arg1: null
    }, null, true);
};

srteditor.prototype.underline = function () {
    return new plugin("underline", "fa-underline", exec, {
        cmd: "underline",
        arg1: null
    }, null, true);
};

srteditor.prototype.strikeThrough = function () {
    return new plugin("strike-through", "fa-strikethrough", exec, {
        cmd: "strikeThrough",
        arg1: null
    }, null, true);
};

srteditor.prototype.superscript = function () {
    return new plugin("superscript", "fa-superscript", exec, {
        cmd: "superscript",
        arg1: null
    }, null, true);
};

srteditor.prototype.subscript = function () {
    return new plugin("subscript", "fa-subscript", exec, {
        cmd: "subscript",
        arg1: null
    }, null, true);
};

srteditor.prototype.unorderedList = function () {
    return new plugin("unordered-list", "fa-list-ul", exec, {
        cmd: "insertUnorderedList",
        arg1: "newUL"
    }, null, true);
};

srteditor.prototype.orderedList = function () {
    return new plugin("ordered-list", "fa-list-ol", exec, {
        cmd: "insertOrderedList",
        arg1: "newOL"
    }, null, true);
};

srteditor.prototype.code = function () {
    return new plugin("code", "fa-terminal", exec, {
        cmd: "insertHTML",
        arg1: "&zwnj;<pre class='srteditor-code'><div>&zwnj;"
    }, null, true);
};

srteditor.prototype.colorText = function () {
    var pluginId = "color-text"
    return new plugin(pluginId, "fa-paint-brush", color, {
        id: pluginId,
        cmd: "foreColor",
    }, {
        color: {
            html: '<input type="color" style="display:none"/>',
            events: {
                "change": function (e) {
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

srteditor.prototype.highlightText = function () {
    var pluginId = "highlight-text"
    return new plugin(pluginId, "fa-highlighter", color, {
        id: pluginId,
        cmd: "hiliteColor",
    }, {
        color: {
            html: '<input type="color" style="display:none"/>',
            events: {
                "change": function (e) {
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

srteditor.prototype.emoji = function () {
    var pluginId = "emoji";
    var list = emojiList();
    return new plugin(pluginId, "fa-icons", value, {
        id: pluginId,
        cmd: "insertHTML"
    }, {
        value: {
            html: '<select>' + list + '</select>',
            events: null
        }
    }, true);
};

srteditor.prototype.font = function () {
    var pluginId = "font";
    var list = fontList();
    return new plugin(pluginId, "fa-font", value, {
        id: pluginId,
        cmd: "fontName"
    }, {
        value: {
            html: '<select>' + list + '</select>',
            events: {
                "change": function (e) {
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

srteditor.prototype.fontSize = function () {
    var pluginId = "font-size"
    var list = fontSizeList()
    return new plugin(pluginId, "fa-text-height", value, {
        id: pluginId,
        cmd: "fontSize"
    }, {
        value: {
            html: '<select>' + list + '</select>',
            events: {
                "change": function (e) {
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

srteditor.prototype.leftJustify = function () {
    return new plugin("left-justify", "fa-align-left", exec, {
        cmd: "justifyLeft",
        arg1: null
    }, null, true);
};

srteditor.prototype.centerJustify = function () {
    return new plugin("center-justify", "fa-align-center", exec, {
        cmd: "justifyCenter",
        arg1: null
    }, null, true);
};

srteditor.prototype.rightJustify = function () {
    return new plugin("right-justify", "fa-align-right", exec, {
        cmd: "justifyRight",
        arg1: null
    }, null, true);
};

srteditor.prototype.fullJustify = function () {
    return new plugin("full-justify", "fa-align-justify", exec, {
        cmd: "justifyFull",
        arg1: null
    }, null, true);
};

srteditor.prototype.link = function () {
    var pluginId = "link";
    return new plugin(pluginId, "fa-link", input, {
        id: pluginId,
        cmd: "createLink"
    }, {
        input: {
            html: '<input placeholder="https://example.com" type="url"/>',
            events: {
                "change": function (e) {
                    var id = e.data.id;
                    $("#" + id + "-input").get(0).checkValidity();
                }
            }
        }
    }, true);
};

srteditor.prototype.unlink = function () {
    var pluginId = "unlink";
    return new plugin(pluginId, "fa-unlink", exec, {
        cmd: "unlink",
        arg1: null
    }, null, true);
};

srteditor.prototype.image = function () {
    var pluginId = "image";
    return new plugin(pluginId, "fa-image", input, {
        id: pluginId,
        cmd: "insertImage"
    }, {
        input: {
            html: '<input placeholder="https://example.com/image.jpg" pattern="http[s]?://.*[.](jpg|jgep|png|gif)" type="url">',
            events: {
                "change": function (e) {
                    var id = e.data.id;
                    $("#" + id + "-input").get(0).checkValidity();
                }
            }
        }
    }, true);
};

srteditor.prototype.email = function () {
    var pluginId = "email";
    return new plugin(pluginId, "fa-at", link, {
        id: pluginId
    }, {
        link: {
            html: '<a style="display:none;"></a>',
            events: {
                "click": function (e) {
                    var html = e.data.src.area[0].contentDocument.body.innerHTML;
                    $(e.target).attr("href", "mailto:?subject=SRTEditor Code&body=" + html);
                }
            }
        }
    }, true);
}

srteditor.prototype.source = function () {
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
    var color = $("#" + args.id + "-color").val();
    $("#" + args.id + "-color").trigger("click");
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
    if ($("#" + args.id + "-input").get(0).checkValidity()) {
        var val = $("#" + args.id + "-input").val();
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

function link(e) {
    var args = e.data.args;
    $("#" + args.id + "-link")[0].click();
}

function toggleSourceCode(e) {
    var self = e.data.src;
    self.area.toggle();
    self.source.toggle();
    self.source.text(self.area[0].contentDocument.body.innerHTML);
    disablePlugins(self.plugins);
    if (self.btns) {
        for (var k in self.btns) {
            self.btns[k].toggle();
        }
    }
}

function disablePlugins(plugins) {
    for (var plugin in plugins) {
        if (plugins[plugin].disable == true) {
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
    for (var i in fonts) {
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
    for (var i in sizes) {
        var size = sizes[i];
        list = list + '<option value="' + size + '">' + size + '</option>';
    }
    return list;
}

function emoji(code, name) {
    this.code = code;
    this.name = name;
}

function initEmoji(code, name) {
    return new emoji(code, name);
}

function emojiList() {
    var emojis = [
        initEmoji("&#x1F600;", ":grinning:"),
        initEmoji("&#x1F601;", ":grin:"),
        initEmoji("&#x1F602;", ":joy:"),
        initEmoji("&#x1F603;", ":smiley:"),
        initEmoji("&#x1F604;", ":smile:"),
        initEmoji("&#x1F605;", ":sweat_smile:"),
        initEmoji("&#x1F606;", ":laughing:"),
        initEmoji("&#x1F607;", ":innocent:"),
        initEmoji("&#x1F608;", ":smiling_imp:"),
        initEmoji("&#x1F609;", ":wink:"),
        initEmoji("&#x1F60A;", ":blush:"),
        initEmoji("&#x1F60B;", ":yum:"),
        initEmoji("&#x1F60C;", ":relieved:"),
        initEmoji("&#x1F60D;", ":heart_eyes:"),
        initEmoji("&#x1F60E;", ":sunglasses:"),
        initEmoji("&#x1F60F;", ":smirk:"),
        initEmoji("&#x1F610;", ":neutral_face:"),
        initEmoji("&#x1F611;", ":expressionless:"),
        initEmoji("&#x1F612;", ":unamused:"),
        initEmoji("&#x1F613;", ":sweat:"),
        initEmoji("&#x1F614;", ":pensive:"),
        initEmoji("&#x1F615;", ":confused:"),
        initEmoji("&#x1F616;", ":confounded:"),
        initEmoji("&#x1F617;", ":kissing:"),
        initEmoji("&#x1F618;", ":kissing_heart:"),
        initEmoji("&#x1F619;", ":kissing_smiling_eyes:"),
        initEmoji("&#x1F61A;", ":kissing_closed_eyes:"),
        initEmoji("&#x1F61B;", ":stuck_out_tongue:"),
        initEmoji("&#x1F61C;", ":stuck_out_tongue_winking_eye:"),
        initEmoji("&#x1F61D;", ":stuck_out_tongue_closed_eyes:"),
        initEmoji("&#x1F61E;", ":disappointed:"),
        initEmoji("&#x1F61F;", ":worried:")
    ];
    var list = "";
    for (var i in emojis) {
        var emoji = emojis[i];
        list = list + '<option value="' + emoji.code + '">' + emoji.name + " " + emoji.code + '</option>';
    }
    return list;
}