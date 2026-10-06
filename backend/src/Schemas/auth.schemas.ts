// schemas/auth.schema.ts
import z from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, "Username é obrigatório"),
    password: z.string().min(6, "Senha é obrigatória")
}).strict();


export const loginSwaggerSchema = {
    
    config: {
            rateLimit: { max: 5, timeWindow: "1 minute" }
        },
    schema: {
        tags: ["Auth"],
        summary: "Autentica um usuário e retorna um token JWT",
        body: {
            type: "object",
            required: ["username", "password"],
            properties: {
                username: { type: "string" },
                password: { type: "string" }
            }
        },
        response: {
            200: {
                description: "Login bem-sucedido",
                type: "object",
                properties: { token: { type: "string" } }
            },
            401: {
                description: "Credenciais inválidas",
                type: "object",
                properties: { error: { type: "string" } }
            }
        }
    }
}
export const refreshSwaggerSchema = {
  schema: {
    description: 'Atualiza o Access Token utilizando o Refresh Token salvo nos cookies.',
    tags: ['Autenticação'],
    summary: 'Renovar Access Token',
    cookies: {
      type: 'object',
      properties: {
        refreshToken: { 
          type: 'string', 
          description: 'Token de atualização HTTP-only gerado no login.' 
        }
      },
      required: ['refreshToken']
    },
    response: {
      200: {
        description: 'Token atualizado com sucesso.',
        type: 'object',
        properties: {
          token: { 
            type: 'string', 
            description: 'Novo JWT Access Token (válido por 10 minutos).' 
          }
        }
      },
      401: {
        description: 'Refresh token inválido, expirado ou ausente.',
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Sessão expirada. Faça login novamente.' }
        }
      }
    }
  }
};


export const authSwaggerSchema = {
  tags: ["Auth"],
  summary: "Autentica um usuário e retorna um token JWT",
  body: {
      type: "object",
      required: ["username", "password"],
      properties: {
          username: { type: "string" },
          password: { type: "string" }
      }
  },
  response: {
      200: {
          description: "Login bem-sucedido",
          type: "object",
          properties: { token: { type: "string" } }
      },
      401: {
          description: "Credenciais inválidas",
          type: "object",
          properties: { error: { type: "string" } }
      }
  }
}