/**
 * Google Apps Script Web App for Sairam Microfinance
 * 
 * Bridging React Client to Google Sheets (Apply Loans, Contact us & Notification).
 * Place this script inside the Extensions -> Apps Script Editor of your Google Sheet.
 */

var LOANS_SHEET_NAME = "Apply Loans";
var CONTACTS_SHEET_NAME = "Contact us";
var NOTIFICATIONS_SHEET_NAME = "Notification";
var SECRET_KEY = "SairamMicroFinanceSecretKey123!";

/**
 * Returns the sheet tab named "Apply Loans".
 * Automatically creates and formats headers if the tab doesn't exist.
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOANS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(LOANS_SHEET_NAME);
    var headers = [
      "S.No", "id", "fullName", "dob", "gender", "mobile", "email", "loanType", 
      "amount", "tenureMonths", "interestRate", "monthlyEMI", "occupation", 
      "employerName", "experienceYears", "monthlyIncome", "otherIncome", 
      "appliedDate", "comments", "status"
    ];
    sheet.appendRow(headers);
    
    // Style the header row for visual clarity
    sheet.setRowHeight(1, 35);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackgroundColor("#1e3a8a"); // Rich Corporate Blue
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    
    // Auto-fit columns with safety padding
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
      var currentWidth = sheet.getColumnWidth(col);
      sheet.setColumnWidth(col, Math.max(currentWidth + 40, 120)); // Minimum width of 120px + 40px padding
    }

    // Delete default Sheet1 if empty
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
      ss.deleteSheet(defaultSheet);
    }
  }
  return sheet;
}

/**
 * Returns the sheet tab named "Contact us".
 * Automatically creates and formats headers if the tab doesn't exist.
 */
function getOrCreateContactSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONTACTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONTACTS_SHEET_NAME);
    var headers = [
      "S.No", "id", "name", "phone", "subject", "message", "submittedAt", "status"
    ];
    sheet.appendRow(headers);
    
    // Style the header row for visual clarity
    sheet.setRowHeight(1, 35);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackgroundColor("#1e3a8a"); // Rich Corporate Blue
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    
    // Auto-fit columns with safety padding
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
      var currentWidth = sheet.getColumnWidth(col);
      sheet.setColumnWidth(col, Math.max(currentWidth + 40, 120));
    }
  }
  return sheet;
}

/**
 * Returns the sheet tab named "Notification".
 * Automatically creates and formats headers if the tab doesn't exist.
 * Columns: S.No, title, message, date
 */
function getOrCreateNotificationSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(NOTIFICATIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(NOTIFICATIONS_SHEET_NAME);
    var headers = [
      "S.No", "title", "message", "date"
    ];
    sheet.appendRow(headers);
    
    // Style the header row for visual clarity
    sheet.setRowHeight(1, 35);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackgroundColor("#1e3a8a"); // Rich Corporate Blue
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    
    // Auto-fit columns with safety padding
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
      var currentWidth = sheet.getColumnWidth(col);
      sheet.setColumnWidth(col, Math.max(currentWidth + 40, 120));
    }
  }
  return sheet;
}

/**
 * Utility to convert dates from yyyy-mm-dd or Date objects to dd-mm-yyyy format.
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  
  var d;
  if (dateStr instanceof Date) {
    d = dateStr;
  } else {
    var str = dateStr.toString().trim();
    if (str.indexOf('T') !== -1) {
      str = str.split('T')[0];
    }
    str = str.replace(/\//g, '-');
    var parts = str.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) { // yyyy-mm-dd
        d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else { // dd-mm-yyyy or mm-dd-yyyy
        d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    } else {
      d = new Date(str);
    }
  }
  
  if (isNaN(d.getTime())) {
    return dateStr;
  }
  
  var day = ("0" + d.getDate()).slice(-2);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var year = d.getFullYear();
  return "'" + day + "-" + month + "-" + year; // Prefix with single quote to force dd-mm-yyyy text format in Google Sheets
}

/**
 * Scans Apply Loans sheet and corrects dates that got swapped to February 2026.
 * Sets them back to July 2nd, 2026 in dd-mm-yyyy text format.
 */
function fixAllSwappedDates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOANS_SHEET_NAME);
  if (!sheet) return;
  
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;
  
  var range = sheet.getRange(2, 18, lastRow - 1, 1); // Column 18: appliedDate
  var values = range.getValues();
  var updated = false;
  
  for (var i = 0; i < values.length; i++) {
    var val = values[i][0];
    if (val instanceof Date) {
      var year = val.getFullYear();
      var month = val.getMonth() + 1; // 1-12
      var day = val.getDate();
      
      // If it got parsed as Feb 6/7, 2026, it was actually July 2nd, 2026!
      if (year === 2026 && month === 2 && (day === 6 || day === 7)) {
        values[i][0] = "'02-07-2026"; // Reset to July 2nd, 2026 in dd-mm-yyyy text format
        updated = true;
      }
    } else if (typeof val === 'string') {
      var cleanVal = val.trim();
      if (cleanVal === '06-02-2026' || cleanVal === "'06-02-2026") {
        values[i][0] = "'02-07-2026";
        updated = true;
      }
    }
  }
  
  if (updated) {
    range.setValues(values);
  }
}

/**
 * GET requests: Read all records from Google Sheets (Apply Loans, Contact us, Notification)
 */
function doGet(e) {
  try {
    // Verify Security Secret Key
    if (!e.parameter || e.parameter.key !== SECRET_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unauthorized access" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Automatically correct locale-swapped dates in the sheet on load
    try {
      fixAllSwappedDates();
    } catch(err) {
      console.error("Failed to run fixAllSwappedDates:", err);
    }

    // 1. Fetch Loan Applications
    var loanSheet = getOrCreateSheet();
    var loanLastRow = loanSheet.getLastRow();
    var apps = [];
    
    if (loanLastRow > 1) {
      var loanRows = loanSheet.getDataRange().getValues();
      var loanHeaders = loanRows[0];
      for (var i = 1; i < loanRows.length; i++) {
        var row = loanRows[i];
        var record = {};
        for (var j = 0; j < loanHeaders.length; j++) {
          record[loanHeaders[j]] = row[j];
        }
        
        // Parse numeric columns correctly
        record["S.No"] = Number(record["S.No"]);
        record.amount = Number(record.amount);
        record.tenureMonths = Number(record.tenureMonths);
        record.interestRate = Number(record.interestRate);
        record.monthlyEMI = Number(record.monthlyEMI);
        record.experienceYears = Number(record.experienceYears);
        record.monthlyIncome = Number(record.monthlyIncome);
        record.otherIncome = Number(record.otherIncome);
        
        // Supply fallback mock values for removed database columns so UI doesn't crash
        record.userId = "guest";
        record.documents = {
          aadhaarName: 'Not Provided',
          aadhaarData: '',
          panName: 'Not Provided',
          panData: '',
          photoName: 'Not Provided',
          photoData: '',
          incomeProofName: 'Not Provided',
          incomeProofData: ''
        };
        apps.push(record);
      }
    }

    // 2. Fetch Contact Messages
    var contactSheet = getOrCreateContactSheet();
    var contactLastRow = contactSheet.getLastRow();
    var contacts = [];

    if (contactLastRow > 1) {
      var contactRows = contactSheet.getDataRange().getValues();
      var contactHeaders = contactRows[0];
      for (var k = 1; k < contactRows.length; k++) {
        var cRow = contactRows[k];
        var cRecord = {};
        for (var m = 0; m < contactHeaders.length; m++) {
          cRecord[contactHeaders[m]] = cRow[m];
        }
        cRecord["S.No"] = Number(cRecord["S.No"]);
        contacts.push(cRecord);
      }
    }

    // 3. Fetch Website Notifications
    var notifSheet = getOrCreateNotificationSheet();
    var notifLastRow = notifSheet.getLastRow();
    var notifications = [];

    if (notifLastRow > 1) {
      var notifRows = notifSheet.getDataRange().getValues();
      var notifHeaders = notifRows[0];
      for (var n = 1; n < notifRows.length; n++) {
        var nRow = notifRows[n];
        var nRecord = {};
        for (var p = 0; p < notifHeaders.length; p++) {
          nRecord[notifHeaders[p]] = nRow[p];
        }
        nRecord["S.No"] = Number(nRecord["S.No"]);
        
        // Supply fallback/default fields deleted from DB so UI doesn't crash
        nRecord.id = "n-" + nRecord["S.No"];
        nRecord.isRead = false;
        nRecord.type = "info";
        
        notifications.push(nRecord);
      }
    }
    
    var responseObj = {
      applications: apps,
      contacts: contacts,
      notifications: notifications
    };

    return ContentService.createTextOutput(JSON.stringify(responseObj))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * POST requests: Handle insertions ("create", "create_contact", "create_notification") and updates/deletions
 */
function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    
    // Verify Security Secret Key
    if (!postData || postData.key !== SECRET_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unauthorized access" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var action = postData.action;
    
    if (action === "create") {
      var sheet = getOrCreateSheet();
      var app = postData.data;
      var rowData = [
        "=ROW()-1", // Formula for auto-incrementing S.No
        app.id,
        app.fullName,
        formatDate(app.dob),
        app.gender,
        app.mobile,
        app.email,
        app.loanType,
        app.amount,
        app.tenureMonths,
        app.interestRate,
        app.monthlyEMI,
        app.occupation,
        app.employerName,
        app.experienceYears,
        app.monthlyIncome,
        app.otherIncome,
        formatDate(app.appliedDate),
        app.comments || "",
        app.status
      ];
      
      sheet.insertRowBefore(2);
      
      var newRange = sheet.getRange(2, 1, 1, rowData.length);
      newRange.setValues([rowData]);
      
      sheet.setRowHeight(2, 28);
      newRange.setHorizontalAlignment("center");
      newRange.setVerticalAlignment("middle");
      
      var statusCell = sheet.getRange(2, 20);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending", "KYC_Verified", "Approved", "Rejected"], true)
        .setAllowInvalid(false)
        .build();
      statusCell.setDataValidation(rule);
      
      applyConditionalFormatting(sheet, 2, sheet.getLastRow() - 1);
      
      for (var col = 1; col <= rowData.length; col++) {
        sheet.autoResizeColumn(col);
        var currentWidth = sheet.getColumnWidth(col);
        sheet.setColumnWidth(col, Math.max(currentWidth + 40, 120));
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Created application successfully", data: app }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === "update") {
      var sheet = getOrCreateSheet();
      var appId = postData.id;
      var status = postData.status;
      var comment = postData.comment || "";
      
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] === appId) {
          sheet.getRange(i + 1, 20).setValue(status);
          if (comment) {
            sheet.getRange(i + 1, 19).setValue(comment);
          }
          
          sheet.autoResizeColumn(19);
          sheet.setColumnWidth(19, Math.max(sheet.getColumnWidth(19) + 40, 120));
          sheet.autoResizeColumn(20);
          sheet.setColumnWidth(20, Math.max(sheet.getColumnWidth(20) + 40, 120));

          return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Updated status successfully" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Application ID not found" }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === "create_contact") {
      var cSheet = getOrCreateContactSheet();
      var msg = postData.data;
      var cRowData = [
        "=ROW()-1",
        msg.id,
        msg.name,
        msg.phone,
        msg.subject,
        msg.message,
        formatDate(msg.submittedAt),
        msg.status
      ];
      
      cSheet.insertRowBefore(2);
      var cRange = cSheet.getRange(2, 1, 1, cRowData.length);
      cRange.setValues([cRowData]);
      
      cSheet.setRowHeight(2, 28);
      cRange.setHorizontalAlignment("center");
      cRange.setVerticalAlignment("middle");
      
      var cStatusCell = cSheet.getRange(2, 8);
      var cRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Read", "Unread"], true)
        .setAllowInvalid(false)
        .build();
      cStatusCell.setDataValidation(cRule);
      
      applyContactConditionalFormatting(cSheet, 2, cSheet.getLastRow() - 1);
      
      for (var cCol = 1; cCol <= cRowData.length; cCol++) {
        cSheet.autoResizeColumn(cCol);
        var cWidth = cSheet.getColumnWidth(cCol);
        cSheet.setColumnWidth(cCol, Math.max(cWidth + 40, 120));
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Created contact message successfully", data: msg }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === "update_contact") {
      var cUpdateSheet = getOrCreateContactSheet();
      var msgId = postData.id;
      var msgStatus = postData.status;
      
      var cRows = cUpdateSheet.getDataRange().getValues();
      for (var k = 1; k < cRows.length; k++) {
        if (cRows[k][1] === msgId) {
          cUpdateSheet.getRange(k + 1, 8).setValue(msgStatus);
          
          cUpdateSheet.autoResizeColumn(8);
          cUpdateSheet.setColumnWidth(8, Math.max(cUpdateSheet.getColumnWidth(8) + 40, 120));

          return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Updated contact status successfully" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Contact Message ID not found" }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === "create_notification") {
      var nSheet = getOrCreateNotificationSheet();
      var notif = postData.data;
      var nRowData = [
        "=ROW()-1",
        notif.title,
        notif.message,
        formatDate(notif.date)
      ];
      
      nSheet.insertRowBefore(2);
      var nRange = nSheet.getRange(2, 1, 1, nRowData.length);
      nRange.setValues([nRowData]);
      
      nSheet.setRowHeight(2, 28);
      nRange.setHorizontalAlignment("center");
      nRange.setVerticalAlignment("middle");
      
      for (var nCol = 1; nCol <= nRowData.length; nCol++) {
        nSheet.autoResizeColumn(nCol);
        var nWidth = nSheet.getColumnWidth(nCol);
        nSheet.setColumnWidth(nCol, Math.max(nWidth + 40, 120));
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Created notification successfully", data: notif }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === "delete_notification") {
      var nDelSheet = getOrCreateNotificationSheet();
      var titleToMatch = postData.title;
      var messageToMatch = postData.message;
      
      var nRows = nDelSheet.getDataRange().getValues();
      for (var rowIdx = 1; rowIdx < nRows.length; rowIdx++) {
        // Column B (index 1) is Title, Column C (index 2) is Message
        if (nRows[rowIdx][1] === titleToMatch && nRows[rowIdx][2] === messageToMatch) {
          nDelSheet.deleteRow(rowIdx + 1);
          return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Deleted notification successfully" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Matching notification not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid action type" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Run this function manually in Google Apps Script editor to format the Apply Loans sheet.
 */
function formatExistingSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOANS_SHEET_NAME) || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  if (lastRow > 0 && lastCol > 0) {
    var rows = sheet.getDataRange().getValues();
    var oldHeaders = rows[0];
    
    var newHeaders = [
      "S.No", "id", "fullName", "dob", "gender", "mobile", "email", "loanType", 
      "amount", "tenureMonths", "interestRate", "monthlyEMI", "occupation", 
      "employerName", "experienceYears", "monthlyIncome", "otherIncome", 
      "appliedDate", "comments", "status"
    ];
    
    var migratedData = [];
    migratedData.push(newHeaders);
    
    for (var i = rows.length - 1; i >= 1; i--) {
      var oldRow = rows[i];
      var record = {};
      for (var j = 0; j < oldHeaders.length; j++) {
        record[oldHeaders[j]] = oldRow[j];
      }
      
      var newRow = [
        "=ROW()-1",
        record.id || "",
        record.fullName || "",
        formatDate(record.dob),
        record.gender || "",
        record.mobile || "",
        record.email || "",
        record.loanType || "",
        record.amount || 0,
        record.tenureMonths || 0,
        record.interestRate || 0,
        record.monthlyEMI || 0,
        record.occupation || "",
        record.employerName || "",
        record.experienceYears || 0,
        record.monthlyIncome || 0,
        record.otherIncome || 0,
        formatDate(record.appliedDate),
        record.comments || "",
        record.status || "Pending"
      ];
      migratedData.push(newRow);
    }
    
    sheet.clear();
    var outputRange = sheet.getRange(1, 1, migratedData.length, newHeaders.length);
    outputRange.setValues(migratedData);
    
    var entireRange = sheet.getRange(1, 1, migratedData.length, newHeaders.length);
    entireRange.setHorizontalAlignment("center");
    entireRange.setVerticalAlignment("middle");
    
    sheet.setRowHeight(1, 35);
    if (migratedData.length > 1) {
      sheet.setRowHeights(2, migratedData.length - 1, 28);
      var statusRange = sheet.getRange(2, 20, migratedData.length - 1, 1);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending", "KYC_Verified", "Approved", "Rejected"], true)
        .setAllowInvalid(false)
        .build();
      statusRange.setDataValidation(rule);
      applyConditionalFormatting(sheet, 2, migratedData.length - 1);
    }
    
    var headerRange = sheet.getRange(1, 1, 1, newHeaders.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackgroundColor("#1e3a8a");
    headerRange.setFontColor("#ffffff");
    
    for (var col = 1; col <= newHeaders.length; col++) {
      sheet.autoResizeColumn(col);
      var currentWidth = sheet.getColumnWidth(col);
      sheet.setColumnWidth(col, Math.max(currentWidth + 40, 120));
    }
  }
}

/**
 * Run this function manually in Google Apps Script editor to format the Contact us sheet.
 */
function formatExistingContactsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateContactSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow > 0) {
    var rows = sheet.getDataRange().getValues();
    var oldHeaders = rows[0];
    
    var newHeaders = [
      "S.No", "id", "name", "phone", "subject", "message", "submittedAt", "status"
    ];
    
    var migratedData = [];
    migratedData.push(newHeaders);
    
    for (var i = rows.length - 1; i >= 1; i--) {
      var oldRow = rows[i];
      var record = {};
      for (var j = 0; j < oldHeaders.length; j++) {
        record[oldHeaders[j]] = oldRow[j];
      }
      
      var newRow = [
        "=ROW()-1",
        record.id || "",
        record.name || "",
        record.phone || "",
        record.subject || "",
        record.message || "",
        formatDate(record.submittedAt),
        record.status || "Unread"
      ];
      migratedData.push(newRow);
    }
    
    sheet.clear();
    var outputRange = sheet.getRange(1, 1, migratedData.length, newHeaders.length);
    outputRange.setValues(migratedData);
    
    var entireRange = sheet.getRange(1, 1, migratedData.length, newHeaders.length);
    entireRange.setHorizontalAlignment("center");
    entireRange.setVerticalAlignment("middle");
    
    sheet.setRowHeight(1, 35);
    if (migratedData.length > 1) {
      sheet.setRowHeights(2, migratedData.length - 1, 28);
      var statusRange = sheet.getRange(2, 8, migratedData.length - 1, 1);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Read", "Unread"], true)
        .setAllowInvalid(false)
        .build();
      statusRange.setDataValidation(rule);
      applyContactConditionalFormatting(sheet, 2, migratedData.length - 1);
    }
    
    var headerRange = sheet.getRange(1, 1, 1, newHeaders.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackgroundColor("#1e3a8a");
    headerRange.setFontColor("#ffffff");
    
    for (var col = 1; col <= newHeaders.length; col++) {
      sheet.autoResizeColumn(col);
      var currentWidth = sheet.getColumnWidth(col);
      sheet.setColumnWidth(col, Math.max(currentWidth + 40, 120));
    }
  }
}

/**
 * Run this function manually in Google Apps Script editor to format the Notification sheet.
 * Columns: S.No, title, message, date
 */
function formatExistingNotificationsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateNotificationSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow > 0) {
    var rows = sheet.getDataRange().getValues();
    var oldHeaders = rows[0];
    
    var newHeaders = [
      "S.No", "title", "message", "date"
    ];
    
    var migratedData = [];
    migratedData.push(newHeaders);
    
    // Find column indexes of title, message, date from old headers
    var titleIdx = oldHeaders.indexOf("title");
    var messageIdx = oldHeaders.indexOf("message");
    var dateIdx = oldHeaders.indexOf("date");
    
    for (var i = rows.length - 1; i >= 1; i--) {
      var oldRow = rows[i];
      var newRow = [
        "=ROW()-1",
        titleIdx !== -1 ? oldRow[titleIdx] : "",
        messageIdx !== -1 ? oldRow[messageIdx] : "",
        dateIdx !== -1 ? formatDate(oldRow[dateIdx]) : formatDate(new Date())
      ];
      migratedData.push(newRow);
    }
    
    sheet.clear();
    sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearDataValidations();
    var outputRange = sheet.getRange(1, 1, migratedData.length, newHeaders.length);
    outputRange.setValues(migratedData);
    
    var entireRange = sheet.getRange(1, 1, migratedData.length, newHeaders.length);
    entireRange.setHorizontalAlignment("center");
    entireRange.setVerticalAlignment("middle");
    
    sheet.setRowHeight(1, 35);
    if (migratedData.length > 1) {
      sheet.setRowHeights(2, migratedData.length - 1, 28);
    }
    
    var headerRange = sheet.getRange(1, 1, 1, newHeaders.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackgroundColor("#1e3a8a");
    headerRange.setFontColor("#ffffff");
    
    for (var col = 1; col <= newHeaders.length; col++) {
      sheet.autoResizeColumn(col);
      var currentWidth = sheet.getColumnWidth(col);
      sheet.setColumnWidth(col, Math.max(currentWidth + 40, 120));
    }
  }
}

/**
 * Applies color coding to the loan status column using Conditional Formatting.
 */
function applyConditionalFormatting(sheet, startRow, numRows) {
  if (numRows <= 0) return;
  var range = sheet.getRange(startRow, 20, numRows, 1); // Column T (status)
  var rules = sheet.getConditionalFormatRules();
  var newRules = [];
  
  for (var i = 0; i < rules.length; i++) {
    var ruleRanges = rules[i].getRanges();
    if (ruleRanges.length > 0 && ruleRanges[0].getColumn() !== 20) {
      newRules.push(rules[i]);
    }
  }
  
  var rulePending = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Pending")
    .setBackground("#f1f5f9")
    .setFontColor("#475569")
    .setRanges([range])
    .build();
    
  var ruleKYC = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("KYC_Verified")
    .setBackground("#2563eb")
    .setFontColor("#ffffff")
    .setRanges([range])
    .build();
    
  var ruleApproved = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Approved")
    .setBackground("#00875a")
    .setFontColor("#ffffff")
    .setRanges([range])
    .build();
    
  var ruleRejected = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Rejected")
    .setBackground("#dc2626")
    .setFontColor("#ffffff")
    .setRanges([range])
    .build();
    
  newRules.push(rulePending, ruleKYC, ruleApproved, ruleRejected);
  sheet.setConditionalFormatRules(newRules);
}

/**
 * Applies color coding to the contact message status column using Conditional Formatting.
 */
function applyContactConditionalFormatting(sheet, startRow, numRows) {
  if (numRows <= 0) return;
  var range = sheet.getRange(startRow, 8, numRows, 1); // Column H (status)
  var rules = sheet.getConditionalFormatRules();
  var newRules = [];
  
  for (var i = 0; i < rules.length; i++) {
    var ruleRanges = rules[i].getRanges();
    if (ruleRanges.length > 0 && ruleRanges[0].getColumn() !== 8) {
      newRules.push(rules[i]);
    }
  }
  
  var ruleUnread = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Unread")
    .setBackground("#fef3c7") // Light yellow background
    .setFontColor("#b45309")   // Amber text
    .setRanges([range])
    .build();
    
  var ruleRead = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Read")
    .setBackground("#f1f5f9") // Light grey background
    .setFontColor("#475569")   // Slate text
    .setRanges([range])
    .build();
    
  newRules.push(ruleUnread, ruleRead);
  sheet.setConditionalFormatRules(newRules);
}
