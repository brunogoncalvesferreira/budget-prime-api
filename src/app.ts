import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import { env } from './env'
import fastifySwagger from '@fastify/swagger'
import scalarReferenceUi from '@scalar/fastify-api-reference'
import { createUsersRoute } from './routes/create-users.route'
import { createClientsRoute } from './routes/create-clients.route'
import { createBudgetsRoute } from './routes/create-budgets.route'
import { getBudgetByIdRoute } from './routes/get-budget-by-id.route'
import { downloadBudgetRoute } from './routes/download-budget.route'
import { listBudgetsRoute } from './routes/list-budgets.route'
import { approveBudgetRoute } from './routes/approve-budget.route'
import { rejectBudgetRoute } from './routes/reject-budget.route'
import { sendBudgetWhatsappRoute } from './routes/send-budget-whatsapp.route'

export const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

if (env.NODE_ENV === 'development') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        version: '1.0.0',
        title: 'Budget Prime API',
        description: 'API generate budgets',
      },
    },

    transform: jsonSchemaTransform,
  })

  app.register(scalarReferenceUi, {
    routePrefix: '/docs',
    configuration: {
      theme: 'default',
    },
  })
}

app.register(createUsersRoute)
app.register(createClientsRoute)
app.register(createBudgetsRoute)
app.register(getBudgetByIdRoute)
app.register(downloadBudgetRoute)
app.register(listBudgetsRoute)
app.register(approveBudgetRoute)
app.register(rejectBudgetRoute)
app.register(sendBudgetWhatsappRoute)
