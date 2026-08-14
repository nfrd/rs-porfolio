import Footer from '../components/Footer'

export default function Contact() {
  return (
    <div>
      <div className="container contact-intro">
        <span className="eyebrow contact-eyebrow">Contact</span>
        <h1>Got a project in mind? Let's talk about it.</h1>
        <p>No decks, no lengthy briefs — just tell me what you're building and where you're stuck.</p>
        <div className="contact-email-row">
          <a href="mailto:hello@pluralworld.com" className="btn">
            email me
          </a>
          <span>hello@pluralworld.com</span>
        </div>
      </div>

      <div className="container contact-form-wrap">
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@company.com" />
          </div>
          <div className="field">
            <label htmlFor="details">Project details</label>
            <textarea id="details" placeholder="What are you building?" />
          </div>
          <button type="submit" className="btn">
            Send message
          </button>
        </form>
      </div>

      <Footer />
    </div>
  )
}
