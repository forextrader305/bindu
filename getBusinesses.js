const puppeteer = require("puppeteer");

module.exports = async (id_number) => {
  const browser = await puppeteer.launch({ headless: true, slowMo: 70 });
  const page = await browser.newPage();
  await page.goto("https://www.bizportal.gov.za/login.aspx", {
    waitUntil: "networkidle2",
  });
  await page.waitForSelector("#cntMain_txtIDNo");
  await page.focus("#cntMain_txtIDNo");
  await page.type("#cntMain_txtIDNo", "9802265953083");
  await page.focus("#cntMain_txtPassword");
  await page.type("#cntMain_txtPassword", "Mufhumudzi@1");
  await page.click("#cntMain_btnLogin");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  await page.goto("https://www.bizportal.gov.za/bizprofile.aspx", {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector("#cntMain_drpSearchOptions");
  await page.select("#cntMain_drpSearchOptions", "IDNo");
  await page.waitForSelector("#cntMain_txtSearchCIPC");
  await page.type("#cntMain_txtSearchCIPC", id_number, { delay: 40 });
  await page.click("#cntMain_btnSearch");
  await page.waitForSelector("#cntMain_pnlIDNoSearch", { visibility: true });
  const data = await page.evaluate(() => {
    const doc1 = document.querySelectorAll(
      "#cntMain_gdvEnterprises > tbody > tr"
    );

    const long = [];
    for (let index = 0; index < doc1.length; index++) {
      if (index == 0) {
        continue;
      }
      const list = Array.from(doc1[index].children);

      const doc = {};

      list.forEach((e, i) => {
        if (i == 0) {
          doc.enterpriseNumber = e.textContent;
        }
        if (i == 1) {
          doc.enterpriseName = e.textContent;
        }
        if (i == 2) {
          doc.enterpriseStatus = e.textContent;
        }
        if (i == 3) {
          doc.directorStatus = e.textContent;
        }
      });

      long.push(doc);
    }

    return long;
  });

  return data;
};
