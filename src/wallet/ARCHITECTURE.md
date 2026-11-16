# Decisões de Arquitetura

- **Idempotência:** Implementada via tabela dedicada `idempotency_keys` no PostgreSQL, armazenando a chave e a resposta JSON cacheada para evitar duplo depósito.
- **Concorrência:** Tratada via controle de versão otimista do MikroORM na entidade `Wallet`.
- **Tratamento Monetário:** Uso estrito de Value Objects (`Money`) baseados em strings para evitar imprecisões de ponto flutuante.