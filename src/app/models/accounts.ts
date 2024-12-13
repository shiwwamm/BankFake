export interface Account {
	accountId: number;
	userId: number;
	accountNumber: string;
	balance: number;
  }

  export interface UpdateAccountDTO {
	userId: number;
	accountNumber: string;
	balance: number;
  }