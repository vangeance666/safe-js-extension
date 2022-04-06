console.log("menu.js loaded");

browser.contextMenus.create({
	id: "muted-tab", 
	title: "Analyze in Safe-JS",
	contexts: ['link']
});


browser.contextMenus.onClicked.addListener(function(info, tab) {
	console.log("tab: ", tab);
	console.log("info: ", info);
  // switch (info.menuItemId) {
  //   case "log-selection":
  //     console.log(info.selectionText);
  //     break;
  //   ...
  // }
})



// let elem = browser.menus.getTargetElement(targetElementId);



// browser.contextMenus.create({
//   id: "log-selection",
//   title: browser.i18n.getMessage("contextMenuItemSelectionLogger"),
//   contexts: ["selection"]
// }, onCreated)