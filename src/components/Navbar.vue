<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-brand">
        <span class="brand-icon">🌍</span>
        GeoQuiz Master
      </div>
      <div v-if="showScore" class="navbar-score">
        <div class="score-item">
          <span class="score-icon">🏆</span>
          Pontuação: {{ score }}
        </div>
        <div class="score-item">
          <span class="score-icon">❓</span>
          Pergunta: {{ currentQuestion }}
        </div>
      </div>
      <div v-else class="navbar-placeholder"></div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      required: true
    },
    currentQuestion: {
      type: Number,
      required: true
    },
    showScore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 70px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
  height: 70px;
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #42b983, #4a7c47, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(66, 185, 131, 0.3);
}

.brand-icon {
  font-size: 2rem;
  -webkit-text-fill-color: initial;
  filter: drop-shadow(0 0 8px rgba(66, 185, 131, 0.4));
}

.navbar-score {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  animation: fadeIn 0.3s ease-in;
}

.score-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.score-icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
}

.navbar-placeholder {
  width: 120px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efeito de brilho sutil no hover */
.navbar-brand::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(66, 185, 131, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.navbar-brand:hover::after {
  opacity: 1;
}

/* Responsividade */
@media (max-width: 768px) {
  .navbar-content {
    padding: 0 1rem;
  }

  .navbar-brand {
    font-size: 1.5rem;
  }

  .brand-icon {
    font-size: 1.7rem;
  }

  .navbar-score {
    gap: 1rem;
  }

  .score-item {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .navbar-brand {
    font-size: 1.3rem;
  }

  .brand-icon {
    font-size: 1.5rem;
  }

  .navbar-score {
    flex-direction: column;
    gap: 0.5rem;
  }

  .score-item {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .navbar-placeholder {
    width: 80px;
  }
}
</style>