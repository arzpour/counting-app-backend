// const router = require("express").Router();
// const Cheque = require("../models/cheques");

// router.get("/", async (req, res) => {
//   try {
//     const data = await Cheque.find();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching cheques" });
//   }
// });

// router.get("/:chassisNo", async (req, res) => {
//   const { chassisNo } = req.params;

//   try {
//     const chassisAsNumber = Number(chassisNo);

//     const cheques = await Cheque.find({
//       $or: [
//         { CarChassisNo: chassisNo },
//         ...(isNaN(chassisAsNumber)
//           ? []
//           : [
//               {
//                 $expr: {
//                   $eq: [
//                     {
//                       $convert: {
//                         input: "$CarChassisNo",
//                         to: "int",
//                         onError: null,
//                         onNull: null,
//                       },
//                     },
//                     chassisAsNumber,
//                   ],
//                 },
//               },
//             ]),
//       ],
//     });

//     res.json(cheques);
//   } catch (err) {
//     console.log("🔹 err:", err);
//     res.status(500).json({ error: "Error fetching cheques" });
//   }
// });

// router.get("/unpaid/:chassisNo", async (req, res) => {
//   const { chassisNo } = req.params;

//   try {
//     const chassisAsNumber = Number(chassisNo);

//     const cheques = await Cheque.find({
//       $or: [
//         { CarChassisNo: chassisNo },
//         ...(isNaN(chassisAsNumber)
//           ? []
//           : [
//               {
//                 $expr: {
//                   $eq: [
//                     {
//                       $convert: {
//                         input: "$CarChassisNo",
//                         to: "int",
//                         onError: null,
//                         onNull: null,
//                       },
//                     },
//                     chassisAsNumber,
//                   ],
//                 },
//               },
//             ]),
//       ],
//     });

//     if (!cheques.length) {
//       return res
//         .status(404)
//         .json({ message: "هیچ چکی برای این شاسی یافت نشد" });
//     }

//     const issuedUnpaid = cheques.filter(
//       (c) => c.ChequeType === "صادره" && c.ChequeStatus !== "وصول شد"
//     );
//     const receivedUnpaid = cheques.filter(
//       (c) => c.ChequeType === "وارده" && c.ChequeStatus !== "وصول شد"
//     );

//     const totalIssuedUnpaid = issuedUnpaid.reduce(
//       (sum, c) => sum + Number(c.ChequeAmount || 0),
//       0
//     );
//     const totalReceivedUnpaid = receivedUnpaid.reduce(
//       (sum, c) => sum + Number(c.ChequeAmount || 0),
//       0
//     );

//     res.json({
//       status: 200,
//       data: {
//         cheques,
//         totals: {
//           issuedUnpaid: totalIssuedUnpaid,
//           receivedUnpaid: totalReceivedUnpaid,
//         },
//       },
//     });
//   } catch (err) {
//     console.error("❌ Error fetching cheques:", err);
//     res.status(500).json({ error: "خطا در دریافت اطلاعات چک‌ها" });
//   }
// });

// module.exports = router;


const router = require("express").Router();
const Cheque = require("../models/cheques");

router.get("/", async (req, res) => {
  try {
    const data = await Cheque.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

// More specific route must come before generic route
router.get("/unpaid/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;

  try {
    const chassisAsNumber = Number(chassisNo);
    const chassisAsString = String(chassisNo);

    // Build array of possible values to match
    const possibleValues = [chassisNo, chassisAsString];
    if (!isNaN(chassisAsNumber)) {
      possibleValues.push(chassisAsNumber);
    }

    // Try direct matches first
    let cheques = await Cheque.find({
      CarChassisNo: { $in: possibleValues },
    });

    // If no results and it's a valid number, try type conversion
    if (cheques.length === 0 && !isNaN(chassisAsNumber)) {
      cheques = await Cheque.find({
        $expr: {
          $or: [
            // Convert field to int and compare
            {
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
            // Convert field to string and compare
            {
              $eq: [
                {
                  $convert: {
                    input: "$CarChassisNo",
                    to: "string",
                    onError: null,
                    onNull: null,
                  },
                },
                chassisAsString,
              ],
            },
            // Try converting input to match field type
            {
              $eq: [
                "$CarChassisNo",
                {
                  $convert: {
                    input: chassisAsString,
                    to: "int",
                    onError: null,
                    onNull: null,
                  },
                },
              ],
            },
          ],
        },
      });
    }

    console.log(
      `🔍 Route /unpaid/:chassisNo - Chassis: ${chassisNo}, Found: ${cheques.length} cheques`
    );

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

router.get("/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;

  try {
    const chassisAsNumber = Number(chassisNo);
    const chassisAsString = String(chassisNo);

    // Build array of possible values to match
    const possibleValues = [chassisNo, chassisAsString];
    if (!isNaN(chassisAsNumber)) {
      possibleValues.push(chassisAsNumber);
    }

    // Try direct matches first
    let cheques = await Cheque.find({
      CarChassisNo: { $in: possibleValues },
    });

    // If no results and it's a valid number, try type conversion
    if (cheques.length === 0 && !isNaN(chassisAsNumber)) {
      cheques = await Cheque.find({
        $expr: {
          $or: [
            // Convert field to int and compare
            {
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
            // Convert field to string and compare
            {
              $eq: [
                {
                  $convert: {
                    input: "$CarChassisNo",
                    to: "string",
                    onError: null,
                    onNull: null,
                  },
                },
                chassisAsString,
              ],
            },
            // Try converting input to match field type
            {
              $eq: [
                "$CarChassisNo",
                {
                  $convert: {
                    input: chassisAsString,
                    to: "int",
                    onError: null,
                    onNull: null,
                  },
                },
              ],
            },
          ],
        },
      });
    }

    console.log(
      `🔍 Route /:chassisNo - Chassis: ${chassisNo}, Found: ${cheques.length} cheques`
    );
    res.json(cheques);
  } catch (err) {
    console.log("🔹 err:", err);
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

module.exports = router;
