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

    <!-- Botão Start -->
    <button v-if="!currentCountry && mapReady" @click="startRandomQuestion" class="btn-start">
      <span class="btn-icon">🎯</span>
      <span class="btn-text">Iniciar Desafio</span>
    </button>

    <!-- Loading State -->
    <div v-if="!mapReady" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Carregando mapa...</p>
    </div>

    <!-- Painel de Status -->
    <div v-if="currentCountry" class="status-panel">
      <div class="status-card">
        <div class="status-icon">⭐</div>
        <div class="status-info">
          <div class="status-value">{{ score }}</div>
          <div class="status-label">Pontos</div>
        </div>
      </div>

      <div class="status-card">
        <div class="status-icon">❓</div>
        <div class="status-info">
          <div class="status-value">{{ currentQuestion }}</div>
          <div class="status-label">Questão</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MapService } from '../services/mapService';
import { countryData } from '../data/countriesData';
import QuestionBox from './QuestionBox.vue';

export default {
  name: 'WorldMap',
  components: {
    QuestionBox
  },
  props: {
    score: {
      type: Number,
      required: true
    },
    currentQuestion: {
      type: Number,
      required: true
    }
  },
  emits: ['update:score', 'update:currentQuestion'],
  data() {
    return {
      currentCountry: null,
      showQuestion: false,
      userAnswer: '',
      feedback: '',
      isCorrect: false,
      mapService: null,
      countries: [],
      mapReady: false
    };
  },
  async mounted() {
    this.mapService = new MapService(this.$refs.mapSvg, countryData);
    await this.mapService.init();
    this.countries = this.mapService.getCountries();
    this.mapReady = true;
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    onWindowResize() {
      if (this.mapService) {
        this.mapService.drawMap();
      }
    },

    async startRandomQuestion() {
      if (this.mapService.isTransitioning) return;

      const validCountries = this.countries.filter(c => c.capital !== null);
      if (validCountries.length === 0) return;

      const randomIndex = Math.floor(Math.random() * validCountries.length);
      const selectedCountry = validCountries[randomIndex];

      this.currentCountry = {
        original: selectedCountry.properties.name,
        pt: selectedCountry.namePt,
        capital: selectedCountry.capital,
        feature: selectedCountry
      };

      this.showQuestion = false;
      this.userAnswer = '';
      this.feedback = '';

      await this.mapService.highlightCountry(selectedCountry);

      this.showQuestion = true;
      this.$emit('update:currentQuestion', this.currentQuestion + 1);
    },

    checkAnswer() {
      if (!this.userAnswer.trim()) return;

      const normalizedAnswer = this.userAnswer.trim().toLowerCase();
      const normalizedCorrect = this.currentCountry.capital.toLowerCase();

      if (normalizedAnswer === normalizedCorrect) {
        this.$emit('update:score', this.score + 10);
        this.feedback = `🎉 Correto! +10 pontos`;
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
  justify-content: center;
  align-items: center;
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

/* Wrapper do Mapa */
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  padding: 1rem;
  margin-left: 400px;
  /* Espaço para o QuestionBox */
}

.world-map {
  display: block;
  width: 100%;
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

/* Botão Start */
.btn-start {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 32px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #42b983, #4a7c47);
  color: white;
  border: none;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow:
    0 8px 25px rgba(66, 185, 131, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.btn-start:hover {
  background: linear-gradient(135deg, #3aa876, #427040);
  transform: translate(-50%, -50%) scale(1.05);
  box-shadow:
    0 12px 35px rgba(66, 185, 131, 0.6),
    0 6px 12px rgba(0, 0, 0, 0.25);
}

.btn-start:active {
  transform: translate(-50%, -50%) scale(0.98);
}

.btn-icon {
  font-size: 1.4rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.btn-text {
  font-weight: 700;
}

/* Painel de Status */
.status-panel {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 120px;
  transition: all 0.3s ease;
}

.status-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.status-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
}

.status-info {
  display: flex;
  flex-direction: column;
}

.status-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #42b983;
  line-height: 1;
}

.status-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-weight: 500;
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
  .map-wrapper {
    margin-left: 380px;
  }
}

@media (max-width: 768px) {
  .map-wrapper {
    margin-left: 0;
    padding: 0.5rem;
  }

  .status-panel {
    top: 1rem;
    right: 1rem;
  }

  .status-card {
    padding: 0.6rem 1rem;
    min-width: 100px;
    gap: 0.5rem;
  }

  .status-value {
    font-size: 1.1rem;
  }

  .status-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .map-wrapper {
    padding: 0.25rem;
  }

  .btn-start {
    padding: 14px 20px;
    font-size: 1rem;
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }

  .status-panel {
    flex-direction: row;
    top: 1rem;
    right: 50%;
    transform: translateX(50%);
    gap: 0.5rem;
  }

  .status-card {
    min-width: 80px;
    padding: 0.5rem 0.8rem;
  }

  .status-value {
    font-size: 1rem;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>