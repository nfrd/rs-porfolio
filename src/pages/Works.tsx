import { projects } from '../data/content'
import Footer from '../components/Footer'

export default function Works() {
  return (
    <div>
      <div className="container works-page-head">
        <span className="eyebrow works-page-eyebrow">All projects ({projects.length})</span>
        <h1>From concept to closets.</h1>
      </div>

      <div className="container works-grid-wrap">
        <div className="works-grid">
          {projects.map((p) => (
            <div className="work-card" key={p.id}>
              <img src={p.photo} alt={p.name} />
              <h3>{p.name}</h3>
              <span>{p.tags}</span>
              <p>{p.blurb}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
