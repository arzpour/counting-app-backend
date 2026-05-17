// backend/routes/wallet.ts
import express, { Response } from "express";
import { getPeopleModel } from "../models/people";
import { AuthRequest } from "../types/db";
import { IWalletTransaction } from "../types/people";

const router = express.Router();

interface WalletTransferRequest {
  oldPersonId: string;
  newPersonId: string;
  amount: number;
  type: string;
  description: string;
  dealId?: string;
  transactionId: string;
  reason: "provider" | "broker" | "financier" | "person";
}

export const updateWalletTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const {
      oldPersonId,
      newPersonId,
      amount,
      type,
      description,
      dealId,
      transactionId,
      reason,
    } = req.body as WalletTransferRequest;

    if (oldPersonId === newPersonId || !oldPersonId || !newPersonId) {
      return res.status(200).json({ message: "Same person or missing IDs" });
    }
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }

    const walletTransactionData = {
      amount,
      type,
      description,
      date: new Date().toISOString(),
      dealID: dealId || "",
      transactionID: transactionId,
      optionId: reason,
    };

    const oldPerson = await PeopleModel.findOneAndUpdate(
      {
        _id: oldPersonId,
        "wallet.transactions.transactionID": transactionId,
      },
      {
        $pull: {
          "wallet.transactions": { transactionID: transactionId },
        },
      },
      { new: true },
    );

    if (oldPerson) {
      const newBalance = oldPerson.wallet.transactions.reduce(
        (sum: number, t: any) => sum + (t.amount || 0),
        0,
      );
      await PeopleModel.updateOne(
        { _id: oldPersonId },
        { $set: { "wallet.balance": newBalance } },
      );
    } else {
      console.log(`⚠️ Transaction not found in old person's wallet`);
    }

    const newPerson = await PeopleModel.findById(newPersonId);

    if (newPerson) {
      const existingTransaction = newPerson.wallet.transactions.find(
        (t: any) => t.transactionID === transactionId,
      );

      if (!existingTransaction) {
        await PeopleModel.updateOne(
          { _id: newPersonId },
          {
            $push: {
              "wallet.transactions": walletTransactionData,
            },
          },
        );

        const updatedPerson = await PeopleModel.findById(newPersonId);
        if (updatedPerson) {
          const newBalance = updatedPerson.wallet.transactions.reduce(
            (sum: number, t: any) => sum + (t.amount || 0),
            0,
          );
          await PeopleModel.updateOne(
            { _id: newPersonId },
            { $set: { "wallet.balance": newBalance } },
          );
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Wallet transfer completed successfully",
    });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({
      message: "Error updating wallet",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateMultipleWalletTransfer = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { updates } = req.body as {
      updates: Array<{
        personId: string;
        amount: number;
        type: string;
        description: string;
        dealId?: string;
        transactionId: string;
      }>;
    };

    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }

    for (const update of updates) {
      const person = await PeopleModel.findById(update.personId);
      if (person) {
        const existingIndex = person.wallet.transactions.findIndex(
          (t: IWalletTransaction) => t.transactionID === update.transactionId,
        );

        if (existingIndex > -1) {
          person.wallet.transactions[existingIndex] = {
            amount: update.amount,
            type: update.type,
            description: update.description,
            date: new Date().toISOString(),
            dealID: update.dealId || "",
            transactionID: update.transactionId,
            optionId: "",
          };
        } else {
          person.wallet.transactions.push({
            amount: update.amount,
            type: update.type,
            description: update.description,
            date: new Date().toISOString(),
            dealID: update.dealId || "",
            transactionID: update.transactionId,
            optionId: "",
          });
        }

        person.wallet.balance = person.wallet.transactions.reduce(
          (sum: number, t: IWalletTransaction) => sum + (t.amount || 0),
          0,
        );

        await person.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating wallets" });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { personId, transactionId } = req.body;

    if (!personId || !transactionId) {
      return res.status(400).json({
        message: "personId and transactionId are required",
      });
    }

    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }

    const person = await PeopleModel.findById(personId);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const transactionIndex = person.wallet.transactions.findIndex(
      (t:IWalletTransaction) => t.transactionID === transactionId,
    );

    if (transactionIndex > -1) {
      person.wallet.transactions.splice(transactionIndex, 1);

      person.wallet.balance = person.wallet.transactions.reduce(
        (sum: number, t: IWalletTransaction) => sum + (t.amount || 0),
        0,
      );

      await person.save();

      res.status(200).json({
        success: true,
        message: "Transaction removed from wallet",
      });
    } else {
      res.status(404).json({
        message: "Transaction not found in wallet",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing transaction" });
  }
};

export default router;
