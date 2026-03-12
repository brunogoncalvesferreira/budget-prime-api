import { app } from './app'

app
  .listen({
    port: 8080,
  })
  .then(() => {
    console.log('Server running on port 8080')
    console.log('Documentation: http://localhost:8080/docs')
  })
