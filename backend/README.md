# Linking Google Sheets to Sairam Microfinance

Follow this step-by-step guide to connect your website to your Google Sheet database.

---

## Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Rename the spreadsheet to whatever you prefer (e.g., `Sairam Microfinance Database`).
3. You **do not** need to create columns or rename the tab sheet manually. The script will automatically setup the sheet tab named **`Apply Loans`** with all headers on its first run.

## Step 2: Open and Paste the script in Apps Script
1. In your Google Sheet, click **Extensions** -> **Apps Script** in the top menu.
2. In the Apps Script code editor, delete any existing boilerplate code.
3. Open the file [google-apps-script.js](google-apps-script.js) from this folder, copy its entire contents, and paste it into the editor.
4. Click the **Save** icon (floppy disk) on the toolbar.

## Step 3: Deploy the Script as a Web App
1. Click the **Deploy** button (top right) -> select **New deployment**.
2. Click the **Gear icon** next to "Select type" and select **Web app**.
3. Fill out the configuration fields exactly as follows:
   *   **Description**: `Sairam Microfinance API`
   *   **Execute as**: `Me (your-google-account@gmail.com)`
   *   **Who has access**: `Anyone` (This is mandatory so that API requests from the frontend can authenticate without login screens).
4. Click **Deploy**.

## Step 4: Authorize Google Sheet Permissions
1. When prompted, click **Authorize Access**.
2. Choose your Google account.
3. You will see a warning screen: *"Google hasn't verified this app"*. Click **Advanced** at the bottom.
4. Click **Go to Untitled project (unsafe)**.
5. Click **Allow** on the next screen.

## Step 5: Copy the URL and link the Website
1. Once deployed, Google will show you a screen with the **Web App URL** (e.g. `https://script.google.com/macros/s/XXXXX/exec`).
2. Copy this URL.
3. Open the file [src/services/mockDb.ts](../src/services/mockDb.ts) in your code editor.
4. Near the top of the file, find the variable `GOOGLE_SHEET_API_URL` and paste your copied URL:
   ```typescript
   const GOOGLE_SHEET_API_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
   ```
5. Save the file. The website will now automatically sync, insert, and update all loan application records directly inside your Google Sheet!

---

## ⚠️ Troubleshooting: New entries saving in the old column format?
If you recently updated your script headers (adding `S.No`, removing `userId` or `documents`) but new applications are still writing in the old format, it is because **Google Apps Script is still running the old version of your code**.

Google does **not** automatically update deployed Web Apps when you save your script. To apply code changes to your live site, you **must** update the deployment:

1. In the Apps Script editor, click **Deploy** -> select **Manage deployments**.
2. Select your active Web App deployment from the list.
3. Click the **Pencil icon** (Edit) on the top right.
4. In the **Version** dropdown list, select **`New version`**.
5. Click **Deploy**.
*(Note: You do not need to copy a new URL. The existing URL remains active but now executes your new code!)*
