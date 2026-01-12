function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetById(0);
  const urlRange = sheet.getRange("B:B").getValues().flat().filter(record => !!record);
  const idRange = sheet.getRange("A:A").getValues().flat().filter(record => !!record);
  if(e.parameter && e.parameter.unique && e.parameter.id) {
    let valid = true;
    idRange.forEach(record => {
      if(record[0] == e.parameter.id) {
        valid = false;
      }
    });
    return ContentService.createTextOutput(valid ? "0" : "1");
  } else if(e.parameter && e.parameter.id) {
    const urlIndex = idRange.indexOf(e.parameter.id);
    return ContentService.createTextOutput(urlIndex > -1 ? urlRange[urlIndex] : 'URL does not exist!');
  } else {}
}
