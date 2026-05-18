#  Sistema de Gerenciamento de Tarefas Colaborativo

Um sistema backend para gerenciamento colaborativo de tarefas, desenvolvido com Node.js, Express, TypeScript e Prisma. O projeto permite que equipes de trabalho ou grupos de estudo organizem tarefas e acompanhem projetos.

---

## Objetivo do Projeto

Construir uma API capaz de:

- Gerenciar usuários e autenticação
- Criar e organizar projetos
- Criar, editar e acompanhar tarefas
- Controlar permissões e acessos
- Registrar histórico de alterações das tarefas

---

##  Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (JSON Web Token)
- Bcrypt
- Jest (testes)
- Git & GitHub

---

## 📁 Estrutura do Projeto

```
task-manager/
├── postman/
├── prisma/
├── src/
│   ├── common/
│   ├── middlewares/
│   ├── prisma/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── jest.config.ts
├── package-lock.json
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## Funcionalidades
 
###  Usuários
- Cadastro de usuários
- Login com autenticação JWT e geração de token
- Edição do perfil do usuário
- Gerenciamento de usuários pelo admin
- Controle de acesso por usuário
- Função de administrador

###  Controle de Acesso
- Proteção de rotas autenticadas
- Validação de papel (role) por endpoint
- Restrição de acesso às tarefas do usuário
- Acesso irrestrito do admin

### Projetos
- Cadastro de projetos
- Associação de tarefa a um projeto

### Tarefas
- Cadastro de tarefas
- Listagem de tarefas do usuário
- Edição de tarefas
- Marcar tarefa como concluída
- Reabrir tarefa concluída

###  Histórico
- Registro automático de eventos da tarefa
- Acesso do admin ao histórico completo