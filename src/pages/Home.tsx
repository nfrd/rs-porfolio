import { Link } from 'react-router-dom'
import { projects } from '../data/content'
import Footer from '../components/Footer'
import WorksBelt from '../components/WorksBelt'

export default function Home() {
  return (
    <div>
      <div className="container hero">
        <h1>
          A creative agency that specializes in brand partnerships, product development, and
          footwear &amp; apparel design.
        </h1>
        <p>
          Based in Los Angeles. Working with founders who need one partner across product,
          positioning, and the people who make it land.
        </p>
        <Link to="/works" className="btn">
          View the work
        </Link>
      </div>

      <hr className="rule" />

      <div className="works-belt-wrap">
        <div className="container works-belt-head">
          <span className="eyebrow">Works</span>
          <div className="works-belt-head-right">
            <Link to="/works">View all projects →</Link>
            <span className="works-belt-hint">Drag to browse</span>
          </div>
        </div>
        <WorksBelt projects={projects} />
        <div className="container works-belt-link-mobile">
          <Link to="/works">View all projects →</Link>
        </div>
      </div>

      <hr className="rule" />

      <div className="container about-teaser">
        <span className="eyebrow">About</span>
        <div className="about-teaser-body">
          <p>
            Six years between the design room and the room where the right athlete decides
            whether the product matters.
          </p>
          <Link to="/about">More about the studio →</Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
