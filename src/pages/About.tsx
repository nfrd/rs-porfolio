import { capabilitiesFull, experience } from '../data/content'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'

export default function About() {
  return (
    <div>
      <div className="container about-intro">
        <span className="eyebrow about-eyebrow">About</span>
        <h1>Plural World makes things with form, feeling, and a reason to exist.</h1>
      </div>

      <div className="container about-body">
        <ImagePlaceholder label="portrait photograph" className="portrait-placeholder" />
        <p>
          Footwear, apparel, and the ideas around them. We work with people building from the
          ground up, keeping the product clear and the point of view intact.
        </p>
      </div>

      <hr className="rule" />

      <div className="container capabilities-full">
        <span className="eyebrow capabilities-full-eyebrow">Capabilities</span>
        {capabilitiesFull.map((c) => (
          <div className="capability-full" key={c.num}>
            <h3>{c.title}</h3>
          </div>
        ))}
      </div>

      <hr className="rule" />

      <div className="container experience-list">
        <span className="eyebrow experience-eyebrow">Experience</span>
        {experience.map((e) => (
          <div className="experience-row" key={e.range}>
            <span>{e.range}</span>
            <span>{e.role}</span>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
