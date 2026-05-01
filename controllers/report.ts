import People from "../models/people";
import Transaction from "../models/transactions-new";
import Cheque from "../models/cheques-new";
import Deal from "../models/deals";
import moment from "moment-jalaali";

interface ReportItem {
  date?: string;
  type?: string;
  sourceCollection?: string;
  amount?: number;
  description?: string;
  [key: string]: any;
}

interface ReportData {
  transactions: ReportItem[];
  cheques: ReportItem[];
  deals: ReportItem[];
  personInfo: ReportItem[];
}

export const getPersonReportData = async (
  lastName: string | undefined,
  firstName: string | undefined,
  startDate: string,
  endDate: string,
  nationalId: string,
): Promise<ReportData> => {
  const reportData: ReportData = {
    transactions: [],
    cheques: [],
    deals: [],
    personInfo: [],
  };

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("فرمت تاریخ نامعتبر است.");
    }
    if (start > end) {
      throw new Error("تاریخ پایان باید بعد از تاریخ شروع باشد.");
    }

    const findCriteria: any = { nationalId: parseInt(nationalId) };

    if (firstName && lastName) {
      findCriteria.$or = [
        { firstName: { $regex: firstName, $options: "i" } },
        { lastName: { $regex: lastName, $options: "i" } },
      ];
    } else if (firstName) {
      findCriteria.$or = [{ firstName: { $regex: firstName, $options: "i" } }];
    } else if (lastName) {
      findCriteria.$or = [{ lastName: { $regex: lastName, $options: "i" } }];
    }

    const person = await People.findOne(findCriteria);
    if (!person) {
      throw new Error("فرد مورد نظر با کد ملی یا نام داده شده یافت نشد.");
    }

    const personId = (person._id as string).toString();

    const startMomentJalaali = moment(startDate, "jYYYY/jMM/jDD");
    const endMomentJalaali = moment(endDate, "jYYYY/jMM/jDD");
    const startDatee = startMomentJalaali.toDate();
    const endDatee = moment(endMomentJalaali).add(1, "day").toDate();

    // ==========================================
    // 1. Fetch Person
    // ==========================================

    reportData.personInfo.push({
      // sourceCollection: "اطلاعات فردی",
      firstName: person.firstName,
      lastName: person.lastName,
      fatherName: person.fatherName || "",
      idNumber: person.idNumber || "",
      nationalId: person.nationalId,
      postalCode: person.postalCode,
      idCardNumber: person.idCardNumber,
      address: person.address || "",
      phoneNumbers: Array.isArray(person.phoneNumbers)
        ? person.phoneNumbers.join(", ")
        : person.phoneNumbers || "",
      roles: Array.isArray(person.roles)
        ? person.roles.join(", ")
        : person.roles || "",
      brokerCurrentPurchaseRate:
        person.brokerDetails?.currentRates?.purchaseCommissionPercent || "",
      brokerCurrentSaleRate:
        person.brokerDetails?.currentRates?.saleCommissionPercent || "",
      brokerLastRateUpdate:
        person.brokerDetails?.currentRates?.lastUpdated || "",
      brokerRateHistoryJson: JSON.stringify(
        person.brokerDetails?.rateHistory || [],
      ),
      empStartDate: person.employmentDetails?.startDate || "",
      empContractType: person.employmentDetails?.contractType || "",
      empBaseSalary: person.employmentDetails?.baseSalary || 0,
      walletBalance: person.wallet?.balance || 0,
      walletTransactionsJson: JSON.stringify(person.wallet?.transactions || []),
    });

    // ==========================================
    // 2. Fetch Transactions
    // ==========================================
    const transactions = await Transaction.find({
      $or: [
        { personId: personId },
        { secondPersonId: personId },
        { providerPersonId: personId },
        { brokerPersonId: personId },
        { partnerPersonId: personId },
      ],
      createdAt: { $gte: startDatee, $lt: endDatee },
    }).lean();

    transactions.forEach((trans: any) => {
      reportData.transactions.push({
        date: trans.transactionDate,
        type: trans.type,
        // sourceCollection: "تراکنش",
        amount: trans.amount,
        description:
          trans.description || trans.reason || `تراکنش ${trans.type}`,
        reason: trans.reason,
        paymentMethod: trans.paymentMethod,
        dealId: trans.dealId,
        vin: trans.vin,
        bussinessAccountId: trans.bussinessAccountId,
        providerPersonId: trans.providerPersonId,
        brokerPersonId: trans.brokerPersonId,
        partnerPersonId: trans.partnerPersonId,
        partnershipProfitSharePercentage:
          trans.partnershipProfitSharePercentage,
        partnerShipProfit: trans.partnerShipProfit,
        isBetweenTwoPerson: trans.isBetweenTwoPerson,
        pairGroupId: trans.pairGroupId,
        profitState: trans.profitState,
      });
    });

    // ==========================================
    // 3. Fetch & Process Cheques
    // ==========================================
    const cheques = await Cheque.find({
      $or: [
        { "customer.personId": personId },
        { "payer.personId": personId },
        { "payee.personId": personId },
      ],
    }).lean();

    cheques.forEach((cheque: any) => {
      let chequeType = "چک";
      if (cheque.payer.personId === personId) chequeType = "چک پرداختی";
      else if (cheque.payee.personId === personId) chequeType = "چک دریافتی";
      else if (cheque.customer.personId === personId) chequeType = "چک مشتری";

      reportData.cheques.push({
        date: cheque.dueDate || cheque.issueDate || "",
        type: chequeType,
        // sourceCollection: "چک",
        amount: cheque.amount,
        // description: `چک شماره ${cheque.chequeNumber} - بانک ${cheque.bankName}`,
        chequeNumber: cheque.chequeNumber,
        bankName: cheque.bankName,
        chequeSerial: cheque.chequeSerial,
        branchName: cheque.branchName,
        issueDate: cheque.issueDate,
        dueDate: cheque.dueDate,
        chequeType: cheque.type,
        status: cheque.status,
        reason: cheque.reason,
        vin: cheque.vin,
        description: cheque.description,
        sayadiID: cheque.sayadiID,
        relatedDealId: cheque.relatedDealId,
        relatedTransactionId: cheque.relatedTransactionId,
        customerFullName: cheque.customer?.fullName || "",
        customerNationalId: cheque.customer?.nationalId || "",
        customerPersonId: cheque.customer?.personId || "",
        payerFullName: cheque.payer?.fullName || "",
        payerNationalId: cheque.payer?.nationalId || "",
        payerPersonId: cheque.payer?.personId || "",
        payeeFullName: cheque.payee?.fullName || "",
        payeeNationalId: cheque.payee?.nationalId || "",
        payeePersonId: cheque.payee?.personId || "",
      });
    });

    // ==========================================
    // 4. Fetch & Process Deals
    // ==========================================
    const deals = await Deal.find({
      $or: [
        { "seller.personId": personId },
        { "buyer.personId": personId },
        { "purchaseBroker.personId": personId },
        { "saleBroker.personId": personId },
      ],
    }).lean();

    deals.forEach((deal: any) => {
      let dealType = "معامله";
      let amount = 0;
      let desc = `معامله خودرو ${deal.vehicleSnapshot?.model || ""}`;

      if (deal.seller.personId === personId) {
        dealType = "فروش خودرو";
        amount = deal.salePrice || 0;
        desc = `فروش خودرو ${deal.vehicleSnapshot?.model || ""} به ${deal.buyer?.fullName || ""}`;
      } else if (deal.buyer.personId === personId) {
        dealType = "خرید خودرو";
        amount = deal.purchasePrice || 0;
        desc = `خرید خودرو ${deal.vehicleSnapshot?.model || ""} از ${deal.seller?.fullName || ""}`;
      } else if (deal.purchaseBroker.personId === personId) {
        dealType = "کارمزد خرید";
        amount = deal.purchaseBroker?.commissionAmount || 0;
        desc = `کارمزد خرید خودرو ${deal.vehicleSnapshot?.model || ""}`;
      } else if (deal.saleBroker.personId === personId) {
        dealType = "کارمزد فروش";
        amount = deal.saleBroker?.commissionAmount || 0;
        desc = `کارمزد فروش خودرو ${deal.vehicleSnapshot?.model || ""}`;
      }

      const dealDate =
        deal.saleDate || deal.purchaseDate || deal.createdAt || "";

      reportData.deals.push({
        date: dealDate,
        type: dealType,
        // sourceCollection: "معامله",
        amount: amount,
        description: desc,
        model: deal.vehicleSnapshot?.model || "",
        vin: deal.vehicleSnapshot?.vin || "",
        productionYear: deal.vehicleSnapshot?.productionYear || "",
        plateNumber: deal.vehicleSnapshot?.plateNumber || "",
        purchasePrice: deal.purchasePrice || 0,
        salePrice: deal.salePrice || 0,
        sellerFullName: deal.seller?.fullName || "",
        sellerNationalId: deal.seller?.nationalId || "",
        sellerMobile: deal.seller?.mobile || "",
        buyerFullName: deal.buyer?.fullName || "",
        buyerNationalId: deal.buyer?.nationalId || "",
        buyerMobile: deal.buyer?.mobile || "",
        purchaseBrokerFullName: deal.purchaseBroker?.fullName || "",
        purchaseBrokerCommission: deal.purchaseBroker?.commissionAmount || 0,
        saleBrokerFullName: deal.saleBroker?.fullName || "",
        saleBrokerCommission: deal.saleBroker?.commissionAmount || 0,
        status: deal.status || "",
        purchaseDate: deal.purchaseDate || "",
        saleDate: deal.saleDate || "",
        directCostsJson: JSON.stringify(deal.directCosts || {}),
        partnershipsJson: JSON.stringify(deal.partnerships || []),
      });
    });

    return reportData;
  } catch (error: any) {
    console.error("Error in getPersonReportData:", error.message);
    throw new Error(`خطا در تولید گزارش: ${error.message}`);
  }
};
