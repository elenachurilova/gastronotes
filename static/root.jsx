const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

const Welcome = () => {
    return (
        <div>
            <h1>Gastronotes</h1>
            <h2>Your favorite recipes. Organized.</h2>
            <p>Collect and save your favorite recipes, all in one place. 
            No need to look across multiple devices' bookmarks. No more scrolling through
            pictures and ads. No more paper recipes. No more binders. Your recipes are
            now here and ready for you.</p>
        </div>
    )
}

const LoginButton = () => {
    return (
        <Link to="/api/login"><button id="login" name="login" type="button">Log In</button></Link>
    );
}

const SignupButton = () => {
    return (
        <Link to="/api/signup"><button id="signup" name="signup" type="button">Sign Up</button></Link>
    );
}

const Homepage = () => {
    return (
        <div>
            <div className="buttons">
                <LoginButton />
                <SignupButton />
            </div>

            <div className="landing">
                <Welcome />

                {/* paste an image here */}
                <img></img>
            </div>
        </div>
    );
}

const LoginPage = () => {
    return (
        <div>
            <div>
                <img src=""></img>
            </div>

            <div>
                <form action="/login" method="POST">
                    <input type="email" placeholder="Email" name="email" required></input>
                    <input type="text" placeholder="Password" name="password" required></input>
                    <input type="submit" name="submit" value="Sign In"></input>
                </form>
            </div>

            <div>
                <h5>Don't have an account?</h5>
                <Link to="/api/signup">Create an account</Link>
            </div>
        </div>
    );
}

const SignupPage = () => {
    return (
        <div>
            <div>
                <img src=""></img>
            </div>

            <div>
                <form action="/signup" method="POST">
                    <input type="text" placeholder="First name" name="fname"></input>
                    <input type="text" placeholder="Last name" name="lname"></input>
                    <input type="email" placeholder="Email" name="email" required></input>
                    <input type="password" placeholder="Password" name="password" required></input>

                    <input type="submit" name="submit" value="Continue"></input>
                </form>
                <p>By creating an account, you are agreeing to our <Link to=""> Terms of Service </Link> 
                    and <Link to=""> Privacy Policy </Link></p>
            </div>

            <div>
                <h5>Already have an account?</h5>
                <Link to="/api/login">Log In</Link>
            </div>
        </div>
    );
}

const App = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/api/home">
                        <Homepage />
                    </Route>

                    <Route path="/api/login">
                        <LoginPage />
                    </Route>

                    <Route path="/api/signup">
                        <SignupPage />
                    </Route>

                </Switch>
            </div>
        </Router>
    );
}


ReactDOM.render(
        <App />, 
        document.getElementById('root')
        )