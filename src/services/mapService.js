// src/services/MapService.js

import * as d3 from 'd3';
import { feature } from 'topojson-client';

export class MapService {
    // Propriedades da classe
    svgElement;
    countryData;
    svg;
    projection;
    path;
    countries = [];
    originalScale = 1;
    originalTranslate = [0, 0];
    isTransitioning = false;

    constructor(svgElement, countryData) {
        this.svgElement = svgElement;
        this.countryData = countryData;
        // Seleciona o elemento SVG real passado do componente Vue
        this.svg = d3.select(this.svgElement);
    }

    // Retorna os países carregados
    getCountries() {
        return this.countries;
    }

    // Método de inicialização (antigo initMap)
    async init() {
        try {
            const topoUrl = 'https://unpkg.com/world-atlas@2/countries-110m.json';
            const res = await fetch(topoUrl);
            const topo = await res.json();
            const topoObject = topo.objects.countries;
            const featureCollection = feature(topo, topoObject);

            this.countries = featureCollection.features
                .filter(d => d.properties.name !== 'Antarctica')
                .map(country => {
                    const countryInfo = this.countryData[country.properties.name] || {
                        pt: country.properties.name,
                        capital: null
                    };
                    return {
                        ...country,
                        namePt: countryInfo.pt,
                        capital: countryInfo.capital,
                        hasData: !!this.countryData[country.properties.name]
                    };
                });
            this.drawMap();
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    // Desenha o mapa (antigo drawMap)
    drawMap() {
        // Usa o container SVG para obter o tamanho
        const container = this.svgElement.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Define margens para centralização
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Guarda para uso em highlight/reset
        this.margin = margin;
        this.innerWidth = innerWidth;
        this.innerHeight = innerHeight;

        this.svg
            .attr('width', width)
            .attr('height', height)
            .style('background', 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)');

        // Remove elementos existentes
        this.svg.selectAll('*').remove();

        // Cria um grupo para centralizar o mapa
        const g = this.svg.append('g')
            .attr('class', 'map-group')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        this.mapGroup = g;

        this.projection = d3.geoMercator()
            .scale(1)
            .translate([0, 0]);

        this.path = d3.geoPath().projection(this.projection);

        // Ajusta a projeção para caber no container
        this.projection.fitSize(
            [innerWidth * 0.92, innerHeight * 0.92],
            {
                type: 'FeatureCollection',
                features: this.countries
            }
        );

        // Salva a escala e tradução originais
        this.originalScale = this.projection.scale();
        this.originalTranslate = this.projection.translate();

        // Guarda o transform original do grupo
        this.currentTransform = {
            k: 1,
            x: margin.left,
            y: margin.top
        };

        // Desenha os países com estilos modernos
        g.selectAll('.country')
            .data(this.countries)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', this.path)
            .attr('id', d => `country-${d.id}`)
            .style('fill', d => d.hasData ? '#4a7c47' : '#2d3748')
            .style('stroke', '#1a1a2e')
            .style('stroke-width', '0.3px')
            .style('vector-effect', 'non-scaling-stroke')
            .style('transition', 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
            .style('cursor', 'pointer');
    }

    async highlightCountry(country) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Seleciona o elemento do país
        const countryElement = this.mapGroup.select(`#country-${country.id}`);
        if (countryElement.empty()) {
            this.isTransitioning = false;
            return;
        }

        // Reseta todos os países para a cor padrão antes de destacar
        this.mapGroup.selectAll('.country')
            .transition()
            .duration(400)
            .style('fill', d => d.hasData ? '#4a7c47' : '#2d3748')
            .style('stroke', '#1a1a2e')
            .style('stroke-width', '0.3px')
            .style('filter', null);

        // Move o país selecionado para o topo
        const node = countryElement.node();
        node.parentNode.appendChild(node);

        // Anima o destaque com efeitos modernos
        await countryElement
            .transition()
            .duration(600)
            .style('fill', '#42b983')
            .style('stroke', '#ffffff')
            .style('stroke-width', '1.2px')
            .style('filter', 'drop-shadow(0 0 15px rgba(66, 185, 131, 0.6))')
            .end();

        this.isTransitioning = false;
    }

    // Reseta o mapa
    async resetMap() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const targetX = this.margin.left;
        const targetY = this.margin.top;
        const targetK = 1;

        await this.mapGroup
            .transition()
            .duration(800)
            .attrTween('transform', () => {
                const ix = d3.interpolateNumber(this.currentTransform.x, targetX);
                const iy = d3.interpolateNumber(this.currentTransform.y, targetY);
                const ik = d3.interpolateNumber(this.currentTransform.k, targetK);
                return t => `translate(${ix(t)},${iy(t)}) scale(${ik(t)})`;
            })
            .end();

        // Restaura estilos dos países para o tema moderno
        this.mapGroup.selectAll('.country')
            .style('fill', d => d.hasData ? '#4a7c47' : '#2d3748')
            .style('stroke', '#1a1a2e')
            .style('stroke-width', '0.3px')
            .style('filter', null);

        // Atualiza estado interno
        this.currentTransform = { k: 1, x: targetX, y: targetY };

        this.isTransitioning = false;
    }

    // Adicione um método para forçar redimensionamento
    forceResize() {
        this.drawMap();
    }
}