/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sapcp/cf/tutorial/app/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});