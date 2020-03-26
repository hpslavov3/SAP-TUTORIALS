/* eslint-disable sap-no-hardcoded-url */
/* global Msal */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"
], function (Controller, Spreadsheet, MessageToast) {
	"use strict";

	return Controller.extend("sapcp.tutorial.cf.ui.controller.View1", {
		config: {
			msalConfig: {
				auth: {
					clientId: "1328387d-95ed-4767-acb4-293e2d2d283a"
				},
				cache: {
					cacheLocation: 'localStorage',
					storeAuthStateInCookie: true
				}
			},
			graphBaseEndpoint: "https://graph.microsoft.com/v1.0/",
			scopeConfig: {
				scopes: ['Files.ReadWrite.All']
			}
		},
		onInit: function () {
			this.oMsalClient = new Msal.UserAgentApplication(this.config.msalConfig);
			//check if the user is already signed in
			if (!this.oMsalClient.getAccount()) {
				this.oMsalClient.loginPopup(this.config.scopeConfig);
			}
		},
		onUploadToOneDrive: function () {
			var oSmartTable = this.getView().findAggregatedObjects(true, function (oAggregate) {
				return oAggregate instanceof sap.ui.comp.smarttable.SmartTable;
			})[0];
			var oTable = oSmartTable.getTable();
			var oRowBinding = oTable.getBinding("items");
			var aCols = oSmartTable.getInitiallyVisibleFields().split(',').map(function (sKey) {
				return {
					label: sKey,
					property: sKey,
					type: 'string'
				};
			});
			var oModel = oRowBinding.getModel();
			var oModelInterface = oModel.getInterface();
			var oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'level'
				},
				dataSource: {
					type: "oData",
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: oModelInterface.sServiceUrl,
					headers: oModelInterface.getHeaders ? oModelInterface.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					sizeLimit: oModelInterface.iSizeLimit
				}
			};
			new Spreadsheet(oSettings).attachBeforeSave({}, function (oEvent) {
				oEvent.preventDefault();
				this.putToGraph('me/drive/root:/UploadedFromWebApp/' + oSmartTable.getEntitySet() + '.xlsx:/content',
					new Blob([oEvent.getParameter('data')], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					}),
					function (data) {
						window.open(data.webUrl, '_blank');
					});
			}.bind(this), {}).build();
		},
		putToGraph: function (sEndpoint, payload, fnCb) {
			this.oMsalClient.acquireTokenSilent(this.config.scopeConfig)
				.then(function (oTokenInfo) {
					$.ajax({
							headers: {
								"Authorization": "Bearer " + oTokenInfo.accessToken
							},
							data: payload,
							processData: false,
							url: this.config.graphBaseEndpoint + sEndpoint,
							type: "PUT"
						})
						.then(fnCb)
						.fail(function (error) {
							MessageToast.show("Error, please check the log for details");
							$.sap.log.error(JSON.stringify(error.responseJSON.error));
						});
				}.bind(this))
				.catch($.sap.log.error);
		}
	});
});