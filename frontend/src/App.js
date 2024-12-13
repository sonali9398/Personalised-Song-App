// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css'; // Add your CSS file for styling

// const App = () => {
//   const [story, setStory] = useState('');
//   const [song, setSong] = useState('');
//   const [mood, setMood] = useState('');
//   const [language, setLanguage] = useState('');
//   const [loading, setLoading] = useState(false); // State for loading
//   const [genre, setGenre] = useState(''); // State for the selected genre
//   const [audio, setAudio] = useState(null); // State for background audio
//   const [speaking, setSpeaking] = useState(false); // State for TTS

//   const genres = {
//     Pop: '/audio/pop.mp3',
//     Rock: '/audio/rock.mp3',
//     Jazz: '/audio/jazz.mp3',
//     Classical: '/audio/classical.mp3',
//     HipHop: '/audio/hiphop.mp3'
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Set loading to true
//     try {
//       const response = await axios.post('http://127.0.0.1:5000/generate-song', { 
//         story, 
//         mood, 
//         language 
//       });
//       setSong(response.data.song);
//     } catch (error) {
//       console.error('Error generating song:', error);
//       setSong('Error generating song. Please try again.');
//     } finally {
//       setLoading(false); // Set loading to false after response
//     }
//   };

//   const handleGenreClick = (selectedGenre) => {
//     setGenre(selectedGenre);

//     // Stop any existing audio or speech
//     stopPlayback();

//     // Play background music for the selected genre
//     const bgAudio = new Audio(genres[selectedGenre]);
//     bgAudio.loop = true;
//     bgAudio.play();
//     setAudio(bgAudio);

//     // Sing the song with TTS
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(song);
//       utterance.rate = 1; // Adjust the speed
//       utterance.pitch = 1; // Adjust the pitch
//       utterance.onend = () => setSpeaking(false); // Reset speaking state after TTS ends
//       setSpeaking(true); // Set speaking state
//       window.speechSynthesis.speak(utterance);
//     } else {
//       alert('Your browser does not support text-to-speech.');
//     }
//   };

//   const stopPlayback = () => {
//     // Stop TTS
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }

//     // Stop background music
//     if (audio) {
//       audio.pause();
//       audio.currentTime = 0; // Reset playback position
//     }

//     // Reset states
//     setSpeaking(false);
//     setGenre('');
//   };

//   return (
//     <div className="app-container">
//       <h1>Code Your Own Song!</h1>

//       {/* Mood Selection Buttons */}
//       <div className="mood-selection">
//         <h3>Select your mood:</h3>
//         <div>
//           {['happy', 'sad', 'romantic', 'energetic', 'nostalgic'].map((m) => (
//             <button 
//               key={m} 
//               onClick={() => setMood(m)} 
//               disabled={!!mood} // Disable all buttons if a mood is selected
//               className={`mood-button ${mood === m ? 'selected' : ''}`} // Add selected class if this button is active
//             >
//               {m.charAt(0).toUpperCase() + m.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Language Selection Buttons */}
//       <div className="language-selection">
//         <h3>Select your language:</h3>
//         <div>
//           {['English', 'Spanish', 'French', 'Korean', 'Hindi'].map((lang) => (
//             <button 
//               key={lang} 
//               onClick={() => setLanguage(lang)} 
//               disabled={!!language} // Disable all buttons if a language is selected
//               className={`language-button ${language === lang ? 'selected' : ''}`} // Add selected class if this button is active
//             >
//               {lang}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Story Input Form */}
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={story}
//           onChange={(e) => setStory(e.target.value)}
//           placeholder="Tell us your story..."
//           rows="4"
//           cols="50"
//           className="story-input"
//         />
//         <br />
//         <button type="submit" className="mood-button" disabled={!mood || !language}>Generate Song</button>
//       </form>

//       {/* Show loader while generating */}
//       {loading && <p>Loading...</p>}

//       {/* Display Generated Song */}
//       {song && (
//         <div className="generated-song">
//           <h2>Your Generated Song:</h2>
//           <p>{song}</p>

//           {/* Genre Buttons */}
//           <div className="genre-buttons">
//             <h3>Sing Along with a Genre:</h3>
//             {Object.keys(genres).map((g) => (
//               <button 
//                 key={g} 
//                 onClick={() => handleGenreClick(g)}
//                 className={`genre-button ${genre === g ? 'selected' : ''}`}
//               >
//                 {g}
//               </button>
//             ))}
//           </div>

//           {/* Stop Button */}
//           {speaking && (
//             <div className="stop-button-container">
//               <button onClick={stopPlayback} className="stop-button">Stop</button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;



import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 
import Loader from './Loader';

const App = () => {
  const [story, setStory] = useState('');
  const [song, setSong] = useState('');
  const [mood, setMood] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState('');
  const [audio, setAudio] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const genres = {
    Pop: '/audio/pop.mp3',
    Rock: '/audio/rock.mp3',
    Jazz: '/audio/jazz.mp3',
    Classical: '/audio/classical.mp3',
    'Hip-Hop': '/audio/hiphop.mp3',
  };

  const languages = {
    English: 'en-US',
    Spanish: 'es-ES',
    French: 'fr-FR',
    Korean: 'ko-KR',
    Hindi: 'hi-IN',
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Song copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text:', err));
  };

  const downloadSong = (song) => {
    const element = document.createElement('a');
    const file = new Blob([song], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'generated_song.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate-song', {
        story,
        mood,
        language,
      });
      setSong(response.data.song);
    } catch (error) {
      setSong('Error generating song. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleGenreClick = (selectedGenre) => {
    setGenre(selectedGenre);
  
    stopPlayback();
  
    // Play background music
    const bgAudio = new Audio(genres[selectedGenre]);
    bgAudio.loop = true;
    bgAudio.volume = 0.5; // Reduce volume to allow TTS to be audible
    bgAudio.play();
    setAudio(bgAudio);
  
    // Split song into paragraphs
    const paragraphs = song.split('\n').filter((p) => p.trim() !== ''); // Filter out empty lines
  
    // Sing the song with TTS in the selected language
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeaking(true);
  
      const speakParagraph = (index) => {
        if (index >= paragraphs.length) {
          setSpeaking(false);
          return;
        }
  
        const utterance = new SpeechSynthesisUtterance(paragraphs[index]);
        utterance.lang = languages[language];
        utterance.rate = 1;
        utterance.pitch = 1;
  
        utterance.onend = () => {
          speakParagraph(index + 1); // Queue the next paragraph
        };
  
        synth.speak(utterance);
      };
  
      speakParagraph(0); // Start with the first paragraph
    } else {
      alert('Your browser does not support text-to-speech.');
    }
  };
  
  const stopPlayback = () => {
    // Stop TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setSpeaking(false);
    setGenre('');
  };

  return (
    <div className="app-container">
      <h1>Code Your Own Song!</h1>

      <div className="mood-selection">
        <h3>Select your mood:</h3>
        {['happy', 'sad', 'romantic', 'energetic', 'nostalgic'].map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            disabled={!!mood}
            className={`mood-button ${mood === m ? 'selected' : ''}`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="language-selection">
        <h3>Select your language:</h3>
        {Object.keys(languages).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            disabled={!!language}
            className={`language-button ${language === lang ? 'selected' : ''}`}
          >
            {lang}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Tell us your story..."
          rows="4"
          cols="50"
          className="story-input"
        />
        <br />
        <button
          type="submit"
          className="submit-button"
          // disabled={!mood || !language}
        >
          Generate Song
        </button>
      </form>

      {loading && <p><Loader/></p>}

      {song && (
        <div className="generated-song">
          <h2>Your Generated Song:</h2>
          <p>{song}</p>

          <div className="action-buttons">
            <button onClick={() => copyToClipboard(song)} className="copy-button">
              Copy
            </button>
            <button onClick={() => downloadSong(song)} className="download-button">
              Download
            </button>
          </div>


          <div className="genre-buttons">
            <h3>Sing Along with a Genre:</h3>
            {Object.keys(genres).map((g) => (
              <button
                key={g}
                onClick={() => handleGenreClick(g)}
                className={`genre-button ${genre === g ? 'selected' : ''}`}
              >
                {g}
              </button>
            ))}
          </div>

          {speaking && (
            <div className="stop-button-container">
              <button onClick={stopPlayback} className="stop-button">
                Stop
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
