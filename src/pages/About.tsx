import { capabilitiesFull, experience } from '../data/content'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'

export default function About() {
  return (
    <div>
      <div className="container about-intro">
        <span className="eyebrow about-eyebrow">About</span>
        <h1>
          I've spent six years in the room where footwear design meets business strategy — and
          the other room, where the right athlete or artist decides whether either one matters.
        </h1>
      </div>

      <div className="container about-body">
        <ImagePlaceholder label="portrait photograph" className="portrait-placeholder" />
        <p>
          Plural World is a footwear and apparel designer turned brand strategist based in Los
          Angeles. They've led product design for independent running and basketball brands,
          built go-to-market plans that took two brands from zero to national retail, and
          brokered the athlete and entertainment partnerships that got the product seen. They now
          work with founders who need one person who can do all of it, in order.
        </p>
      </div>

      <hr className="rule" />

      <div className="container capabilities-full">
        {capabilitiesFull.map((c) => (
          <div className="capability" key={c.num}>
            <p className="num">{c.num}</p>
            <h3>{c.title}</h3>
            <p>{c.copy}</p>
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
