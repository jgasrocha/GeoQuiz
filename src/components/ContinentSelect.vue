<template>
    <div class="continent-select">
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
            <!-- Header -->
            <div class="header-section">
                <h1 class="main-title">
                    <span class="globe-icon">🌍</span>
                    <span class="title-text">Escolha Seu Continente</span>
                </h1>
                <p class="subtitle">Embarque em uma jornada geográfica épica</p>
            </div>

            <!-- Stats -->
            <div class="stats-section">
                <div class="stat">
                    <div class="stat-number">{{ totalCountries }}</div>
                    <div class="stat-label">Países</div>
                </div>
                <div class="stat">
                    <div class="stat-number">5</div>
                    <div class="stat-label">Continentes</div>
                </div>
            </div>

            <!-- Grid de Continentes -->
            <div class="continents-grid">
                <div v-for="c in continents" :key="c.name" class="continent-card" @click="selectContinent(c.name)">
                    <div class="card-content">
                        <div class="continent-icon">{{ c.icon }}</div>
                        <h3 class="continent-name">{{ c.label }}</h3>
                        <p class="continent-description">{{ getContinentDescription(c.name) }}</p>
                        <div class="card-footer">
                            <div class="country-count">{{ c.countryCount }} países</div>
                            <div v-if="completedContinents.has(c.name)" class="completed-badge">
                                ✅ Completado
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p class="tip">💡 <strong>Dica:</strong> Explore cada continente e teste seus conhecimentos sobre
                    capitais!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getCountriesByContinent } from '../data/countriesDetails.js';

const props = defineProps({
    completedContinents: {
        type: Set,
        default: () => new Set()
    }
});

const emit = defineEmits(["continentSelected"]);

// Lógica para contar países
const countryCounts = getCountriesByContinent();

const continents = ref([
    { name: "africa", label: "África", icon: "🦁", countryCount: countryCounts.africa.length },
    { name: "europe", label: "Europa", icon: "🏰", countryCount: countryCounts.europe.length },
    { name: "asia", label: "Ásia", icon: "🐉", countryCount: countryCounts.asia.length },
    { name: "americas", label: "Américas", icon: "🌎", countryCount: countryCounts.americas.length },
    { name: "oceania", label: "Oceania", icon: "🐨", countryCount: countryCounts.oceania.length }
]);

// Computed
const totalCountries = computed(() => {
    return Object.values(countryCounts).reduce((total, countries) => total + countries.length, 0);
});

// Métodos
const getContinentDescription = (continent) => {
    const descriptions = {
        africa: "Terra de savanas e diversidade cultural",
        europe: "Berço da civilização ocidental",
        asia: "O maior e mais populoso continente",
        americas: "Do Ártico à Patagônia",
        oceania: "Paraíso insular no Pacífico"
    };
    return descriptions[continent] || "Desafie seus conhecimentos";
};

const selectContinent = (continent) => {
    emit("continentSelected", continent);
};
</script>

<style scoped>
/* Adicione este CSS ao final do seu arquivo existente */
.completed-badge {
    background: linear-gradient(135deg, #42b983, #4a7c47);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    margin-top: 0.5rem;
}

.continent-select {
    position: relative;
    height: 100vh;
    /* <-- MUDANÇA: Garante que o container tenha exatamente a altura da tela */
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 0;
    display: flex;
    flex-direction: column;
    /* importante para empilhar conteúdo */
    align-items: center;
    justify-content: flex-start;
    margin-top: 0;
    overflow-y: auto;
    /* <-- MUDANÇA: Ativa o scroll vertical SÓ neste elemento */
    overflow-x: hidden;
    /* <-- Adição: Evita scroll horizontal acidental */
}

/* Efeitos de Fundo */
.background-effects {
    position: fixed;
    /* Mudado de absolute para fixed */
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
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;
    /* Adicionado padding vertical */
}

/* Header Section */
.header-section {
    text-align: center;
    margin-bottom: 3rem;
}

.main-title {
    font-size: 3rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.globe-icon {
    font-size: 3rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.title-text {
    background: linear-gradient(135deg, #42b983, #4a7c47);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(66, 185, 131, 0.3);
}

.subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
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
    padding: 1.5rem 2rem;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.stat {
    text-align: center;
}

.stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #42b983;
    line-height: 1;
}

.stat-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

/* Grid de Continentes */
.continents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
    justify-items: center;
}

.continent-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    width: 100%;
    max-width: 320px;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.continent-card:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
}

.continent-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.continent-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin: 0 0 1rem 0;
}

.continent-description {
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
    font-size: 0.95rem;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: auto;
}

.country-count {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    font-weight: 500;
}

/* Footer */
.footer {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 2rem;
    /* Adicionado margem inferior para espaçamento do scroll */
}

.tip {
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    font-size: 1rem;
}

.tip strong {
    color: #42b983;
}

/* Scroll personalizado */
.continent-select::-webkit-scrollbar {
    width: 8px;
}

.continent-select::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.continent-select::-webkit-scrollbar-thumb {
    background: rgba(66, 185, 131, 0.5);
    border-radius: 4px;
}

.continent-select::-webkit-scrollbar-thumb:hover {
    background: rgba(66, 185, 131, 0.7);
}

/* Responsividade */
@media (max-width: 768px) {
    .continent-select {
        padding: 0;
        /* <-- MUDANÇA */
        min-height: 100vh;
        margin-top: 0;
    }

    .content {
        padding: 1rem;
        /* <-- ADIÇÃO */
    }

    .header-section {
        margin-bottom: 2rem;
    }

    .main-title {
        font-size: 2.5rem;
        flex-direction: column;
        gap: 0.25rem;
    }

    .globe-icon {
        font-size: 2.5rem;
    }

    .stats-section {
        flex-direction: column;
        gap: 1rem;
        max-width: 300px;
    }

    .continents-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
    }

    .continent-card {
        padding: 1.5rem;
        min-height: 250px;
        max-width: 300px;
    }

    .continent-name {
        font-size: 1.3rem;
    }

    .continent-icon {
        font-size: 3rem;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 2rem;
    }

    .globe-icon {
        font-size: 2rem;
    }

    .continent-icon {
        font-size: 2.5rem;
    }

    .footer {
        padding: 1.5rem;
    }

    .continents-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .continent-card {
        max-width: 100%;
        min-height: 220px;
    }
}

/* Para telas muito grandes */
@media (min-width: 1400px) {
    .continents-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>