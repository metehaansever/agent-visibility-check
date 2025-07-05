
const HeroIllustration = () => {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <svg 
        width="400" 
        height="200" 
        viewBox="0 0 400 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="border border-black"
      >
        {/* Browser Windows */}
        <rect x="20" y="40" width="80" height="60" stroke="black" strokeWidth="2" fill="none" />
        <rect x="20" y="40" width="80" height="12" stroke="black" strokeWidth="2" fill="black" />
        <circle cx="28" cy="46" r="2" fill="white" />
        <circle cx="36" cy="46" r="2" fill="white" />
        <circle cx="44" cy="46" r="2" fill="white" />
        
        <rect x="160" y="20" width="80" height="60" stroke="black" strokeWidth="2" fill="none" />
        <rect x="160" y="20" width="80" height="12" stroke="black" strokeWidth="2" fill="black" />
        <circle cx="168" cy="26" r="2" fill="white" />
        <circle cx="176" cy="26" r="2" fill="white" />
        <circle cx="184" cy="26" r="2" fill="white" />
        
        <rect x="300" y="40" width="80" height="60" stroke="black" strokeWidth="2" fill="none" />
        <rect x="300" y="40" width="80" height="12" stroke="black" strokeWidth="2" fill="black" />
        <circle cx="308" cy="46" r="2" fill="white" />
        <circle cx="316" cy="46" r="2" fill="white" />
        <circle cx="324" cy="46" r="2" fill="white" />
        
        <rect x="160" y="120" width="80" height="60" stroke="black" strokeWidth="2" fill="none" />
        <rect x="160" y="120" width="80" height="12" stroke="black" strokeWidth="2" fill="black" />
        <circle cx="168" cy="126" r="2" fill="white" />
        <circle cx="176" cy="126" r="2" fill="white" />
        <circle cx="184" cy="126" r="2" fill="white" />
        
        {/* Connection Lines */}
        <line x1="100" y1="70" x2="160" y2="50" stroke="black" strokeWidth="2" strokeDasharray="4,4" />
        <line x1="200" y1="80" x2="300" y2="70" stroke="black" strokeWidth="2" strokeDasharray="4,4" />
        <line x1="200" y1="80" x2="200" y2="120" stroke="black" strokeWidth="2" strokeDasharray="4,4" />
        
        {/* Connection Nodes */}
        <circle cx="200" cy="80" r="6" stroke="black" strokeWidth="2" fill="white" />
        <circle cx="200" cy="50" r="4" stroke="black" strokeWidth="2" fill="black" />
        <circle cx="200" cy="150" r="4" stroke="black" strokeWidth="2" fill="black" />
      </svg>
    </div>
  );
};

export default HeroIllustration;
