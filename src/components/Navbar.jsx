import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-dark d-flex flex-column p-0 pb-3" style={{backgroundColor: '#6f42c1'}}>

            <div className="container pt-3">
                <div className="row w-100 align-items-center m-0">
                    <div className="col-4"></div>
                    <div className="col-4 text-center">
                        <Link className="navbar-brand fw-bold fs-1 m-0" to="/orders">
                            Inno-shop
                        </Link>
                    </div>
                    <div className="col-4 text-end p-0">
                        <button className="btn btn-outline-light px-4 fw-bold" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-100 border-top border-light opacity-50 my-3"></div>

            <div className="w-100 px-2">
                <div className="navbar-nav d-flex flex-row gap-5 justify-content-center">
                    <Link className="nav-link text-white fs-5 fw-medium" to="/orders">Orders</Link>
                </div>
            </div>
        </nav>
    );
}