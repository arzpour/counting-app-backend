import express, { Response, Router } from "express";
import { getPeopleModel } from "../models/people";
import { getUserModel } from "../models/user";
import { AuthRequest } from "../types/db";
import { IWalletTransaction } from "../types/people";

const router: Router = express.Router();

// GET all people
export const getAllPeople = async (req: AuthRequest, res: Response) => {
  try {
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }
    const people = await PeopleModel.find();
    res.json(people);
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).json({ error: "Error fetching people" });
  }
};

// GET person by ID
export const getPeopleById = async (req: AuthRequest, res: Response) => {
  try {
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }
    const person = await PeopleModel.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(500).json({ error: "Error fetching person" });
  }
};

// GET person by national ID
export const getPeopleByNationalId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }
    const person = await PeopleModel.findOne({
      nationalId: req.params.nationalId,
    });
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(500).json({ error: "Error fetching person" });
  }
};

// GET people by role
export const getPeopleByRole = async (req: AuthRequest, res: Response) => {
  try {
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }
    const people = await PeopleModel.find({ roles: req.params.role });
    res.json(people);
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).json({ error: "Error fetching people" });
  }
};

// GET people by name search
export const getPeopleByName = async (req: AuthRequest, res: Response) => {
  try {
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }
    const people = await PeopleModel.find({
      $or: [
        { firstName: { $regex: req.params.name, $options: "i" } },
        { lastName: { $regex: req.params.name, $options: "i" } },
      ],
    });
    res.json(people);
  } catch (error) {
    console.error("Error searching people:", error);
    res.status(500).json({ error: "Error searching people" });
  }
};

// POST create new person
export const createPerson = async (req: AuthRequest, res: Response) => {
  try {
    const UserModel = getUserModel(req.db);
    if (!UserModel) {
      return res.status(500).json({ error: "User model is not initialized" });
    }
    const userId = (req as any).userId;
    if (userId) {
      const user = await UserModel.findById(userId);
      if (user && user.role === "secretary") {
        if (req.body.roles && Array.isArray(req.body.roles)) {
          const hasNonCustomerRole = req.body.roles.some(
            (role: string) => role !== "customer",
          );
          if (hasNonCustomerRole) {
            return res.status(403).json({
              error: "Secretary can only create people with customer role",
            });
          }
        } else {
          req.body.roles = ["customer"];
        }
      }
    }

    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }

    const newPerson = new PeopleModel(req.body);
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (error: any) {
    console.error("Error creating person:", error);
    res.status(500).json({
      error: "Error creating person",
      details: error.message,
    });
  }
};

// PUT update person by ID
export const editPersonById = async (req: AuthRequest, res: Response) => {
  try {
    const UserModel = getUserModel(req.db);
    if (!UserModel) {
      return res.status(500).json({ error: "User model is not initialized" });
    }
    const userId = (req as any).userId;
    if (userId) {
      const user = await UserModel.findById(userId);
      if (user && user.role === "secretary") {
        if (req.body.roles && Array.isArray(req.body.roles)) {
          const hasNonCustomerRole = req.body.roles.some(
            (role: string) => role !== "customer",
          );
          if (hasNonCustomerRole) {
            return res.status(403).json({
              error: "Secretary can only set people to customer role",
            });
          }
        } else if (req.body.roles !== undefined) {
          req.body.roles = ["customer"];
        }
      }
    }
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }

    const updatedPerson = await PeopleModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(updatedPerson);
  } catch (error: any) {
    console.error("Error updating person:", error);
    res.status(500).json({
      error: "Error updating person",
      details: error.message,
    });
  }
};

// PUT update wallet balance
export const editPersonWalletById = async (req: AuthRequest, res: Response) => {
  try {
    const {
      amount,
      type,
      description,
      dealID,
      transactionID,
      optionId,
      chequeId,
      moneyChangerId,
    } = req.body;

    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }

    const person = await PeopleModel.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    person.wallet = person.wallet || { balance: 0, transactions: [] };

    const newTransaction = {
      amount,
      type,
      description,
      dealID,
      transactionID,
      optionId,
      chequeId,
      moneyChangerId,
      date: new Date().toISOString(),
    };

    let transactionFound = false;

    person.wallet.transactions = person.wallet.transactions.map(
      (t: IWalletTransaction) => {
        if (moneyChangerId && t.moneyChangerId === moneyChangerId) {
          transactionFound = true;
          return { ...t, amount: amount, description: description, type: type };
        }

        if (chequeId && t.chequeId === chequeId) {
          transactionFound = true;
          return { ...t, amount: amount, description: description, type: type };
        }

        if (transactionID && t.transactionID === transactionID) {
          transactionFound = true;
          return { ...t, amount: amount, description: description, type: type };
        }

        if (
          type === "هزینه خودرو options" &&
          optionId &&
          String(t.optionId) === String(optionId)
        ) {
          transactionFound = true;
          return { ...t, amount: amount };
        }

        if (
          type === "هزینه خودرو options" &&
          !optionId &&
          t.dealID === dealID &&
          t.description === description
        ) {
          transactionFound = true;
          return { ...t, amount: amount, optionId: optionId };
        }

        return t;
      },
    );

    if (!transactionFound) {
      person.wallet.transactions.push(newTransaction);
    }

    person.wallet.balance = person.wallet.transactions.reduce(
      (sum: number, t: IWalletTransaction) => sum + t.amount,
      0,
    );

    await person.save();
    res.json(person);
  } catch (error: any) {
    console.error("Error updating wallet:", error);
    res.status(500).json({
      error: "Error updating wallet",
      details: error.message,
    });
  }
};

// DELETE wallet
export const deletePersonWalletById = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { dealID, transactionID, optionId, chequeId } = req.body;

    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }

    // if (moneyChangerId && t.moneyChangerId === moneyChangerId) {
    //   transactionFound = true;
    //   return { ...t, amount: amount, description: description, type: type };
    // }

    const person = await PeopleModel.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    if (!person.wallet) {
      return res.status(400).json({ error: "Wallet not found" });
    }

    // person.wallet.transactions = person.wallet.transactions.filter(
    //   (t) => t.dealID !== dealID && t.transactionID !== transactionID,
    // );
    person.wallet.transactions = person.wallet.transactions.filter(
      (t: IWalletTransaction) => t.transactionID !== transactionID,
    );

    if (optionId) {
      person.wallet.transactions = person.wallet.transactions.filter(
        (t: IWalletTransaction) => t.optionId !== optionId,
      );
    }

    if (chequeId) {
      person.wallet.transactions = person.wallet.transactions.filter(
        (t: IWalletTransaction) => t.chequeId !== chequeId,
      );
    }

    person.wallet.balance = person.wallet.transactions.reduce(
      (acc: number, curr: IWalletTransaction) => acc + curr.amount,
      0,
    );

    await person.save();
    res.json(person);
  } catch (error: any) {
    console.error("Error deleting transaction from wallet:", error);
    res.status(500).json({
      error: "Error deleting transaction from wallet",
      details: error.message,
    });
  }
};

// DELETE person by ID
export const deletePersonById = async (req: AuthRequest, res: Response) => {
  try {
    const PeopleModel = getPeopleModel(req.db);
    if (!PeopleModel) {
      return res.status(500).json({ error: "People model is not initialized" });
    }
    const deletedPerson = await PeopleModel.findByIdAndDelete(req.params.id);
    if (!deletedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json({ message: "Person deleted successfully", person: deletedPerson });
  } catch (error) {
    console.error("Error deleting person:", error);
    res.status(500).json({ error: "Error deleting person" });
  }
};

export default router;
