import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { AccountComponent } from './components/account/account.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

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
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "**",
        component: HomeComponent
    }
];
