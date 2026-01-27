# 📊 League Tracker - Rastreador de Estatísticas de League of Legends

## ✨ Demonstração Visual

### 🎯 Tela Principal - Busca de Jogadores

<img width="1001" height="409" alt="image" src="https://github.com/user-attachments/assets/3304e131-1bc9-44cc-a740-4214de24f161" />

*A interface de busca permite encontrar qualquer jogador de League of Legends usando o formato ID#tag.*

### 📊 Análise de Partidas

<img width="1218" height="729" alt="image" src="https://github.com/user-attachments/assets/c46006e8-6411-4586-9005-ea5eaa8f7074" />

*Visualização detalhada das últimas partidas com KDA, resultado e informações do oponente.*

### 🏆 Sistema de Rank e LP

<img width="328" height="695" alt="image" src="https://github.com/user-attachments/assets/45bfbc17-b299-44fe-9516-4431a3f8009b" />

*Display completo do tier atual, pontos de liga (LP) e estatísticas da temporada 2026.*

### 🎮 Maestria de Campeões

<img width="849" height="680" alt="image" src="https://github.com/user-attachments/assets/3fa68d27-f9c8-47f4-a159-4faabd7fac95" />

*Top 10 campeões por pontos de maestria com gráficos de desempenho detalhados.*

### 🎮 Campeões Jogados recentemente

<img width="805" height="693" alt="image" src="https://github.com/user-attachments/assets/f2d2e4cb-7064-41d3-8e29-3cba526e220b" />

*Mostra os campeões que o jogador jogou recentemente.*

## 🚀 Sobre o Projeto

O **League Tracker** é uma aplicação web moderna desenvolvida para fornecer estatísticas detalhadas e em tempo real de jogadores de League of Legends. Com uma interface , oferece uma experiência intuitiva para analisar desempenho, acompanhar progresso e comparar estatísticas.

## ⚡ Funcionalidades Principais

### 🔍 **Busca Inteligente**
- Pesquisa por jogadores usando o formato oficial `Nome#Tag`
- Histórico de buscas recentes
- Suporte a múltiplos servidores regionais

### 📈 **Análise Detalhada**
- Histórico das últimas 19 partidas
- Estatísticas de KDA por campeão
- Taxa de vitória (Win Rate) em diferentes modos
- Filtros por tipo de jogo (Solo/Duo, Flex, ARAM)

### 🏅 **Sistema de Rank**
- Visualização do tier atual (Ferro até Desafiante)
- Acompanhamento de pontos de Liga (LP)
- Progresso da temporada atual
- Comparativo de vitórias/derrotas

### 🎯 **Maestria de Campeões**
- Top 10 campeões por pontos de maestria
- Nível de maestria e progresso
- Estatísticas específicas por campeão
- Gráficos de desempenho histórico

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18+** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática para melhor desenvolvimento
- **Vite** - Build tool extremamente rápida
- **CSS Modules** - Estilização componentizada
- **React Router** - Navegação entre páginas

### Backend
- **Node.js** - Runtime JavaScript server-side
- **Express** - Framework web minimalista
- **TypeScript** - Tipagem no backend
- **Riot Games API** - Dados oficiais de League of Legends

## ⚡ Como Executar o Projeto

### Pré-requisitos
- Node.js 18.0 ou superior
- npm ou yarn instalado

### Passo a Passo

#### 1. Clone o repositório
```bash
git clone https://github.com/gabrielsrpp/League-Tracker.git
cd League-Tracker

adicione uma API valida ao arquivo .env
npm run dev
nodemon src/api/server.ts
