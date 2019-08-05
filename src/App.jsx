import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import React, {useEffect} from 'react';
import UserForm from './components/UserForm';
import Question from './components/Question';
import Results from './components/Results';
import {UserProvider} from './components/UserProvider';

const questions = [
  {
    question: "What's your favorite color?",
    options: ['Red 🔴', 'Blue 🔵', 'Green 🟢', 'Yellow 🟡'],
  },
];

const keywords = {
  Fire: 'fire',
  Water: 'water',
  Earth: 'earth',
  Air: 'air',
};

const elements = {
  'Red 🔴': 'Fire',
  'Blue 🔵': 'Water',
  'Green 🟢': 'Earth',
  'Yellow 🟡': 'Air',
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [artwork, setArtwork] = React.useState(null);

  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex, answers]
  );

  async function fetchArtwork(keyword) {
    try {
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`);
      const data = await response.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
        const objectID = data.objectIDs[randomIndex];
        const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
        const artworkData = await artworkResponse.json();
        setArtwork(artworkData);
      } else {
        throw new Error('No artworks found');
      }
    } catch (error) {
      console.error('Error fetching artwork:', error);
      setArtwork(null);
    }
  }

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach(function (answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function (a, b) {
      return counts[a] > counts[b] ? a : b;
    });
  }

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path='/personality-quiz' element={<UserForm />} />
          <Route
            path='/personality-quiz/quiz'
            element={
              currentQuestionIndex < questions.length ? (
                <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
              ) : (
                <Results element={determineElement(answers)} artwork={artwork} />
              )
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
