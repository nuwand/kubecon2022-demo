# Task Management - Query Tasks - GraphQL

## Get tasks filtered by group

### GraphQL query
```
{   
    tasksFilteredByGroup(id:1) {                  
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
    tasksFilteredByGroup(id:1) {                  
        tasks {      
            id       
            title 
            status   
        }            
    }                
  }" }'                \
  'http://localhost:4000/task/query'
```

### Response
```
{"data":{"tasksFilteredByGroup":{"tasks":[...]}}}
```

## Get tasks filtered by group and status

### GraphQL query
```
{   
    tasksFilteredByGroupAndStatus(id:1, status: \"open\") {                  
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
    tasksFilteredByGroupAndStatus(id:1, status: \"open\") {                  
        tasks {      
            id       
            title 
            status   
        }            
    }                
  }" }'                \
  'http://localhost:4000/task/query'
```

### Response
```
{"data":{"tasksFilteredByGroupAndStatus":{"tasks":[...]}}}
```

## Get all tasks categorized per group
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
  }" }'                \
  'http://localhost:4000/task/query'
```

