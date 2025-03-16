# Baikal Wildlife AR Guide: Chat with a Virtual Zoologist 

**Explore Baikal's Wildlife** through an augmented reality experience combined with an AI-powered virtual zoologist. This project, developed for the National Technology Olympiad (NTO) finals, blends AR storytelling and natural language processing to educate users about Lake Baikal's unique ecosystem.

## Key Features 🔍
- **AR Zoologist Avatar**: Meet a virtual Baikal scientist who guides you through the fauna. 
- **Marker-Based AR**:
  - Point your camera at physical markers/objects to activate animal holograms.
  - If marker is lost, the zoologist remains visible for continued interaction.
- **Chat with the Zoologist**: 
  - Ask questions about Baikal's wildlife in natural language (e.g., "What do Baikal seals eat?").
  - AI responses powered by Langflow's NLP pipeline.
- **3D Animal Models**: Interactive holograms of endemic species with behavioral animations.

## Tech Stack 🛠️
- **AR Core**: Pure JavaScript + [AR.js](https://ar-js-org.github.io/AR.js-Docs/) 
- **AI Chat**: Langflow custom pipeline (Python backend API)
- **3D Models**: Three.js for WebGL rendering
- **UI**: Vanilla JS + Canvas animations
- **Hosting**: Firebase (Static Web Hosting + Cloud Functions)
