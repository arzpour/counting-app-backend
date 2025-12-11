# Migration Guide: Old Structure → New Structure

## Overview
This guide helps you understand the mapping between the old database structure and the new refactored structure.

## Data Model Mapping

### Old "Cars" Collection → Multiple New Collections

#### Old Car Record:
```json
{
  "ChassisNo": "ABC123",
  "CarModel": "Toyota Camry",
  "LicensePlate": "12A34567",
  "PurchaseAmount": 50000,
  "PurchaseDate": "2024-01-15",
  "SellerName": "John Doe",
  "SellerNationalID": "1234567890",
  "SellerMobile": "09123456789",
  "SaleAmount": 55000,
  "SaleDate": "2024-02-20",
  "BuyerName": "Jane Smith",
  "BuyerNationalID": "0987654321",
  "BuyerMobile": "09198765432",
  "PurchaseBroker": "Broker A",
  "SaleBroker": "Broker B"
}
```

#### New Structure (Split into multiple entities):

**1. Vehicle:**
```json
{
  "vin": "ABC123",
  "model": "Toyota Camry",
  "plateNumber": "12A34567",
  "productionYear": 2023,
  "color": "Silver",
  "dealHistoryIds": ["deal1_id", "deal2_id"]
}
```

**2. People (created for each unique person):**
```json
{
  "fullName": "John Doe",
  "nationalId": 1234567890,
  "phoneNumber": 9123456789,
  "roles": ["seller", "buyer"],
  "wallet": {
    "balance": 0,
    "transactions": []
  }
}
```

**3. Deal (purchase transaction):**
```json
{
  "vehicleId": 1,
  "vehicleSnapshot": {
    "vin": "ABC123",
    "model": "Toyota Camry",
    "productionYear": 2023,
    "plateNumber": "12A34567"
  },
  "status": "completed",
  "purchaseDate": "2024-01-15",
  "purchasePrice": 50000,
  "seller": {
    "personId": "person_id",
    "fullName": "John Doe",
    "nationalId": "1234567890",
    "mobile": "09123456789"
  },
  "buyer": {
    "personId": "business_id",
    "fullName": "Your Business",
    "nationalId": "",
    "mobile": ""
  },
  "purchaseBroker": {
    "personId": "broker_a_id",
    "fullName": "Broker A",
    "commissionPercent": 2,
    "commissionAmount": 1000
  }
}
```

**4. Deal (sale transaction):**
```json
{
  "vehicleId": 1,
  "vehicleSnapshot": {
    "vin": "ABC123",
    "model": "Toyota Camry",
    "productionYear": 2023,
    "plateNumber": "12A34567"
  },
  "status": "completed",
  "saleDate": "2024-02-20",
  "salePrice": 55000,
  "seller": {
    "personId": "business_id",
    "fullName": "Your Business",
    "nationalId": "",
    "mobile": ""
  },
  "buyer": {
    "personId": "person_id",
    "fullName": "Jane Smith",
    "nationalId": "0987654321",
    "mobile": "09198765432"
  },
  "saleBroker": {
    "personId": "broker_b_id",
    "fullName": "Broker B",
    "commissionPercent": 2,
    "commissionAmount": 1100
  }
}
```

### Old "Cheques" Collection → New Cheques Collection

#### Old Cheque Record:
```json
{
  "CarChassisNo": "ABC123",
  "CustomerName": "John Doe",
  "CustomerNationalID": "1234567890",
  "ChequeAmount": 10000,
  "ChequeDueDate": "2024-03-15",
  "ChequeStatus": "pending",
  "ChequeType": "issued"
}
```

#### New Cheque Record:
```json
{
  "chequeNumber": 123456,
  "bankName": "Bank Melli",
  "issueDate": "2024-01-15",
  "dueDate": "2024-03-15",
  "amount": 10000,
  "type": "issued",
  "status": "pending",
  "payer": {
    "personId": "person_id",
    "fullName": "John Doe",
    "nationalId": "1234567890"
  },
  "payee": {
    "personId": "business_id",
    "fullName": "Your Business",
    "nationalId": ""
  },
  "relatedDealId": 1,
  "relatedTransactionId": 1,
  "actions": [
    {
      "actionType": "created",
      "actionDate": "2024-01-15",
      "actorUserId": "user_id",
      "description": "Cheque created"
    }
  ]
}
```

### Old "Transactions" Collection → New Transactions Collection

#### Old Transaction Record:
```json
{
  "ChassisNo": "ABC123",
  "TransactionType": "payment",
  "TransactionAmount": 5000,
  "TransactionDate": "2024-01-20",
  "CustomerNationalID": "1234567890"
}
```

#### New Transaction Record:
```json
{
  "amount": 5000,
  "transactionDate": "2024-01-20",
  "type": "payment",
  "reason": "partial payment",
  "paymentMethod": "bank_transfer",
  "personId": "person_id",
  "dealId": "deal_id",
  "bussinessAccountId": "account_id",
  "description": "Partial payment for vehicle purchase"
}
```

## API Endpoint Mapping

### Get Vehicle/Car Information

**Old:**
```
GET /api/cars/:chassisNo
```

**New:**
```
GET /api/vehicles/vin/:vin
GET /api/deals/vin/:vin  (to get all deals for this vehicle)
```

### Get Transactions by ChassisNo

**Old:**
```
GET /api/transactions/:chassisNo
```

**New:**
```
GET /api/deals/vin/:vin  (get deals first)
GET /api/transactions/deal/:dealId  (then get transactions for each deal)
```

### Get Cheques by ChassisNo

**Old:**
```
GET /api/cheques/:chassisNo
```

**New:**
```
GET /api/deals/vin/:vin  (get deals first)
GET /api/cheques/deal/:dealId  (then get cheques for each deal)
```

### Get User/Person Data

**Old:**
```
GET /api/cars/userData  (extracted from car records)
GET /api/cars/filterByUser?nationalId=...
```

**New:**
```
GET /api/people  (dedicated people collection)
GET /api/people/national-id/:nationalId
GET /api/deals/person/:personId
```

## Benefits of New Structure

1. **Normalized Data**: No data redundancy
2. **Better Relationships**: Clear links between entities
3. **Flexibility**: Easy to track multiple deals per vehicle
4. **Scalability**: Better performance with indexed queries
5. **Comprehensive**: Supports complex business scenarios
6. **Type Safety**: Full TypeScript support

## Migration Steps (If Needed)

If you need to migrate existing data:

1. **Create People Records**: Extract unique sellers/buyers from old car records
2. **Create Vehicle Records**: Extract vehicle info (VIN, model, etc.)
3. **Split into Deals**: Create separate deal records for purchases and sales
4. **Update Cheques**: Link to deals and people instead of chassis numbers
5. **Update Transactions**: Link to deals and people
6. **Add New Entities**: Create business accounts, salary records, etc.

## Notes

- The new structure uses `vin` instead of `ChassisNo`
- Each purchase and sale is now a separate `Deal` record
- All people (buyers, sellers, brokers, employees) are in the `People` collection
- Cheques and transactions are now linked to deals and people by ID
- The system now supports partnerships, direct costs, and commission tracking in deals

