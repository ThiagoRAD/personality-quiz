import { Link } from 'react-router-dom'
import './Header.css'

export const Header = () => {
  return <header className="header">
    <h1>Which element Are You?</h1>
    <p>(based on completely random things)</p>
    <nav>
      <Link to="/personality-quiz">Home</Link>
      <Link to="/personality-quiz/quiz">Quiz</Link>
    </nav>
  </header>
}
