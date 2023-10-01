import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './src/' }))
app.use('/favicon.ico', serveStatic({ path: './src/favicon.ico' }))
app.get('/', (c) => c.text('start of something great.'))
app.get('*', serveStatic({ path: './src/static/fallback.txt' }))

export default {
  port: 8000,
  fetch: app.fetch,
}