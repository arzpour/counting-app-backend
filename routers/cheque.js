const router = require("express").Router();
const { Int32 } = require("mongodb");
const Cheque = require("../models/cheques");

router.get("/", async (req, res) => {
  try {
    const data = await Cheque.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

router.get("/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;
  const chassisNoNumber = new Int32(chassisNo);

  try {
    const cheques = await Cheque.find({
      $or: [
        { CarChassisNo: Number(chassisNo) },
        { CarChassisNo: chassisNo },
        { CarChassisNo: chassisNoNumber },
      ],
    });

    res.json(cheques);
  } catch (err) {
    console.log("🔹 err:", err);
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

router.get("/unpaid/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;

  try {
    const chassisAsNumber = Number(chassisNo);

    const cheques = await Cheque.find({
      $or: [
        { CarChassisNo: chassisNo },
        ...(isNaN(chassisAsNumber)
          ? []
          : [
              {
                $expr: {
                  $eq: [
                    {
                      $convert: {
                        input: "$CarChassisNo",
                        to: "int",
                        onError: null,
                        onNull: null,
                      },
                    },
                    chassisAsNumber,
                  ],
                },
              },
            ]),
      ],
    });

    if (!cheques.length) {
      return res
        .status(404)
        .json({ message: "هیچ چکی برای این شاسی یافت نشد" });
    }

    const issuedUnpaid = cheques.filter(
      (c) => c.ChequeType === "صادره" && c.ChequeStatus !== "وصول شد"
    );
    const receivedUnpaid = cheques.filter(
      (c) => c.ChequeType === "وارده" && c.ChequeStatus !== "وصول شد"
    );

    const totalIssuedUnpaid = issuedUnpaid.reduce(
      (sum, c) => sum + Number(c.ChequeAmount || 0),
      0
    );
    const totalReceivedUnpaid = receivedUnpaid.reduce(
      (sum, c) => sum + Number(c.ChequeAmount || 0),
      0
    );

    res.json({
      status: 200,
      data: {
        cheques,
        totals: {
          issuedUnpaid: totalIssuedUnpaid,
          receivedUnpaid: totalReceivedUnpaid,
        },
      },
    });
  } catch (err) {
    console.error("❌ Error fetching cheques:", err);
    res.status(500).json({ error: "خطا در دریافت اطلاعات چک‌ها" });
  }
});

module.exports = router;
