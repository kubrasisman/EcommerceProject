import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#232f3e] text-white">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#4a5a6f] py-4 text-sm font-medium transition-colors"
      >
        Back to top
      </button>

      {/* Main Footer */}
      <div className="bg-[#232f3e] py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Get to Know Us */}
            <div>
              <h3 className="font-bold mb-4">Get to Know Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/about" className="hover:underline">About Us</Link></li>
                <li><Link to="/careers" className="hover:underline">Careers</Link></li>
                <li><Link to="/press" className="hover:underline">Press Releases</Link></li>
                <li><Link to="/sustainability" className="hover:underline">ShopHub Science</Link></li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h3 className="font-bold mb-4">Make Money with Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/sell" className="hover:underline">Sell on ShopHub</Link></li>
                <li><Link to="/affiliate" className="hover:underline">Become an Affiliate</Link></li>
                <li><Link to="/advertise" className="hover:underline">Advertise Your Products</Link></li>
                <li><Link to="/self-publish" className="hover:underline">Self-Publish with Us</Link></li>
              </ul>
            </div>

            {/* ShopHub Payment Products */}
            <div>
              <h3 className="font-bold mb-4">Payment Products</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/card" className="hover:underline">ShopHub Business Card</Link></li>
                <li><Link to="/reload" className="hover:underline">Shop with Points</Link></li>
                <li><Link to="/balance" className="hover:underline">Reload Your Balance</Link></li>
                <li><Link to="/currency" className="hover:underline">Currency Converter</Link></li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="font-bold mb-4">Let Us Help You</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/account" className="hover:underline">Your Account</Link></li>
                <li><Link to="/orders" className="hover:underline">Your Orders</Link></li>
                <li><Link to="/shipping" className="hover:underline">Shipping Rates & Policies</Link></li>
                <li><Link to="/returns" className="hover:underline">Returns & Replacements</Link></li>
                <li><Link to="/help" className="hover:underline">Help</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-[#131921] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
                SH
              </div>
              <span className="text-xl font-bold">ShopHub</span>
            </Link>

            {/* Language & Currency */}
            <div className="flex items-center gap-4 text-sm">
              <button className="px-3 py-1 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
                🌐 English
              </button>
              <button className="px-3 py-1 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
                $ USD
              </button>
              <button className="px-3 py-1 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
                🇺🇸 United States
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#131921] py-4 text-center text-xs text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <Link to="/conditions" className="hover:underline">Conditions of Use</Link>
            <Link to="/privacy" className="hover:underline">Privacy Notice</Link>
            <Link to="/interest-ads" className="hover:underline">Interest-Based Ads</Link>
          </div>
          <p>&copy; {currentYear} ShopHub.com, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  )
}

