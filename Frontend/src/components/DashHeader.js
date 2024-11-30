import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const DASHBOARD_REGEX = /^\/dashboard(\/)?$/;
const DAILYLOGS_REGEX = /^\/dashboard\/dailylogs(\/)?$/;
const ITEMTEMPLATES_REGEX = /^\/dashboard\/itemtemplates(\/)?$/;

const DashHeader = () => {

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  let dashClass = null;
  if (!DASHBOARD_REGEX.test(pathname) && !DAILYLOGS_REGEX.test(pathname) && !ITEMTEMPLATES_REGEX.test(pathname)) {
    dashClass = "dash-header__container--small";
  }

  const logoutButton = (
    <button
      className="icon-button"
      title="Logout"
      onClick={sendLogout}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dashboard">
            <h1 className="dash-header__title">ByteLog</h1>
          </Link>
          <nav className="dash-header__nav">
            {logoutButton}
          </nav>
        </div>
      </header>
    </>
  );

  return content;
};

export default DashHeader;
