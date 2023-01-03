# Task Management - Query Tasks - GraphQL

## Get all groups
### GraphQL query
```
{   
    groups {         
        id           
        name                    
    }
}
```

### cURL

```
curl -X POST -H "Content-type: application/json" \
  -d '{ "query": "{   
    groups {         
        id           
        name                    
    }                
  }",
  "operationName":null } }'                \
  'http://localhost:4000'
```

### Response

```
{
  "data": {
    "groups": [
      {
        "id":1,
        "name": "Urgent & Important"
      },{
        "id":2,
        "name": "Urgent & not Important"
      }
    ]
  }
}
```

## Get all groups with tasks

### GraphQL query
```
{   
    groups {         
        id           
        name         
        tasks {      
            id       
            title 
            status   
        }            
    }
}
```

### cURL

```
curl -X POST -H "Content-type: application/json" \
  -d '{ "query": "{   
    groups {         
        id           
        name         
        tasks {      
            id       
            title 
            status   
        }            
    }                
  }",
  "operationName":null } }'                \
  'http://localhost:4000'
```

### Response

```
{
  "data": {
    "groups": [
      {
        "Id": 1,
        "name": "Urgent & Important",
        "tasks": [
          {
            "id": 1,
            "content": "Task 1",
            "status": "open"
          },
          {
            "id": 2,
            "content": "Task 2",
            "status": "in-progress"
          },
          {
            "id": 3,
            "content": "Task 3",
            "status": "complete"
          }
        ]
      },
      {
        "Id": 2,
        "name": "Urgent & Unimportant",
        "tasks": [
          {
            "id": 4,
            "content": "Task 4",
            "status": "open"
          },
          {
            "id": 5,
            "content": "Task 5",
            "status": "in-progress"
          },
          {
            "id": 6,
            "content": "Task 6",
            "status": "complete"
          }
        ]
      }
    ]
  }
}

```


## Get tasks filtered by group

### GraphQL query
```
{   
    tasks(groupId:1) {                  
        id       
        title 
        status             
    }                
}
```

### cURL
```
curl -X POST -H "Content-type: application/json" \
  -d '{ "query": "{   
    tasks(groupId:1) {                  
        id       
        title 
        status             
    }                  
  }",
  "operationName":null } }'                \
  'http://localhost:4000'
```

### Response
```
{"data":{"tasks":[...]}}
```

## Get tasks filtered by group and status

### GraphQL query
```
{   
    tasksFiltered(groupId:1, status: "open") {                      
        id       
        title 
        status            
    }                
}
```

### cURL
```
curl -X POST -H "Content-type: application/json" \
  -d '{ "query": "{   
    tasksFiltered(groupId:1, status: \"open\") {                      
        id       
        title 
        status            
    }                
  }",
  "operationName":null } }'                \
  'http://localhost:4000'
```

### Response
```
{"data":{"tasksFiltered":[...]}}
```

## Get archived tasks by group

### GraphQL query
```
{   
    archived(groupId:1) {                      
        id   
        taskId 
        groupId     
        title 
        status  
        archivedAt          
    }                
}
```

### cURL
```
curl -X POST -H "Content-type: application/json" \
  -d '{ "query": "{   
    archived(groupId:1) {                      
        id   
        taskId 
        groupId     
        title 
        status  
        archivedAt          
    }                
  }",
  "operationName":null } }'                \
  'http://localhost:4000'
```

### Response
```
{"data":{"archived":[...]}}
```