import { Routes } from '@angular/router';
import { PrincipalComponent } from './Components/principal/principal.component';
import { LoginComponent } from './Components/login/login.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AvailabilityComponent } from './Components/availability/availability.component';
import { PropertiesComponent } from './Components/properties/properties.component';
import { RequestsComponent } from './Components/requests/requests.component';

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
        path: 'availability/:searchType/:propertyType/:site',
        component: AvailabilityComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'properties',
        component: PropertiesComponent
    },
    {
        path: 'requests',
        component: RequestsComponent
    },
    {
        path: 'request',
        component: RequestsComponent
    },
    {
        path: '**', redirectTo: '/', pathMatch: "full"
    }
];