const puppeteer = require("puppeteer");

module.exports = async (kc_number) => {
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
  await page.select("#cntMain_drpSearchOptions", "EntNo");
  await page.waitForSelector("#cntMain_txtSearchCIPC");
  await page.type("#cntMain_txtSearchCIPC", kc_number, { delay: 40 });
  await page.click("#cntMain_btnSearch");
  await page.waitForSelector("#cntMain_pnlResults", { visibility: true });
  const data = await page.evaluate(() => {
    const EnterpriceNumber =
      document.querySelector("#cntMain_lblEntNo").textContent;
    const EnterpriseName = document.querySelector(
      "#cntMain_lblEntName"
    ).textContent;
    const EnterpriseType = document.querySelector(
      "#cntMain_lblEntType"
    ).textContent;
    const EnterpriseStatus = document.querySelector(
      "#cntMain_lblEntStatus"
    ).textContent;

    const ComplianceNotice = document.querySelector(
      "#cntMain_lblNonComply"
    ).textContent;
    const RegistrationDate = document.querySelector(
      "#cntMain_lblRegDate"
    ).textContent;
    const PhysicalAddress = document
      .querySelector("#cntMain_lblPhysAddress")
      .innerHTML.split("<br>");
    const PostalAddress = document
      .querySelector("#cntMain_lblPostalAddress")
      .innerHTML.split("<br>");

    const directors = document.querySelector(
      "#cntMain_gdvDirectorDetails > tbody"
    ).childNodes;

    const companyDirectors = [];

    for (let index = 0; index < directors.length; index++) {
      if (index == 0) {
        continue;
      }
      const doc = {};
      directors[index].childNodes.forEach((e, i) => {
        if (i == 1) {
          doc.idNumber = e.textContent;
        }
        if (i == 2) {
          doc.FullName = e.textContent;
        }
        if (i == 3) {
          doc.Surname = e.textContent;
        }
        if (i == 4) {
          doc.Type = e.textContent;
        }
        if (i == 5) {
          doc.Status = e.textContent;
        }
      });
      if (doc.idNumber) {
        companyDirectors.push(doc);
      }
    }

    const returnDue = document.querySelector(
      "#cntMain_gdvAROutstanding > tbody"
    ).childNodes;

    const returnOverDue = [];

    for (let index = 0; index < returnDue.length; index++) {
      if (index == 0) {
        console.log("skeped");
        continue;
      }
      const doc = {};
      returnDue[index].childNodes.forEach((e, i) => {
        if (i == 1) {
          doc.ARYear = e.textContent;
        }
        if (i == 2) {
          doc.ARMonth = e.textContent;
        }
        if (i == 3) {
          doc.ARNoComplianceDate = e.textContent;
        }
      });

      if (doc.ARYear) {
        returnOverDue.push(doc);
      }
    }

    const level = document.querySelector("#cntMain_lblBEELevel").textContent;

    const procurementRecognition = document.querySelector(
      "#cntMain_lblBEEProcRecog"
    ).textContent;
    const validPeriod =
      document.querySelector("#cntMain_lblPeriod").textContent;

    const totalShareholders = document.querySelector(
      "#cntMain_lblTotalShareholders"
    ).textContent;
    const blackShareholders = document.querySelector(
      "#cntMain_lblBlackPercent"
    ).textContent;
    const blackPercentage = document.querySelector(
      "#cntMain_lblBlackPercent"
    ).textContent;
    const blackFemalePercentage = document.querySelector(
      "#cntMain_lblBlackFemalePercent"
    ).textContent;

    const taxNumber = document.querySelector("#cntMain_lblTax").textContent;
    const UIFNum = document.querySelector("#cntMain_lblUIF").textContent;
    const CompensationFund =
      document.querySelector("#cntMain_lblCF").textContent;

    return {
      EnterpriceNumber,
      EnterpriseName,
      EnterpriseType,
      EnterpriseStatus,
      ComplianceNotice,
      RegistrationDate,
      PhysicalAddress,
      PostalAddress,
      companyDirectors,
      returnOverDue,
      BBEE: {
        level,
        procurementRecognition,
        validPeriod,
        totalShareholders,
        blackShareholders,
        blackPercentage,
        blackFemalePercentage,
      },
      taxNumber,
      UIFNum,
      CompensationFund,
    };
  });

  return data;
};
