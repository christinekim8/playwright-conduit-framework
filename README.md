# 🎭 Playwright Automation Framework: Conduit Project

<div align="left">
  <a href="https://github.com/christinekim8/playwright-conduit-framework/actions/workflows/playwright.yml">
    <img src="https://github.com/christinekim8/playwright-conduit-framework/actions/workflows/playwright.yml/badge.svg" height="20">
  </a>
  <a href="https://christinekim8.github.io/playwright-conduit-framework/">
    <img src="https://img.shields.io/badge/Allure%20Report-Live-green?logo=allure" height="20">
  </a>
</div>

## 👤 QA Lead's Strategic Overview
As a QA Lead with 9 years of experience, I engineered this framework to demonstrate a professional-grade automation ecosystem. In an environment without formal PRDs, I utilized **Exploratory Testing** to reverse-engineer business logic and established a **Shift-Left** quality process. 

This project goes beyond simple scripting; it showcases a **strategic quality roadmap** from test scenario design to high-performance CI/CD orchestration.

---

## 📈 Quality Management Workflow

### 1. Test Analysis & Planning (Reverse Engineering)
Before automation, I analyzed the application to derive detailed test scenarios. Since no formal documentation existed, I created a comprehensive matrix based on exploratory sessions.
* 📊 **[View Google Sheets: Test Scenario Matrix]**(https://docs.google.com/spreadsheets/d/1ZkSBPep7vtqimvpTUn90P5xdxXk1J76SkOOm3wOl5M8/edit?usp=sharing)
    * *Includes: Module-based scenarios, Acceptance Criteria, and Automation Priority.*

### 2. Project Orchestration (Kanban)
Managed the entire development lifecycle using a structured Kanban board to track tasks, priorities, and sprint progress.
* 📋 **[View Notion: Project Kanban Board]**(https://minkyung-christine.notion.site/Playwright-Automation-Project-2fa921a38d4b8082b39fd90228cdfe35?source=copy_link)

---

## 🏗️ Technical Architecture & Key Features

### 🚀 Engineering Excellence
* **Hybrid Testing Strategy (API + UI):** Implemented high-speed data seeding via API to bypass redundant UI flows, optimizing execution time while maintaining 100% reliability.
* **Page Object Model (POM):** Architected a scalable and maintainable POM structure to minimize maintenance overhead.
* **Data Factory & Management:** Utilized dynamic data generation with `@faker-js` to ensure zero data collisions during parallel execution.
* **Infrastructure & CI/CD:** Integrated **GitHub Actions** for automated regression on every push, with real-time **Allure Reporting** hosted on GitHub Pages.
* **Resilience & Stability:** Advanced error handling, network mocking for edge-case validation, and race-condition mitigation.

---

## 📈 Quality Management Workflow

### 1. Test Analysis & Planning (Reverse Engineering)
Before automation, I analyzed the application to derive detailed test scenarios. Since no formal documentation existed, I created a comprehensive matrix based on exploratory sessions.
* 📊 **[View Google Sheets: Test Scenario Matrix]**(https://docs.google.com/spreadsheets/d/1ZkSBPep7vtqimvpTUn90P5xdxXk1J76SkOOm3wOl5M8/edit?usp=sharing)
    * *Includes: Module-based scenarios, Acceptance Criteria, and Automation Priority.*

### 2. Project Orchestration (Kanban)
Managed the entire development lifecycle using a structured Kanban board to track tasks, priorities, and sprint progress.
* 📋 **[View Notion: Project Kanban Board]**(https://minkyung-christine.notion.site/Playwright-Automation-Project-2fa921a38d4b8082b39fd90228cdfe35?source=copy_link)

---

## 📂 Project Structure
```text
.
├── .github/workflows/     # CI/CD Orchestration (GitHub Actions)
├── src/
│   ├── fixtures/          # Custom fixtures for POM injection (pom.ts)
│   ├── helpers/           # API Helpers for Hybrid Seeding (ApiHelper.ts)
│   ├── pages/             # Page Object Models (POM)
│   ├── types/             # TypeScript Interface definitions
│   └── utils/             # Global Setup & Utilities (global-setup.ts)
├── tests/                 # Feature-based Automated Test Suites
├── allure-results/        # Raw execution data for Allure
├── playwright.config.ts   # Global Framework & Environment Config
├── tsconfig.json          # TypeScript Configuration
└── package.json           # Project Dependencies & Custom Scripts
```
---

## 🏁 Getting Started

To get a local copy up and running, follow these steps:

### 1. Installation
#### Install NPM packages
npm install

#### Install Playwright Browsers
npx playwright install

### 2. Running Tests
#### Run all tests (Headless mode)
npx playwright test

### 3. Generating & Viewing Reports
#### Generate and open the Allure report locally
npx allure serve allure-results

---

## ✍️ Contact & Author
### Minkyung (Christine) Kim - QA Lead / Senior Quality Engineer
#### LinkedIn: https://www.linkedin.com/in/testninja/
#### GitHub: https://github.com/christinekim8
