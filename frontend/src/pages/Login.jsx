import { useState, useEffect } from "react";

// Composant générique pour les icônes
const Icon = ({ type, className, size = 20 }) => {
  const icons = {
    Mail: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>,
    Lock: <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <circle cx="12" cy="16" r="1"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </>,
    Eye: <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </>,
    EyeOff: <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>,
      <line x1="1" y1="1" x2="23" y2="23"/>
    </>,
    Linkedin: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={type === "Linkedin" ? "currentColor" : "none"}
      stroke={type !== "Linkedin" ? "currentColor" : "none"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[type]}
    </svg>
  );
};

// Composant générique pour les champs de formulaire
const InputField = ({ name, value, onChange, placeholder, type, iconType, focusedField, setFocusedField, error, showPasswordToggle }) => (
  <div className="relative">
    <div className={`relative transition-all duration-300 ${focusedField === name || value ? 'transform scale-[1.02]' : ''}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon type={iconType} className={`transition-colors duration-300 ${focusedField === name ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
        type={type}
        placeholder={placeholder}
        required
        className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
          error ? 'border-red-300 bg-red-50' : focusedField === name ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={showPasswordToggle}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon type={type === 'password' ? 'Eye' : 'EyeOff'} />
        </button>
      )}
    </div>
    {error && <p className="mt-2 text-sm text-red-600 animate-slideDown">{error}</p>}
  </div>
);

// Composant générique pour les boutons OAuth
const OAuthButton = ({ provider, label, colorClass, gradientClass, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-3 ${gradientClass} py-4 px-6 rounded-xl text-white font-medium hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]`}
  >
    <div className={`w-6 h-6 ${colorClass} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
      {provider[0].toUpperCase()}
    </div>
    <span>{label}</span>
  </button>
);

export default function Login() {
  const [form, setForm] = useState({ Email: "", MotDePasse: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [animationClass, setAnimationClass] = useState("animate-fadeIn");

  useEffect(() => {
    setTimeout(() => setAnimationClass("animate-slideInUp"), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.Email) errors.Email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.Email)) errors.Email = "Format d'email invalide";
    if (!form.MotDePasse) errors.MotDePasse = "Le mot de passe est requis";
    else if (form.MotDePasse.length < 6) errors.MotDePasse = "Le mot de passe doit contenir au moins 6 caractères";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOAuth = (provider) => {
    const backendOrigin = window.location.origin.replace(/:\d+$/, ":5000");
    window.location.href = `${backendOrigin}/api/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Connexion simulée réussie !");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Particules */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Formulaire */}
      <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-12 relative z-10 ${animationClass}`}>
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
              <Icon type="Linkedin" className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Bienvenu sur le plateforme KANDRA !</h1>
            <p className="text-gray-600">Restez connecté avec votre réseau professionnel</p>
          </div>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <OAuthButton provider="google" label="Continuer avec Google" colorClass="bg-gradient-to-r from-red-500 to-yellow-500" gradientClass="bg-white text-gray-700 border-2 border-gray-200" onClick={() => handleOAuth("google")} />
            <OAuthButton provider="facebook" label="Continuer avec Facebook" colorClass="bg-blue-600" gradientClass="bg-white text-gray-700 border-2 border-gray-200" onClick={() => handleOAuth("facebook")} />
          </div>

          {/* Séparateur */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t-2 border-gray-200" />
            <span className="px-4 text-gray-500 text-sm font-medium bg-white">ou</span>
            <div className="flex-grow border-t-2 border-gray-200" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              name="Email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Adresse email"
              type="email"
              iconType="Mail"
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              error={formErrors.Email}
            />
            <InputField
              name="MotDePasse"
              value={form.MotDePasse}
              onChange={handleChange}
              placeholder="Mot de passe"
              type={showPassword ? "text" : "password"}
              iconType="Lock"
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              error={formErrors.MotDePasse}
              showPasswordToggle={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform ${
                loading ? 'opacity-80 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Nouveau sur la plateforme ?{" "}
              <button type="button" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline">
                Rejoignez-nous maintenant
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 text-center text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Connectez-vous avec votre réseau professionnel</h2>
          <p className="text-xl opacity-90 mb-8">Plus de 750 millions de membres utilisent notre plateforme pour construire leur carrière</p>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold">750M+</div>
              <div className="text-sm opacity-80">Membres actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm opacity-80">Pays et régions</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
