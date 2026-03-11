import { app } from './app'

app
  .listen({
    port: 8080,
  })
  .then(() => console.log('Server running on port 8080'))
