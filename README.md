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
As a **QA Lead with 9 years of experience** in leading quality initiatives and defining testing strategies, I engineered this framework to demonstrate a professional-grade automation ecosystem.

In an environment without formal PRDs, I leveraged my expertise in **Requirement Analysis** and **Exploratory Testing** to reverse-engineer business logic and establish a **Shift-Left** quality process. This project is not just a coding exercise; it is a demonstration of how a senior leader orchestrates technology, AI, and process to deliver business value.

---
## 🎯 Test Target
* **Application**: RealWorld Conduit App (Bondar Academy)
* **URL**: [https://conduit.bondaracademy.com/](https://conduit.bondaracademy.com/)
* **Description**: A production-ready social blogging platform (Medium.com clone) used to demonstrate advanced E2E automation patterns.

---

## 🏗️ Strategic Quality Leadership (9+ Years Expertise)
This framework is built upon nearly a decade of SDLC leadership, focusing on high-ROI automation and sustainable architecture.

* **Deep Requirement Analysis:** Analyzed the 'Conduit' application to identify high-risk business flows, ensuring the automation suite covers critical paths (Auth, Editor, Feed) with maximum efficiency.

* **Test Planning Mastery:** Designed a comprehensive Test Scenario Matrix that prioritizes automation based on criticality and technical complexity, rather than random coverage.

* **Architectural Governance:** Applied proven design patterns (POM, Custom Fixtures, Global Setup) refined over 9 years to ensure the code remains maintainable and scalable for large-scale enterprise environments.

---

## 🤖 Strategic AI Collaboration: Human-in-the-Loop
I utilize a **Multi-Model AI Orchestration** strategy, treating AI as a "Strategic Peer" while maintaining 100% architectural ownership.

**1. Strategic Planning & Strategy (Gemini Pro)**
* **Role:** Acting as a high-reasoning brainstorming partner for top-down design.

* **Execution:** Leveraged Gemini Pro to derive complex test scenarios and edge cases from exploratory sessions.

* **Leadership:** I manually audited and refined every AI-generated scenario to align with real-world business risks.

**2. Tactical Execution (GitHub Copilot)**
* **Role:** Real-time pair programmer for development velocity.

* **Execution:** Used Copilot to accelerate TypeScript scripting and POM implementation.

* **Leadership:** Every line of code underwent an Internal Peer Review. I personally directed all refactoring paths and refined asynchronous wait strategies to ensure 100% reliability (zero flakiness).

**3. Intentional Technical Integrity (Why not Cursor?)**
* While tools like **Cursor** offer automated full-repo indexing, I **intentionally chose not to use them** for this portfolio.

* **The Reason:** To verify that the core architecture, logic, and Playwright implementation are a direct reflection of my personal engineering skills. This framework serves as a "Verified Human-led" project, showcasing my ability to govern AI tools without losing deep technical mastery.

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
```bash
# Clone the repository and navigate to the project directory:
git clone https://github.com/christinekim8/playwright-conduit-framework.git
cd playwright-conduit-framework

# Install NPM packages
npm install

# Install Playwright Browsers
npx playwright install
```
### 2. Running Tests
```bash
# Run all tests (Headless mode)
npx playwright test
```
### 3. Generating & Viewing Reports
```bash
# Generate and open the Allure report locally
npx allure serve allure-results
```
---

## ✍️ Contact & Author
### Minkyung (Christine) Kim - QA Lead / Senior Quality Engineer
#### LinkedIn: https://www.linkedin.com/in/testninja/
#### GitHub: https://github.com/christinekim8