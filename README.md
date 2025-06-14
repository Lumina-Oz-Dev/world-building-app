# 🌍 World Building Tool

> **AI-Powered World Generation for Game Developers**  
> Built by [Lumina Oz Game Dev](https://github.com/Lumina-Oz-Dev)

![World Building Tool](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🤖 **AI-Powered Generation** - Uses Google Gemini 2.0 Flash for intelligent world creation
- 🌍 **Rich World Narratives** - Detailed histories, geography, factions, and societies
- 🎭 **Character Concepts** - Unique characters with roles and backstories
- 🎮 **Game & Book Ideas** - Creative concepts based on your world
- 🗺️ **Conceptual Maps** - Regional descriptions and landmarks
- 🎨 **Concept Art** - AI-generated visual representations
- 📄 **PDF Export** - Professional documents of your worlds
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 14 or later
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lumina-Oz-Dev/world-building-app.git
   cd world-building-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Google Gemini API key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting your API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## 🎯 Usage

1. **Enter your world idea** - Describe the concept for your world
2. **Select world type** - Choose from predefined types or create custom
3. **Generate** - Let AI create your world
4. **Export** - Download as PDF or text file

### Example World Ideas
- "A steampunk world where magic and technology coexist"
- "Post-apocalyptic floating cities above toxic clouds"
- "Medieval fantasy realm with color-based magic system"

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **AI**: Google Gemini 2.0 Flash API
- **Export**: jsPDF, html2canvas
- **Build**: Create React App

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── InputForm.jsx   # World idea input form
│   ├── WorldDisplay.jsx # Generated content display
│   ├── ErrorMessage.jsx # Error handling
│   └── ...
├── hooks/              # Custom React hooks
│   └── useGeminiApi.js # Gemini API integration
├── utils/              # Utility functions
│   └── pdfExporter.js  # PDF generation
└── App.jsx             # Main application
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for powerful AI capabilities
- React team for the fantastic framework
- Tailwind CSS for beautiful styling
- Open source community for inspiration

## 📞 Support

- 🐛 [Report Issues](https://github.com/Lumina-Oz-Dev/world-building-app/issues)
- 💬 [Discussions](https://github.com/Lumina-Oz-Dev/world-building-app/discussions)
- 📧 Contact: [Lumina Oz Game Dev](https://github.com/Lumina-Oz-Dev)

---

**Built with ❤️ by Lumina Oz Game Dev**
