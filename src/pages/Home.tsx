import { Link } from 'react-router-dom'
import { projects } from '../data/content'
import Footer from '../components/Footer'
import WorksBelt from '../components/WorksBelt'

export default function Home() {
  return (
    <div>
      <div className="container hero">
        <h1>
          A creative agency that specializes in brand partnerships, marketing strategy, product development, and apparel &amp; footwear design.
        </h1>
        <p>
          Based in New York, with 8 years of experience working alongside some of the world's top athletes, high-profile celebrities, and most renowned brands across lifestyle, luxury, and sportswear.

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
          <p>Plural World makes things with form, feeling, and a reason to exist.</p>
          <p className="about-teaser-copy">
            Footwear, apparel, and the ideas around them. We work with people building from the
            ground up, keeping the product clear and the point of view intact.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
