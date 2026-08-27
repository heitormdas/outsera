# Golden Raspberry Awards API — AI / SDD Development Record

## Purpose

Este documento consolida a análise da avaliação técnica de backend e a evolução da estratégia para implementar o projeto usando Spec-Driven Development (SDD) com VS Code + GitHub Copilot Agent.

Ele foi preparado para ser adicionado ao repositório como histórico/contexto da preparação do projeto.

> **Nota:** o registro factual das execuções dos agentes deve continuar em `docs/ai/development-log.md`. Este documento não deve ser tratado como substituto desse log.

---

# 1. Requisitos identificados na avaliação

A avaliação solicita uma API RESTful para leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

Requisitos considerados obrigatórios:

- ler o arquivo CSV e inserir os dados em uma base de dados durante o startup;
- disponibilizar uma API RESTful;
- obter o produtor com o maior intervalo entre dois prêmios consecutivos;
- obter o produtor com o menor intervalo entre dois prêmios consecutivos;
- implementar nível 2 de maturidade de Richardson;
- implementar somente testes de integração;
- usar banco em memória com SGBD embarcado;
- não exigir instalação externa de infraestrutura;
- possuir README com instruções para aplicação e testes;
- disponibilizar o código em Git;
- utilizar IA no desenvolvimento;
- manter registro das interações com IA no repositório;
- considerar qualidade e desempenho como em revisão tradicional de código.

A avaliação também define uma resposta contendo `min` e `max`, com os campos:

- `producer`
- `interval`
- `previousWin`
- `followingWin`

A avaliação alerta que outros datasets e cenários serão usados, portanto a implementação não pode depender de valores específicos do dataset original.

---

# 2. Dataset analisado

Formato:

```csv
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
1980;Cruising;Lorimar Productions, United Artists;Jerry Weintraub;
1980;The Formula;MGM, United Artists;Steve Shagan;
1980;Friday the 13th;Paramount Pictures;Sean S. Cunningham;
1980;The Nude Bomb;Universal Studios;Jennings Lang;
```

Características relevantes:

- delimitador `;`;
- `winner = yes` representa um vencedor;
- o campo `producers` pode conter múltiplos produtores;
- múltiplos produtores devem ser tratados individualmente;
- o parser deve ser um parser CSV real, não `split(';')` ingênuo.

---

# 3. Regra de negócio central

Para cada produtor:

1. considerar somente filmes vencedores;
2. obter todos os anos das vitórias;
3. ordenar cronologicamente;
4. calcular diferenças somente entre anos consecutivos;
5. ignorar produtores com menos de duas vitórias;
6. encontrar o menor intervalo global;
7. encontrar o maior intervalo global;
8. retornar todos os resultados empatados.

## Caso crítico

Para:

```text
Producer A
1980
1985
1986
2000
```

os intervalos são:

```text
1980 → 1985 = 5
1985 → 1986 = 1
1986 → 2000 = 14
```

Logo:

```text
min = 1
max = 14
```

Uma implementação baseada apenas em primeira vitória versus última vitória retornaria 20 e estaria incorreta.

---

# 4. Edge cases considerados

- produtor com somente uma vitória;
- múltiplos produtores no mesmo filme;
- anos fora de ordem no CSV;
- empate no menor intervalo;
- empate no maior intervalo;
- empate simultâneo em min e max;
- nenhum produtor com duas ou mais vitórias;
- datasets diferentes do exemplo;
- espaços periféricos em nomes;
- campos CSV quoted/quoted fields;
- falha ao ler CSV;
- falha de parsing;
- falha de validação;
- falha de persistência;
- importação parcial.

Para o caso sem intervalos, foi adotada como decisão de implementação a resposta:

```json
{
  "min": [],
  "max": []
}
```

A avaliação não define explicitamente esse caso, portanto a decisão deve ser documentada e testada.

---

# 5. Arquitetura SDD

A estratégia definida foi separar quatro conceitos:

```text
specs/
    O que o sistema deve fazer

.github/copilot-instructions.md
    Como o agente deve trabalhar

.github/instructions/
    Regras específicas por contexto

.github/prompts/
    Tarefa executável do momento

src/
    Implementação

test/
    Evidência comportamental

docs/ai/
    Registro do que realmente aconteceu
```

A especificação é a fonte de verdade.

O agente não deve reinterpretar os requisitos a cada tarefa.

---

# 6. Arquitetura técnica proposta

Estrutura:

```text
src/
├── config/
├── domain/
├── application/
├── infrastructure/
│   ├── database/
│   └── import/
├── api/
├── app.ts
└── main.ts

test/
├── integration/
└── fixtures/
```

Fluxo:

```text
main / bootstrap
      |
      +--> database initialization
      |
      +--> CSV importer
              |
              +--> repository
                      |
                      +--> SQLite :memory:
      |
      +--> createApp()
      |
      +--> listen()
```

Separação importante:

- `app.ts`: cria/configura Express;
- `main.ts`: inicialização real e `listen()`;
- testes usam Supertest contra a aplicação sem depender de listener TCP;
- regras de negócio ficam fora da rota;
- SQLite não deve vazar para API/application.

---

# 7. Stack final aprovada

Após revisar o plano do Agent, a direção escolhida foi:

```text
Node.js
TypeScript
Express
SQLite3
csv-parse
node:test
Supertest
```

Motivação:

- simples para o tamanho da avaliação;
- sem infraestrutura externa;
- SQLite atende ao requisito de banco embarcado em memória;
- Express possui baixo overhead;
- `csv-parse` evita parser frágil;
- `node:test` atende à estratégia de integração;
- Supertest permite exercitar HTTP sem abrir uma porta TCP nos testes.

---

# 8. Modelo de dados

Foi definido o seguinte modelo relacional:

```text
movies
------
id
year
title
studios
winner

producers
---------
id
name

movie_producers
---------------
movie_id
producer_id
```

Relação:

```text
movies N:N producers
```

através de `movie_producers`.

Pontos importantes:

- persistir o dataset completo, inclusive não vencedores;
- filtrar somente vencedores na regra de negócio;
- produtor deve possuir identidade interna (`producer_id`);
- nome do produtor é dado de apresentação;
- múltiplos produtores são associações independentes.

---

# 9. Startup e importação

Sequência desejada:

```text
1. inicializar SQLite :memory:
2. criar schema
3. resolver CSV_PATH
4. ler CSV
5. parsear com csv-parse
6. validar dados necessários
7. persistir em transação
8. somente após sucesso iniciar HTTP
```

Defaults:

```text
CSV_PATH=Movielist.csv
PORT=3000
```

Falhas de leitura, parsing, validação ou persistência devem interromper o startup.

Importação de banco deve ser atômica.

---

# 10. API

Endpoint:

```http
GET /producers/intervals
```

Sucesso:

```http
200 OK
Content-Type: application/json
```

Formato:

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

Não são necessários:

- HATEOAS;
- autenticação;
- CRUD;
- paginação;
- persistência em disco;
- datasets remotos.

---

# 11. Ordenação determinística

A ordenação definida para a API deve ser documentada e determinística.

Foi recomendada:

```text
interval
producer
previousWin
followingWin
```

O objetivo é evitar respostas instáveis e testes frágeis.

---

# 12. Testes

A avaliação determina somente testes de integração.

Estrutura:

```text
test/
├── integration/
└── fixtures/
```

Cenários mínimos:

1. dataset normal;
2. empate no mínimo;
3. empate no máximo;
4. múltiplos produtores;
5. produtor com uma vitória;
6. anos fora de ordem;
7. caso consecutivo 1980/1985/1986/2000;
8. ausência de produtores com múltiplas vitórias;
9. datasets alternativos.

Asserções devem verificar:

- status HTTP;
- estrutura JSON;
- quantidade de resultados;
- produtor;
- intervalo;
- previousWin;
- followingWin;
- followingWin;
- empates.

---

# 13. Pacote SDD

A estrutura criada para o projeto foi:

```text
.github/
├── copilot-instructions.md
├── instructions/
│   ├── backend.instructions.md
│   ├── testing.instructions.md
│   └── documentation.instructions.md
└── prompts/
    ├── implementation/
    │   ├── 00-plan.prompt.md
    │   ├── 01-bootstrap.prompt.md
    │   ├── 02-database.prompt.md
    │   ├── 03-csv-import.prompt.md
    │   ├── 04-business-rule.prompt.md
    │   └── 05-api.prompt.md
    └── review/
        ├── 06-integration-tests.prompt.md
        ├── 07-hardening.prompt.md
        ├── 08-performance.prompt.md
        ├── 09-code-review.prompt.md
        ├── 10-spec-audit.prompt.md
        └── 11-adversarial-datasets.prompt.md

specs/
├── 00-overview.md
├── 01-functional-requirements.md
├── 02-api-contract.md
├── 03-domain-rules.md
├── 04-data-model.md
├── 05-startup-and-import.md
├── 06-testing-strategy.md
└── 07-acceptance-criteria.md

docs/
└── ai/
    ├── development-log.md
    └── prompts-used.md
```

---

# 14. Função de cada tipo de prompt

## Implementation

### 00-plan
Somente análise, sem código.

### 01-bootstrap
Fundação do projeto.

### 02-database
Banco, schema e repositories.

### 03-csv-import
Parser, transformação e persistência no startup.

### 04-business-rule
Cálculo dos intervalos consecutivos.

### 05-api
Endpoint REST.

## Review

### 06-integration-tests
Cobertura através de HTTP.

### 07-hardening
Robustez e edge cases.

### 08-performance
Complexidade, queries e memória.

### 09-code-review
Revisão de engenharia.

### 10-spec-audit
Comparação spec vs código vs testes.

### 11-adversarial-datasets
Tentativa deliberada de quebrar a solução com datasets alternativos.

---

# 15. Primeira execução SDD

Com Copilot Chat em Agent mode:

```text
Read .github/prompts/implementation/00-plan.prompt.md and execute it. Do not implement code.
```

Esse passo serve para:

```text
specs
  ↓
repository inspection
  ↓
implementation plan
  ↓
human approval
```

O plano gerado pelo Agent foi posteriormente revisado.

---

# 16. Resultado da revisão do plano do Agent

O primeiro plano do Agent foi considerado muito bom, mas algumas decisões foram fechadas antes da implementação:

1. Framework: Express.
2. `createApp()` separado de `start()` / `listen()`.
3. Supertest contra Express sem necessidade de listener TCP.
4. `producer_id` como identidade interna.
5. Persistir dataset completo.
6. Filtrar vencedores na regra de negócio.
7. Não inventar validações não necessárias.
8. Startup somente após importação concluída.
9. Ordenação determinística documentada.
10. Preservar alterações preexistentes no worktree.

O segundo plano foi considerado adequado para seguir à implementação.

---

# 17. Prompt consolidado usado para iniciar implementação

Após aprovação do plano:

```text
The implementation plan is approved.

Use these final architectural decisions:

- Node.js + TypeScript
- Express
- SQLite3 with an in-memory database
- csv-parse for CSV parsing
- node:test + Supertest for integration tests
- createApp() must be separated from the real startup/listen lifecycle
- tests should exercise the Express HTTP layer through Supertest without requiring a real TCP listener
- producer identity in the domain/persistence layer must use producer_id; producer name is presentation data
- persist the complete CSV dataset, including non-winning movies; apply winner filtering in the business-rule query/use case
- default CSV_PATH is Movielist.csv
- default PORT is 3000
- startup must complete database/schema initialization and CSV import before listen()
- import failures must fail startup explicitly
- deterministic result ordering: interval, then producer, then previousWin, then followingWin
- preserve all unrelated pre-existing working-tree changes

Now execute `.github/prompts/implementation/01-bootstrap.prompt.md`.

Important:
- inspect the repository first;
- read the relevant specs;
- implement only the bootstrap/foundation stage;
- do not implement the database, CSV importer, business rule, or final endpoint yet;
- run the available checks after implementation;
- review the git diff;
- record the actual interaction and validation results in `docs/ai/development-log.md`.

Do not proceed to the next implementation stage.
```

---

# 18. Development flow

```text
00-plan
    ↓
human approval
    ↓
01-bootstrap
    ↓
checkpoint
    ↓
02-database
    ↓
checkpoint
    ↓
03-csv-import
    ↓
checkpoint
    ↓
04-business-rule
    ↓
checkpoint
    ↓
05-api
    ↓
checkpoint
    ↓
06-integration-tests
    ↓
07-hardening
    ↓
08-performance
    ↓
09-code-review
    ↓
10-spec-audit
    ↓
11-adversarial-datasets
```

Não executar simultaneamente prompts de implementação contra o mesmo working tree.

---

# 19. Critérios de qualidade adotados

As decisões foram avaliadas com foco em:

## Correção
A regra deve ser independente do dataset.

## Testabilidade
A API deve poder ser exercitada sem infraestrutura externa.

## Isolamento
A lógica não deve depender diretamente do SQLite.

## Determinismo
Empates devem possuir resultado previsível.

## Robustez
Falha de importação não deve resultar em aplicação aparentemente saudável.

## Simplicidade
Evitar overengineering para um desafio pequeno.

## Manutenibilidade
Responsabilidades bem separadas entre HTTP, application e infrastructure.

---

# 20. Estado do projeto durante esta preparação

```text
[✓] avaliação analisada
[✓] dataset analisado
[✓] requisitos extraídos
[✓] SDD definido
[✓] specifications preparadas
[✓] prompts preparados
[✓] primeiro plano do Agent revisado
[ ] bootstrap
[ ] database
[ ] CSV importer
[ ] business rule
[ ] API
[ ] integration tests
[ ] hardening
[ ] code review
[ ] final audit
```

O próximo passo de implementação é executar exclusivamente `01-bootstrap.prompt.md`.

---

# 21. Princípio de uso da IA

O fluxo adotado é:

```text
Specification
      ↓
Agent proposal
      ↓
Human review
      ↓
Agent implementation
      ↓
Automated validation
      ↓
Human approval
```

O objetivo é usar IA como ferramenta de desenvolvimento controlado, mantendo a especificação e a validação como fontes independentes da implementação.
