import { Link } from 'react-router-dom'
import { capabilities, projects } from '../data/content'
import Footer from '../components/Footer'

export default function Home() {
  const featured = projects.slice(0, 3)

  return (
    <div>
      <div className="container hero">
        <h1>Design that earns attention before it asks</h1>
        <Link to="/works" className="btn">
          View the work
        </Link>
      </div>

      <hr className="rule" />

      <div className="container culture">
        <p>Pushing the culture forward.</p>
        <img src={projects[0].photo} alt={projects[0].name} />
        <img src={projects[1].photo} alt={projects[1].name} />
      </div>

      <hr className="rule" />

      <div className="container works-list">
        <div className="works-list-head">
          <span className="eyebrow">Works</span>
          <Link to="/works">View all projects →</Link>
        </div>
        {featured.map((p) => (
          <div className="works-row" key={p.id}>
            <h3>{p.name}</h3>
            <span>{p.tags}</span>
          </div>
        ))}
      </div>

      <div className="container capabilities">
        <span className="eyebrow capabilities-eyebrow">Experience</span>
        {capabilities.map((c) => (
          <div className="capability" key={c.num}>
            <p className="num">{c.num}</p>
            <h3>{c.title}</h3>
            <p>{c.copy}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
