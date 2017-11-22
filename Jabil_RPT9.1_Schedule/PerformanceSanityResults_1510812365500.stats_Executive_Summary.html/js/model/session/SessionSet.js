var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var SessionSet = (function (_super) {
        __extends(SessionSet, _super);
        function SessionSet(pSession, sessions, activatedSessions, copy) {
            _super.call(this);
            this.primarySession = pSession;
            this.sessions = copy ? sessions.slice(0) : sessions;
            this.activatedSessions = copy ? activatedSessions.slice(0) : activatedSessions;
        }
        SessionSet.prototype.list = function () {
            return this.sessions;
        };
        SessionSet.prototype.listIncludingPrimary = function () {
            var sessions = [];
            sessions.push(this.primarySession);
            sessions = sessions.concat(this.activatedSessions);
            return sessions;
        };
        SessionSet.prototype.count = function () {
            return this.sessions.length;
        };
        SessionSet.prototype.get = function (index) {
            return this.sessions[index];
        };
        SessionSet.prototype.move = function (from, to) {
            if (from == to - 1)
                return;
            var moved = this.sessions.splice(from, 1);
            if (from < to)
                to--;
            this.sessions.splice(to, 0, moved[0]);
        };
        SessionSet.prototype.selection = function () {
            return this.activatedSessions;
        };
        SessionSet.prototype.add = function (session) {
            if (!this.contains(session)) {
                this.sessions.push(session);
                this.activatedSessions.push(session);
                this.emit("modified", this);
                this.emit("selectionChanged", this);
            }
        };
        SessionSet.prototype.remove = function (session) {
            var idx = this.sessions.indexOf(session);
            var selectionChanged = false;
            if (idx != -1) {
                this.sessions.splice(idx, 1);
                idx = this.activatedSessions.indexOf(session);
                if (idx != -1) {
                    this.activatedSessions.splice(idx, 1);
                    selectionChanged = true;
                }
                this.emit("modified", this);
                if (selectionChanged)
                    this.emit("selectionChanged", this);
            }
        };
        SessionSet.prototype.contains = function (session) {
            for (var i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].sessionPath === session.sessionPath) {
                    return true;
                }
            }
            return session.sessionPath === this.primarySession.sessionPath;
        };
        SessionSet.prototype.setSelection = function (selection) {
            var nselect = selection.slice();
            var selectionChanged = false;
            for (var _i = 0, selection_1 = selection; _i < selection_1.length; _i++) {
                var session = selection_1[_i];
                if (this.activatedSessions.indexOf(session) != -1) {
                    nselect.splice(nselect.indexOf(session), 1);
                }
            }
            selectionChanged = nselect.length > 0 || this.activatedSessions.length != nselect.length;
            this.activatedSessions = selection.slice();
            if (selectionChanged) {
                this.emit("selectionChanged", this);
            }
        };
        SessionSet.prototype.isChecked = function (session) {
            return this.activatedSessions.indexOf(session) != -1;
        };
        SessionSet.prototype.setSessions = function (sessions) {
            if (this.hasSameSessions(sessions))
                return;
            var old = this.sessions;
            this.sessions = sessions;
            var oldSelection = this.activatedSessions;
            this.activatedSessions = [];
            for (var i = 0; i < this.sessions.length; i++) {
                this.activatedSessions.push(this.sessions[i]);
            }
            for (var i = 0; i < old.length; i++) {
                if (oldSelection.indexOf(old[i]) == -1)
                    this.activatedSessions.splice(this.activatedSessions.indexOf(old[i]), 1);
            }
            this.emit("modified", this);
            this.emit("selectionChanged", this);
        };
        SessionSet.prototype.hasSameSessions = function (sessions) {
            if (sessions.length != this.sessions.length)
                return false;
            for (var i = 0; i < sessions.length; i++) {
                if (sessions[i].sessionPath != this.sessions[i].sessionPath)
                    return false;
            }
            return true;
        };
        return SessionSet;
    }(Evented));
    return SessionSet;
});
