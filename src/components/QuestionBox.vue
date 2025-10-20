<template>
  <div class="question-box">
    <div class="question-header">
      <div class="globe-icon">🌍</div>
      <h2>Qual a capital de <span class="country-name">{{ countryName }}</span>?</h2>
    </div>

    <div class="input-group">
      <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @keyup.enter="submit"
        placeholder="Digite a capital aqui..." class="answer-input" ref="answerInput">
      <button @click="submit" class="btn-answer">
        <span class="btn-text">Responder</span>
        <span class="btn-icon">🚀</span>
      </button>

      <button @click="$emit('skip')" class="btn-skip">
        <span class="btn-text">Pular</span>
        <span class="btn-icon">⏭️</span>
      </button>

    </div>


    <div v-if="feedback" :class="['feedback', isCorrect ? 'correct' : 'wrong']">
      <div class="feedback-icon">
        {{ isCorrect ? '✅' : '❌' }}
      </div>
      <div class="feedback-text">
        {{ feedback }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionBox',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    countryName: {
      type: String,
      required: true
    },
    feedback: String,
    isCorrect: Boolean
  },
  emits: ['update:modelValue', 'submit', 'skip'],
  methods: {
    submit() {
      this.$emit('submit');
    },
    focusInput() {
      this.$refs.answerInput.focus();
    }
  },
  mounted() {
    this.focusInput();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.question-box {
  position: absolute;
  top: 50%;
  left: 2rem;
  transform: translateY(-50%);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  color: #1a1a2e;
  padding: 24px 28px;
  border-radius: 20px;
  text-align: center;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  z-index: 1000;
  animation: slideInLeft 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 380px;
  max-width: 90vw;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.btn-skip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #888, #555);
  color: white;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.btn-skip:hover {
  background: linear-gradient(135deg, #777, #444);
  transform: translateY(-2px);
}

.btn-skip:active {
  transform: translateY(0);
}

.question-header {
  margin-bottom: 20px;
}

.globe-icon {
  font-size: 2.2rem;
  margin-bottom: 10px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.question-box h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.4;
}

.country-name {
  background: linear-gradient(135deg, #42b983, #4a7c47);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(66, 185, 131, 0.2);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.answer-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

.answer-input:focus {
  border-color: #42b983;
  background: #ffffff;
  box-shadow:
    0 0 0 3px rgba(66, 185, 131, 0.15),
    0 4px 12px rgba(66, 185, 131, 0.2);
  transform: translateY(-2px);
}

.answer-input::placeholder {
  color: #a0a0a0;
  font-weight: 400;
}

.btn-answer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #42b983, #4a7c47);
  color: white;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow:
    0 6px 20px rgba(66, 185, 131, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.btn-answer:hover {
  background: linear-gradient(135deg, #3aa876, #427040);
  transform: translateY(-3px);
  box-shadow:
    0 10px 25px rgba(66, 185, 131, 0.5),
    0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-answer:active {
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(66, 185, 131, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-text {
  font-weight: 700;
}

.btn-icon {
  font-size: 1.1em;
}

.feedback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  animation: fadeIn 0.4s ease-out;
  backdrop-filter: blur(10px);
}

.feedback.correct {
  color: #2e7d32;
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(76, 175, 80, 0.05));
  border: 1px solid rgba(46, 125, 50, 0.2);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
}

.feedback.wrong {
  color: #c62828;
  background: linear-gradient(135deg, rgba(198, 40, 40, 0.1), rgba(229, 57, 53, 0.05));
  border: 1px solid rgba(198, 40, 40, 0.2);
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.15);
}

.feedback-icon {
  font-size: 1.2rem;
}

.feedback-text {
  font-weight: 600;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-40px);
  }

  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efeito de brilho sutil no hover */
.question-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent);
  border-radius: 20px 20px 0 0;
}

/* Responsividade */
@media (max-width: 1024px) {
  .question-box {
    left: 1rem;
    width: 350px;
    padding: 20px 24px;
  }

  .question-box h2 {
    font-size: 1.2rem;
  }

  .globe-icon {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .question-box {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    width: 95%;
    max-width: 400px;
    margin: 1rem auto;
    padding: 20px;
  }

  .question-box h2 {
    font-size: 1.1rem;
  }

  .globe-icon {
    font-size: 1.8rem;
  }

  .input-group {
    gap: 10px;
  }

  .answer-input {
    padding: 12px 14px;
    font-size: 15px;
  }

  .btn-answer {
    padding: 12px 18px;
    font-size: 15px;
  }

  .feedback {
    padding: 12px 14px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .question-box {
    padding: 18px 16px;
    margin: 0.5rem auto;
  }

  .question-box h2 {
    font-size: 1rem;
  }

  .answer-input {
    padding: 10px 12px;
    font-size: 14px;
  }

  .btn-answer {
    padding: 10px 16px;
    font-size: 14px;
  }

  .feedback {
    padding: 10px 12px;
    font-size: 0.9rem;
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }
}
</style>