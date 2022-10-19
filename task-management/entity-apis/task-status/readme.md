# Task Status Entity API

### Author

Ramith Jayasinghe

### Environment Variables

DATABASE_URL="mysql://USERNAME:PWD@HOST:3306/todo"

Note: create an '.env' file in following mount path:

Name : taskstatus-api-env-file
Type: Secret
Mount: File
Mount Path: /usr/src/app/.env

### Choreo BYOC

- Dockerfile - task-management/entity-apis/task-status/Dockerfile
- Docker Context - /task-management/entity-apis/task-status/
- Port - 8080
- Open API File Path - /task-management/entity-apis/task-status/openapi.yaml