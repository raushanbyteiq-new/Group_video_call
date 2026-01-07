# AI Video Chat with Real-Time Translation

A modern, real-time video conferencing application featuring AI-powered translation capabilities, enabling seamless communication across language barriers. Built with LiveKit for WebRTC functionality and Chrome AI APIs for instant translation.

## 🌟 Features

- **Real-Time Video Conferencing**: High-quality video and audio communication using WebRTC
- **AI-Powered Translation**: Instant translation between English and Japanese using Chrome AI APIs
- **Speech-to-Text**: Real-time transcription using Deepgram's Nova-3 model
- **Live Captions**: Translated captions displayed in real-time during conversations
- **Smart Layouts**: Adaptive video grid layouts for optimal viewing
- **Room-Based Meetings**: Create or join meeting rooms with custom names
- **Cross-Platform**: Works on modern browsers with Chrome AI API support

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **LiveKit Server SDK** - WebRTC server for real-time communication
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **LiveKit Components** - Pre-built video conferencing UI components
- **Deepgram API** - Speech-to-text transcription
- **Chrome AI APIs** - Translation
- **Lucide React** - Icon library

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **LiveKit Cloud Account** - For WebRTC infrastructure
- **Chrome Browser** with AI APIs enabled (chrome://flags/#enable-experimental-web-platform-features)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GroupMeeting
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```env
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
```

Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:3000`.

### 3. Frontend Setup

Navigate to the Group_meeting directory:
```bash
cd ../Group_meeting
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🔧 Configuration

### LiveKit Setup
1. Create a LiveKit Cloud account at [livekit.io](https://livekit.io)
2. Get your API key and secret from the dashboard
3. Add them to the backend `.env` file

### Chrome AI APIs
To enable translation features:
1. Open Chrome and navigate to `chrome://flags/`

2. Enable the following flags:
   - `#Enable optimization guide debug logs`
   - `#translation-api`
   - `#Translation API streaming split by sentence`
   - `#Enables optimization guide on device`
   - `#Experimental Web Platform features`
   - `#Experimental WebAssembly`


3. Open Chrome and navigate to `chrome://components/`
   Check for Update :
    - `Optimization Hints `
    - `Chrome TranslateKit`
    - `Chrome TranslateKit en-ja`

4. Open Chrome and navigate to `chrome://on-device-translation-internals/`
   - check for `Language Package` Installed or not

5. Restart Chrome

## 📖 Usage

### Joining a Meeting
1. Open the application in your browser
2. Enter your name and a room name
3. Click "Join Meeting" to enter the video conference

### Using Translation Features
1. Select your language (source language for speech-to-text)
2. Choose the target language for translation
3. Click the translation initialization button
4. Enable speech-to-text to start real-time transcription and translation
5. Translated captions will appear automatically when others speak

### Controls
- **Microphone**: Toggle audio input
- **Camera**: Toggle video input
- **Screen Share**: Share your screen
- **Leave**: Exit the meeting

## 🏗️ Architecture

### Backend Architecture
The backend provides authentication and token generation for LiveKit rooms:
- `POST /getToken`: Generates access tokens with appropriate permissions for room access

### Frontend Architecture
The frontend is structured as follows:
- `src/App.tsx`: Main application component with LiveKit room management
- `src/components/`: Reusable UI components (Stage, Captions, TranslationControls)
- `src/hooks/`: Custom hooks for speech-to-text and translation functionality
- `src/pages/`: Page components (JoinScreen)

### Data Flow
1. User joins via JoinScreen → Token fetched from backend
2. LiveKit room initialized with token
3. Speech-to-text captures audio → Publishes text data to room
4. Other participants receive data → Translate using Chrome AI → Display captions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [LiveKit](https://livekit.io) for WebRTC infrastructure
- [Deepgram](https://deepgram.com) for speech-to-text transcription
- [Chrome AI APIs](https://developer.chrome.com/docs/ai/) for translation capabilities
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React](https://reactjs.org) for the UI framework

## 📞 Support

For questions or issues, please open an issue on the GitHub repository.

---

**Note**: This application requires Chrome with experimental AI features enabled for full functionality. Translation features may not work in other browsers at this time.
