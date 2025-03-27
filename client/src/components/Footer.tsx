import { Link } from "wouter";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#16082F] py-8 border-t border-[#2A2A2A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-white text-xl font-bold" style={{ 
                fontFamily: 'Sofia Pro, sans-serif',
                letterSpacing: '1px'
              }}>
                GAMESF7
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Your ultimate gaming platform for HTML games, Roblox, Fortnite and RecRoom.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/discover">
                  <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                    Featured Games
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=1">
                  <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                    HTML Games
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=2">
                  <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                    Roblox
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=3">
                  <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                    Fortnite
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/discover?platform=4">
                  <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                    RecRoom
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Create</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create">
                  <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                    Game Templates
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/create">
                  <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                    HTML Game Builder
                  </div>
                </Link>
              </li>
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  Developer Resources
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  Documentation
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  API
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  Help Center
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  Community Forum
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  Contact Us
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  Privacy Policy
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                  Terms of Service
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#2A2A2A] text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GAMESF7 Alpha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
