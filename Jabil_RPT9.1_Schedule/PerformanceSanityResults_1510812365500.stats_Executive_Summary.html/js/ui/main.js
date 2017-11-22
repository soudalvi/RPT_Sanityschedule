require(["dojo/ready",
    "dojo/fx",
    "jquery",
    "jqueryui"], function (ready, fx, $, jui) {
    ready(function () {
        require(["dojo/fx",
            "ui/App",
            "dojo/domReady!"], function (fx, Application) {
            _app = new Application();
            _app.start();
        });
    });
});
