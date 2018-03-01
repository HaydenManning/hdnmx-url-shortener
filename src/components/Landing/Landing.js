// Landing Page
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import "./Landing.css";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { newShortUrlInputFunc, createNewShortUrl } from "./../../ducks/reducer";

class Landing extends Component {
  newShortUrlInput(e) {
    this.props.newShortUrlInputFunc(e);
  }

  createNewShortUrl() {
    this.props.createNewShortUrl(this.props.newShortUrlInput);
    document.getElementById("long-input").value = "";
  }

  render() {
    return (
      <div>
        <Header />
        <div className="landing-parent">
          <div className="url-shortener">
            <div className="short-content">
              <h1>Simplify your link</h1>
              <div className="url-input">
                <input
                  id="long-input"
                  onChange={e => this.newShortUrlInput(e.target.value)}
                  placeholder="Your original URL here"
                  type="url"
                />
                <button onClick={() => this.createNewShortUrl()}>
                  SHORTEN URL
                </button>
              </div>
              <p>
                All hayd.xyz URLs and analytics are public and can be accessed
                by anyone
              </p>
              {this.props.newShortUrl !== ""
                ? `http://localhost:3002/${this.props.newShortUrl}`
                : false}
            </div>
          </div>
          <div className="unleash-the-link">
            <div className="cta-head">
              <h1>UNLEASH THE POWER OF YOUR LINK</h1>
              <p>
                The link is an invisible string that connects every customer
                interaction to drive a seamless experience. Create a greater
                story across ever channel and every device with hayd Enterprise.
              </p>
            </div>
            <div className="landing-cta">
              <div className="landing-brand">
                <h2>BRAND</h2>
                <p>
                  Consistency is what makes great brands. Create custom links
                  that carry your branding to every device and channel.
                </p>
              </div>
              <div className="landing-track">
                <h2>TRACK</h2>
                <p>
                  Track individual link analytics and measure campaign
                  performance across teams and channels in real-time. All in one
                  location.
                </p>
              </div>
              <div className="landing-optimize">
                <h2>OPTIMIZE</h2>
                <p>
                  Whether you're at customer number one or customer 1,000,000
                  the link gives each user the right experience every time.
                </p>
              </div>
              <div className="cta-learn">
                <Link to="/enterprise">
                  <button>LEARN MORE</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="landing-links-powered">
            <h1>
              {/* put a dynamic counter that pulls info on total links in db */}
              656,356,768
            </h1>
            <h1>LINKS POWERED BY HAYD</h1>
            <a href={process.env.REACT_APP_LOGIN}>
              <button>CREATE YOUR FREE ACCOUNT</button>
            </a>
          </div>
          <div className="landing-trustedby">
            <h2>TRUSTED BY THE SMARTEST BRANDS</h2>
            <p>haydxyz, HaydenManning, Me, Myself & I</p>
          </div>
          <div className="landing-some-reviews">
            <q>
              "Hayd provides me the information I need and the experience my
              customers deserve"
            </q>
            <p>- Some Business Guy Somewhere</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default withRouter(
  connect(mapStateToProps, { newShortUrlInputFunc, createNewShortUrl })(Landing)
);
