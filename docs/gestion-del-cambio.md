# Gestión del cambio – Frontend

Todo cambio al código pasa por el flujo **RFC → Issue → Rama → Commit → Pull Request → Merge → Cierre**.

## Registro de solicitudes de cambio (RFC)

| RFC | Cambio solicitado | Tipo | Prioridad | Componente | Estado | Release | Issues |
|---|---|---|---|---|---|---|---|
| RFC-06 | DRY en servicios HTTP del frontend (ApiService / CrudApiService) | Refactor | Alta | Frontend | Implementado | v1.1.0 | #9, #10 |
| RFC-07 | SRP/OCP/DRY en citar y calendario (grilla, turnos, payload) | Refactor | Media | Frontend | Implementado | v2.0.0 | #11, #12 |
| RFC-08 | Reparar pruebas y proveedores de prueba (IoC) | Mejora / Pruebas | Media | Frontend | Implementado | v2.0.0 | #13 |
| RFC-11 | Alinear contrato de adjuntos (tipo/nombre vs tipoArchivo/nombreOriginal) | Bug | Alta | Ambos | Propuesto | — | #16 |

## Issues (etiquetas: `bug`, `mejora`, `refactor`, `seguridad`)

| Issue | Título | Etiqueta | RFC |
|---|---|---|---|
| #9 | CRUD HTTP copiado en 4 servicios Angular | `refactor` | RFC-06 |
| #10 | URL base repetida en 10 servicios y HttpClient directo en insertar-hc | `refactor` | RFC-06 |
| #11 | Grilla del calendario copiada 3 veces (citar y calendario) | `refactor` | RFC-07 |
| #12 | Rangos de turno M1/T1/MT1 fijos en el componente y payload armado en citar.ts | `refactor` | RFC-07 |
| #13 | 4 de las 11 pruebas del frontend fallaban en la línea base | `mejora` | RFC-08 |
| #16 | El frontend envía tipo/nombre y el backend espera tipoArchivo/nombreOriginal | `bug` | RFC-11 |

## Flujo de aprobación

1. **Solicitud** (Producto / TI) – se registra el RFC con tipo, prioridad y justificación.
2. **Evaluación técnica** – impacto, riesgo y esfuerzo (responsable técnico).
3. **Comité de control de cambios (CCC)** – aprueba, rechaza o difiere.
4. **Priorización** – se asigna a un sprint / release.
5. **Ejecución** – issue + rama `feature/RFC-xx-*` (o `hotfix/*`) + commits convencionales.
6. **Pruebas** – pruebas unitarias en verde + revisión de código en el Pull Request.
7. **Despliegue** – merge a `develop`, release branch, merge a `main` y tag `vX.Y.Z`.
8. **Registro en el SGC** – se actualiza `CHANGELOG.md` y este registro.

## Convenciones

* Ramas: `main` · `develop` · `feature/RFC-xx-descripcion` · `release/x.y.z` · `hotfix/RFC-xx-descripcion`.
* Commits: `tipo(ámbito): resumen` (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`) y referencia `Refs: RFC-xx`.
* Versionado semántico: MAJOR (cambio de arquitectura) · MINOR (funcionalidad) · PATCH (corrección).
