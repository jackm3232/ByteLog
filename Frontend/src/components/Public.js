import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>Welcome to <span className="nowrap">ByteLog!</span></h1>
      </header>
      <main className="public__main">
        <p>ByteLog allows you to easily track your daily calories and protein.</p>
        <address className="public__addr">
          -Create templates for food items<br />
          -Keep daily nutrition logs<br />
        </address>
      </main>
      <footer>
        <Link to="/login">Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
