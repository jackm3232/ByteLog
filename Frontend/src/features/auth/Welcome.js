import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {

  const { username } = useAuth();

  const content = (
    <section className="welcome">

      <h1>Welcome {username}!</h1>

      <br></br>

      <p><Link to="/dashboard/dailylogs">View Daily Logs</Link></p>

      <p><Link to="/dashboard/dailylogs/new">Add New Daily Log</Link></p>

      <br></br>

      <p><Link to="/dashboard/itemtemplates">View Item Templates</Link></p>

      <p><Link to="/dashboard/itemtemplates/new">Add New Item Template</Link></p>

    </section>
  );

  return content;
};

export default Welcome;
