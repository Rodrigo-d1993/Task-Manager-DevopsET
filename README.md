# Task Manager - EFT DevOps (ISY1101)

Proyecto de Evaluación Final Transversal: automatización del ciclo CI/CD de una plataforma compuesta por frontend, backend y base de datos relacional, desplegada en AWS ECS Fargate.

## Arquitectura

- **Frontend**: HTML + JavaScript vanilla, servido por Nginx (Alpine).
- **Backend**: Spring Boot 3 (Java 17), API REST CRUD de tareas.
- **Base de datos**: MySQL 8.
- **Contenedores**: Dockerfiles multietapa para frontend y backend, orquestados localmente con Docker Compose.
- **CI/CD**: GitHub Actions (build → test → push a Amazon ECR → deploy a ECS Fargate).
- **Cloud**: AWS ECS Fargate, ECR, VPC, Security Groups.

## Estructura del repositorio

```
Task-Manager-DevopsET/
├── backend/          # API REST Spring Boot
├── frontend/          # Cliente web estático
├── docker-compose.yml # Orquestación local
├── .github/workflows/ # Pipeline CI/CD
└── README.md
```

## Cómo levantar el entorno localmente

1. Clonar el repositorio y crear el archivo `.env` a partir de `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Levantar todos los servicios:
   ```bash
   docker-compose up --build
   ```
3. Acceder a:
   - Frontend: http://localhost:8081
   - Backend (API): http://localhost:8080/api/tasks
   - Health check: http://localhost:8080/actuator/health

## Endpoints de la API

| Método | Ruta                                   | Descripción                          |
|--------|-----------------------------------------|---------------------------------------|
| GET    | /api/tasks                              | Lista todas las tareas                |
| GET    | /api/tasks?completed=true               | Filtra por estado                     |
| GET    | /api/tasks?priority=HIGH                | Filtra por prioridad                  |
| GET    | /api/tasks/{id}                         | Obtiene una tarea                     |
| POST   | /api/tasks                              | Crea una tarea (valida título)        |
| PUT    | /api/tasks/{id}                         | Actualiza una tarea                   |
| DELETE | /api/tasks/{id}                         | Elimina una tarea                     |

Documentación interactiva (Swagger UI): http://localhost:8080/swagger-ui.html

### Modelo de datos

Cada tarea tiene: `title` (obligatorio), `description`, `completed`, `priority` (`LOW`/`MEDIUM`/`HIGH`), `dueDate`, `createdAt`.

## CI/CD

El pipeline en `.github/workflows/ci-cd.yml` ejecuta automáticamente en cada push a `main`:
1. **Test**: ejecuta pruebas unitarias del backend (JUnit 5).
2. **Build**: compila el backend con Maven y construye las imágenes Docker de backend y frontend.
3. **Push**: publica ambas imágenes en Amazon ECR, etiquetadas con el SHA del commit y `latest`.
4. **Deploy**: toma la task definition activa de cada servicio ECS, la actualiza con la nueva imagen y despliega la nueva revisión, esperando a que el servicio quede estable (`wait-for-service-stability`).

El pipeline requiere las siguientes Repository Variables configuradas en GitHub (Settings → Secrets and variables → Actions → Variables): `ECS_CLUSTER`, `ECS_SERVICE_BACKEND`, `ECS_SERVICE_FRONTEND`, `ECS_TASK_DEF_BACKEND`, `ECS_TASK_DEF_FRONTEND`, `CONTAINER_NAME_BACKEND`, `CONTAINER_NAME_FRONTEND`.

## Despliegue en AWS

La plataforma corre en un clúster **ECS Fargate**, con un servicio independiente para backend y frontend. El detalle de la arquitectura (VPC, subredes, Security Groups, roles IAM) se documentará en el informe (pendiente).
