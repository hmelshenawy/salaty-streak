# Salaty Streak - Product Requirements Document (PRD)

## 1. Product Overview

### Product Name

Salaty Streak

### Vision

Help Muslims build consistency in prayer through tracking, streaks, points, statistics, and habit-building techniques.

### Problem Statement

Many people want to maintain their daily prayers but struggle with consistency. Existing prayer apps focus mainly on prayer times, while Salaty Streak focuses on accountability, progress tracking, and motivation.

### Target Users

* Muslims seeking consistency in prayer
* Habit builders
* Students
* Professionals with busy schedules
* Users who enjoy KPI dashboards and progress tracking

---

# 2. Goals

## Business Goals

* Create a simple prayer habit tracker
* Build a highly engaging streak system
* Encourage long-term consistency

## User Goals

* Track daily prayers
* Maintain prayer streaks
* Earn points and achievements
* Monitor improvement over time

---

# 3. MVP Scope

## Included

### User Management

* Register account
* Login
* Logout
* Profile management

### Prayer Tracking

Users can log:

* Fajr
* Dhuhr
* Asr
* Maghrib
* Isha

For each prayer:

* On Time
* Late
* Missed

Additional options:

* Prayed in Mosque
* Prayer timestamp

---

### Daily Scoring

#### Points Rules

| Action             | Points |
| ------------------ | ------ |
| Prayer On Time     | 5      |
| Prayer Late        | 1      |
| Prayer Missed      | -10    |
| Prayed in Mosque   | +21    |
| Fajr On Time Bonus | +15    |

---

### Daily Summary

System calculates:

* Total Points
* Completed Prayers
* Missed Prayers
* Completion Percentage

Example:

* Completed: 5/5
* Points: 12
* Completion: 100%

---

### Streak System

A streak day is achieved when:

* All 5 prayers completed



Metrics:

* Current Streak
* Best Streak

---

### Dashboard

Display:

#### Today's Progress

* Fajr
* Dhuhr
* Asr
* Maghrib
* Isha

#### KPIs

* Current Streak
* Best Streak
* Monthly Points
* Completion Rate

---

# 4. Future Features

## Achievements

Examples:

* First Prayer Logged
* First Perfect Day
* 7 Day Streak
* 30 Day Streak
* 100 Fajr Prayers
* Perfect Month

---

## Prayer Times Integration

Automatically fetch:

* Fajr
* Dhuhr
* Asr
* Maghrib
* Isha

based on user location.

---

## Notifications

Examples:

* Asr in 15 minutes
* You have a 10-day streak
* Don't break your streak today

---

## AI Coach

Examples:

"You are highly consistent with Fajr."

"Your weakest prayer this month is Asr."

"Your prayer completion improved by 12% this month."

---

# 5. Functional Requirements

## FR-01 Register

User can create an account.

### Inputs

* Name
* Email
* Password
* Gender
* Timezone

---

## FR-02 Login

User can authenticate using:

* Email
* Password

---

## FR-03 Log Prayer

User can record a prayer.

### Inputs

* Prayer Name
* Status
* In Mosque
* Prayer Time

### Rules

Only one record per:

(User + Date + Prayer)

---

## FR-04 Daily Summary

System automatically calculates:

* Total Points
* Completed Prayers
* Missed Prayers
* Completion Percentage

---

## FR-05 Streak Calculation

System calculates:

* Current Streak
* Best Streak

Daily after Isha or when dashboard loads.

---

# 6. Database Design

## User

| Field     | Type     |
| --------- | -------- |
| id        | UUID     |
| name      | String   |
| email     | String   |
| password  | String   |
| gender    | Enum     |
| timezone  | String   |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## PrayerLog

| Field      | Type     |
| ---------- | -------- |
| id         | UUID     |
| userId     | UUID     |
| prayerName | Enum     |
| date       | Date     |
| status     | Enum     |
| prayedAt   | DateTime |
| inMosque   | Boolean  |
| points     | Integer  |
| createdAt  | DateTime |
| updatedAt  | DateTime |

Unique Constraint:

(UserId + Date + PrayerName)

---

## DailySummary

| Field            | Type     |
| ---------------- | -------- |
| id               | UUID     |
| userId           | UUID     |
| date             | Date     |
| totalPoints      | Integer  |
| completedPrayers | Integer  |
| missedPrayers    | Integer  |
| isStreakDay      | Boolean  |
| createdAt        | DateTime |
| updatedAt        | DateTime |

Unique Constraint:

(UserId + Date)

---

# 7. API Endpoints

## Auth

POST /auth/register

POST /auth/login

GET /auth/profile

---

## Prayers

POST /prayers

GET /prayers/today

GET /prayers/history

PUT /prayers/:id

DELETE /prayers/:id

---

## Dashboard

GET /dashboard

Response:

* Current Streak
* Best Streak
* Total Points
* Completion Rate

---

# 8. Technical Stack

## Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication

## Frontend

* Next.js
* TypeScript
* TailwindCSS
* shadcn/ui

## Hosting

* Vercel (Frontend)
* VPS / Railway / Render (Backend)
* Prisma Postgres

---

# 9. Success Metrics

### User Metrics

* Daily Prayer Completion %
* Average Monthly Streak
* Best Streak
* Monthly Active Users

### Product Metrics

* User Retention
* Streak Retention
* Daily Active Users
* Average Daily Prayers Logged

---

# Version

Version: 1.0 MVP

Author: Haitham Elshenawy

Date: June 2026
