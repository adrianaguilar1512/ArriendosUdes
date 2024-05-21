import { Routes } from '@angular/router';
import { PrincipalComponent } from './Components/principal/principal.component';
import { LoginComponent } from './Components/login/login.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AvailabilityComponent } from './Components/availability/availability.component';

export const routes: Routes = [
    {
        path: '',
        component: PrincipalComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'availability',
        component: AvailabilityComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: '**', redirectTo: '/', pathMatch: "full"
    }
];