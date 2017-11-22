var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Listview", "jrptlib/DateFormat", "ui/HelpContextIds", "jrptlib/Properties!APPMSG"], function (require, exports, Evented, Listview, DateFormat, HelpContextIds, APPMSG) {
    "use strict";
    var SessionSetDialog = (function (_super) {
        __extends(SessionSetDialog, _super);
        function SessionSetDialog() {
            _super.call(this);
            var _this = this;
            this.dialog = $("#session_set_dialog").dialog({
                autoOpen: false,
                width: "auto",
                height: 450,
                closeText: APPMSG.Close_button,
                modal: true,
                dialogClass: "session-set-dialog",
                buttons: [{
                        id: "applySessionSet",
                        text: APPMSG.Apply_button,
                        click: function () {
                            _this.apply();
                            $(this).dialog("close");
                        } },
                    {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
            this.session_list = new Listview($(this.dialog).find(".session-list")[0]);
            this.session_list.setLabelProvider({
                getText: function (session) {
                    var d = new DateFormat(session.getDate());
                    return session.getTestName() + " [" + d.toDateString() + "]";
                }
            });
            this.session_list.setContentProvider({
                getElements: function (sessionSet, handler) {
                    handler(sessionSet.sessions);
                }
            });
            this.session_list.setEditMode(true);
            this.session_list.setModelModifierProvider({
                getLabel: function (action) {
                    if (action == this.remove)
                        return APPMSG.Remove_Action;
                    if (action == this.insertAfter)
                        return APPMSG.Add_Action;
                    if (action == this.moveUp)
                        return APPMSG.MoveUp_Action;
                    if (action == this.moveDown)
                        return APPMSG.MoveDown_Action;
                    return null;
                },
                remove: function (session, done) {
                    var removed_index = _this.sessionSet.list().indexOf(session);
                    _this.sessionSet.remove(session);
                    var selection = null;
                    if (removed_index < _this.sessionSet.list().length) {
                        selection = _this.sessionSet.list()[removed_index];
                    }
                    else {
                        selection = _this.sessionSet.list()[removed_index - 1];
                    }
                    done(selection);
                },
                insertAfter: function (after, done) {
                    _this.addSession(after, done);
                },
                moveUp: function (session, done) {
                    var idx = _this.sessionSet.sessions.indexOf(session);
                    _this.sessionSet.move(idx, idx - 1);
                    done(_this.sessionSet.get(idx - 1));
                },
                moveDown: function (session, done) {
                    var idx = _this.sessionSet.sessions.indexOf(session);
                    _this.sessionSet.move(idx, idx + 2);
                    done(_this.sessionSet.get(idx + 1));
                }
            });
            _app.getHelpSystem().setHelp(".session-dialog", HelpContextIds.SESSION_SET_DIALOG);
        }
        SessionSetDialog.prototype.addSession = function (after, done) {
            var _this = this;
            require(["dojo/fx", "ui/SessionSelector", "model/session/Session"], function (fx, SessionSelector, Session) {
                var session_selector = new SessionSelector(_this.sessionSet);
                session_selector.on("selected", function (selection) {
                    if (_this.sessionSet != null) {
                        var session = new Session(selection.path + "/" + selection.name);
                        session.setOn();
                        session.modelAvailable().then(function () {
                            _this.sessionSet.add(session);
                            done(session);
                        });
                    }
                });
                session_selector.select();
            });
        };
        SessionSetDialog.prototype.setSession = function (session) {
            this.session = session;
            this.sessionSet = session.copySessionSet();
        };
        SessionSetDialog.prototype.open = function () {
            this.session_list.setInput(this.sessionSet);
            if (this.sessionSet.sessions.length > 0)
                this.session_list.setSelection(this.sessionSet.sessions[0]);
            this.dialog.dialog("open");
        };
        SessionSetDialog.prototype.apply = function () {
            this.session.setSessionSet(this.sessionSet);
        };
        SessionSetDialog.prototype.add = function (session) {
            if (!this.dialog.dialog("isOpen"))
                return;
        };
        return SessionSetDialog;
    }(Evented));
    return SessionSetDialog;
});
