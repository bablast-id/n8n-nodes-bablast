# @bablast/n8n-nodes-bablast

[![npm version](https://img.shields.io/npm/v/@bablast/n8n-nodes-bablast.svg?style=flat-square&color=00d26a)](https://www.npmjs.com/package/@bablast/n8n-nodes-bablast)
[![license](https://img.shields.io/npm/l/@bablast/n8n-nodes-bablast.svg?style=flat-square)](./LICENSE)

Official [n8n](https://n8n.io/) community node for **Bablast** — WhatsApp Messaging & Official Meta WABA Cloud API Automation.

---

## 📦 Installation

### In n8n (Recommended)

1. Open your n8n instance dashboard.
2. Go to **Settings > Community Nodes**.
3. Click **Install a community node**.
4. Enter package name: `@bablast/n8n-nodes-bablast`
5. Click **Install**.

---

## 🚀 Features & Nodes

### 1. Bablast (Action Node)
Perform operations on Bablast WhatsApp messaging API:

- **WhatsApp Device (Unofficial)**:
  - Send Text Message
  - Send Media Message (Image, PDF, Video, Audio)
  - Get Device Real-Time Connection Status
- **Official Meta WABA**:
  - Send Meta-approved WABA Template Messages
- **Contacts & Phonebook**:
  - Create Contact
  - List Contacts
  - Create Contact Group

### 2. Bablast Trigger (Trigger Node)
Automatically trigger n8n workflows when events occur on Bablast:

- **Events Supported**:
  - `incoming_message` — Trigger when a new WhatsApp message is received.
  - `message_status` — Trigger when message status changes (`delivered`, `read`, `failed`).
- **Declarative Lifecycle**: Automatically registers and unregisters Webhook URLs to Bablast when workflows are activated or deactivated in n8n.

---

## 🔑 Credentials Setup

1. In n8n, create a new Credential of type **Bablast API**.
2. Enter your **API Key** (from Bablast Dashboard > API Settings).
3. Base URL default: `https://api.bablast.id/v2/openapi` (or your custom White-Label URL).

---

## 📄 License

MIT © [Bablast](https://bablast.id)
