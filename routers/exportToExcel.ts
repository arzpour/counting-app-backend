// import express, { Router, Request, Response } from "express";
// import * as XLSX from "xlsx";
// import { getPersonReportData } from "../controllers/report";
// import moment from "moment-jalaali";

// const router: Router = express.Router();

// router.get("/generate-person-report", async (req: Request, res: Response) => {
//   const { lastName,firstName, startDate, endDate, nationalId } = req.query;

//   if (!nationalId || !startDate || !endDate) {
//     return res.status(400).json({
//       message: "لطفاً کد ملی، تاریخ شروع و تاریخ پایان را وارد کنید.",
//     });
//   }

//   const nationalIdStr = nationalId as string;
//   const startDateStr = startDate as string;
//   const endDateStr = endDate as string;
//   const firstNameStr = firstName as string | undefined;
//   const lastNameStr = lastName as string | undefined;

//   const startMomentJalaali = moment(startDateStr, "jYYYY/jMM/jDD");
//   const endMomentJalaali = moment(endDateStr, "jYYYY/jMM/jDD");

//   const startDatee = startMomentJalaali.toDate();
//   const endDatee = moment(endMomentJalaali).add(1, "day").toDate();

//   function formatDateToYYYYMMDD(date: any) {
//     if (!(date instanceof Date)) {
//       try {
//         date = new Date(date);
//       } catch (e) {
//         console.error("Invalid date input for formatting:", date, e);
//         return "invalid-date";
//       }
//     }

//     if (isNaN(date.getTime())) {
//       console.error("Date object is invalid after construction:", date);
//       return "invalid-date";
//     }

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   }

//   const formattedStartDate = formatDateToYYYYMMDD(startDatee);
//   const formattedEndDate = formatDateToYYYYMMDD(endDatee);

//   try {
//     const reportData = await getPersonReportData(
//       lastNameStr,
//       firstNameStr,
//       startDateStr,
//       endDateStr,
//       nationalIdStr,
//     );

//     if (!reportData || reportData.length === 0) {
//       return res.status(404).json({
//         message: "داده‌ای برای بازه زمانی و کد ملی مشخص شده یافت نشد.",
//       });
//     }

//     const excelJsonData = reportData.map((item) => ({
//       تاریخ: item.date,
//       "نوع تراکنش": item.type,
//       "کالکشن منبع": item.sourceCollection,
//       مبلغ: item.amount,
//       توضیحات: item.description,
//     }));
//     // console.log("🚀 ~ reportData:", reportData)

//     const worksheet = XLSX.utils.json_to_sheet(excelJsonData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, `اطلاعات ${firstNameStr} ${lastNameStr}`);

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "buffer",
//     });

//     const baseFileName = `${firstNameStr || "person"} ${lastNameStr || "person"}_report_${formattedStartDate}_to_${formattedEndDate}.xlsx`;
//     const safeFileName = encodeURIComponent(baseFileName);
//     const asciiFileName = baseFileName.replace(/[^\x20-\x7E]/g, "_");

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     );
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${asciiFileName}"; filename*=UTF-8''${safeFileName}`,
//     );
//     // res.send(excelBuffer);
//     res.end(excelBuffer);
//   } catch (error) {
//     console.error("Error generating person report:", error);
//     res.status(500).json({ message: "خطا در تولید گزارش." });
//   }
// });

// export default router;

import express, { Router, Request, Response } from "express";
import * as XLSX from "xlsx";
import { getPersonReportData } from "../controllers/report";
import moment from "moment-jalaali";

const router: Router = express.Router();

router.get("/generate-person-report", async (req: Request, res: Response) => {
  const { lastName, firstName, startDate, endDate, nationalId } = req.query;

  if (!nationalId || !startDate || !endDate) {
    return res.status(400).json({
      message: "لطفاًً کد ملی، تاریخ شروع و تاریخ پایان را وارد کنید.",
    });
  }

  const nationalIdStr = nationalId as string;
  const startDateStr = startDate as string;
  const endDateStr = endDate as string;
  const firstNameStr = firstName as string | undefined;
  const lastNameStr = lastName as string | undefined;

  const startMomentJalaali = moment(startDateStr, "jYYYY/jMM/jDD");
  const endMomentJalaali = moment(endDateStr, "jYYYY/jMM/jDD");
  const startDatee = startMomentJalaali.toDate();
  const endDatee = moment(endMomentJalaali).add(1, "day").toDate();

  function formatDateToYYYYMMDD(date: any) {
    if (!(date instanceof Date)) {
      try {
        date = new Date(date);
      } catch (e) {
        console.error("Invalid date input for formatting:", date, e);
        return "invalid-date";
      }
    }
    if (isNaN(date.getTime())) {
      console.error("Date object is invalid after construction:", date);
      return "invalid-date";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const formattedStartDate = formatDateToYYYYMMDD(startDatee);
  const formattedEndDate = formatDateToYYYYMMDD(endDatee);

  try {
    const reportData = await getPersonReportData(
      lastNameStr,
      firstNameStr,
      startDateStr,
      endDateStr,
      nationalIdStr,
    );

    if (
      !reportData.transactions.length &&
      !reportData.cheques.length &&
      !reportData.deals.length
    ) {
      return res.status(404).json({
        message: "داده‌ای برای بازه زمانی و کد ملی مشخص شده یافت نشد.",
      });
    }

    const workbook = XLSX.utils.book_new();

    const addSheet = (data: any[], sheetName: string) => {
      if (data && data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const wscols = Object.keys(data[0]).map((key) => ({
          wch: key.length + 10,
        }));
        worksheet["!cols"] = wscols;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    };

    addSheet(reportData.personInfo, "اطلاعات فردی");

    addSheet(reportData.transactions, "تراکنش‌ها");

    addSheet(reportData.cheques, "چک‌ها");

    addSheet(reportData.deals, "معاملات");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const baseFileName = `${firstNameStr || "person"} ${lastNameStr || "person"}_report_${formattedStartDate}_to_${formattedEndDate}.xlsx`;
    const safeFileName = encodeURIComponent(baseFileName);
    const asciiFileName = baseFileName.replace(/[^\x20-\x7E]/g, "_");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asciiFileName}"; filename*=UTF-8''${safeFileName}`,
    );

    res.end(excelBuffer);
  } catch (error: any) {
    console.error("Error generating person report:", error);
    res
      .status(500)
      .json({ message: "خطا در تولید گزارش.", error: error.message });
  }
});

export default router;
