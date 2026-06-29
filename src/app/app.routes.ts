import { Routes } from '@angular/router';
import { Pacientes } from './pages/pacientes/pacientes';
import { Layout } from './layout/layout/layout';
import { Nuevopaciente } from './pages/nuevopaciente/nuevopaciente';
import { Historiaclinica } from './pages/historiaclinica/historiaclinica';
import { Citar } from './pages/citar/citar';
import { Calendario } from './pages/calendario/calendario';
import { Configuracion } from './pages/configuracion/configuracion';
import { Turnospaciente } from './pages/configuracion/turnosPaciente/turnospaciente';
import { Inicio } from './pages/inicio/inicio';
import { InsertarHc } from './pages/insertar-hc/insertar-hc';
import { Referencias } from './pages/referencias/referencias';
import { Login } from './pages/login/login';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canActivate: [LoginGuard],
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: Layout,
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: Inicio},
            { path: 'listapacientes', component: Pacientes},
            { path: 'nuevopacientes', component: Nuevopaciente},
            { path: 'historiaclinica/:hc', component: Historiaclinica},
            { path: 'citar', component: Citar},
            { path: 'calendario', component: Calendario},
            { path: 'insertar-hc', component: InsertarHc},
            { path: 'referencias', component: Referencias},
            { path: 'configuracion', component: Configuracion},
            { path: 'datos/:nombre', component: Turnospaciente},
        ]
    }
];
