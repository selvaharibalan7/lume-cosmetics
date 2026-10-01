import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Button, Badge, Input, Card, StarRating, Tabs, Toast,
  Alert, Spinner, Skeleton, EmptyState, Avatar, Modal, Drawer,
  ProgressBar, Stepper, SearchInput, SectionHeader,
  PageHeader, QuantitySelector, Divider, Icons, MatchChip, IconButton,
  Toggle, Checkbox, Select, Textarea, CategoryIcon,
} from './ui';
import {
  CATEGORIES, SKIN_CONCERNS, AVOIDED_INGREDIENTS, Product, Order, ProductVariant,
} from './data';
import { useAuth } from './context/AuthContext';
import { api } from './api';

// ─── Screen Types ─────────────────────────────────────────────────────────────
type Screen =
  | 'login' | 'signup' | 'forgot-password' | 'otp'
  | 'onboarding-skin' | 'onboarding-concerns' | 'onboarding-tone'
  | 'onboarding-ingredients' | 'onboarding-summary'
  | 'home' | 'shop' | 'search' | 'product' | 'cart' | 'wishlist'
  | 'checkout-address' | 'checkout-delivery' | 'checkout-payment'
  | 'payment-processing' | 'payment-failed' | 'order-confirm'
  | 'orders' | 'order-detail' | 'order-tracking' | 'return-request'
  | 'profile' | 'skin-profile' | 'saved-addresses' | 'payment-methods'
  | 'compare' | 'shade-finder';

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function CustomerApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [prevScreen, setPrevScreen] = useState<Screen>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<Array<{ product: Product; qty: number }>>([]);
  const [wishlist, setWishlist] = useState<string[]>(['p2', 'p6']);
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' | 'warning' } | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState<string[]>([]);
  
  // Real data integration
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const prods = await api.products.list();
        if (prods && prods.length > 0) {
          setProducts(prods);
          setSelectedProduct(prods[0]);
        }
        if (user) {
          const ords = await api.orders.list();
          if (ords) {
            setOrders(ords);
            if (ords.length > 0) setSelectedOrder(ords[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load initial data", e);
      }
    };
    loadData();
  }, [user]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const navigate = (s: Screen) => {
    setPrevScreen(screen);
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ msg, type });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const isAuth = ['login', 'signup', 'forgot-password', 'otp'].includes(screen);
  const isOnboarding = screen.startsWith('onboarding');
  const showNav = !isAuth && !isOnboarding;

  return (
    <div className="min-h-screen bg-[#fafaf8]" style={{ fontFamily: 'Figtree, sans-serif' }}>
      {showNav && (
        <TopNav
          screen={screen}
          navigate={navigate}
          cartCount={cartCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <main className={showNav ? 'pt-16 pb-16 md:pb-0' : ''}>
        {screen === 'login' && <LoginScreen navigate={navigate} />}
        {screen === 'signup' && <SignupScreen navigate={navigate} />}
        {screen === 'forgot-password' && <ForgotPasswordScreen navigate={navigate} />}
        {screen === 'otp' && <OTPScreen navigate={navigate} />}
        {screen === 'onboarding-skin' && <OnboardingSkinType navigate={navigate} />}
        {screen === 'onboarding-concerns' && <OnboardingConcerns navigate={navigate} />}
        {screen === 'onboarding-tone' && <OnboardingTone navigate={navigate} />}
        {screen === 'onboarding-ingredients' && <OnboardingIngredients navigate={navigate} />}
        {screen === 'onboarding-summary' && <OnboardingSummary navigate={navigate} />}
        {screen === 'home' && (
          <HomeScreen
            navigate={navigate}
            wishlist={wishlist}
            onWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onProduct={(p) => { setSelectedProduct(p); navigate('product'); }}
            products={products}
          />
        )}
        {screen === 'shop' && (
          <ShopScreen
            navigate={navigate}
            wishlist={wishlist}
            onWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onProduct={(p) => { setSelectedProduct(p); navigate('product'); }}
            filterOpen={filterDrawerOpen}
            setFilterOpen={setFilterDrawerOpen}
            products={products}
          />
        )}
        {screen === 'search' && (
          <SearchScreen
            query={searchQuery}
            navigate={navigate}
            onProduct={(p) => { setSelectedProduct(p); navigate('product'); }}
            onAddToCart={addToCart}
            products={products}
          />
        )}
        {screen === 'product' && selectedProduct && (
          <ProductDetailScreen
            product={selectedProduct}
            navigate={navigate}
            wishlist={wishlist}
            onWishlist={toggleWishlist}
            onAddToCart={addToCart}
            compareList={compareList}
            onCompare={(id) => setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          />
        )}
        {screen === 'wishlist' && (
          <WishlistScreen
            wishlist={wishlist}
            navigate={navigate}
            onProduct={(p) => { setSelectedProduct(p); navigate('product'); }}
            onAddToCart={addToCart}
            onRemove={toggleWishlist}
            products={products}
          />
        )}
        {screen === 'cart' && (
          <CartScreen
            cart={cart}
            setCart={setCart}
            navigate={navigate}
            showToast={showToast}
          />
        )}
        {screen === 'checkout-address' && <CheckoutAddressScreen navigate={navigate} />}
        {screen === 'checkout-delivery' && <CheckoutDeliveryScreen navigate={navigate} />}
        {screen === 'checkout-payment' && <CheckoutPaymentScreen navigate={navigate} />}
        {screen === 'payment-processing' && <PaymentProcessingScreen navigate={navigate} cart={cart} setCart={setCart} setOrders={setOrders} />}
        {screen === 'payment-failed' && <PaymentFailedScreen navigate={navigate} />}
        {screen === 'order-confirm' && <OrderConfirmScreen navigate={navigate} />}
        {screen === 'orders' && (
          <OrdersScreen
            navigate={navigate}
            onOrderDetail={(o) => { setSelectedOrder(o); navigate('order-detail'); }}
            orders={orders}
          />
        )}
        {screen === 'order-detail' && selectedOrder && (
          <OrderDetailScreen order={selectedOrder} navigate={navigate} />
        )}
        {screen === 'order-tracking' && selectedOrder && <OrderTrackingScreen order={selectedOrder} navigate={navigate} />}
        {screen === 'return-request' && <ReturnRequestScreen navigate={navigate} />}
        {screen === 'profile' && <ProfileScreen navigate={navigate} onLogout={async () => { await logout(); navigate('login'); }} />}
        {screen === 'skin-profile' && <SkinProfileScreen navigate={navigate} />}
        {screen === 'saved-addresses' && <SavedAddressesScreen navigate={navigate} />}
        {screen === 'payment-methods' && <PaymentMethodsScreen navigate={navigate} />}
        {screen === 'compare' && <CompareScreen navigate={navigate} compareList={compareList} products={products} />}
        {screen === 'shade-finder' && selectedProduct && <ShadeFinderScreen navigate={navigate} product={selectedProduct} />}
      </main>

      {/* Compare Tray */}
      {compareList.length > 0 && !['compare'].includes(screen) && showNav && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1a1714] text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl max-w-[calc(100vw-2rem)]">
          <span className="text-sm font-medium whitespace-nowrap">{compareList.length} to compare</span>
          <Button size="sm" variant="secondary" onClick={() => navigate('compare')}>Compare</Button>
          <button onClick={() => setCompareList([])} className="text-white/60 hover:text-white text-sm" aria-label="Clear compare list">
            <Icons.Close />
          </button>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      {showNav && <MobileBottomNav screen={screen} navigate={navigate} cartCount={cartCount} />}

      {/* Filter Drawer */}
      <FilterDrawer open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)} />

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Top Navigation ───────────────────────────────────────────────────────────
function TopNav({ screen, navigate, cartCount, searchQuery, setSearchQuery }: {
  screen: Screen; navigate: (s: Screen) => void; cartCount: number;
  searchQuery: string; setSearchQuery: (v: string) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks: Array<{ label: string, screen: Screen }> = [];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-[#e6e1db] h-16" aria-label="Main navigation">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center min-w-[120px]">
            <button onClick={() => navigate('home')} className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] rounded" aria-label="Lume home">
              <span className="text-xl font-bold tracking-tight text-[#1a1714]">lume</span>
            </button>
          </div>

          {/* Search - desktop */}
          <div className="flex-1 hidden md:flex justify-center px-4 md:px-8">
            <div className="w-full max-w-2xl">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={() => navigate('search')}
                placeholder="Search products, brands, categories..."
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center justify-end gap-1 min-w-[120px]">
            <IconButton icon={<Icons.Search />} label="Search" onClick={() => navigate('search')} className="md:hidden" />
            <IconButton
              icon={<Icons.Heart />}
              label="Wishlist"
              onClick={() => navigate('wishlist')}
              active={screen === 'wishlist'}
            />
            <button
              onClick={() => navigate('cart')}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[#5c5751] hover:bg-[#f5f3ef] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a]"
              aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            >
              <Icons.Cart />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold bg-[#b8724a] text-white rounded-full flex items-center justify-center tabular-nums">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <IconButton icon={<Icons.User />} label="Profile" onClick={() => navigate('profile')} active={screen === 'profile'} />
            {/* Hamburger — tablet/mobile */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#5c5751] hover:bg-[#f5f3ef] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icons.Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} position="left" title="Menu">
        <div className="space-y-1 mb-6">
          {navLinks.map((item, i) => (
            <button
              key={i}
              onClick={() => { navigate(item.screen); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                screen === item.screen ? 'bg-[#f5e8de] text-[#b8724a]' : 'text-[#5c5751] hover:bg-[#f5f3ef] hover:text-[#1a1714]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Divider className="mb-6" />
        <div className="space-y-1">
          {[
            { label: 'My Profile', screen: 'profile' as Screen, icon: <Icons.User /> },
            { label: 'My Orders', screen: 'orders' as Screen, icon: <Icons.Orders /> },
            { label: 'Wishlist', screen: 'wishlist' as Screen, icon: <Icons.Heart /> },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => { navigate(item.screen); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-[#5c5751] hover:bg-[#f5f3ef] hover:text-[#1a1714] transition-colors"
            >
              <span className="text-[#9e9890]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </Drawer>
    </>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function MobileBottomNav({ screen, navigate, cartCount }: {
  screen: Screen; navigate: (s: Screen) => void; cartCount: number;
}) {
  const items: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Icons.Home /> },
    { id: 'shop', label: 'Shop', icon: <Icons.Shop /> },
    { id: 'wishlist', label: 'Saved', icon: <Icons.Heart /> },
    { id: 'cart', label: 'Cart', icon: <Icons.Cart /> },
    { id: 'profile', label: 'Profile', icon: <Icons.User /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e6e1db]" aria-label="Mobile navigation" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {items.map(item => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 min-h-[56px] justify-center text-[10px] font-medium transition-colors ${
                active ? 'text-[#b8724a]' : 'text-[#9e9890] hover:text-[#5c5751]'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <span className="relative">
                {item.icon}
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[9px] font-bold bg-[#b8724a] text-white rounded-full flex items-center justify-center tabular-nums">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Auth Shell ───────────────────────────────────────────────────────────────
function AuthShell({ children, title, subtitle, footer }: {
  children: React.ReactNode; title: string; subtitle: string; footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: decorative image */}
      <div className="hidden md:block relative bg-[#1a1714] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop&auto=format"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1714]/20 to-[#1a1714]/80" />
        <div className="absolute bottom-12 left-12 text-white">
          <div className="text-4xl font-bold tracking-tight mb-3">lume</div>
          <p className="text-white/70 text-lg max-w-xs leading-relaxed">
            Personalized beauty for every skin type and concern.
          </p>
        </div>
      </div>
      {/* Right: form */}
      <div className="flex items-center justify-center p-6 md:p-16 bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <span className="text-2xl font-bold text-[#1a1714]">lume</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1714] mb-2">{title}</h1>
          <p className="text-sm text-[#5c5751] mb-8">{subtitle}</p>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-[#5c5751]">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    try {
      await login({ email, password });
      navigate('home');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your lume account"
      footer={<>Don't have an account? <button className="text-[#b8724a] font-semibold hover:underline" onClick={() => navigate('signup')}>Sign up</button></>}
    >
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
          icon={<Icons.User size={14} />}
        />
        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          iconRight={
            <button type="button" onClick={() => setShowPass(v => !v)} aria-label={showPass ? 'Hide password' : 'Show password'} className="focus:outline-none">
              {showPass ? <Icons.EyeOff /> : <Icons.Eye />}
            </button>
          }
        />
        <div className="flex justify-end">
          <button className="text-sm text-[#b8724a] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] rounded" onClick={() => navigate('forgot-password')}>
            Forgot password?
          </button>
        </div>
        <Button fullWidth loading={loading} onClick={handleLogin}>Sign In</Button>
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e6e1db]" />
          <span className="text-xs text-[#9e9890]">or</span>
          <div className="flex-1 h-px bg-[#e6e1db]" />
        </div>
        <button className="w-full h-10 flex items-center justify-center gap-3 border border-[#e6e1db] rounded-lg text-sm font-medium text-[#1a1714] hover:bg-[#f5f3ef] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a]">
          <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" aria-hidden="true" />
          Continue with Google
        </button>
      </div>
    </AuthShell>
  );
}

// ─── Signup Screen ────────────────────────────────────────────────────────────
function SignupScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required.';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters.';
    setErrors(errs);
    setErrorMsg('');
    if (Object.keys(errs).length) return;
    
    setLoading(true);
    try {
      await register({ name, email, password });
      await login({ email, password });
      navigate('onboarding-skin');
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join lume and discover your perfect beauty routine"
      footer={<>Already have an account? <button className="text-[#b8724a] font-semibold hover:underline" onClick={() => navigate('login')}>Sign in</button></>}
    >
      {errorMsg && <Alert variant="error" className="mb-4">{errorMsg}</Alert>}
      <div className="space-y-4">
        <Input label="Full name" value={name} onChange={setName} placeholder="Maya Chen" required error={errors.name} />
        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required error={errors.email} />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          required
          error={errors.password}
          hint={!errors.password ? 'At least 8 characters' : undefined}
        />
        <p className="text-xs text-[#9e9890]">By creating an account you agree to our Terms of Service and Privacy Policy.</p>
        <Button fullWidth loading={loading} onClick={handleSignup}>Create Account</Button>
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e6e1db]" />
          <span className="text-xs text-[#9e9890]">or</span>
          <div className="flex-1 h-px bg-[#e6e1db]" />
        </div>
        <button className="w-full h-10 flex items-center justify-center gap-3 border border-[#e6e1db] rounded-lg text-sm font-medium text-[#1a1714] hover:bg-[#f5f3ef] transition-colors">
          <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" aria-hidden="true" />
          Sign up with Google
        </button>
      </div>
    </AuthShell>
  );
}

// ─── Forgot Password Screen ───────────────────────────────────────────────────
function ForgotPasswordScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSend = () => {
    if (!email.trim() || !email.includes('@')) { setEmailError('Please enter a valid email address.'); return; }
    setEmailError('');
    setSent(true);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={<button className="text-[#b8724a] font-semibold hover:underline" onClick={() => navigate('login')}>Back to sign in</button>}
    >
      {sent ? (
        <Alert variant="success" title="Reset link sent">Check your inbox for a password reset link. It expires in 1 hour.</Alert>
      ) : (
        <div className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required error={emailError} />
          <Button fullWidth onClick={handleSend}>Send Reset Link</Button>
        </div>
      )}
    </AuthShell>
  );
}

// ─── OTP Screen ───────────────────────────────────────────────────────────────
function OTPScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    const nd = [...digits];
    nd[i] = val.slice(-1);
    setDigits(nd);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  return (
    <AuthShell title="Verify your identity" subtitle="Enter the 6-digit code sent to your phone">
      <div className="space-y-6">
        <div className="flex gap-2 justify-center" role="group" aria-label="Verification code">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label={`Digit ${i + 1}`}
              className="w-10 h-12 sm:w-11 text-center text-lg font-bold border-2 border-[#e6e1db] rounded-lg outline-none focus:border-[#b8724a] transition-colors bg-white text-[#1a1714]"
            />
          ))}
        </div>
        <Button fullWidth onClick={() => navigate('home')}>Verify Code</Button>
        <div className="text-center text-sm text-[#9e9890]">
          Didn't receive a code?{' '}
          <button className="text-[#b8724a] font-medium hover:underline">Resend</button>
        </div>
      </div>
    </AuthShell>
  );
}

// ─── Onboarding Shell ─────────────────────────────────────────────────────────
function OnboardingShell({ children, step, title, subtitle, onNext, onBack, nextLabel = 'Continue' }: {
  children: React.ReactNode; step: number; title: string; subtitle: string;
  onNext: () => void; onBack?: () => void; nextLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full h-1 bg-[#ece9e2]" role="progressbar" aria-valuenow={step} aria-valuemax={5} aria-label={`Step ${step} of 5`}>
        <div className="h-full bg-[#b8724a] transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl font-bold text-[#1a1714]">lume</span>
            <span className="text-sm text-[#9e9890]">Step {step} of 5</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1714] mb-2">{title}</h2>
          <p className="text-sm text-[#5c5751] mb-8">{subtitle}</p>
          {children}
          <div className="flex items-center justify-between mt-8">
            {onBack ? (
              <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#5c5751] hover:text-[#1a1714] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] rounded px-1">
                <Icons.ArrowLeft />
                Back
              </button>
            ) : <div />}
            <Button onClick={onNext} iconRight={<Icons.ArrowRight />}>{nextLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingSkinType({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState('');
  const types = [
    { id: 'normal', label: 'Normal', desc: 'Well-balanced, few imperfections' },
    { id: 'dry', label: 'Dry', desc: 'Feels tight, may flake' },
    { id: 'oily', label: 'Oily', desc: 'Shiny, enlarged pores' },
    { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
    { id: 'sensitive', label: 'Sensitive', desc: 'Easily irritated, reacts to products' },
    { id: 'unknown', label: 'Not Sure', desc: "We'll help you figure it out" },
  ];
  return (
    <OnboardingShell step={1} title="What's your skin type?" subtitle="We'll use this to personalize your recommendations." onNext={() => navigate('onboarding-concerns')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            aria-pressed={selected === t.id}
            className={`p-4 rounded-xl border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] ${selected === t.id ? 'border-[#b8724a] bg-[#f5e8de]' : 'border-[#e6e1db] hover:border-[#c8c3bc]'}`}
          >
            <p className="font-semibold text-[#1a1714] text-sm">{t.label}</p>
            <p className="text-xs text-[#5c5751] mt-0.5">{t.desc}</p>
          </button>
        ))}
      </div>
    </OnboardingShell>
  );
}

function OnboardingConcerns({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (c: string) => setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  return (
    <OnboardingShell step={2} title="Your skin concerns" subtitle="Select up to 5 concerns you'd like to address." onNext={() => navigate('onboarding-tone')} onBack={() => navigate('onboarding-skin')}>
      <div className="flex flex-wrap gap-2">
        {SKIN_CONCERNS.map(c => (
          <button
            key={c}
            onClick={() => toggle(c)}
            disabled={!selected.includes(c) && selected.length >= 5}
            aria-pressed={selected.includes(c)}
            className={`px-3 py-2 rounded-full text-sm border-2 transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a]
              ${selected.includes(c) ? 'border-[#b8724a] bg-[#b8724a] text-white' : 'border-[#e6e1db] text-[#5c5751] hover:border-[#c8c3bc] disabled:opacity-40 disabled:cursor-not-allowed'}`}
          >
            {c}
          </button>
        ))}
      </div>
      {selected.length > 0 && <p className="text-xs text-[#9e9890] mt-3">{selected.length}/5 selected</p>}
    </OnboardingShell>
  );
}

function OnboardingTone({ navigate }: { navigate: (s: Screen) => void }) {
  const [tone, setTone] = useState('');
  const [undertone, setUndertone] = useState('');
  const tones = [
    { id: 'fair', label: 'Fair', hex: '#FDDBB4' },
    { id: 'light', label: 'Light', hex: '#F0C693' },
    { id: 'medium', label: 'Medium', hex: '#D9A96E' },
    { id: 'tan', label: 'Tan', hex: '#C07840' },
    { id: 'deep', label: 'Deep', hex: '#7D4A20' },
    { id: 'rich', label: 'Rich', hex: '#3D1F10' },
  ];
  const undertones = [
    { id: 'warm', label: 'Warm', desc: 'Yellow, peachy, golden' },
    { id: 'cool', label: 'Cool', desc: 'Pink, red, bluish' },
    { id: 'neutral', label: 'Neutral', desc: 'Mix of warm and cool' },
    { id: 'unknown', label: 'Not Sure', desc: 'Skip for now' },
  ];
  return (
    <OnboardingShell step={3} title="Skin tone & undertone" subtitle="This helps us match shades and foundations to you." onNext={() => navigate('onboarding-ingredients')} onBack={() => navigate('onboarding-concerns')}>
      <div>
        <p className="text-sm font-semibold text-[#1a1714] mb-3">Skin Tone</p>
        <div className="flex gap-3 mb-6 flex-wrap">
          {tones.map(t => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              aria-pressed={tone === t.id}
              aria-label={t.label}
              className="flex flex-col items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] rounded-full"
            >
              <div
                className={`w-10 h-10 rounded-full border-4 transition-all ${tone === t.id ? 'border-[#b8724a] scale-110' : 'border-transparent hover:border-[#c8c3bc]'}`}
                style={{ backgroundColor: t.hex }}
              />
              <span className={`text-xs ${tone === t.id ? 'font-semibold text-[#1a1714]' : 'text-[#9e9890]'}`}>{t.label}</span>
            </button>
          ))}
        </div>
        <p className="text-sm font-semibold text-[#1a1714] mb-3">Undertone</p>
        <div className="grid grid-cols-2 gap-2">
          {undertones.map(u => (
            <button
              key={u.id}
              onClick={() => setUndertone(u.id)}
              aria-pressed={undertone === u.id}
              className={`p-3 rounded-xl border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] ${undertone === u.id ? 'border-[#b8724a] bg-[#f5e8de]' : 'border-[#e6e1db] hover:border-[#c8c3bc]'}`}
            >
              <p className="font-semibold text-[#1a1714] text-sm">{u.label}</p>
              <p className="text-xs text-[#5c5751] mt-0.5">{u.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </OnboardingShell>
  );
}

function OnboardingIngredients({ navigate }: { navigate: (s: Screen) => void }) {
  const [avoided, setAvoided] = useState<string[]>([]);
  const toggle = (i: string) => setAvoided(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  return (
    <OnboardingShell step={4} title="Ingredients to avoid" subtitle="We'll warn you if a product contains these ingredients." onNext={() => navigate('onboarding-summary')} onBack={() => navigate('onboarding-tone')}>
      <div className="flex flex-wrap gap-2">
        {AVOIDED_INGREDIENTS.map(i => (
          <button
            key={i}
            onClick={() => toggle(i)}
            aria-pressed={avoided.includes(i)}
            className={`px-3 py-2 rounded-full text-sm border-2 transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a]
              ${avoided.includes(i) ? 'border-[#dc2626] bg-[#fef2f2] text-[#991b1b]' : 'border-[#e6e1db] text-[#5c5751] hover:border-[#c8c3bc]'}`}
          >
            {i}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#9e9890] mt-3">You can always update this in your profile settings.</p>
    </OnboardingShell>
  );
}

function OnboardingSummary({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <OnboardingShell step={5} title="Your skin profile is ready" subtitle="Here's a summary of your personalized settings." onNext={() => navigate('home')} onBack={() => navigate('onboarding-ingredients')} nextLabel="Start Shopping">
      <div className="space-y-3">
        {[
          { label: 'Skin Type', value: 'Combination' },
          { label: 'Concerns', value: 'Dark Spots, Dullness, Large Pores' },
          { label: 'Skin Tone', value: 'Medium — Warm Undertone' },
          { label: 'Avoiding', value: 'Fragrance, Parabens' },
        ].map(item => (
          <div key={item.label} className="flex items-start gap-3 p-4 bg-[#f5f3ef] rounded-xl">
            <div className="w-5 h-5 rounded-full bg-[#b8724a] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icons.Check size={10} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9e9890] uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-medium text-[#1a1714] mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#9e9890] mt-4">You can update your profile at any time from account settings.</p>
    </OnboardingShell>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, wishlisted, onWishlist, onAddToCart, onProduct, showMatch = true }: {
  product: Product;
  wishlisted: boolean;
  onWishlist: (id: string) => void;
  onAddToCart: (p: Product) => void;
  onProduct: (p: Product) => void;
  showMatch?: boolean;
}) {
  return (
    <div className="group bg-white border border-[#e6e1db] rounded-xl overflow-hidden hover:border-[#c8c3bc] hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-[#f5f3ef] overflow-hidden">
        <button onClick={() => onProduct(product)} className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b8724a]" aria-label={`View ${product.name}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#5c5751] bg-white px-3 py-1 rounded-full border border-[#e6e1db]">Out of Stock</span>
          </div>
        )}
        {product.originalPrice && (
          <div className="absolute top-2 left-2">
            <span className="text-xs font-bold bg-[#b8724a] text-white px-2 py-0.5 rounded-full">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% off
            </span>
          </div>
        )}
        <button
          onClick={() => onWishlist(product.id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] ${wishlisted ? 'text-[#b8724a]' : 'text-[#9e9890] hover:text-[#b8724a]'}`}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
        >
          {wishlisted ? <Icons.HeartFilled size={14} /> : <Icons.Heart size={14} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-[#9e9890] font-medium">{product.brand}</p>
        <button onClick={() => onProduct(product)} className="block text-left w-full">
          <p className="text-sm font-semibold text-[#1a1714] leading-tight mt-0.5 line-clamp-2 hover:text-[#b8724a] transition-colors">{product.name}</p>
        </button>
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} size={11} />
          <span className="text-xs text-[#9e9890]">({product.reviewCount.toLocaleString()})</span>
        </div>
        {showMatch && product.matchScore && (
          <div className="mt-2">
            <MatchChip score={product.matchScore} compact />
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-base font-bold text-[#1a1714]">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#9e9890] line-through ml-1.5">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="w-8 h-8 rounded-lg bg-[#1a1714] text-white flex items-center justify-center hover:bg-[#2e2a26] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a]"
            aria-label={`Add ${product.name} to cart`}
          >
            <Icons.Plus />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({ navigate, wishlist, onWishlist, onAddToCart, onProduct, products }: {
  navigate: (s: Screen) => void;
  wishlist: string[]; onWishlist: (id: string) => void;
  onAddToCart: (p: Product) => void;
  onProduct: (p: Product) => void;
  products: Product[];
}) {
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8 space-y-10 md:space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1a1714] min-h-[280px] md:min-h-[360px] flex items-end">
        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=500&fit=crop&auto=format"
          alt="Beauty collection"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          loading="eager"
        />
        <div className="relative z-10 p-6 md:p-12 text-white w-full">
          <Badge variant="brand" className="mb-3">New Arrivals</Badge>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight max-w-xl">
            Your skin deserves<br />exactly this.
          </h1>
          <p className="text-white/70 text-sm md:text-base mb-5 max-w-md">
            Personalized recommendations matched to your skin type, concerns, and preferences.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button size="lg" variant="secondary" onClick={() => navigate('shop')}>Shop For You</Button>
            <button onClick={() => navigate('shop')} className="h-12 px-5 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors">
              Explore All
            </button>
          </div>
        </div>
      </section>

      {/* Skin profile promo */}
      <div className="bg-[#f5e8de] rounded-2xl p-4 md:p-6 flex items-start md:items-center gap-4">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-[#b8724a] rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <Icons.Skin size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1a1714] text-base">Your skin profile is active</h3>
          <p className="text-sm text-[#5c5751] mt-0.5">All products are matched to your skin type, tone, and ingredient preferences.</p>
        </div>
        <button
          onClick={() => navigate('skin-profile')}
          className="text-sm text-[#b8724a] font-semibold hover:underline whitespace-nowrap flex-shrink-0 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] rounded"
        >
          Edit
          <Icons.ArrowRight />
        </button>
      </div>

      {/* Categories */}
      <section>
        <SectionHeader
          title="Shop by Category"
          action={<button className="text-sm text-[#b8724a] font-semibold hover:underline flex items-center gap-1" onClick={() => navigate('shop')}>View all <Icons.ArrowRight /></button>}
          className="mb-4"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('shop')}
              className="flex flex-col items-center gap-2 flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] rounded-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#f5f3ef] group-hover:bg-[#f5e8de] transition-colors flex items-center justify-center text-[#5c5751] group-hover:text-[#b8724a]">
                <CategoryIcon icon={cat.icon} size={24} />
              </div>
              <span className="text-xs font-medium text-[#5c5751] whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Top picks */}
      <section>
        <SectionHeader
          title="Top Picks For You"
          description="Matched to your skin profile"
          action={<button className="text-sm text-[#b8724a] font-semibold hover:underline flex items-center gap-1" onClick={() => navigate('shop')}>See all <Icons.ArrowRight /></button>}
          className="mb-4"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.slice(0, 4).map(p => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={onWishlist}
              onAddToCart={onAddToCart}
              onProduct={onProduct}
            />
          ))}
        </div>
      </section>

      {/* All products */}
      <section>
        <SectionHeader title="Trending Now" className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={onWishlist}
              onAddToCart={onAddToCart}
              onProduct={onProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────
function FilterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => { setSelectedCats([]); setMinRating(0); setInStockOnly(false); }}>Reset</Button>
          <Button fullWidth onClick={onClose}>Apply Filters</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <p className="text-sm font-semibold text-[#1a1714] mb-3">Category</p>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <Checkbox
                key={cat.id}
                checked={selectedCats.includes(cat.id)}
                onChange={(v) => setSelectedCats(prev => v ? [...prev, cat.id] : prev.filter(x => x !== cat.id))}
                label={cat.name}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* Price */}
        <div>
          <p className="text-sm font-semibold text-[#1a1714] mb-3">Price Range</p>
          <div className="flex items-center gap-3">
            <Input value={String(priceRange[0])} onChange={v => setPriceRange([Number(v), priceRange[1]])} placeholder="$0" className="flex-1" />
            <span className="text-[#9e9890]">—</span>
            <Input value={String(priceRange[1])} onChange={v => setPriceRange([priceRange[0], Number(v)])} placeholder="$200" className="flex-1" />
          </div>
        </div>

        <Divider />

        {/* Rating */}
        <div>
          <p className="text-sm font-semibold text-[#1a1714] mb-3">Minimum Rating</p>
          <div className="space-y-2">
            {[4, 3, 2].map(r => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                aria-pressed={minRating === r}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${minRating === r ? 'border-[#b8724a] bg-[#f5e8de]' : 'border-[#e6e1db] hover:border-[#c8c3bc]'}`}
              >
                <StarRating rating={r} size={12} />
                <span className="text-sm text-[#5c5751]">& above</span>
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* In stock */}
        <Toggle checked={inStockOnly} onChange={setInStockOnly} label="In stock only" />
      </div>
    </Drawer>
  );
}

// ─── Shop Screen ──────────────────────────────────────────────────────────────
function ShopScreen({ navigate, wishlist, onWishlist, onAddToCart, onProduct, filterOpen, setFilterOpen, products }: {
  navigate: (s: Screen) => void;
  wishlist: string[]; onWishlist: (id: string) => void;
  onAddToCart: (p: Product) => void; onProduct: (p: Product) => void;
  filterOpen: boolean; setFilterOpen: (v: boolean) => void;
  products: Product[];
}) {
  const [sortBy, setSortBy] = useState('recommended');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // If we had a date field we would sort by it. Fallback to reverse ID for now.
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'recommended':
      default:
        // Keep default order (which could be the backend's default recommended order)
        break;
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1a1714]">Shop All Products</h1>
          <p className="text-sm text-[#9e9890] mt-0.5">{filteredProducts.length} products</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" icon={<Icons.Filter />} onClick={() => setFilterOpen(true)}>
            Filter
          </Button>
          <Select
            value={sortBy}
            onChange={setSortBy}
            className="w-40 hidden sm:block"
            options={[
              { value: 'recommended', label: 'Recommended' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'rating', label: 'Top Rated' },
              { value: 'newest', label: 'Newest' },
            ]}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
        {['all', ...CATEGORIES.map(c => c.name)].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] ${
              activeCategory === cat ? 'bg-[#1a1714] text-white' : 'bg-white border border-[#e6e1db] text-[#5c5751] hover:border-[#c8c3bc]'
            }`}
          >
            {cat === 'all' ? 'All Products' : cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Icons.Shop size={32} />}
          title="No products found"
          description="Try adjusting your filters or search terms."
          action={<Button variant="outline" onClick={() => setActiveCategory('all')}>Clear Filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={onWishlist}
              onAddToCart={onAddToCart}
              onProduct={onProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Search Screen ────────────────────────────────────────────────────────────
function SearchScreen({ query, navigate, onProduct, onAddToCart, products }: {
  query: string; navigate: (s: Screen) => void;
  onProduct: (p: Product) => void; onAddToCart: (p: Product) => void;
  products: Product[];
}) {
  const [q, setQ] = useState(query);
  
  useEffect(() => {
    setQ(query);
  }, [query]);

  const normalizedQ = q.trim().toLowerCase();
  const results = normalizedQ
    ? products.filter(p =>
        p.name.toLowerCase().includes(normalizedQ) ||
        p.brand.toLowerCase().includes(normalizedQ) ||
        p.category.toLowerCase().includes(normalizedQ) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(normalizedQ))) ||
        (p.description && p.description.toLowerCase().includes(normalizedQ))
      )
    : [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder="Search products, brands, categories..."
            className="w-full"
          />
        </div>

        {q.trim() === '' && (
          <div>
            <p className="text-sm font-semibold text-[#1a1714] mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Vitamin C Serum', 'Foundation', 'Moisturizer', 'Eye Cream', 'Lip Balm', 'SPF'].map(s => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="px-3 py-1.5 rounded-full text-sm border border-[#e6e1db] text-[#5c5751] hover:border-[#b8724a] hover:text-[#b8724a] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {q.trim() !== '' && results.length === 0 && (
          <EmptyState
            icon={<Icons.Search size={32} />}
            title={`No results for "${q}"`}
            description="Try different search terms or browse our categories."
            action={<Button variant="outline" onClick={() => navigate('shop')}>Browse All Products</Button>}
          />
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-[#9e9890] mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for "{q}"</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {results.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                wishlisted={false}
                onWishlist={() => {}}
                onAddToCart={onAddToCart}
                onProduct={onProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product Detail Screen ────────────────────────────────────────────────────
function ProductDetailScreen({ product, navigate, wishlist, onWishlist, onAddToCart, compareList, onCompare }: {
  product: Product; navigate: (s: Screen) => void;
  wishlist: string[]; onWishlist: (id: string) => void;
  onAddToCart: (p: Product) => void;
  compareList: string[]; onCompare: (id: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const wishlisted = wishlist.includes(product.id);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    api.reviews.list(product.id).then(setReviews).catch(console.error);
  }, [product.id]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title={product.name}
        breadcrumbs={[{ label: 'Shop', onClick: () => navigate('shop') }, { label: product.category, onClick: () => navigate('shop') }, { label: product.name }]}
      />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f5f3ef] mb-3">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-sm font-semibold text-[#5c5751] bg-white px-4 py-2 rounded-full border border-[#e6e1db]">Out of Stock</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${activeImg === i ? 'border-[#b8724a]' : 'border-[#e6e1db] hover:border-[#c8c3bc]'}`}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={activeImg === i}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-semibold text-[#9e9890] uppercase tracking-wider mb-1">{product.brand}</p>
          <h1 className="text-xl md:text-2xl font-bold text-[#1a1714] mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <StarRating rating={product.rating} showValue size={14} />
            <span className="text-sm text-[#9e9890]">({product.reviewCount.toLocaleString()} reviews)</span>
          </div>

          {product.matchScore && (
            <div className="mb-4 inline-block">
              <MatchChip score={product.matchScore} details={product.matchDetails} />
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl font-bold text-[#1a1714]">${selectedVariant?.price ?? product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-[#9e9890] line-through">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <Badge variant="brand">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</Badge>
            )}
          </div>

          {/* Shade/Variant selector */}
          {product.variants && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#1a1714] mb-2">
                Shade: <span className="font-normal text-[#5c5751]">{selectedVariant?.shade ?? 'Select'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                    aria-pressed={selectedVariant?.id === v.id}
                    aria-label={`${v.shade} ${v.stock === 0 ? '— out of stock' : ''}`}
                    className={`w-8 h-8 rounded-full border-4 transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] ${
                      selectedVariant?.id === v.id ? 'border-[#b8724a] scale-110' : 'border-transparent hover:border-[#c8c3bc]'
                    } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: v.hexColor }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <QuantitySelector value={qty} onChange={setQty} min={1} max={selectedVariant?.stock ?? 10} />
            <Button
              variant="primary"
              size="lg"
              disabled={!product.inStock || (selectedVariant ? selectedVariant.stock === 0 : false)}
              onClick={() => onAddToCart(product)}
              className="flex-1 min-w-0"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          {/* Secondary actions */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => onWishlist(product.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${wishlisted ? 'border-[#b8724a] bg-[#f5e8de] text-[#b8724a]' : 'border-[#e6e1db] text-[#5c5751] hover:border-[#c8c3bc]'}`}
              aria-pressed={wishlisted}
            >
              {wishlisted ? <Icons.HeartFilled size={14} /> : <Icons.Heart size={14} />}
              {wishlisted ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => onCompare(product.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${compareList.includes(product.id) ? 'border-[#1a1714] bg-[#f5f3ef]' : 'border-[#e6e1db] text-[#5c5751] hover:border-[#c8c3bc]'}`}
            >
              <Icons.Layers size={14} />
              Compare
            </button>
            <button
              onClick={() => navigate('shade-finder')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e6e1db] text-sm font-medium text-[#5c5751] hover:border-[#c8c3bc] transition-all"
            >
              <Icons.Palette size={14} />
              Shade Finder
            </button>
          </div>

          {/* Delivery info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Icons.Truck size={16} />, label: 'Free shipping on orders over $50' },
              { icon: <Icons.Rotate size={16} />, label: '30-day easy returns' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-[#f5f3ef] rounded-xl">
                <span className="text-[#5c5751] mt-0.5 flex-shrink-0">{item.icon}</span>
                <span className="text-xs text-[#5c5751] leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Info Tabs */}
      <div className="mt-10 md:mt-12">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'ingredients', label: 'Ingredients' },
            { id: 'reviews', label: 'Reviews', count: product.reviewCount },
          ]}
          active={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold text-[#1a1714] mb-3">Description</h3>
              <p className="text-sm text-[#5c5751] leading-relaxed">{product.description}</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1a1714] mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-[#5c5751]">
                    <span className="w-5 h-5 rounded-full bg-[#f5e8de] text-[#b8724a] flex items-center justify-center flex-shrink-0">
                      <Icons.Check size={10} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-3">
            {product.ingredients.map(ing => (
              <div key={ing.id} className={`p-4 rounded-xl border ${ing.flagged ? 'border-[#fca5a5] bg-[#fef2f2]' : 'border-[#e6e1db] bg-white'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${ing.flagged ? 'bg-[#fca5a5] text-[#991b1b]' : 'bg-[#f5e8de] text-[#b8724a]'}`}>
                    {ing.flagged ? <Icons.Warning size={12} /> : <Icons.Check size={10} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#1a1714]">{ing.name}</span>
                      <Badge variant={ing.flagged ? 'error' : 'neutral'} size="sm">{ing.purpose}</Badge>
                      {ing.commonlyAvoided && <Badge variant="warning" size="sm">Commonly avoided</Badge>}
                    </div>
                    <p className="text-xs text-[#5c5751] mt-1">{ing.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#f5f3ef] rounded-xl">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1a1714]">{product.rating}</p>
                <StarRating rating={product.rating} size={16} />
                <p className="text-xs text-[#9e9890] mt-1">{product.reviewCount.toLocaleString()} reviews</p>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(r => (
                  <div key={r} className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#9e9890] w-3">{r}</span>
                    <ProgressBar value={r === 5 ? 65 : r === 4 ? 20 : r === 3 ? 8 : r === 2 ? 4 : 3} className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="p-4 border border-[#e6e1db] rounded-xl bg-white">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar src={review.avatar} name={review.author} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#1a1714]">{review.author}</span>
                        {review.verified && <Badge variant="success" size="sm">Verified</Badge>}
                        <Badge size="sm">{review.skinType}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} size={12} />
                        <span className="text-xs text-[#9e9890]">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1714] mb-1">{review.title}</p>
                  <p className="text-sm text-[#5c5751] leading-relaxed">{review.body}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-[#9e9890]">
                    <Icons.Check size={12} />
                    <span>{review.helpful} found this helpful</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Wishlist Screen ──────────────────────────────────────────────────────────
function WishlistScreen({ wishlist, navigate, onProduct, onAddToCart, onRemove, products }: {
  wishlist: string[]; navigate: (s: Screen) => void;
  onProduct: (p: Product) => void; onAddToCart: (p: Product) => void;
  onRemove: (id: string) => void;
  products: Product[];
}) {
  const wishlisted = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
      <PageHeader title="Wishlist" description={`${wishlisted.length} saved item${wishlisted.length !== 1 ? 's' : ''}`} />

      {wishlisted.length === 0 ? (
        <EmptyState
          icon={<Icons.Heart size={36} />}
          title="Your wishlist is empty"
          description="Save products you love to find them easily later."
          action={<Button onClick={() => navigate('shop')}>Browse Products</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {wishlisted.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={true}
              onWishlist={onRemove}
              onAddToCart={onAddToCart}
              onProduct={onProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Cart Screen ──────────────────────────────────────────────────────────────
function CartScreen({ cart, setCart, navigate, showToast }: {
  cart: Array<{ product: Product; qty: number }>;
  setCart: React.Dispatch<React.SetStateAction<Array<{ product: Product; qty: number }>>>;
  navigate: (s: Screen) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const updateQty = (id: string, qty: number) => {
    if (qty === 0) {
      setCart(prev => prev.filter(i => i.product.id !== id));
    } else {
      setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
    }
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(i => i.product.id !== id));
    showToast('Item removed from cart', 'warning');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
      <PageHeader title="Shopping Cart" description={`${cart.length} item${cart.length !== 1 ? 's' : ''}`} />

      {cart.length === 0 ? (
        <EmptyState
          icon={<Icons.Cart size={36} />}
          title="Your cart is empty"
          description="Add products to your cart to continue shopping."
          action={<Button onClick={() => navigate('shop')}>Browse Products</Button>}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <div key={item.product.id} className="bg-white border border-[#e6e1db] rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#f5f3ef] flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#9e9890]">{item.product.brand}</p>
                    <p className="text-sm font-semibold text-[#1a1714] leading-tight">{item.product.name}</p>
                    <p className="text-base font-bold text-[#1a1714] mt-1">${item.product.price}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9e9890] hover:text-[#991b1b] hover:bg-[#fef2f2] transition-colors flex-shrink-0"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Icons.Trash />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f5f3ef]">
                  <QuantitySelector value={item.qty} onChange={qty => updateQty(item.product.id, qty)} min={0} max={10} />
                  <span className="text-sm font-bold text-[#1a1714]">${(item.product.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e6e1db] rounded-xl p-5 sticky top-20">
              <h2 className="text-base font-bold text-[#1a1714] mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#5c5751]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1a1714]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5c5751]">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-[#166534]' : 'text-[#1a1714]'}`}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#9e9890]">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>
                )}
                <Divider />
                <div className="flex justify-between font-bold text-[#1a1714]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button fullWidth size="lg" className="mt-5" onClick={() => navigate('checkout-address')}>
                Proceed to Checkout
              </Button>
              <button
                className="w-full mt-3 text-center text-sm text-[#b8724a] hover:underline"
                onClick={() => navigate('shop')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Checkout Screens ─────────────────────────────────────────────────────────
function CheckoutShell({ children, step, steps }: {
  children: React.ReactNode; step: number; steps: string[];
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-8 overflow-x-auto pb-2">
        <Stepper steps={steps} current={step} />
      </div>
      {children}
    </div>
  );
}

const CHECKOUT_STEPS = ['Address', 'Delivery', 'Payment', 'Confirm'];

function CheckoutAddressScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [name, setName] = useState('Maya Chen');
  const [line1, setLine1] = useState('42 Blossom Lane');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94105');
  const [phone, setPhone] = useState('+1 (415) 555-0192');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!line1.trim()) errs.line1 = 'Address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!zip.trim()) errs.zip = 'ZIP code is required';
    setErrors(errs);
    if (Object.keys(errs).length === 0) navigate('checkout-delivery');
  };

  return (
    <CheckoutShell step={0} steps={CHECKOUT_STEPS}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-[#1a1714] mb-5">Delivery Address</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full name" value={name} onChange={setName} required className="sm:col-span-2" error={errors.name} />
            <Input label="Street address" value={line1} onChange={setLine1} required className="sm:col-span-2" error={errors.line1} />
            <Input label="City" value={city} onChange={setCity} required error={errors.city} />
            <Input label="State" value={state} onChange={setState} required />
            <Input label="ZIP code" value={zip} onChange={setZip} required error={errors.zip} />
            <Input label="Phone" value={phone} onChange={setPhone} type="tel" />
          </div>
          <Button className="mt-6" onClick={handleNext} iconRight={<Icons.ArrowRight />}>Continue to Delivery</Button>
        </div>
        <div className="lg:col-span-1">
          <OrderSummaryMini />
        </div>
      </div>
    </CheckoutShell>
  );
}

function CheckoutDeliveryScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState('standard');
  const options = [
    { id: 'standard', label: 'Standard', desc: '5–7 business days', price: 0 },
    { id: 'express', label: 'Express', desc: '2–3 business days', price: 8.99 },
    { id: 'overnight', label: 'Overnight', desc: 'Next business day', price: 19.99 },
  ];
  return (
    <CheckoutShell step={1} steps={CHECKOUT_STEPS}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-[#1a1714] mb-5">Delivery Method</h2>
          <div className="space-y-3">
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                aria-pressed={selected === opt.id}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selected === opt.id ? 'border-[#b8724a] bg-[#f5e8de]' : 'border-[#e6e1db] hover:border-[#c8c3bc] bg-white'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected === opt.id ? 'border-[#b8724a]' : 'border-[#c5c0b5]'}`}>
                  {selected === opt.id && <div className="w-2 h-2 rounded-full bg-[#b8724a]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a1714]">{opt.label}</p>
                  <p className="text-xs text-[#9e9890]">{opt.desc}</p>
                </div>
                <span className="text-sm font-semibold text-[#1a1714]">{opt.price === 0 ? 'Free' : `$${opt.price.toFixed(2)}`}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => navigate('checkout-address')} icon={<Icons.ArrowLeft />}>Back</Button>
            <Button onClick={() => navigate('checkout-payment')} iconRight={<Icons.ArrowRight />}>Continue to Payment</Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <OrderSummaryMini />
        </div>
      </div>
    </CheckoutShell>
  );
}

function CheckoutPaymentScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    navigate('payment-processing');
  };

  return (
    <CheckoutShell step={2} steps={CHECKOUT_STEPS}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-[#1a1714] mb-5">Payment</h2>
          <div className="space-y-4">
            <Input
              label="Card number"
              value={cardNum}
              onChange={setCardNum}
              placeholder="1234 5678 9012 3456"
              icon={<Icons.CreditCard />}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry date" value={expiry} onChange={setExpiry} placeholder="MM / YY" required />
              <Input label="CVV" value={cvv} onChange={setCvv} placeholder="123" required />
            </div>
            <Input label="Name on card" value={name} onChange={setName} placeholder="Maya Chen" required />
          </div>
          <div className="flex items-center gap-2 mt-4 p-3 bg-[#f5f3ef] rounded-lg">
            <Icons.Shield size={16} />
            <p className="text-xs text-[#5c5751]">Your payment info is encrypted and secure.</p>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => navigate('checkout-delivery')} icon={<Icons.ArrowLeft />}>Back</Button>
            <Button loading={loading} onClick={handlePay} className="flex-1">Pay Now</Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <OrderSummaryMini />
        </div>
      </div>
    </CheckoutShell>
  );
}

function OrderSummaryMini() {
  return (
    <div className="bg-[#f5f3ef] rounded-xl p-4">
      <p className="text-sm font-semibold text-[#1a1714] mb-3">Order Summary</p>
      <div className="space-y-2 text-sm text-[#5c5751]">
        <div className="flex justify-between"><span>2 items</span><span className="font-medium text-[#1a1714]">$110.00</span></div>
        <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-[#166534]">Free</span></div>
        <Divider className="my-2" />
        <div className="flex justify-between font-bold text-[#1a1714]"><span>Total</span><span>$110.00</span></div>
      </div>
    </div>
  );
}

function PaymentProcessingScreen({ navigate, cart, setCart, setOrders }: { 
  navigate: (s: Screen) => void;
  cart: Array<{ product: Product; qty: number }>;
  setCart: (c: Array<any>) => void;
  setOrders: (o: any) => void;
}) {
  useEffect(() => {
    const processOrder = async () => {
      try {
        const orderData = {
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.qty,
            price: item.product.price
          })),
          totalAmount: cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0),
          addressId: 1, // Default mock address ID
          paymentMethod: 'Credit Card' // Default mock payment
        };
        
        await api.orders.create(orderData);
        const newOrders = await api.orders.list();
        if (newOrders) setOrders(newOrders);
        
        setCart([]);
        navigate('order-confirm');
      } catch (err) {
        console.error(err);
        navigate('payment-failed');
      }
    };
    
    // Slight delay for UX
    const t = setTimeout(processOrder, 1500);
    return () => clearTimeout(t);
  }, [navigate, cart, setCart, setOrders]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <Spinner size={48} />
      <p className="mt-6 text-lg font-semibold text-[#1a1714]">Processing your payment…</p>
      <p className="text-sm text-[#9e9890] mt-2">Please don't close this window.</p>
    </div>
  );
}

function PaymentFailedScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-full bg-[#fef2f2] flex items-center justify-center mb-4 text-[#991b1b]">
        <Icons.Close size={28} />
      </div>
      <h2 className="text-xl font-bold text-[#1a1714] mb-2">Payment failed</h2>
      <p className="text-sm text-[#5c5751] mb-6">Something went wrong with your payment. Please check your card details and try again.</p>
      <div className="flex flex-col gap-3 w-full">
        <Button fullWidth onClick={() => navigate('checkout-payment')}>Try Again</Button>
        <Button variant="outline" fullWidth onClick={() => navigate('cart')}>Back to Cart</Button>
      </div>
    </div>
  );
}

function OrderConfirmScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-4 text-[#166534]">
        <Icons.Check size={28} />
      </div>
      <h2 className="text-xl font-bold text-[#1a1714] mb-2">Order placed!</h2>
      <p className="text-sm text-[#5c5751] mb-1">Order #ORD-2024-9901</p>
      <p className="text-sm text-[#9e9890] mb-6">We've sent a confirmation to your email. Your order will arrive in 5–7 business days.</p>
      <div className="flex flex-col gap-3 w-full">
        <Button fullWidth onClick={() => navigate('orders')}>View Order</Button>
        <Button variant="outline" fullWidth onClick={() => navigate('home')}>Continue Shopping</Button>
      </div>
    </div>
  );
}

// ─── Orders Screen ────────────────────────────────────────────────────────────
const ORDER_STATUS_LABELS: Record<string, string> = {
  processing: 'Processing',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const ORDER_STATUS_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'neutral'> = {
  processing: 'warning',
  confirmed: 'info',
  shipped: 'brand',
  out_for_delivery: 'brand',
  delivered: 'success',
  cancelled: 'error',
  returned: 'neutral',
};

function OrdersScreen({ navigate, onOrderDetail, orders }: {
  navigate: (s: Screen) => void;
  onOrderDetail: (o: Order) => void;
  orders: Order[];
}) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <PageHeader title="My Orders" />

      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: orders.length },
          { id: 'shipped', label: 'Shipped' },
          { id: 'delivered', label: 'Delivered' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<Icons.Orders size={36} />} title="No orders yet" description="Your orders will appear here." action={<Button onClick={() => navigate('shop')}>Start Shopping</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <button
              key={order.id}
              onClick={() => onOrderDetail(order)}
              className="w-full text-left bg-white border border-[#e6e1db] rounded-xl p-4 hover:border-[#c8c3bc] hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#1a1714]">{order.id}</p>
                  <p className="text-xs text-[#9e9890] mt-0.5">{order.date} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                  <Icons.ChevronRight />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-[#f5f3ef] flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-lg bg-[#f5f3ef] flex items-center justify-center text-xs font-semibold text-[#5c5751]">
                    +{order.items.length - 3}
                  </div>
                )}
                <div className="ml-auto text-sm font-bold text-[#1a1714]">${order.total.toFixed(2)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Order Detail Screen ──────────────────────────────────────────────────────
function OrderDetailScreen({ order, navigate }: { order: Order; navigate: (s: Screen) => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title={order.id}
        breadcrumbs={[{ label: 'Orders', onClick: () => navigate('orders') }, { label: order.id }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('order-tracking')} icon={<Icons.Truck size={14} />}>Track</Button>
            {order.status === 'delivered' && (
              <Button variant="ghost" size="sm" onClick={() => navigate('return-request')} icon={<Icons.Rotate size={14} />}>Return</Button>
            )}
          </div>
        }
      />

      {/* Status */}
      <div className="bg-white border border-[#e6e1db] rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${order.status === 'delivered' ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#f5f3ef] text-[#5c5751]'}`}>
          {order.status === 'delivered' ? <Icons.Check size={18} /> : <Icons.Truck size={18} />}
        </div>
        <div>
          <p className="text-sm font-bold text-[#1a1714]">{ORDER_STATUS_LABELS[order.status]}</p>
          {order.estimatedDelivery && <p className="text-xs text-[#9e9890]">Est. delivery: {order.estimatedDelivery}</p>}
          {order.trackingNumber && <p className="text-xs text-[#9e9890]">Tracking: {order.trackingNumber}</p>}
        </div>
        <Badge variant={ORDER_STATUS_VARIANTS[order.status]} className="ml-auto">{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>

      {/* Items */}
      <div className="bg-white border border-[#e6e1db] rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[#f5f3ef]">
          <p className="text-sm font-semibold text-[#1a1714]">Items</p>
        </div>
        <div className="divide-y divide-[#f5f3ef]">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 p-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#f5f3ef] flex-shrink-0">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#9e9890]">{item.product.brand}</p>
                <p className="text-sm font-semibold text-[#1a1714] leading-tight">{item.product.name}</p>
                {item.variant && <p className="text-xs text-[#9e9890] mt-0.5">{item.variant.name}</p>}
                <p className="text-xs text-[#9e9890] mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-[#1a1714]">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Payment */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-[#e6e1db] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#9e9890] uppercase tracking-wider mb-2">Delivery Address</p>
          <p className="text-sm font-semibold text-[#1a1714]">{order.address.name}</p>
          <p className="text-xs text-[#5c5751] mt-0.5">{order.address.line1}</p>
          <p className="text-xs text-[#5c5751]">{order.address.city}, {order.address.state} {order.address.zip}</p>
          <p className="text-xs text-[#5c5751]">{order.address.phone}</p>
        </div>
        <div className="bg-white border border-[#e6e1db] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#9e9890] uppercase tracking-wider mb-2">Payment</p>
          <div className="flex items-center gap-2">
            <Icons.CreditCard size={16} />
            <p className="text-sm text-[#1a1714]">{order.paymentMethod}</p>
          </div>
          <Divider className="my-3" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-[#5c5751]"><span>Subtotal</span><span>${order.total.toFixed(2)}</span></div>
            <div className="flex justify-between text-[#5c5751]"><span>Shipping</span><span className="text-[#166534]">Free</span></div>
            <div className="flex justify-between font-bold text-[#1a1714]"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order Tracking Screen ────────────────────────────────────────────────────
function OrderTrackingScreen({ order, navigate }: { order: Order; navigate: (s: Screen) => void }) {
  const steps = [
    { label: 'Order Placed', desc: 'We received your order', done: true, date: order.date },
    { label: 'Confirmed', desc: 'Order confirmed by seller', done: true, date: order.date },
    { label: 'Shipped', desc: 'Package is on its way', done: order.status !== 'processing' && order.status !== 'confirmed', date: '' },
    { label: 'Out for Delivery', desc: 'Package is out for delivery', done: order.status === 'out_for_delivery' || order.status === 'delivered', date: '' },
    { label: 'Delivered', desc: 'Package delivered successfully', done: order.status === 'delivered', date: order.estimatedDelivery ?? '' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Track Order"
        breadcrumbs={[{ label: 'Orders', onClick: () => navigate('orders') }, { label: order.id, onClick: () => navigate('order-detail') }, { label: 'Tracking' }]}
      />

      {order.trackingNumber && (
        <div className="bg-[#f5f3ef] rounded-xl p-4 mb-6 flex items-center gap-3">
          <Icons.Copy />
          <div>
            <p className="text-xs text-[#9e9890]">Tracking number</p>
            <p className="text-sm font-mono font-semibold text-[#1a1714]">{order.trackingNumber}</p>
          </div>
          <button className="ml-auto text-sm text-[#b8724a] font-medium hover:underline">Copy</button>
        </div>
      )}

      <div className="bg-white border border-[#e6e1db] rounded-xl p-5">
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-[#1a1714]' : 'bg-[#ece9e2]'}`}>
                  {step.done
                    ? <Icons.Check size={12} />
                    : <span className="w-2 h-2 rounded-full bg-[#c5c0b5]" />
                  }
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 ${step.done ? 'bg-[#1a1714]' : 'bg-[#e6e1db]'}`} style={{ minHeight: '24px' }} />
                )}
              </div>
              <div className="pb-6">
                <p className={`text-sm font-semibold ${step.done ? 'text-[#1a1714]' : 'text-[#9e9890]'}`}>{step.label}</p>
                <p className="text-xs text-[#9e9890] mt-0.5">{step.desc}</p>
                {step.date && <p className="text-xs text-[#b8724a] mt-0.5">{step.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Return Request Screen ────────────────────────────────────────────────────
function ReturnRequestScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-4 text-[#166534]">
          <Icons.Check size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#1a1714] mb-2">Return request submitted</h2>
        <p className="text-sm text-[#5c5751] mb-6">We'll process your return within 2–3 business days and send you a prepaid shipping label.</p>
        <Button fullWidth onClick={() => navigate('orders')}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      <PageHeader title="Request Return" back={() => navigate('order-detail')} />
      <div className="bg-white border border-[#e6e1db] rounded-xl p-6 space-y-5">
        <Select
          label="Reason for return"
          value={reason}
          onChange={setReason}
          required
          placeholder="Select a reason"
          options={[
            { value: 'wrong', label: 'Wrong item received' },
            { value: 'damaged', label: 'Item arrived damaged' },
            { value: 'not-as-described', label: 'Not as described' },
            { value: 'changed-mind', label: 'Changed my mind' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <Textarea label="Additional details" value={details} onChange={setDetails} placeholder="Describe the issue in more detail…" rows={4} />
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('order-detail')}>Cancel</Button>
          <Button onClick={() => setSubmitted(true)} disabled={!reason}>Submit Return Request</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({ navigate, onLogout }: { navigate: (s: Screen) => void; onLogout: () => void }) {
  const [logoutModal, setLogoutModal] = useState(false);
  const { user } = useAuth();
  
  // Default values to prevent breaking before user is loaded
  const userInfo = user || { name: 'User', email: '', created_at: '' };

  const sections = [
    {
      title: 'Shopping',
      items: [
        { label: 'My Orders', icon: <Icons.Orders />, screen: 'orders' as Screen },
        { label: 'Wishlist', icon: <Icons.Heart />, screen: 'wishlist' as Screen },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Skin Profile', icon: <Icons.Skin />, screen: 'skin-profile' as Screen },
        { label: 'Saved Addresses', icon: <Icons.Location />, screen: 'saved-addresses' as Screen },
        { label: 'Payment Methods', icon: <Icons.CreditCard />, screen: 'payment-methods' as Screen },
        { label: 'Settings', icon: <Icons.Settings />, screen: null as null },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      <PageHeader title="My Profile" />

      {/* User card */}
      <div className="bg-white border border-[#e6e1db] rounded-xl p-5 mb-6 flex items-center gap-4">
        <Avatar src={(userInfo as any).avatar_url} name={userInfo.name} size="xl" />
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-[#1a1714] truncate">{userInfo.name}</p>
          <p className="text-sm text-[#9e9890] truncate">{userInfo.email}</p>
          <p className="text-xs text-[#9e9890] mt-1">Member since {new Date(userInfo.created_at || Date.now()).getFullYear()}</p>
        </div>
        <IconButton icon={<Icons.Edit />} label="Edit profile" variant="outline" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-[#e6e1db] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#1a1714]">0</p>
          <p className="text-xs text-[#9e9890] mt-0.5">Orders</p>
        </div>
        <div className="bg-white border border-[#e6e1db] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#1a1714]">$0</p>
          <p className="text-xs text-[#9e9890] mt-0.5">Total spent</p>
        </div>
      </div>

      {/* Navigation sections */}
      {sections.map(section => (
        <div key={section.title} className="mb-4">
          <p className="text-xs font-semibold text-[#9e9890] uppercase tracking-wider px-1 mb-2">{section.title}</p>
          <div className="bg-white border border-[#e6e1db] rounded-xl overflow-hidden divide-y divide-[#f5f3ef]">
            {section.items.map(item => (
              <button
                key={item.label}
                onClick={() => item.screen && navigate(item.screen)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#f5f3ef] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b8724a]"
              >
                <span className="text-[#5c5751]">{item.icon}</span>
                <span className="flex-1 text-sm font-medium text-[#1a1714]">{item.label}</span>
                <Icons.ChevronRight />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button
        onClick={() => setLogoutModal(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-[#e6e1db] rounded-xl text-left hover:bg-[#fef2f2] hover:border-[#fca5a5] transition-colors text-[#991b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#991b1b]"
      >
        <Icons.ArrowLeft size={18} />
        <span className="text-sm font-medium">Sign Out</span>
      </button>

      <Modal
        open={logoutModal}
        onClose={() => setLogoutModal(false)}
        title="Sign out"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setLogoutModal(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={onLogout}>Sign Out</Button>
          </div>
        }
      >
        <p className="text-sm text-[#5c5751]">Are you sure you want to sign out of your lume account?</p>
      </Modal>
    </div>
  );
}

// ─── Skin Profile Screen ──────────────────────────────────────────────────────
function SkinProfileScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [editing, setEditing] = useState(false);
  const profile = { skinType: 'Combination', tone: 'Medium', undertone: 'Warm', concerns: ['Dark Spots', 'Dullness', 'Large Pores'], avoiding: ['Fragrance', 'Parabens'] };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Skin Profile"
        back={() => navigate('profile')}
        actions={<Button variant="outline" size="sm" icon={<Icons.Edit size={14} />} onClick={() => setEditing(true)}>Edit</Button>}
      />

      <div className="space-y-4">
        {[
          { label: 'Skin Type', value: profile.skinType },
          { label: 'Skin Tone', value: `${profile.tone} — ${profile.undertone} Undertone` },
          { label: 'Concerns', value: profile.concerns.join(', ') },
          { label: 'Ingredients to Avoid', value: profile.avoiding.join(', ') },
        ].map(item => (
          <div key={item.label} className="bg-white border border-[#e6e1db] rounded-xl p-4">
            <p className="text-xs font-semibold text-[#9e9890] uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-sm font-medium text-[#1a1714]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Alert variant="info">Your skin profile is used to calculate product match scores and personalize recommendations.</Alert>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Skin Profile" size="md" footer={
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setEditing(false)}>Cancel</Button>
          <Button fullWidth onClick={() => setEditing(false)}>Save Changes</Button>
        </div>
      }>
        <div className="space-y-6">
          <div className="space-y-4">
            <Select label="Skin Type" value="combination" onChange={() => {}} options={[
              { value: 'normal', label: 'Normal' }, { value: 'dry', label: 'Dry' },
              { value: 'oily', label: 'Oily' }, { value: 'combination', label: 'Combination' },
              { value: 'sensitive', label: 'Sensitive' },
            ]} />
            <Select label="Skin Tone" value="medium" onChange={() => {}} options={[
              { value: 'fair', label: 'Fair' }, { value: 'light', label: 'Light' },
              { value: 'medium', label: 'Medium' }, { value: 'tan', label: 'Tan' },
              { value: 'deep', label: 'Deep' }, { value: 'rich', label: 'Rich' },
            ]} />
          </div>

          <div>
            <p className="text-sm font-medium text-[#1a1714] mb-3">Concerns</p>
            <div className="space-y-2">
              {['Acne', 'Dark Spots', 'Dullness', 'Fine Lines', 'Large Pores', 'Redness'].map(concern => (
                <Checkbox
                  key={concern}
                  checked={profile.concerns.includes(concern)}
                  onChange={() => {}}
                  label={concern}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[#1a1714] mb-3">Ingredients to Avoid</p>
            <div className="space-y-2">
              {['Alcohol', 'Fragrance', 'Parabens', 'Sulfates'].map(ingredient => (
                <Checkbox
                  key={ingredient}
                  checked={profile.avoiding.includes(ingredient)}
                  onChange={() => {}}
                  label={ingredient}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Saved Addresses Screen ───────────────────────────────────────────────────
function SavedAddressesScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [addOpen, setAddOpen] = useState(false);
  const addresses = [
    { id: 'a1', name: 'Maya Chen', line1: '42 Blossom Lane', city: 'San Francisco', state: 'CA', zip: '94105', phone: '+1 (415) 555-0192', isDefault: true },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Saved Addresses"
        back={() => navigate('profile')}
        actions={<Button size="sm" icon={<Icons.Plus />} onClick={() => setAddOpen(true)}>Add</Button>}
      />

      <div className="space-y-3">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white border border-[#e6e1db] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#1a1714]">{addr.name}</p>
                  {addr.isDefault && <Badge variant="brand" size="sm">Default</Badge>}
                </div>
                <p className="text-sm text-[#5c5751]">{addr.line1}</p>
                <p className="text-sm text-[#5c5751]">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-xs text-[#9e9890] mt-0.5">{addr.phone}</p>
              </div>
              <div className="flex gap-1">
                <IconButton icon={<Icons.Edit />} label="Edit address" size="sm" />
                {!addr.isDefault && <IconButton icon={<Icons.Trash />} label="Delete address" size="sm" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Address" size="md" footer={
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button fullWidth onClick={() => setAddOpen(false)}>Save Address</Button>
        </div>
      }>
        <div className="space-y-4">
          <Input label="Full name" placeholder="Maya Chen" required />
          <Input label="Street address" placeholder="42 Blossom Lane" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" placeholder="San Francisco" required />
            <Input label="State" placeholder="CA" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="ZIP code" placeholder="94105" required />
            <Input label="Phone" placeholder="+1 (415) 555-0192" type="tel" />
          </div>
          <Checkbox checked={false} onChange={() => {}} label="Set as default address" />
        </div>
      </Modal>
    </div>
  );
}

// ─── Payment Methods Screen ───────────────────────────────────────────────────
function PaymentMethodsScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [addOpen, setAddOpen] = useState(false);
  const methods = [
    { id: 'm1', type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Payment Methods"
        back={() => navigate('profile')}
        actions={<Button size="sm" icon={<Icons.Plus />} onClick={() => setAddOpen(true)}>Add</Button>}
      />

      <div className="space-y-3">
        {methods.map(method => (
          <div key={method.id} className="bg-white border border-[#e6e1db] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-[#f5f3ef] flex items-center justify-center">
                <Icons.CreditCard size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#1a1714]">{method.type} **** {method.last4}</p>
                  {method.isDefault && <Badge variant="brand" size="sm">Default</Badge>}
                </div>
                <p className="text-xs text-[#9e9890]">Expires {method.expiry}</p>
              </div>
              <div className="flex gap-1">
                {!method.isDefault && <IconButton icon={<Icons.Trash />} label="Remove card" size="sm" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Payment Method" size="md" footer={
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button fullWidth onClick={() => setAddOpen(false)}>Add Card</Button>
        </div>
      }>
        <div className="space-y-4">
          <Input label="Card number" placeholder="1234 5678 9012 3456" required icon={<Icons.CreditCard />} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Expiry" placeholder="MM / YY" required />
            <Input label="CVV" placeholder="123" required />
          </div>
          <Input label="Name on card" placeholder="Maya Chen" required />
          <Checkbox checked={false} onChange={() => {}} label="Set as default payment method" />
        </div>
      </Modal>
    </div>
  );
}

// ─── Compare Screen ───────────────────────────────────────────────────────────
function CompareScreen({ navigate, compareList, products }: { navigate: (s: Screen) => void; compareList: string[]; products: Product[] }) {
  const comparedProducts = products.filter(p => compareList.includes(p.id));

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <PageHeader title="Compare Products" back={() => navigate('shop')} />
        <EmptyState icon={<Icons.Layers size={36} />} title="No products to compare" description="Add products to compare them side by side." action={<Button onClick={() => navigate('shop')}>Browse Products</Button>} />
      </div>
    );
  }

  const attrs = ['Price', 'Rating', 'Reviews', 'Brand', 'Category', 'Match Score'];
  const getVal = (p: Product, attr: string) => {
    switch (attr) {
      case 'Price': return `$${p.price}`;
      case 'Rating': return `${p.rating}/5`;
      case 'Reviews': return p.reviewCount.toLocaleString();
      case 'Brand': return p.brand;
      case 'Category': return p.category;
      case 'Match Score': return p.matchScore ? `${p.matchScore}%` : 'N/A';
      default: return '—';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      <PageHeader title="Compare Products" back={() => navigate('shop')} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th className="w-32 text-left text-xs font-semibold text-[#9e9890] uppercase tracking-wider pb-4" />
              {comparedProducts.map(p => (
                <th key={p.id} className="text-center pb-4 px-2">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f5f3ef] mx-auto mb-2">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-semibold text-[#1a1714] line-clamp-2">{p.name}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attrs.map(attr => (
              <tr key={attr} className="border-t border-[#f5f3ef]">
                <td className="py-3 text-xs font-semibold text-[#9e9890]">{attr}</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 text-center text-sm font-medium text-[#1a1714] px-2">{getVal(p, attr)}</td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-[#f5f3ef]">
              <td />
              {comparedProducts.map(p => (
                <td key={p.id} className="py-3 text-center px-2">
                  <Button size="sm" onClick={() => { navigate('product'); }} className="w-full">View</Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Shade Finder Screen ──────────────────────────────────────────────────────
function ShadeFinderScreen({ navigate, product }: { navigate: (s: Screen) => void; product: Product }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ProductVariant | null>(null);

  const questions = [
    { q: 'What is your skin tone?', opts: ['Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Rich'] },
    { q: 'What is your undertone?', opts: ['Warm (yellow/golden)', 'Cool (pink/blue)', 'Neutral'] },
    { q: 'What coverage do you prefer?', opts: ['Light', 'Medium', 'Full'] },
  ];

  const handleAnswer = (ans: string) => {
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      // Simple recommendation logic
      if (product.variants) {
        const recommended = product.variants.find(v => v.stock > 0) ?? product.variants[0];
        setResult(recommended);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Shade Finder"
        breadcrumbs={[{ label: product.name, onClick: () => navigate('product') }, { label: 'Shade Finder' }]}
      />

      {result ? (
        <div className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#b8724a]" style={{ backgroundColor: result.hexColor }} />
          <h2 className="text-xl font-bold text-[#1a1714] mb-1">Your perfect shade</h2>
          <p className="text-lg text-[#5c5751] mb-2">{result.name}</p>
          <Badge variant={result.stock > 0 ? 'success' : 'error'} className="mb-6">
            {result.stock > 0 ? `${result.stock} in stock` : 'Out of stock'}
          </Badge>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('product')}>Add to Cart</Button>
            <Button variant="outline" onClick={() => { setStep(0); setAnswers([]); setResult(null); }}>Try Again</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#9e9890] mb-2">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(((step) / questions.length) * 100)}% complete</span>
            </div>
            <ProgressBar value={step} max={questions.length} />
          </div>
          <h2 className="text-lg font-bold text-[#1a1714] mb-5">{questions[step].q}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {questions[step].opts.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="p-4 rounded-xl border-2 border-[#e6e1db] hover:border-[#b8724a] hover:bg-[#f5e8de] transition-all text-sm font-medium text-[#1a1714] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a]"
              >
                {opt}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              onClick={() => { setStep(s => s - 1); setAnswers(a => a.slice(0, -1)); }}
              className="mt-5 flex items-center gap-2 text-sm text-[#5c5751] hover:text-[#1a1714] font-medium"
            >
              <Icons.ArrowLeft size={14} />
              Back
            </button>
          )}
        </div>
      )}
    </div>
  );
}
