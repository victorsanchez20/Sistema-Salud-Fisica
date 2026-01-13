import { Routes } from '@angular/router';
import { Aside } from './layout/aside/aside';
import { Pacientes } from './pages/pacientes/pacientes';
import { App } from './app';
import { Layout } from './layout/layout/layout';
import { Nuevopaciente } from './pages/nuevopaciente/nuevopaciente';
import { Historiaclinica } from './pages/historiaclinica/historiaclinica';
import { Citar } from './pages/citar/citar';
import { Calendario } from './pages/calendario/calendario';
import { Configuracion } from './pages/configuracion/configuracion';
import { Turnospaciente } from './pages/configuracion/turnosPaciente/turnospaciente';
import { Inicio } from './pages/inicio/inicio';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: 'home', component: Inicio},
            { path: 'listapacientes', component: Pacientes},
            { path: 'nuevopacientes', component: Nuevopaciente},
            { path: 'historiaclinica/:hc', component: Historiaclinica},
            { path: 'citar', component: Citar},
            { path: 'calendario', component: Calendario},
            { path: 'configuracion', component: Configuracion},
            { path: 'datos/:nombre', component: Turnospaciente}
        ]
    }
];
