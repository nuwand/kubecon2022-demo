# Task Management - Process APIs

Contains the following Ballerina Apps.
- Process API - Task Management (REST API)
- Process API - Task Query (GraphQL API)

## Configurables

Configure the following from the `Deploy` page for each of the above components by clicking `Click & Deploy` in the `Build Area`.

### Process API - Task Management
- `groupApiUrl` - internal URL from the DevOps Portal of `Entity API - Task Group` in the `Task Management` project
- `taskApiUrl` - internal URL from the DevOps Portal of `Entity API - Task` in the `Task Management` project
- `archiveApiUrl` - internal URL from the DevOps Portal of `Entity API - Archived Task` in the `Task Management` project
- `notificationUrl` - external Production URL (from the deploy page or the Developer Portal) of `Process API - Notification` in the `Notification Management` project 
- `accessToken` - access token (from the Developer Portal) of `Process API - Notification` in the `Notification Management` project 

### Process API - Task Query
- `groupApiUrl` - internal URL from the DevOps Portal of `Entity API - Task Group` in the `Task Management` project
- `taskApiUrl` - internal URL from the DevOps Portal of `Entity API - Task` in the `Task Management` project
- `archiveApiUrl` - internal URL from the DevOps Portal of `Entity API - Archived Task` in the `Task Management` project