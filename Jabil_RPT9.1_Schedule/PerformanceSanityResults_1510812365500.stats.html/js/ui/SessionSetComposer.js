var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/CheckboxDropDownList", "ui/SessionLabelProvider", "jrptlib/Properties!APPMSG"], function (require, exports, CheckboxDropDownList, SessionLabelProvider, APPMSG) {
    "use strict";
    var SessionSetComposer = (function (_super) {
        __extends(SessionSetComposer, _super);
        function SessionSetComposer(container) {
            var _this = this;
            _super.call(this, container);
            this.sessionSetDialog = null;
            this.session = null;
            this.readOnly = true;
            this.heights = [];
            this.setTextForEmptyList(APPMSG.EmptySessionSelector_helper);
            this.setContentProvider({
                getElements: function (session, handler) {
                    handler(session.sessionSet.sessions);
                }
            });
            this.setCheckStateProvider({
                isChecked: function (session) {
                    return _this.session.sessionSet.isChecked(session);
                }
            });
            this.setLabelProvider(new SessionLabelProvider());
            this.setCheckListChangedListener();
            this.on("opened", function (listContainer) {
                if (_this.width) {
                    $(_this.commentText).width(_this.width);
                    $(_this.commentText).height(_this.heights[0]);
                    $(_this.tagsText).width(_this.width);
                    $(_this.tagsText).height(_this.heights[1]);
                }
                else {
                    var w = $(listContainer).width() - 3;
                    $(_this.commentText).width(w);
                    $(_this.tagsText).width(w);
                }
            });
        }
        SessionSetComposer.prototype.setCheckListChangedListener = function () {
            var _this = this;
            this.checkListChangedHandler = this.on("checkListChanged", function (checkList) {
                _this.checkListChanged(checkList);
            });
        };
        SessionSetComposer.prototype.removeCheckListChangedListener = function () {
            this.checkListChangedHandler.remove();
        };
        SessionSetComposer.prototype.checkListChanged = function (checkList) {
            var _this = this;
            setTimeout(function () {
                _this.session.sessionSet.setSelection(checkList);
            }, 20);
        };
        SessionSetComposer.prototype.setReadOnly = function (readOnly) {
            this.readOnly = readOnly;
        };
        SessionSetComposer.prototype.drawFooterList = function (contents) {
            var _this = this;
            var createButton = function (parent, label) {
                return $("<button>")
                    .text(label)
                    .appendTo($(parent))
                    .button();
            };
            this.add_button = createButton(contents, "+")
                .click(function () {
                _this.addSession();
            });
            this.manage_button = createButton(contents, APPMSG.ManageButton_label)
                .click(function () {
                _this.openSessionSetDialog();
            });
            this.selectAll_button = createButton(contents, APPMSG.SelectAllButton_label)
                .click(function (e) {
                _this.session.sessionSet.setSelection(_this.session.sessionSet.sessions);
                _this.updateCheckState();
            });
            this.updateButtonState();
        };
        SessionSetComposer.prototype.drawHeaderList = function (contents) {
            var _this = this;
            if (this.readOnly)
                return;
            var addField = function (placeholder, value, field, setter) {
                var text = $("<textarea>");
                if (!value) {
                    text.attr("placeholder", placeholder);
                }
                else {
                    text.text(value);
                }
                text.appendTo($(contents));
                text.change(function () {
                    setter(text.val());
                });
                text.mouseup(function () {
                    _this.heights[field] = $(_this.commentText).height();
                    _this.width = $(_this.commentText).width();
                });
            };
            addField(APPMSG.EnterYourComment, this.session.getUserComment(), 0, function (v) { return _this.session.setUserComment(v); });
            addField(APPMSG.EnterTags, this.session.getTags(), 1, function (v) { return _this.session.setTags(v); });
        };
        SessionSetComposer.prototype.updateButtonState = function () {
            this.add_button.button("option", "disabled", this.readOnly);
            this.manage_button.button("option", "disabled", this.readOnly || this.session.sessionSet.count() == 0);
            this.selectAll_button.button("option", "disabled", this.session.sessionSet.count() == 0);
        };
        SessionSetComposer.prototype.addSession = function () {
            var composer = this;
            require(["dojo/fx", "ui/SessionSelector", "model/session/Session"], function (fx, SessionSelector, Session) {
                var session_selector = new SessionSelector(composer.session.sessionSet);
                session_selector.on("selected", function (selection) {
                    if (composer.session != null) {
                        var session = new Session(selection.path + "/" + selection.name);
                        session.setOn();
                        session.modelAvailable().then(function () {
                            composer.session.sessionSet.add(session);
                        });
                    }
                });
                session_selector.select();
            });
        };
        SessionSetComposer.prototype.setSession = function (session) {
            this.session = session;
            this.setInput(session);
            this.width = undefined;
            this.heights = [];
        };
        SessionSetComposer.prototype.openSessionSetDialog = function (done) {
            if (this.sessionSetDialog != null) {
                this.sessionSetDialog.setSession(this.session);
                this.sessionSetDialog.open();
                if (done)
                    done();
            }
            else {
                var composer = this;
                require(["dojo/fx", "ui/SessionSetDialog"], function (fx, SessionSetDialog) {
                    composer.sessionSetDialog = new SessionSetDialog();
                    composer.sessionSetDialog.setSession(composer.session);
                    composer.sessionSetDialog.open();
                    if (done)
                        done();
                });
            }
        };
        return SessionSetComposer;
    }(CheckboxDropDownList));
    return SessionSetComposer;
});
