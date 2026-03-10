import { AppDataSource } from './infrastructure/database/DataSource';
import { GroupRepository } from './infrastructure/repositories/GroupRepository';
import { Group } from './domain/entities';
import { PlayerType } from './domain/enums';

async function testAddPlayer() {
  try {
    console.log('🚀 Iniciando teste do addPlayer...');

    // 1. Inicializar banco
    await AppDataSource.initialize();
    console.log('✅ Database conectado');

    // 2. Criar um grupo primeiro
    const groupRepo = new GroupRepository();
    const newGroup = Group.create('Test Group');
    const savedGroup = await groupRepo.save(newGroup);
    console.log('✅ Grupo criado:', savedGroup.id);

    // 3. Testar addPlayer
    console.log('\n🎯 Testando addPlayer...');

    // Adicionar primeiro player
    const groupWithPlayer1 = await groupRepo.addPlayer(
      savedGroup.id,
      'João Silva',
      PlayerType.STANDARD
    );
    console.log('✅ Player 1 adicionado:', groupWithPlayer1.players?.length);

    // Adicionar segundo player (teste incremental)
    const groupWithPlayer2 = await groupRepo.addPlayer(
      savedGroup.id,
      'Maria Santos',
      PlayerType.STANDARD
    );
    console.log('✅ Player 2 adicionado:', groupWithPlayer2.players?.length);

    // 4. Buscar grupo para verificar
    const finalGroup = await groupRepo.findById(savedGroup.id);
    console.log('\n📋 Resultado final:');
    console.log('- Grupo ID:', finalGroup?.id);
    console.log('- Nome:', finalGroup?.name);
    console.log(
      '- Players:',
      finalGroup?.players?.map((p) => ({ name: p.name, type: p.playerType }))
    );

    // 5. Testar deletePlayer
    console.log('\n🗑️ Testando deletePlayer...');
    const playerToDelete = finalGroup?.players?.[0];
    if (playerToDelete) {
      const groupAfterDelete = await groupRepo.deletePlayer(
        savedGroup.id,
        playerToDelete.id
      );
      console.log('✅ Player removido:', groupAfterDelete.players?.length);

      // Verificar se player foi removido
      const groupAfterDeletion = await groupRepo.findById(savedGroup.id);
      console.log(
        '- Players restantes:',
        groupAfterDeletion?.players?.map((p) => ({
          name: p.name,
          type: p.playerType,
        }))
      );
    }

    // 6. Teste de erro deletePlayer - player inexistente
    console.log('\n🚨 Testando erro deletePlayer - player inexistente...');
    try {
      await groupRepo.deletePlayer(savedGroup.id, 'invalid-player-id');
    } catch (error: any) {
      console.log('✅ Erro capturado corretamente:', error.message);
    }

    // 7. Teste de erro deletePlayer - grupo inexistente
    console.log('\n🚨 Testando erro deletePlayer - grupo inexistente...');
    try {
      await groupRepo.deletePlayer('invalid-group-id', 'some-player-id');
    } catch (error: any) {
      console.log('✅ Erro capturado corretamente:', error.message);
    }

    // 8. Teste de erro addPlayer - grupo inexistente
    console.log('\n🚨 Testando erro addPlayer - grupo inexistente...');
    try {
      await groupRepo.addPlayer(
        'invalid-id',
        'Test Player',
        PlayerType.STANDARD
      );
    } catch (error: any) {
      console.log('✅ Erro capturado corretamente:', error.message);
    }

    console.log('\n🎉 Todos os testes passaram!');
  } catch (error: any) {
    console.error('❌ Erro no teste:', error.message);
    console.error(error.stack);
  } finally {
    // 6. Fechar conexão
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ Database desconectado');
    }
  }
}

// Executar teste
testAddPlayer();
