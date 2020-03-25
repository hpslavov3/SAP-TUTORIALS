sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log"
], function (Controller,Log) {
	"use strict";

	return Controller.extend("sapcp.tutorial.cf.ui.controller.View1", {
		onInit: function () {

		},
		
		onBeforeRendering: function() {
			Log.info("A random log message");
		},
		
		onAfterRendering: function() {
			debugger
		}
	});
});