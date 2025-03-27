import { Link } from "wouter";
import Logo from "./Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E1E1E] py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-gray-400 mb-4">
              Share and play games together. Your ultimate gaming platform for HTML games and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/discover">
                  <a className="text-gray-400 hover:text-[#007AF4] transition-colors">
                    Featured Games
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=1">
                  <a className="text-gray-400 hover:text-[#007AF4] transition-colors">
                    HTML Games
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=2">
                  <a className="text-gray-400 hover:text-[#007AF4] transition-colors">
                    Roblox
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=3">
                  <a className="text-gray-400 hover:text-[#007AF4] transition-colors">
                    Fortnite
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=4">
                  <a className="text-gray-400 hover:text-[#007AF4] transition-colors">
                    RecRoom
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Create</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create">
                  <a className="text-gray-400 hover:text-[#007AF4] transition-colors">
                    Game Templates
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/create">
                  <a className="text-gray-400 hover:text-[#007AF4] transition-colors">
                    HTML Game Builder
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  Developer Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#007AF4] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#2A2A2A] text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GAMESF7. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
