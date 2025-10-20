<template>
  <div class="map-container">
    <!-- Efeitos de fundo -->
    <div class="background-effects">
      <div class="gradient-overlay"></div>
      <div class="floating-particles">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
      </div>
    </div>

    <!-- Container do mapa -->
    <div class="map-wrapper">
      <svg ref="mapSvg" class="world-map"></svg>
      <div class="map-overlay"></div>
    </div>

    <!-- Question Box -->
    <QuestionBox v-if="showQuestion && currentCountry" v-model="userAnswer" :country-name="currentCountry.pt"
      :feedback="feedback" :is-correct="isCorrect" @submit="checkAnswer" ref="questionBox" />

    <!-- Loading State -->
    <div v-if="!mapReady" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Carregando mapa...</p>
    </div>
  </div>
</template>

<script>
import { MapService } from '../services/mapService';
import { countryDetails } from '../data/countriesDetails';
import QuestionBox from './QuestionBox.vue';

export default {
  name: 'GeoMap',
  components: {
    QuestionBox
  },
  props: {
    selectedContinent: {
      type: String,
      required: true,
    }
  },
  emits: ['update:score', 'update:currentQuestion', 'gameCompleted'],
  data() {
    return {
      currentCountry: null,
      showQuestion: false,
      userAnswer: '',
      feedback: '',
      isCorrect: false,
      score: 0,
      questionCount: 0,
      mapService: null,
      allCountries: [],
      playableCountries: [],
      askedCountries: new Set(),
      mapReady: false
    };
  },
  async mounted() {
    this.mapService = new MapService(this.$refs.mapSvg, countryDetails);
    await this.mapService.init();

    this.allCountries = this.mapService.getCountries();
    this.prepareGame();
    this.mapReady = true;

    this.startRandomQuestion();
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    getContinentName(continent) {
      const names = {
        africa: 'África',
        europe: 'Europa',
        asia: 'Ásia',
        americas: 'Américas',
        oceania: 'Oceania'
      };
      return names[continent] || continent;
    },

    getProgressPercentage() {
      if (this.playableCountries.length === 0) return 0;
      return ((this.playableCountries.length - this.askedCountries.size) / this.playableCountries.length) * 100;
    },

    prepareGame() {
      this.playableCountries = this.allCountries.filter(feature => {
        const countryName = feature.properties.name;
        return countryDetails[countryName] &&
          countryDetails[countryName].continent === this.selectedContinent;
      });
      this.updateMapVisualization();
    },

    updateMapVisualization() {
      if (this.mapService && this.mapService.svg) {
        this.mapService.svg.selectAll('.country')
          .style('fill', d => {
            const countryName = d.properties.name;
            const isPlayable = countryDetails[countryName] &&
              countryDetails[countryName].continent === this.selectedContinent;
            return isPlayable ? '#4a7c47' : '#2d3748';
          })
          .style('cursor', 'default') /* MUDADO: cursor padrão em vez de pointer */
          .style('opacity', d => {
            const countryName = d.properties.name;
            const isPlayable = countryDetails[countryName] &&
              countryDetails[countryName].continent === this.selectedContinent;
            return isPlayable ? 0.8 : 0.3;
          });
      }
    },

    onWindowResize() {
      if (this.mapService) {
        this.mapService.drawMap();
        this.$nextTick(() => {
          this.updateMapVisualization();
        });
      }
    },

    async startRandomQuestion() {
      if (this.mapService.isTransitioning) return;

      const availableCountries = this.playableCountries.filter(
        c => !this.askedCountries.has(c.properties.name)
      );

      if (availableCountries.length === 0) {
        this.$emit('gameCompleted', this.selectedContinent);
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableCountries.length);
      const selectedFeature = availableCountries[randomIndex];
      const countryName = selectedFeature.properties.name;
      const details = countryDetails[countryName];

      this.currentCountry = {
        name: countryName,
        pt: details.pt,
        capital: details.capital,
        feature: selectedFeature
      };

      this.askedCountries.add(countryName);
      this.showQuestion = false;
      this.userAnswer = '';
      this.feedback = '';

      await this.mapService.highlightCountry(selectedFeature);

      this.showQuestion = true;
      this.questionCount++;
      this.$emit('update:currentQuestion', this.questionCount);
    },

    checkAnswer() {
      if (!this.userAnswer.trim()) return;

      const normalizedAnswer = this.userAnswer.trim().toLowerCase();
      const normalizedCorrect = this.currentCountry.capital.toLowerCase();

      if (normalizedAnswer === normalizedCorrect) {
        this.score += 10;
        this.$emit('update:score', this.score);
        this.feedback = '🎉 Correto! +10 pontos';
        this.isCorrect = true;
        setTimeout(() => this.goToNextQuestion(), 1500);
      } else {
        this.feedback = `❌ Incorreto! A capital correta é ${this.currentCountry.capital}.`;
        this.isCorrect = false;
        this.userAnswer = '';

        this.$nextTick(() => {
          this.$refs.questionBox?.focusInput();
        });
      }
    },

    async goToNextQuestion() {
      if (this.mapService.isTransitioning) return;
      this.showQuestion = false;
      await this.mapService.resetMap();
      this.updateMapVisualization();
      this.startRandomQuestion();
    }
  }
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Efeitos de Fundo */
.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gradient-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(74, 124, 71, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.1) 0%, transparent 50%);
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.1), rgba(52, 152, 219, 0.1));
  animation: float 8s ease-in-out infinite;
}

.particle-1 {
  width: 120px;
  height: 120px;
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 15%;
  animation-delay: 2s;
}

.particle-3 {
  width: 60px;
  height: 60px;
  bottom: 25%;
  left: 20%;
  animation-delay: 4s;
}

.particle-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 25%;
  animation-delay: 6s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }

  50% {
    transform: translateY(-25px) rotate(180deg);
    opacity: 1;
  }
}

/* Header do Jogo */
.game-header {
  position: relative;
  z-index: 3;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.compass-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.game-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #42b983, #4a7c47);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.continent-badge {
  background: linear-gradient(135deg, #42b983, #4a7c47);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

/* Painel de Estatísticas */
.stats-panel {
  display: flex;
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 140px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #42b983;
  line-height: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Wrapper do Mapa - POSIÇÃO AJUSTADA */
.map-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  z-index: 2;
  height: 65vh;
  margin-top: 0.5rem;
}

.world-map {
  display: block;
  width: 95%;
  height: 100%;
  max-width: none;
  max-height: none;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  border-radius: 12px;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background:
    radial-gradient(circle at center, transparent 30%, rgba(10, 10, 10, 0.4) 100%);
}

/* Barra de Progresso - POSIÇÃO AJUSTADA */
.progress-container {
  position: absolute;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  width: 90%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42b983, #4a7c47);
  border-radius: 10px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
}

.progress-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

/* Loading State */
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Estilos para os países (aplicados via D3) */
:deep(.country) {
  stroke: #1a1a2e;
  stroke-width: 0.3px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* REMOVIDO: Efeito de hover em todos os países */
/* :deep(.country:hover) {
  filter: brightness(1.3) drop-shadow(0 0 8px rgba(66, 185, 131, 0.4));
  transform: scale(1.02);
  cursor: pointer;
} */

:deep(.country.highlighted) {
  fill: #42b983 !important;
  filter: drop-shadow(0 0 15px rgba(66, 185, 131, 0.6));
  stroke: #ffffff;
  stroke-width: 1px;
  animation: pulse 2s infinite;
  transform: scale(1.02);
  /* Apenas o país destacado "levanta" */
  cursor: pointer;
}

@keyframes pulse {

  0%,
  100% {
    filter: drop-shadow(0 0 15px rgba(66, 185, 131, 0.6));
    transform: scale(1.02);
  }

  50% {
    filter: drop-shadow(0 0 25px rgba(66, 185, 131, 0.8));
    transform: scale(1.03);
  }
}

/* Responsividade */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stats-panel {
    gap: 1rem;
  }

  .stat-card {
    min-width: 120px;
    padding: 0.6rem 1rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .game-header {
    padding: 0.8rem 1rem;
  }

  .game-title {
    font-size: 1.4rem;
  }

  .compass-icon {
    font-size: 2rem;
  }

  .continent-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .stats-panel {
    gap: 0.5rem;
  }

  .stat-card {
    min-width: 100px;
    padding: 0.5rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .map-wrapper {
    padding: 0.5rem;
    height: 60vh;
  }

  .world-map {
    width: 98%;
  }

  .progress-container {
    bottom: 5rem;
    width: 95%;
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 480px) {
  .title-section {
    flex-direction: column;
    gap: 0.5rem;
  }

  .game-title {
    font-size: 1.2rem;
  }

  .stats-panel {
    flex-wrap: wrap;
    justify-content: center;
  }

  .stat-card {
    min-width: 80px;
  }

  .stat-value {
    font-size: 1rem;
  }

  .map-wrapper {
    height: 55vh;
  }

  .progress-container {
    bottom: 4.5rem;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>