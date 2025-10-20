<template>
    <div class="home-container">
        <!-- Background com efeitos -->
        <div class="background-effects">
            <div class="gradient-bg"></div>
            <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
            </div>
        </div>

        <div class="content">
            <!-- Header Principal -->
            <div class="header-section">
                <h1 class="main-title">🌍 GeoQuiz Master</h1>
                <p class="subtitle">Teste seus conhecimentos geográficos</p>
            </div>

            <!-- Cards de Estatísticas -->
            <div class="stats-section">
                <div class="stat-card">
                    <div class="stat-number">5</div>
                    <div class="stat-label">Continentes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">195</div>
                    <div class="stat-label">Países</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">195</div>
                    <div class="stat-label">Capitais</div>
                </div>
            </div>

            <!-- Botões de Ação -->
            <div class="action-section">
                <button @click="startGame" class="btn-primary">
                    <span class="btn-icon">🎮</span>
                    Começar Jogo
                </button>

                <button @click="showHowToPlay = true" class="btn-secondary">
                    <span class="btn-icon">❓</span>
                    Como Jogar
                </button>

                <button @click="showAbout = true" class="btn-about">
                    <span class="btn-icon">ℹ️</span>
                    Sobre
                </button>
            </div>
        </div>

        <!-- Modal Como Jogar -->
        <div v-if="showHowToPlay" class="modal-overlay" @click="showHowToPlay = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>Como Jogar</h2>
                    <button class="close-button" @click="showHowToPlay = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="instruction-step">
                        <span class="step-number">1</span>
                        <div class="step-content">
                            <h3>Escolha um Continente</h3>
                            <p>Selecione o continente que deseja desafiar seus conhecimentos</p>
                        </div>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">2</span>
                        <div class="step-content">
                            <h3>Responda as Perguntas</h3>
                            <p>Digite o nome da capital do país destacado no mapa</p>
                        </div>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            <h3>Ganhe Pontos</h3>
                            <p>Acertou? +10 pontos! Errou? Aprenda a capital correta</p>
                        </div>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">4</span>
                        <div class="step-content">
                            <h3>Complete os Continentes</h3>
                            <p>Teste seus conhecimentos em todos os continentes disponíveis</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-close-btn" @click="showHowToPlay = false">Entendi!</button>
                </div>
            </div>
        </div>

        <!-- Modal Sobre -->
        <div v-if="showAbout" class="modal-overlay" @click="showAbout = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>Sobre o GeoQuiz Master</h2>
                    <button class="close-button" @click="showAbout = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="about-section">
                        <h3>🎯 O que é o GeoQuiz Master?</h3>
                        <p>GeoQuiz Master é um jogo educativo desenvolvido para testar e melhorar seus conhecimentos
                            sobre geografia mundial, especificamente sobre as capitais dos países.</p>
                    </div>

                    <div class="about-section">
                        <h3>🌍 Objetivo</h3>
                        <p>Ajudar jogadores de todas as idades a aprenderem as capitais dos países de forma divertida e
                            interativa, através de um sistema de perguntas e respostas com mapa mundial.</p>
                    </div>

                    <div class="about-section">
                        <h3>👨‍💻 Desenvolvimento</h3>
                        <p>Este projeto foi desenvolvido com:</p>
                        <ul class="tech-list">
                            <li>⚡ Vue.js 3</li>
                            <li>🎨 D3.js para visualização de mapas</li>
                            <li>💫 CSS3 com animações modernas</li>
                            <li>📱 Design responsivo</li>
                        </ul>
                    </div>

                    <div class="about-section">
                        <h3>📊 Dados</h3>
                        <p>Informações sobre países e capitais baseadas em dados geográficos atualizados e confiáveis.
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-close-btn" @click="showAbout = false">Fechar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['startGame']);

const showHowToPlay = ref(false);
const showAbout = ref(false);

const startGame = () => {
    emit('startGame');
};
</script>

<style scoped>
.home-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
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

.gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(circle at 20% 80%, rgba(74, 124, 71, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(155, 89, 182, 0.05) 0%, transparent 50%);
}

.floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(66, 185, 131, 0.1), rgba(52, 152, 219, 0.1));
    animation: float 6s ease-in-out infinite;
}

.shape-1 {
    width: 200px;
    height: 200px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
}

.shape-2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 10%;
    animation-delay: 2s;
}

.shape-3 {
    width: 100px;
    height: 100px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

/* Conteúdo Principal */
.content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
    max-width: 800px;
    width: 90%;
}

/* Header Section */
.header-section {
    margin-bottom: 3rem;
}

.main-title {
    font-size: 4rem;
    font-weight: 800;
    background: linear-gradient(135deg, #42b983, #4a7c47, #3498db);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem 0;
    text-shadow: 0 0 30px rgba(66, 185, 131, 0.3);
}

.subtitle {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-weight: 300;
}

/* Stats Section */
.stats-section {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 3rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem 2.5rem;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.stat-card {
    text-align: center;
    flex: 1;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: #42b983;
    line-height: 1;
}

.stat-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-top: 0.5rem;
    font-weight: 500;
}

/* Action Section */
.action-section {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-about {
    padding: 15px 30px;
    border: none;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
    justify-content: center;
}

.btn-primary {
    background: linear-gradient(135deg, #42b983, #4a7c47);
    color: white;
    box-shadow: 0 5px 15px rgba(66, 185, 131, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(66, 185, 131, 0.4);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.btn-about {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 2px solid rgba(52, 152, 219, 0.5);
    backdrop-filter: blur(10px);
}

.btn-about:hover {
    background: rgba(52, 152, 219, 0.2);
    transform: translateY(-2px);
    border-color: rgba(52, 152, 219, 0.7);
}

.btn-icon {
    font-size: 1.3rem;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
    margin: 0;
    color: white;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #42b983, #3498db);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.close-button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
}

.close-button:hover {
    color: white;
}

.modal-body {
    padding: 2rem;
}

.instruction-step {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
}

.step-number {
    background: linear-gradient(135deg, #42b983, #3498db);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
    font-size: 0.9rem;
}

.step-content h3 {
    margin: 0 0 0.5rem 0;
    color: white;
    font-size: 1.1rem;
}

.step-content p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
}

.about-section {
    margin-bottom: 1.5rem;
}

.about-section h3 {
    color: white;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.about-section p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin-bottom: 0.5rem;
}

.tech-list {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
}

.tech-list li {
    padding: 0.25rem 0;
    color: rgba(255, 255, 255, 0.7);
}

.modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.modal-close-btn {
    padding: 12px 32px;
    background: linear-gradient(135deg, #42b983, #3498db);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.modal-close-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(66, 185, 131, 0.4);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsividade */
@media (max-width: 768px) {
    .content {
        padding: 1rem;
    }

    .main-title {
        font-size: 2.5rem;
    }

    .subtitle {
        font-size: 1.2rem;
    }

    .stats-section {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    .action-section {
        flex-direction: column;
        align-items: center;
    }

    .btn-primary,
    .btn-secondary,
    .btn-about {
        width: 100%;
        max-width: 300px;
    }

    .modal-content {
        width: 95%;
        margin: 1rem;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 1rem 1.5rem;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 2rem;
    }

    .stats-section {
        padding: 1rem 0.5rem;
    }

    .stat-number {
        font-size: 2rem;
    }
}
</style>