<template>
  <div class="app-container">
    <!-- Navbar só aparece quando NÃO estiver na home -->
    <Navbar v-if="$route.name !== 'Home'" :score="score" :currentQuestion="currentQuestion" :showScore="showScore"
      @home="goToHome" />

    <main>
      <router-view 
        @startGame="startGame"
        @continentSelected="onContinentSelected"
        @update:score="score = $event"
        @update:currentQuestion="currentQuestion = $event"
        @gameCompleted="onGameCompleted"
        :completed-continents="completedContinents"
        :selected-continent="$route.params.continent"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';

const router = useRouter();

// Estado geral do aplicativo
const completedContinents = ref(new Set());
const score = ref(0);
const currentQuestion = ref(0);

// Computed property para controlar quando mostrar a pontuação
const showScore = computed(() => {
  return router.currentRoute.value.name !== 'Home';
});

// Watch para resetar stats quando mudar de rota
watch(
  () => router.currentRoute.value.name,
  (newRouteName) => {
    if (newRouteName === 'Home') {
      resetGameStats();
    }
  }
);

// LÓGICA: Esta função reseta *todo* o estado do jogo para uma nova sessão.
const resetGameStats = () => {
  score.value = 0;
  currentQuestion.value = 0;
  completedContinents.value.clear();
};

// Funções de transição de estado
const startGame = () => {
  resetGameStats();
  router.push('/continents');
};

const onContinentSelected = (continent) => {
  // Zera a contagem de perguntas e a pontuação para a nova rodada
  currentQuestion.value = 0;
  score.value = 0;
  
  router.push(`/play/${continent}`);
};

const onGameCompleted = (continent) => {
  completedContinents.value.add(continent);
  // Volta para a seleção de continentes após completar um
  router.push('/continents');
};

const goToHome = () => {
  router.push('/');
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f0f0f0;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

main {
  flex: 1;
  overflow: hidden;
  background: transparent;
}

/* Garante que a home ocupe toda a tela */
.home-container {
  height: 100vh;
  width: 100vw;
}
</style>