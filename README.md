# Quem Vai Pagar a Coca?

Aplicacao web simples para controlar quem deve pagar a Coca-Cola em encontros
de um grupo de amigos.

## Stack

- Next.js com App Router
- React
- TypeScript
- Material UI
- Zustand com persist middleware
- LocalStorage
- dnd-kit para reordenar a fila fixa

Nao existe backend, banco de dados, API Route ou IndexedDB.

## Regras do aplicativo

Participantes fixos formam uma fila. O primeiro da fila e o proximo a pagar.
Quando ele paga, vai para o fim da fila. Se nao paga, a fila nao muda.

Participantes esporadicos nao entram na fila fixa. Cada presenca confirmada
soma uma participacao. O limite para ficar pendente e igual ao numero atual de
participantes fixos. Ao atingir esse limite, o participante fica pendente para
pagar.

Quando houver um esporadico pendente presente no encontro, ele tem prioridade
sobre a fila fixa. Se mais de um estiver pendente e presente, paga quem ficou
pendente primeiro. Depois de pagar, o contador volta para zero.

## Fluxo principal

1. Cadastre participantes fixos e esporadicos.
2. Reordene a fila fixa por drag-and-drop quando necessario.
3. Marque quais esporadicos estiveram presentes no encontro.
4. Confirme as presencas para atualizar contadores e definir o pagador.
5. Registre o resultado: pagou, nao pagou ou nao houve Coca.

Todos os resultados geram historico com data, participante, tipo e resultado.

## Dados

O estado global fica em `store/useStore.ts` e e persistido automaticamente no
LocalStorage pela chave `quem-vai-pagar-a-coca`.

A tela permite exportar um JSON com todos os dados e importar novamente um JSON
exportado anteriormente, restaurando participantes fixos, participantes
esporadicos e historico.

## Estrutura

- `app/`: rotas, layout raiz, providers e tela principal.
- `components/`: componentes reutilizaveis pequenos.
- `store/`: Zustand Store unica e regras de negocio.
- `theme/`: tema Material UI.
- `types/`: interfaces compartilhadas.

## Desenvolvimento

```bash
npm run dev
```

## Validacao

```bash
npm run lint
npm run build
```
