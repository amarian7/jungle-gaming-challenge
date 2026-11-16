import * as Core from '@mikro-orm/core';
import config from './mikro-orm.config.js';

async function main() {
  console.log('Inicializando MikroORM para gerar a migração...');
  const orm = await Core.MikroORM.init(config);

  const migrator = orm.getMigrator();
  
  console.log('Gerando migração inicial baseada nas entidades...');
  const migration = await migrator.createMigration();
  
  console.log(`Migração criada com sucesso em: ${migration.fileName}`);

  await orm.close(true);
  process.exit(0);
}

main().catch((err) => {
  console.error('Erro ao gerar migração:', err);
  process.exit(1);
});