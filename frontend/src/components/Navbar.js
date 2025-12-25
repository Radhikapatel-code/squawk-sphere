import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="card">
      <button className="button primary" onClick={() => navigate("/feed")}>
        Feed
      </button>
      <button className="button primary" onClick={() => navigate("/create")}>
        Create Post
      </button>
      <button className="button danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
