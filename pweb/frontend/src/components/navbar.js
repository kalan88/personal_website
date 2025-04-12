import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul className="min-h-25 flex bg-gray-900 items-left justify-left space-x-8 list-none font-serif text-amber-400 font-bold hover:color-amber-500">
        <li className="px-4 py-2 "><Link to="/">Home</Link></li>
        <li className="px-4 py-2 "><Link to="/todo">To-do</Link></li>
        <li className="px-4 py-2 0"><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;