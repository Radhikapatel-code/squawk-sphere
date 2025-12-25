import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { syncUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔥 WAIT FOR TOKEN TO BE READY
  const waitForAuthReady = () =>
    new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
      });
    });

  const login = async () => {
    try {
      setError("");

      await signInWithEmailAndPassword(auth, email, password);

      // 🔥 CRITICAL: wait until Firebase auth is ready
      await waitForAuthReady();

      await syncUser();
      navigate("/feed");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const register = async () => {
    try {
      setError("");

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(res.user, {
        displayName: name,
      });

      // 🔥 WAIT FOR TOKEN
      await waitForAuthReady();

      await syncUser();
      navigate("/feed");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login / Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          className="input"
          placeholder="Full Name (for registration)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button primary" onClick={login}>
          Login
        </button>
        <button className="button primary" onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
