# Security Specification for StudyPlanner

## Collection: `/tasks/{taskId}`

### Data Model
- `id`: string (alphanumeric/hyphen)
- `userId`: string (matches `request.auth.uid`)
- `title`: string (1..200 chars)
- `course`: string (1..100 chars)
- `type`: 'assignment' | 'exam'
- `dueDate`: regex `^[0-9]{4}-[0-9]{2}-[0-9]{2}$`
- `time`: optional string (<= 5 chars)
- `completed`: boolean
- `completedAt`: optional string
- `priority`: 'low' | 'medium' | 'high'
- `notes`: optional string (<= 2000 chars)
- `estimatedHours`: optional number
- `createdAt`: string

### Access Control Rules
1. **Authentication:** Must be signed in (`request.auth != null`). Supports anonymous and standard auth.
2. **Read / List:** User can only query their own tasks (`resource.data.userId == request.auth.uid`).
3. **Create:** `request.resource.data.userId == request.auth.uid` and passes schema validation.
4. **Update:** `resource.data.userId == request.auth.uid` and `request.resource.data.userId == request.auth.uid`.
5. **Delete:** `resource.data.userId == request.auth.uid`.
