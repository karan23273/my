import React, { useState } from 'react';
import { LogIn, Lock, Mail, UserPlus, ArrowLeft, User, LayoutDashboard, Package, ClipboardList, BarChart3, Settings, LogOut, Menu, Star, Box, Warehouse, Truck as TruckLoading, Users, Search, Filter, SortAsc, AlertCircle } from 'lucide-react';

type UserType = 'customer' | 'admin' | 'supplier';

interface AuthUser {
  name?: string;
  email: string;
  type: UserType;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const MOCK_PRODUCTS: Product[] = [
  { id: 'P001', name: 'Laptop Pro X', category: 'Electronics', price: 1299.99, stock: 50, status: 'In Stock' },
  { id: 'P002', name: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 5, status: 'Low Stock' },
  { id: 'P003', name: 'USB-C Cable', category: 'Accessories', price: 12.99, stock: 0, status: 'Out of Stock' },
  { id: 'P004', name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 25, status: 'In Stock' },
  { id: 'P005', name: 'Bluetooth Speaker', category: 'Audio', price: 79.99, stock: 30, status: 'In Stock' },
];

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Audio'];

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<UserType>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('Products');
  
  // Product management states
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      setUser({ email, type: userType });
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      setUser({ name, email, type: userType });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { icon: <Package className="h-5 w-5" />, label: 'Products' },
    { icon: <ClipboardList className="h-5 w-5" />, label: 'Orders' },
    { icon: <Star className="h-5 w-5" />, label: 'Reviews' },
    { icon: <Box className="h-5 w-5" />, label: 'Inventory' },
    { icon: <TruckLoading className="h-5 w-5" />, label: 'Stock Management' },
    { icon: <Warehouse className="h-5 w-5" />, label: 'Warehouse' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Reports' },
    { icon: <Users className="h-5 w-5" />, label: 'Suppliers' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.id.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * order;
      if (sortBy === 'price') return (a.price - b.price) * order;
      return (a.stock - b.stock) * order;
    });

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'In Stock': return 'text-green-500';
      case 'Low Stock': return 'text-yellow-500';
      case 'Out of Stock': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const ProductsSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
              className="focus:outline-none bg-transparent"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <SortAsc className={`h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center text-sm ${getStatusColor(product.status)}`}>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {product.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (user && user.type === 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0B14]">
        {/* Top Navigation */}
        <nav className="bg-green-100 shadow-lg border-b border-green-200">
          <div className="px-4">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-600 hover:bg-green-200"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 ml-2">Bizarre Bazaar</h1>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-green-200 px-3 py-2 rounded-md"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#12141F] h-[calc(100vh-3.5rem)] p-4 transition-all duration-300 overflow-y-auto`}>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <a 
                  key={item.label}
                  href="#" 
                  onClick={() => setActiveSection(item.label)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    activeSection === item.label
                      ? 'text-emerald-500 bg-[#0A0B14]' 
                      : 'text-gray-400 hover:bg-[#0A0B14]'
                  }`}
                >
                  {item.icon}
                  {isSidebarOpen && <span>{item.label}</span>}
                </a>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {activeSection === 'Products' ? (
              <ProductsSection />
            ) : (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{activeSection.toUpperCase()}</h2>
                <p className="text-gray-400">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            Welcome to InvenFlow
          </h1>
          <p className="text-gray-600">
            Please login to continue
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-md shadow p-6">
          {!isLogin && (
            <button
              onClick={toggleAuthMode}
              className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          )}

          <div className="flex gap-2 mb-4">
            {(['customer', 'admin', 'supplier'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`flex-1 py-1 px-3 rounded text-sm ${
                  userType === type
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder={`${userType}@invenflow.com`}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLogin ? `Login as ${userType}` : 'Sign Up'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">No account? </span>
              <button
                onClick={toggleAuthMode}
                className="text-blue-500 hover:text-blue-700"
              >
                Create one
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;