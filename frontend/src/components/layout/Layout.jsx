import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default Layout;
