var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ui/View", "jrptlib/Properties!APPMSG"], function (require, exports, View, APPMSG) {
    "use strict";
    var ckeditor_initialized = false;
    var TextView = (function (_super) {
        __extends(TextView, _super);
        function TextView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.setClassName("text-view");
            this.showTitle = $(view_node).attr("showTitle") === "true";
        }
        TextView.prototype.createContents = function (parent) {
            this.content = $("<div class=\"text-editor\">")
                .appendTo(parent);
            var html = $(this.getModel()).attr("contents");
            if (html && html.length > 0) {
                $(this.content).html(html);
            }
        };
        TextView.prototype.setEditMode = function (value) {
            _super.prototype.setEditMode.call(this, value);
            if (!this.content)
                return;
            if (value) {
                $(this.content).hide();
                this.editor = $("<textarea class=\"text-editor\">")
                    .insertAfter(this.content)
                    .text(APPMSG.InitializingEditor);
                var _this = this;
                require(["ckeditor"], function (CKEditor) {
                    if (!ckeditor_initialized) {
                        ckeditor_initialized = true;
                        CKEDITOR.on("instanceReady", function (e) {
                            var frame = $(e.editor.container.$);
                            frame = $(frame).find(".cke_wysiwyg_frame");
                            if (frame)
                                frame.attr("title", "");
                        });
                    }
                    require(["ckeditor_adapter"], function (fCKAdapter) {
                        if (!_this.editor)
                            return;
                        _this.ckeditor = $(_this.editor)
                            .ckeditor()
                            .editor;
                        $.when($(_this.editor).promise).then(function () {
                            $(_this.editor).val($(_this.content).html());
                            _this.ckeditor.on("change", function () {
                                var data = $(_this.editor).val();
                                $(_this.getModel()).attr("contents", data);
                                _this.emit("modified", _this);
                            });
                        });
                    });
                });
            }
            else {
                var data = $(this.editor).val();
                if (this.ckeditor) {
                    $(this.content).html(data);
                    this.ckeditor.destroy();
                    this.ckeditor = undefined;
                    $(this.editor).remove();
                    this.editor = undefined;
                    $(this.content).show();
                }
            }
        };
        return TextView;
    }(View));
    return TextView;
});
