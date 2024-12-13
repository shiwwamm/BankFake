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