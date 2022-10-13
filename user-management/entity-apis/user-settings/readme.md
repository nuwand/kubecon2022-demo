# User Settings Entity API

### Author

Ramith Jayasinghe

### Environment Variables

DATABASE_URL="mysql://USERNAME:PWD@HOST:3306/todo"

Note: create an '.env' file in following mount path:

Name : taskgroup-api-env-file
Type: Secret
Mount: File
Mount Path: /usr/src/app/.env

### Choreo BYOC

- Dockerfile - user-management/entity-apis/user-settings/Dockerfile
- Docker Context - user-management/entity-apis/user-settings
- Port - 8080
- Open API File Path - user-management/entity-apis/user-settings/openapi.yaml