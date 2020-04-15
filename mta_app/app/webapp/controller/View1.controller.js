sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("sapcp.cf.tutorial.app.controller.View1", {
		onInit: function () {

		},
		handleSearch: function (evt) {
			var filters = [];
			var query = evt.getParameter("query");
			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}

			var list = this.getView().byId("List");
			var binding = list.getBinding("items");
			binding.filter(filters);
		},
		handleListItemPress: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var selectedProductId = oEvent.getSource().getBindingContext().getProperty("ProductID");
			oRouter.navTo("Detail", {
				productId: selectedProductId
			});
		}
	});
});