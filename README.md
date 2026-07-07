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

El pipeline en `.github/workflows/ci-cd.yml` ejecuta automáticamente:
1. **Build**: compila el backend con Maven.
2. **Test**: ejecuta pruebas unitarias (JUnit 5, con H2 en memoria).
3. **Push**: construye las imágenes Docker y las publica en Amazon ECR.
4. **Deploy**: actualiza los servicios en el clúster ECS Fargate.

## Despliegue en AWS

Ver `docs/informe.docx` para el detalle de la arquitectura en la nube (VPC, subredes, Security Groups, ECS Fargate) y las decisiones de configuración y seguridad tomadas.
