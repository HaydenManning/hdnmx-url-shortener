require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { json } = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const massive = require("massive");
const path = require("path");
const {
  CONNECTION_STRING,
  DOMAIN,
  CLIENT_ID,
  CLIENT_SECRET,
  SESSION_SECRET,
  PORT
} = process.env;
const {
  createShortUrl,
  getShortUrl,
  getAllUrl,
  deleteShortUrl
} = require(`${__dirname}/controllers/urlController`);
const {
  getUserByAuthId,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserFirstName,
  updateUserLastName,
  updateUserRole,
  updateUserEmail
} = require(`${__dirname}/controllers/userController`);

const {
  stripe,
  paymentApi,
  configureRoutes
} = require(`${__dirname}/controllers/stripeController`);

const app = express();

// serving production files
app.use(express.static(`${__dirname}/../build/`));
massive(CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
  })
  .catch(console.log);

app.use(json());
app.use(cors());
configureRoutes(app);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000
    }
  })
);

/* REWRITE Auth0Strategy */
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new Auth0Strategy(
    {
      domain: DOMAIN,
      clientSecret: CLIENT_SECRET,
      clientID: CLIENT_ID,
      scope: "openid profile",
      callbackURL: "/auth"
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      app
        .get("db")
        .getUserByAuthId(profile.id)
        .then(response => {
          console.log(response);
          if (!response[0]) {
            app
              .get("db")
              .createNewUser(
                profile.id,
                profile.name.givenName,
                profile.name.familyName
              )
              .then(created => done(null, created[0]));
            console.log(created);
          } else {
            return done(null, response[0]);
          }
        });
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get(
  "/auth",
  passport.authenticate(`auth0`, {
    failureRedirect: "http://hdn.mx"
  }),
  (req, res) => {
    res.redirect(`http://hdn.mx`);
    console.log(req.user);
  }
);
app.get("/api/me", (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(500).json({ message: "User is not logged in" });
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("http://hdn.mx/");
  });
});

app.get(`/api/url/:id`, getShortUrl);
app.get(`/api/url/all/:id`, getAllUrl);
app.post(`/api/url`, createShortUrl);
app.delete(`/api/url/:id`, deleteShortUrl);

app.get(`/api/user/:id`, getUserByAuthId);
app.get(`/api/user/`, getAllUsers);
app.post(`/api/user`, createNewUser);
app.delete(`/api/user/:id`, deleteUser);
app.put(`/api/user/first/:id`, updateUserFirstName);
app.put(`/api/user/last/:id`, updateUserLastName);
app.put(`/api/user/permissions/:id`, updateUserRole);
app.put(`/api/user/email/:id`, updateUserEmail);

// STRIPE

// for production only
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
