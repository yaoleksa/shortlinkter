function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const lastRow = SpreadsheetApp.getActiveSpreadsheet().getSheetById(0).getLastRow();
  let id;
  SpreadsheetApp.getActiveSpreadsheet().getSheetById(0).getRange(`A2:B${lastRow}`).getValues().forEach(record => {
    if(data.link == record[1]) {
      id = record[0];
    }
  });
  if(id) {
    return ContentService.createTextOutput(id);
  } else {
    const rowForRecord = lastRow + 1;
    SpreadsheetApp.getActiveSpreadsheet().getSheetById(0).getRange(`A${rowForRecord}:B${rowForRecord}`).setValues([
      [data.id, data.link]
    ]);
    return ContentService.createTextOutput(data.id); 
  }
}
