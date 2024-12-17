export interface TransactionDTO {
	transactionId: number;
	amount: number;
	fromAccountId: number;
	toAccountId: number;
  }
  
  export interface CreateTransactionDTO {
	amount: number;
	fromAccountId: number;
	toAccountId: number;
  }

  export interface TransactionDetailsDTO {
	transactionId: number;
	amount: number;
    fromAccountNumber: string;
    fromUsername: string;
    fromUserId: number;
    toAccountNumber: string;
    toUsername: string;
    toUserId: number;
  }