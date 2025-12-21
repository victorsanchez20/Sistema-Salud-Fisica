import { Routes } from '@angular/router';
import { Aside } from './layout/aside/aside';
import { Pacientes } from './pages/pacientes/pacientes';
import { App } from './app';
import { Layout } from './layout/layout/layout';
import { Nuevopaciente } from './pages/nuevopaciente/nuevopaciente';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: 'listapacientes', component: Pacientes},
            { path: 'nuevopacientes', component: Nuevopaciente}
        ]
    }
];
