import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="bg-gray-900 shadow-md">
      <ul className="flex items-left justify-left space-x-8 px-6 py-4 font-serif text-amber-400 font-bold">
        {[
          { path: "/", label: "Home" },
          { path: "/todo", label: "To-do" },
          { path: "/WebVulture", label: "WebVulture" },
          { path: "/about", label: "About" },
        ].map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className="px-4 py-2 rounded transition duration-300 hover:bg-amber-400 hover:text-gray-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
