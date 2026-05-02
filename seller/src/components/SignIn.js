function SignIn({ onLogin }) {
  return (
    <div className="login-page">
      <form className="login-box" >
        <h1>Seller Sign In</h1>

        <input type="email" placeholder="Email address" required />
        <input type="password" placeholder="Password" required />

        <button type="submit">Sign In</button>

        <p className="small-text">Create an account if you are a new seller</p>
      </form>
    </div>
  );
}

export default SignIn;
