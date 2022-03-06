import { Link } from 'react-router-dom'

export const Header = () => {
  return <header>
    <h1>Which element Are You?</h1>
    <p>(based on completely random things)</p>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/quiz">Quiz</Link>
    </nav>
  </header>
}
