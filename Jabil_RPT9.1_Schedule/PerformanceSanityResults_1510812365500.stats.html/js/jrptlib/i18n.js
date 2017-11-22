require(["dojo/ready",
    "dojo/fx",
    "jrptlib/Offline!",
    "jrptlib/Url",
    "jrptlib/Nls",
    "jquery"], function (ready, fx, Offline, Url, Nls, $) {
    ready(function () {
        var url = window.location.pathname;
        if (url.indexOf(".html", url.length - ".html".length) == -1) {
            var page_name = $('#i18n').attr("page");
            url += page_name;
        }
        url += ".property";
        var nl_expr = new RegExp("%\\w+", "");
        var url_obj = new Url(url);
        url_obj.get(null, function (data) {
            var myMap = Nls.parseProperties(data);
            $("head").find("title").each(function (idx) {
                var title = $(this).text();
                var t2 = nl_expr.exec($(this).text());
                if (t2 != null) {
                    for (var i = 0; i < t2.length; i++) {
                        var id = t2[i].substring(1, title.length);
                        if (myMap[id] != null)
                            $(this).text(title.replace(t2[i], myMap[id]));
                        else
                            $(this).text(title.replace(t2[i], "[Not localized " + title + "]"));
                    }
                }
            });
            $("body").find("*").each(function (idx) {
                var n = this.childNodes[0];
                while (n != null) {
                    if (n.nodeType == 3) {
                        var t = nl_expr.exec(n.data);
                        if (t != null) {
                            for (var i = 0; i < t.length; i++) {
                                var id = t[i].substring(1, n.data.length);
                                if (myMap[id] != null)
                                    n.nodeValue = n.nodeValue.replace(t[i], myMap[id]);
                                else
                                    n.nodeValue = n.nodeValue.replace(t[i], "[Not localized " + n.data + "]");
                            }
                        }
                    }
                    n = n.nextSibling;
                }
                var title = $(this).attr("title");
                if (title) {
                    var t2 = nl_expr.exec(title);
                    if (t2 != null) {
                        for (var i = 0; i < t2.length; i++) {
                            var id = t2[i].substring(1, title.length);
                            if (myMap[id] != null)
                                $(this).attr("title", title.replace(t2[i], myMap[id]));
                            else
                                $(this).attr("title", title.replace(t2[i], "[Not localized " + title + "]"));
                        }
                    }
                }
                var alt = $(this).attr("alt");
                if (alt) {
                    var t2 = nl_expr.exec(alt);
                    if (t2 != null) {
                        for (var i = 0; i < t2.length; i++) {
                            var id = t2[i].substring(1, alt.length);
                            if (myMap[id] != null)
                                $(this).attr("alt", alt.replace(t2[i], myMap[id]));
                            else
                                $(this).attr("alt", alt.replace(t2[i], "[Not localized " + title + "]"));
                        }
                    }
                }
            });
        }, "text", function (xhr, text, errorThrown) {
            console.log('Unable to retrieve localization resource : ' + this.url + " due to " + errorThrown);
        });
    });
});
