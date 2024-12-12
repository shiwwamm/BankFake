import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { AccountComponent } from './components/account/account.component';
import { TransferComponent } from './components/transfer/transfer.component';

export const routes: Routes = [
    {
        path: "users",
        component: UserComponent
    },
    {
        path: "accounts",
        component: AccountComponent
    },
    {
        path: "transfers",
        component: TransferComponent
    }
];
