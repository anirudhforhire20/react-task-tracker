import './Auth.css';
const Auth = ({onSubmit}) => {
    return (
        <form id="signup-form-1" className="flash-card form" method="POST" action="">
        <div className="form-pages">
            <div id="page-1" className="form-page">
                <legend>Login</legend>
    
                <input id="cors_token" name="cors_token" type="hidden" value="{{cors_token}}"></input>
                <fieldset id="uname">
                    <input name="uname" type="text" placeholder=" "></input>
                    <label>Username</label>
                    <span>Enter your username</span>
                </fieldset>
    
                <fieldset id="password">
                    <input name="password" type="password" placeholder=" "></input>
                    <label>Password</label>
                    <span>Enter your password</span>
                </fieldset>

                <span id="client-check-err" style={{color : 'red'}}></span>
    
                <div className="btn-grp">
                    <button onClick={onSubmit} className="btn primary form-submit" type="button">Login</button>
                </div>
            </div>
        </div>
    </form>
    );
}

export default Auth;