import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import React, {useContext, useEffect} from 'react';
import {UserContext} from './contexts/UserContext';
import UserForm from './components/UserForm';
import Question from './components/Question';
import Results from './components/Results';

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
  const {setName} = useContext(UserContext);
  const [element, setElement] = React.useState('');
  const [artwork, setArtwork] = React.useState(null);

  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex, answers]
  );

  async function fetchArtwork(keyword) {
    try {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`
      );
      const data = await response.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
        const objectID = data.objectIDs[randomIndex];
        const artworkResponse = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
        );
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

  function handleUserFormSubmit(name) {
    setName(name);
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
      <Routes>
        <Route path='/' element={<UserForm onSubmit={handleUserFormSubmit} />} />
        <Route
          path='/quiz'
          element={
            currentQuestionIndex < questions.length ? (
              <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
            ) : (
              <Results element={determineElement(answers)} artwork={artwork} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
