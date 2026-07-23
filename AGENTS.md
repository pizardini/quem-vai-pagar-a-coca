<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
# AGENTS.md

## Projeto

Este projeto é um aplicativo web chamado **Quem Vai Pagar a Coca?**.

O objetivo é controlar, de forma simples, quem deve pagar a Coca-Cola do grupo em cada encontro.

O projeto será publicado no GitHub Pages.

---

# Stack obrigatória

- Next.js (App Router)
- React
- TypeScript
- Material UI (MUI)
- Zustand
- LocalStorage (persistência)
- Sem backend
- Sem banco de dados
- Sem API Routes
- Sem TailwindCSS

---

# Arquitetura

O projeto deve permanecer simples.

Não criar arquitetura enterprise.

Preferir poucos componentes reutilizáveis.

Evitar abstrações desnecessárias.

Toda a lógica de negócio deve ficar organizada e de fácil leitura.

---

# Persistência

Todos os dados devem ser persistidos utilizando Zustand + persist middleware.

Nunca utilizar IndexedDB.

Nunca utilizar backend.

---

# Interface

A interface deve seguir Material Design utilizando Material UI.

Priorizar:

- simplicidade
- clareza
- poucos cliques
- boa responsividade

---

# Código

Sempre utilizar TypeScript.

Nunca utilizar any.

Sempre utilizar interfaces.

Sempre utilizar funções pequenas.

Evitar duplicação de código.

---

# Estado

Todo o estado global deve ficar em um único Zustand Store.

Não utilizar Redux.

Não utilizar Context API.

---

# Objetivo

O projeto deve ser fácil de entender por qualquer desenvolvedor React intermediário.

O código deve parecer um projeto pequeno, organizado e moderno.

---

# Organização

Preferir a seguinte estrutura:

app/

components/

store/

theme/

types/

---

Sempre atualizar a documentação quando houver mudanças importantes na arquitetura.